"""Regression tests for the read-only catalogue audit. No database access allowed."""

import csv
from hashlib import sha256
from io import StringIO
import json
from pathlib import Path
from tempfile import TemporaryDirectory

from django.core.management import call_command
from django.core.management.base import CommandError
from django.test import SimpleTestCase

from .services.catalogue_audit_service import (
    build_catalogue_report, normalize_catalogue_text,
)
from .services.catalogue_import_service import (
    CatalogueCSVError, KAGGLE_PRODUCT_COLUMNS, MENDELEY_PRODUCT_COLUMNS,
    read_catalogue_csv, validate_catalogue_row,
)


class CatalogueAuditTests(SimpleTestCase):
    def setUp(self):
        temporary = TemporaryDirectory()
        self.addCleanup(temporary.cleanup)
        self.directory = Path(temporary.name)
        self.raw = self.directory / "raw"
        self.kaggle_path = self.raw / "kaggle" / "medicine.csv"
        self.mendeley_path = self.raw / "mendeley" / "MENDLY.csv"

    def product(self, **changes):
        row = dict.fromkeys(KAGGLE_PRODUCT_COLUMNS, "")
        row.update({
            "brand id": "1", "brand name": "Example", "type": "allopathic",
            "generic": "Ingredient A", "strength": "500 mg", "dosage form": "Tablet",
            "manufacturer": "Example Ltd.", "slug": "example-tablet-500-mg",
        })
        row.update(changes)
        return row

    def mendeley(self, source):
        mapping = {
            "genericName": "generic", "brandName": "brand name", "packageMark": "slug",
            "dosageType": "dosage form", "strength": "strength", "manufacturer": "manufacturer",
        }
        return {target: source[key] for target, key in mapping.items()}

    def write_csv(self, path, columns, rows):
        path.parent.mkdir(parents=True, exist_ok=True)
        with path.open("w", encoding="utf-8-sig", newline="") as output:
            writer = csv.DictWriter(output, fieldnames=columns)
            writer.writeheader()
            writer.writerows(rows)

    def prepare(self, kaggle, mendeley):
        self.write_csv(self.kaggle_path, KAGGLE_PRODUCT_COLUMNS, kaggle)
        self.write_csv(self.mendeley_path, MENDELEY_PRODUCT_COLUMNS, mendeley)

    def test_normalization_preserves_units_punctuation_and_originals(self):
        self.assertEqual(normalize_catalogue_text("  CAFE\u0301\t Brand  "), "café brand")
        self.assertNotEqual(normalize_catalogue_text("500 mg"), normalize_catalogue_text("0.5 g"))
        source = self.product()
        self.prepare([source], [self.mendeley(source)])
        originals = [self.kaggle_path.read_bytes(), self.mendeley_path.read_bytes()]
        report = build_catalogue_report(self.raw)
        self.assertEqual(report["reconciliation"]["counts"]["matched_exact"], 1)
        self.assertEqual(originals, [self.kaggle_path.read_bytes(), self.mendeley_path.read_bytes()])
        self.assertEqual(report["datasets"]["kaggle"]["sha256"], sha256(originals[0]).hexdigest())

    def test_mapping_and_empty_mendeley_fields(self):
        source = self.product()
        mapped, errors = validate_catalogue_row(source, "kaggle")
        self.assertEqual(errors, [])
        self.assertEqual(mapped["source_record_id"], "1")
        mapped, errors = validate_catalogue_row(self.mendeley(source), "mendeley")
        self.assertEqual(errors, [])
        self.assertEqual(mapped["source_record_id"], "")
        self.assertEqual(mapped["medicine_type"], "")
        self.assertEqual(mapped["source_slug"], source["slug"])

    def test_identical_copies_still_require_reconciliation_review(self):
        source = self.product()
        self.prepare([source, source.copy()], [self.mendeley(source)])
        report = build_catalogue_report(self.raw)
        duplicates = report["datasets"]["kaggle"]["duplicates"]
        self.assertEqual(len(duplicates["exact_duplicate_rows"]), 1)
        self.assertEqual(len(duplicates["conflicting_source_ids"]), 0)
        self.assertEqual(report["reconciliation"]["counts"]["ambiguous"], 1)
        self.assertEqual(report["reconciliation"]["mendeley_rows_with_exact_six_field_correspondence"], 1)

    def test_shared_slug_does_not_merge_different_strengths(self):
        first = self.product()
        second = self.product(**{"brand id": "2", "strength": "250 mg"})
        self.prepare([first, second], [self.mendeley(second)])
        report = build_catalogue_report(self.raw)
        duplicates = report["datasets"]["kaggle"]["duplicates"]
        self.assertEqual(len(duplicates["conflicting_slugs"]), 1)
        self.assertEqual(report["reconciliation"]["details"][0]["kaggle_row_numbers"], [2])
        self.assertEqual(report["reconciliation"]["counts"]["matched_exact"], 1)

    def test_conflicting_source_id_blocks_an_otherwise_exact_candidate(self):
        first = self.product()
        second = self.product(**{"strength": "250 mg", "slug": "another-slug"})
        self.prepare([first, second], [self.mendeley(first)])
        detail = build_catalogue_report(self.raw)["reconciliation"]["details"][0]
        self.assertEqual(detail["status"], "ambiguous")
        self.assertEqual(detail["reason"], "conflicting_kaggle_source_id")

    def test_normalized_match_is_distinguished_from_exact_match(self):
        source = self.product()
        other = self.mendeley(source)
        other["brandName"] = "  EXAMPLE  "
        self.prepare([source], [other])
        report = build_catalogue_report(self.raw)
        self.assertEqual(report["reconciliation"]["counts"]["matched_normalized"], 1)
        self.assertEqual(report["reconciliation"]["mendeley_rows_with_exact_six_field_correspondence"], 0)

    def test_slug_mismatch_or_changed_ingredient_is_not_a_match(self):
        source = self.product()
        slug_mismatch = self.mendeley(source)
        slug_mismatch["packageMark"] = "different"
        ingredient_mismatch = self.mendeley(source)
        ingredient_mismatch["genericName"] = "Ingredient B"
        self.prepare([source], [slug_mismatch, ingredient_mismatch])
        result = build_catalogue_report(self.raw)["reconciliation"]
        self.assertEqual(result["counts"]["unmatched"], 2)
        self.assertEqual(result["details"][0]["reason"], "product_fields_agree_but_slug_differs")
        self.assertEqual(result["details"][1]["kaggle_row_numbers"], [])

    def test_missing_identity_remains_ambiguous_and_invalid_rows_are_excluded(self):
        incomplete = self.product(**{"manufacturer": ""})
        invalid = self.product(**{"brand name": "   "})
        self.prepare([incomplete, invalid], [self.mendeley(incomplete), self.mendeley(invalid)])
        report = build_catalogue_report(self.raw)
        self.assertEqual(report["datasets"]["kaggle"]["rows_rejected"], 1)
        self.assertEqual(report["datasets"]["mendeley"]["rows_rejected"], 1)
        self.assertEqual(report["reconciliation"]["counts"]["ambiguous"], 1)
        self.assertEqual(report["reconciliation"]["details"][0]["missing_product_fields"], ["manufacturer"])

    def test_quoted_commas_multiline_and_empty_fields_survive_reading(self):
        source = self.product(**{"manufacturer": "Example, Ltd.\nDivision A"})
        self.prepare([source], [])
        rows = list(read_catalogue_csv(self.kaggle_path, KAGGLE_PRODUCT_COLUMNS))
        self.assertEqual(rows, [(1, source)])

    def test_duplicate_header_and_wrong_row_width_fail(self):
        self.raw.mkdir(parents=True)
        path = self.raw / "invalid.csv"
        for text in ("a,a\n1,2\n", "a,b\n1\n", "a,b\n1,2,3\n", 'a,b\n"unfinished'):
            with self.subTest(text=text):
                path.write_text(text, encoding="utf-8")
                with self.assertRaises(CatalogueCSVError):
                    list(read_catalogue_csv(path, ("a", "b")))

    def test_command_report_is_read_only_and_cannot_overwrite_inputs_or_reports(self):
        source = self.product()
        self.prepare([source], [self.mendeley(source)])
        report_path = self.directory / "reports" / "audit.json"
        output = StringIO()
        call_command("check_catalogue", data_dir=self.raw, report=report_path, stdout=output)
        original = report_path.read_bytes()
        self.assertEqual(json.loads(original)["reconciliation"]["counts"]["matched_exact"], 1)
        self.assertIn("matched_exact: 1", output.getvalue())
        with self.assertRaises(CommandError):
            call_command("check_catalogue", data_dir=self.raw, report=report_path, stdout=StringIO())
        self.assertEqual(report_path.read_bytes(), original)
        with self.assertRaises(CommandError):
            call_command("check_catalogue", data_dir=self.raw, report=self.raw / "audit.json", stdout=StringIO())
        self.assertFalse((self.raw / "audit.json").exists())
