"""Transactional first import of the reviewed product CSV pair.

Each Kaggle source row becomes one catalogue entry. No source entries are
merged, no existing product attributes are overwritten, and no chat calls occur.
"""

from collections import Counter
from dataclasses import dataclass
from pathlib import Path

from django.db import connection, transaction
from django.utils import timezone

from ..models import CatalogDataset, CatalogImportBatch, CatalogProduct, CatalogSourceRecord
from .catalogue_audit_service import (
    PRODUCT_FIELDS, CatalogueRow, normalize_catalogue_text, read_dataset, reconcile_rows,
)
from .catalogue_import_service import KAGGLE_PRODUCT_COLUMNS, MENDELEY_PRODUCT_COLUMNS


class CatalogueImportError(ValueError):
    """The input or existing catalogue needs review before importing."""


DATASETS = (
    ("kaggle_assorted", {
        "name": "Assorted Medicine Dataset of Bangladesh",
        "dataset_url": "https://www.kaggle.com/datasets/ahmedshahriarsakib/assorted-medicine-dataset-of-bangladesh",
        "license": "CC0-1.0",
    }),
    ("mendeley_bd", {
        "name": "Medicinal Products in Bangladesh",
        "dataset_url": "https://data.mendeley.com/datasets/zhtvkny53n/1",
        "license": "CC-BY-4.0",
    }),
)


@dataclass
class PreparedCatalogue:
    kaggle: list[CatalogueRow]
    mendeley: list[CatalogueRow]
    summaries: list[dict]
    reconciliation: dict

    def summary(self):
        statuses = Counter(detail["status"] for detail in self.reconciliation["details"])
        return {
            "kaggle_entries": len(self.kaggle),
            "mendeley_rows": len(self.mendeley),
            "source_rows": len(self.kaggle) + len(self.mendeley),
            "mendeley_linked": statuses["matched_exact"],
            "mendeley_ambiguous": statuses["ambiguous"],
            "mendeley_pending": statuses["matched_normalized"] + statuses["unmatched"],
        }


def prepare_catalogue(data_dir: str | Path) -> PreparedCatalogue:
    root = Path(data_dir).expanduser().resolve()
    kaggle, first = read_dataset(root / "kaggle" / "medicine.csv", "kaggle", KAGGLE_PRODUCT_COLUMNS)
    mendeley, second = read_dataset(root / "mendeley" / "MENDLY.csv", "mendeley", MENDELEY_PRODUCT_COLUMNS)
    for rows, summary in ((kaggle, first), (mendeley, second)):
        if summary["rows_rejected"] or not rows:
            raise CatalogueImportError(
                f"{summary['filename']}: import requires a nonempty file with zero rejected rows. "
                "Use check_catalogue to review the original rows."
            )
        for row in rows:
            # PostgreSQL JSON/text cannot store NUL; do not silently strip it.
            if any("\x00" in key or "\x00" in value for key, value in row.original.items()):
                raise CatalogueImportError(f"{summary['filename']}: NUL character in row {row.number}.")
            normalized = normalize_catalogue_text(row.fields["brand_name"])
            if len(normalized) > CatalogProduct._meta.get_field("normalized_brand_name").max_length:
                raise CatalogueImportError(f"{summary['filename']}: normalized brand too long at row {row.number}.")
    identifiers = [row.fields["source_record_id"] for row in kaggle]
    if any(not identifier.strip() for identifier in identifiers) or len(set(identifiers)) != len(identifiers):
        raise CatalogueImportError("Kaggle source IDs must be nonempty and unique for this first-import workflow.")
    return PreparedCatalogue(kaggle, mendeley, [first, second], reconcile_rows(kaggle, mendeley, set()))


def _expected_mendeley_link(detail, kaggle_ids):
    if detail["status"] == "matched_exact":
        return kaggle_ids[detail["kaggle_row_numbers"][0]], "matched"
    if detail["status"] == "ambiguous":
        return None, "ambiguous"
    return None, "pending"


def _verify_existing(prepared, batches):
    """A rerun is a no-op only when saved rows still represent the same import."""
    kaggle_ids = {}
    for index, rows in enumerate((prepared.kaggle, prepared.mendeley)):
        batch = batches[index]
        if (batch.rows_received, batch.rows_accepted, batch.rows_rejected) != (len(rows), len(rows), 0):
            raise CatalogueImportError("Existing batch counts are inconsistent; refusing automatic repair.")
        records = {record["row_number"]: record for record in CatalogSourceRecord.objects.filter(
            import_batch=batch,
        ).values("row_number", "product_id", "reconciliation_status", "source_record_id", "source_slug", "raw_row")}
        if len(records) != len(rows):
            raise CatalogueImportError("Existing source rows are incomplete; refusing automatic repair.")
        details = {detail["mendeley_row_number"]: detail for detail in prepared.reconciliation["details"]} if index else {}
        for row in rows:
            record = records.get(row.number)
            if record is None or record["raw_row"] != row.original or record["source_record_id"] != row.fields["source_record_id"] or record["source_slug"] != row.fields["source_slug"]:
                raise CatalogueImportError("Existing source provenance differs from the files; review required.")
            if index == 0:
                if record["product_id"] is None or record["reconciliation_status"] != "matched":
                    raise CatalogueImportError("Existing Kaggle linkage is incomplete; review required.")
                kaggle_ids[row.number] = record["product_id"]
            else:
                expected_id, expected_status = _expected_mendeley_link(details[row.number], kaggle_ids)
                if (record["product_id"], record["reconciliation_status"]) != (expected_id, expected_status):
                    raise CatalogueImportError("Existing Mendeley linkage differs; review required.")
    if len(set(kaggle_ids.values())) != len(prepared.kaggle):
        raise CatalogueImportError("Existing Kaggle entries were merged; review required.")
    products = CatalogProduct.objects.in_bulk(kaggle_ids.values())
    for row in prepared.kaggle:
        product = products.get(kaggle_ids[row.number])
        if product is None or any(getattr(product, name) != row.fields[name] for name in (*PRODUCT_FIELDS, "medicine_type")) or product.normalized_brand_name != normalize_catalogue_text(row.fields["brand_name"]):
            raise CatalogueImportError("Existing product attributes differ; refusing to overwrite them.")


def persist_catalogue(prepared: PreparedCatalogue) -> dict:
    """Import once, or verify and skip an identical previous import.

    Dataset row locks serialize concurrent imports on PostgreSQL. Both batches
    and all source/product rows commit together; errors roll the transaction back.
    """
    if connection.vendor != "postgresql":
        raise CatalogueImportError("The write importer requires PostgreSQL for its concurrency guarantees.")
    with transaction.atomic():
        datasets = []
        # Always acquire dataset locks in this order to avoid lock inversion.
        for code, defaults in DATASETS:
            dataset, _ = CatalogDataset.objects.get_or_create(code=code, defaults=defaults)
            dataset = CatalogDataset.objects.select_for_update().get(pk=dataset.pk)
            datasets.append(dataset)
        previous = [list(CatalogImportBatch.objects.filter(dataset=dataset).order_by("pk")) for dataset in datasets]
        if any(previous):
            if not all(len(group) == 1 for group in previous):
                raise CatalogueImportError("Existing import history is partial or contains multiple batches; review required.")
            batches = [group[0] for group in previous]
            for batch, summary in zip(batches, prepared.summaries):
                if batch.status != "completed" or batch.checksum != summary["sha256"] or batch.filename != summary["filename"]:
                    raise CatalogueImportError("These files differ from the completed import, or an earlier batch is incomplete. Updates require a separate reviewed workflow.")
            _verify_existing(prepared, batches)
            return {"state": "already_imported", **prepared.summary()}
        if CatalogProduct.objects.exists() or CatalogSourceRecord.objects.exists():
            raise CatalogueImportError("Catalogue rows already exist without this import history; review required.")
        if not connection.features.can_return_rows_from_bulk_insert:
            raise CatalogueImportError("This database cannot return IDs for the bulk product insert.")
        now = timezone.now()
        batches = [CatalogImportBatch.objects.create(
            dataset=dataset, filename=summary["filename"], checksum=summary["sha256"],
            dataset_version="", status="running", started_at=now,
            rows_received=summary["rows_read"], rows_accepted=summary["rows_accepted"], rows_rejected=0,
        ) for dataset, summary in zip(datasets, prepared.summaries)]
        products = [CatalogProduct(
            **{name: row.fields[name] for name in (*PRODUCT_FIELDS, "medicine_type")},
            normalized_brand_name=normalize_catalogue_text(row.fields["brand_name"]),
        ) for row in prepared.kaggle]
        CatalogProduct.objects.bulk_create(products, batch_size=500)
        if any(product.pk is None for product in products):
            raise CatalogueImportError("Product IDs were not returned; rolling back.")
        kaggle_ids = {row.number: product.pk for row, product in zip(prepared.kaggle, products)}
        details = {detail["mendeley_row_number"]: detail for detail in prepared.reconciliation["details"]}
        for index, rows in enumerate((prepared.kaggle, prepared.mendeley)):
            records = []
            for row in rows:
                product_id, state = (kaggle_ids[row.number], "matched") if index == 0 else _expected_mendeley_link(details[row.number], kaggle_ids)
                records.append(CatalogSourceRecord(
                    import_batch=batches[index], product_id=product_id, row_number=row.number,
                    source_record_id=row.fields["source_record_id"], source_slug=row.fields["source_slug"],
                    raw_row=row.original, reconciliation_status=state,
                ))
                if len(records) == 500:
                    CatalogSourceRecord.objects.bulk_create(records, batch_size=500)
                    records = []
            if records:
                CatalogSourceRecord.objects.bulk_create(records, batch_size=500)
        finished = timezone.now()
        for batch in batches:
            batch.status = "completed"
            batch.completed_at = finished
            batch.save(update_fields=["status", "completed_at"])
        return {"state": "imported", **prepared.summary()}
