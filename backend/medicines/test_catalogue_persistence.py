"""PostgreSQL import tests. Django uses a separate test database."""

import csv
from io import StringIO
import json
from pathlib import Path
from tempfile import TemporaryDirectory
from unittest.mock import patch

from django.core.management import call_command
from django.core.management.base import CommandError
from django.test import TestCase, skipUnlessDBFeature

from .models import CatalogDataset, CatalogImportBatch, CatalogProduct, CatalogSourceRecord
from .services.catalogue_audit_service import build_catalogue_report
from .services.catalogue_import_service import KAGGLE_PRODUCT_COLUMNS, MENDELEY_PRODUCT_COLUMNS
from .services.catalogue_persistence_service import (
    CatalogueImportError, persist_catalogue, prepare_catalogue,
)


@skipUnlessDBFeature("has_select_for_update")
class CataloguePersistenceTests(TestCase):
    def setUp(self):
        temporary = TemporaryDirectory()
        self.addCleanup(temporary.cleanup)
        self.directory = Path(temporary.name)
        self.raw = self.directory / "raw"
        self.first = dict.fromkeys(KAGGLE_PRODUCT_COLUMNS, "")
        self.first.update({
            "brand id": "1", "brand name": "Example", "generic": "Ingredient A",
            "strength": "500 mg", "dosage form": "Tablet", "manufacturer": "Example Ltd.",
            "slug": "example-500", "type": "allopathic", "package container": "10 tablets",
        })
        self.second = {**self.first, "brand id": "2", "brand name": "Incomplete", "strength": "", "slug": "incomplete"}
        self.write_pair([self.first, self.second])

    def mendeley(self, row):
        return {target: row[source] for target, source in {
            "genericName": "generic", "brandName": "brand name", "packageMark": "slug",
            "dosageType": "dosage form", "strength": "strength", "manufacturer": "manufacturer",
        }.items()}

    def write_pair(self, kaggle, mendeley=None):
        if mendeley is None:
            mendeley = [self.mendeley(row) for row in kaggle]
        for relative, columns, rows in (
            ("kaggle/medicine.csv", KAGGLE_PRODUCT_COLUMNS, kaggle),
            ("mendeley/MENDLY.csv", MENDELEY_PRODUCT_COLUMNS, mendeley),
        ):
            path = self.raw / relative
            path.parent.mkdir(parents=True, exist_ok=True)
            with path.open("w", encoding="utf-8", newline="") as output:
                writer = csv.DictWriter(output, fieldnames=columns)
                writer.writeheader()
                writer.writerows(rows)

    def snapshot(self):
        return tuple(model.objects.count() for model in (CatalogDataset, CatalogImportBatch, CatalogProduct, CatalogSourceRecord))

    def reviewed_report(self):
        path = self.directory / "reviewed.json"
        path.write_text(json.dumps(build_catalogue_report(self.raw)), encoding="utf-8")
        return path

    def test_initial_import_preserves_raw_rows_and_unlinked_ambiguity(self):
        result = persist_catalogue(prepare_catalogue(self.raw))
        self.assertEqual(result["state"], "imported")
        self.assertEqual(self.snapshot(), (2, 2, 2, 4))
        self.assertEqual(CatalogImportBatch.objects.filter(status="completed").count(), 2)
        original = CatalogSourceRecord.objects.get(import_batch__dataset__code="kaggle_assorted", row_number=1)
        linked = CatalogSourceRecord.objects.get(import_batch__dataset__code="mendeley_bd", row_number=1)
        ambiguous = CatalogSourceRecord.objects.get(import_batch__dataset__code="mendeley_bd", row_number=2)
        self.assertEqual(original.raw_row, self.first)
        self.assertEqual(linked.product_id, original.product_id)
        self.assertIsNone(ambiguous.product_id)
        self.assertEqual(ambiguous.reconciliation_status, "ambiguous")
        self.assertEqual(ambiguous.raw_row, self.mendeley(self.second))

    def test_identical_rerun_adds_nothing(self):
        persist_catalogue(prepare_catalogue(self.raw))
        original_counts = self.snapshot()
        original_ids = list(CatalogProduct.objects.values_list("pk", flat=True))
        result = persist_catalogue(prepare_catalogue(self.raw))
        self.assertEqual(result["state"], "already_imported")
        self.assertEqual(self.snapshot(), original_counts)
        self.assertEqual(list(CatalogProduct.objects.values_list("pk", flat=True)), original_ids)

    def test_changed_file_cannot_overwrite_existing_products(self):
        persist_catalogue(prepare_catalogue(self.raw))
        before = self.snapshot()
        self.write_pair([{**self.first, "strength": "250 mg"}, self.second])
        with self.assertRaises(CatalogueImportError):
            persist_catalogue(prepare_catalogue(self.raw))
        self.assertEqual(self.snapshot(), before)
        self.assertTrue(CatalogProduct.objects.filter(brand_name="Example", strength_text="500 mg").exists())

    def test_failed_insert_rolls_back_products_batches_and_datasets(self):
        prepared = prepare_catalogue(self.raw)
        with patch.object(CatalogSourceRecord.objects, "bulk_create", side_effect=RuntimeError("injected failure")):
            with self.assertRaises(RuntimeError):
                persist_catalogue(prepared)
        self.assertEqual(self.snapshot(), (0, 0, 0, 0))

    def test_multiple_source_rows_are_not_silently_merged(self):
        duplicate_product = {**self.first, "brand id": "3", "package container": "30 tablets"}
        self.write_pair([self.first, duplicate_product], [self.mendeley(self.first)])
        result = persist_catalogue(prepare_catalogue(self.raw))
        self.assertEqual(result["mendeley_ambiguous"], 1)
        self.assertEqual(CatalogProduct.objects.count(), 2)
        self.assertEqual(CatalogSourceRecord.objects.filter(reconciliation_status="ambiguous", product__isnull=True).count(), 1)

    def test_normalized_or_unmatched_candidates_remain_pending(self):
        normalized = {**self.mendeley(self.first), "brandName": " EXAMPLE "}
        unknown = {**self.mendeley(self.first), "brandName": "Unknown"}
        self.write_pair([self.first], [normalized, unknown])
        result = persist_catalogue(prepare_catalogue(self.raw))
        self.assertEqual(result["mendeley_pending"], 2)
        self.assertEqual(CatalogSourceRecord.objects.filter(reconciliation_status="pending", product__isnull=True).count(), 2)

    def test_invalid_or_duplicate_source_ids_fail_before_writing(self):
        for rows in ([self.first, self.first], [{**self.first, "brand id": ""}], [{**self.first, "brand name": " "}], [{**self.first, "package container": "bad\x00value"}]):
            with self.subTest(rows=rows):
                self.write_pair(rows)
                with self.assertRaises(CatalogueImportError):
                    prepare_catalogue(self.raw)
                self.assertEqual(self.snapshot(), (0, 0, 0, 0))

    def test_existing_changed_product_is_not_repaired_silently(self):
        persist_catalogue(prepare_catalogue(self.raw))
        CatalogProduct.objects.filter(brand_name="Example").update(strength_text="edited")
        with self.assertRaises(CatalogueImportError):
            persist_catalogue(prepare_catalogue(self.raw))
        self.assertTrue(CatalogProduct.objects.filter(strength_text="edited").exists())

    def test_preview_command_does_not_write(self):
        output = StringIO()
        call_command("import_catalogue", data_dir=self.raw, stdout=output)
        self.assertIn("Catalogue import: preview", output.getvalue())
        self.assertEqual(self.snapshot(), (0, 0, 0, 0))

    def test_apply_requires_report_and_rejects_changed_fingerprints(self):
        with self.assertRaises(CommandError):
            call_command("import_catalogue", data_dir=self.raw, apply=True, stdout=StringIO())
        reviewed = self.reviewed_report()
        self.write_pair([{**self.first, "package container": "changed package"}, self.second])
        with self.assertRaises(CommandError):
            call_command("import_catalogue", data_dir=self.raw, apply=True, reviewed_report=reviewed, stdout=StringIO())
        self.assertEqual(self.snapshot(), (0, 0, 0, 0))

    def test_apply_command_with_matching_report_imports(self):
        output = StringIO()
        call_command("import_catalogue", data_dir=self.raw, apply=True, reviewed_report=self.reviewed_report(), stdout=output)
        self.assertIn("Catalogue import: imported", output.getvalue())
        self.assertEqual(self.snapshot(), (2, 2, 2, 4))
