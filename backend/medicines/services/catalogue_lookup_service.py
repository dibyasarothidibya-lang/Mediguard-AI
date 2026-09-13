"""Bounded read-only lookup of imported brand-name candidates."""

from dataclasses import dataclass, field
from django.db import DatabaseError
from django.db.models import Exists, OuterRef, Prefetch

from ..models import CatalogImportBatch, CatalogProduct, CatalogSourceRecord
from .catalogue_audit_service import PRODUCT_FIELDS, normalize_catalogue_text

MAX_SOURCE_ENTRIES = 100
MAX_CANDIDATES = 5
CATALOGUE_SOURCES = {
    "kaggle_assorted": ("Kaggle dataset", "https://www.kaggle.com/datasets/ahmedshahriarsakib/assorted-medicine-dataset-of-bangladesh"),
    "mendeley_bd": ("Mendeley dataset", "https://data.mendeley.com/datasets/zhtvkny53n/1"),
}


@dataclass
class CatalogueLookup:
    query: str
    status: str
    candidates: list[dict] = field(default_factory=list)
    truncated: bool = False


def lookup_catalogue(name: str, *, strength="", dosage_form="", manufacturer="") -> CatalogueLookup:
    """Exact normalized brand lookup; details filter candidates without guessing.

    Duplicate source entries with the same formulation are displayed together.
    Their database rows and provenance remain separate and are never changed.
    """
    if not isinstance(name, str) or not name.strip() or len(name) > 200 or any(ord(c) < 32 for c in name):
        return CatalogueLookup(str(name)[:200], "invalid_query")
    details = {"strength_text": strength, "dosage_form": dosage_form, "manufacturer": manufacturer}
    if any(not isinstance(value, str) or len(value) > 500 for value in details.values()):
        return CatalogueLookup(name, "invalid_query")
    normalized = normalize_catalogue_text(name)
    try:
        if not CatalogImportBatch.objects.filter(dataset__code="kaggle_assorted", status="completed").exists():
            return CatalogueLookup(name, "not_ready")
        provenance = CatalogSourceRecord.objects.filter(
            reconciliation_status="matched", import_batch__status="completed",
            import_batch__dataset__code__in=tuple(CATALOGUE_SOURCES),
        ).select_related("import_batch__dataset").order_by("pk")
        imported = CatalogSourceRecord.objects.filter(
            product_id=OuterRef("pk"), reconciliation_status="matched",
            import_batch__status="completed", import_batch__dataset__code="kaggle_assorted",
        )
        products = list(CatalogProduct.objects.filter(
            normalized_brand_name=normalized,
        ).filter(Exists(imported)).order_by("pk").prefetch_related(
            Prefetch("source_records", queryset=provenance, to_attr="catalogue_provenance"),
        )[:MAX_SOURCE_ENTRIES + 1])
        truncated = len(products) > MAX_SOURCE_ENTRIES
        products = products[:MAX_SOURCE_ENTRIES]
        groups = {}
        for product in products:
            fields = {name: getattr(product, name) for name in (*PRODUCT_FIELDS, "medicine_type")}
            key = tuple(normalize_catalogue_text(value) for value in fields.values())
            group = groups.setdefault(key, {**fields, "catalogue_ids": [], "sources": []})
            group["catalogue_ids"].append(product.pk)
            for source in product.catalogue_provenance:
                batch = source.import_batch
                group["sources"].append({
                    "dataset_code": batch.dataset.code, "batch_id": batch.pk,
                    "row_number": source.row_number, "source_record_id": source.source_record_id,
                    "imported_at": batch.completed_at.isoformat() if batch.completed_at else None,
                })
        all_candidates = list(groups.values())
        if not all_candidates:
            return CatalogueLookup(name, "no_match")
        candidates = [candidate for candidate in all_candidates if all(
            not value.strip() or normalize_catalogue_text(candidate[key]) == normalize_catalogue_text(value)
            for key, value in details.items()
        )]
        if not candidates:
            return CatalogueLookup(name, "details_not_found", all_candidates[:MAX_CANDIDATES], truncated or len(all_candidates) > MAX_CANDIDATES)
        if truncated or len(candidates) > 1:
            return CatalogueLookup(name, "ambiguous", candidates[:MAX_CANDIDATES], truncated or len(candidates) > MAX_CANDIDATES)
        candidate = candidates[0]
        complete = all(normalize_catalogue_text(candidate[key]) for key in PRODUCT_FIELDS)
        return CatalogueLookup(name, "resolved" if complete else "incomplete", candidates)
    except DatabaseError:
        # Connection details and row contents must not leak into chat errors.
        return CatalogueLookup(name, "unavailable")
