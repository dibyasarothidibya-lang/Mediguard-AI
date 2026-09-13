"""Database lookup tests using Django's isolated test database."""

from unittest.mock import patch
from django.db import DatabaseError
from django.test import TestCase
from django.utils import timezone

from .models import CatalogDataset, CatalogImportBatch, CatalogProduct, CatalogSourceRecord
from .services.catalogue_audit_service import normalize_catalogue_text
from .services.catalogue_lookup_service import lookup_catalogue


class CatalogueLookupTests(TestCase):
    def setUp(self):
        dataset = CatalogDataset.objects.create(code="kaggle_assorted", name="Kaggle", dataset_url="https://example.com")
        self.batch = CatalogImportBatch.objects.create(dataset=dataset, filename="medicine.csv", checksum="a" * 64, status="completed", completed_at=timezone.now())

    def product(self, **changes):
        fields = dict(brand_name="Example", generic_name="Ingredient A", strength_text="500 mg", dosage_form="Tablet", manufacturer="Example Ltd.", medicine_type="allopathic")
        fields.update(changes)
        product = CatalogProduct.objects.create(**fields, normalized_brand_name=normalize_catalogue_text(fields["brand_name"]))
        CatalogSourceRecord.objects.create(import_batch=self.batch, product=product, row_number=product.pk, source_record_id=str(product.pk), raw_row={"brand": fields["brand_name"]}, reconciliation_status="matched")
        return product

    def test_exact_normalized_name_returns_provenance_without_mutation(self):
        product = self.product()
        result = lookup_catalogue(" EXAMPLE ")
        self.assertEqual(result.status, "resolved")
        self.assertEqual(result.candidates[0]["catalogue_ids"], [product.pk])
        self.assertEqual(result.candidates[0]["sources"][0]["dataset_code"], "kaggle_assorted")
        product.refresh_from_db()
        self.assertEqual(product.brand_name, "Example")

    def test_different_strengths_require_clarification_and_explicit_filter_resolves(self):
        self.product()
        other = self.product(strength_text="250 mg")
        self.assertEqual(lookup_catalogue("Example").status, "ambiguous")
        result = lookup_catalogue("Example", strength="250 mg", dosage_form="tablet", manufacturer="example ltd.")
        self.assertEqual(result.status, "resolved")
        self.assertEqual(result.candidates[0]["catalogue_ids"], [other.pk])
        self.assertEqual(lookup_catalogue("Example", strength="999 mg").status, "details_not_found")

    def test_identical_formulations_group_without_deleting_source_entries(self):
        first, second = self.product(), self.product()
        result = lookup_catalogue("Example")
        self.assertEqual(result.status, "resolved")
        self.assertEqual(result.candidates[0]["catalogue_ids"], [first.pk, second.pk])
        self.assertEqual(CatalogProduct.objects.count(), 2)
        self.assertEqual(len(result.candidates[0]["sources"]), 2)

    def test_changed_ingredient_does_not_collapse_into_same_candidate(self):
        self.product()
        self.product(generic_name="Ingredient B")
        self.assertEqual(lookup_catalogue("Example").status, "ambiguous")

    def test_unlinked_or_unfinished_products_are_not_used(self):
        self.product()
        self.batch.status = "running"
        self.batch.save(update_fields=["status"])
        self.assertEqual(lookup_catalogue("Example").status, "not_ready")
        self.batch.status = "completed"
        self.batch.save(update_fields=["status"])
        CatalogSourceRecord.objects.update(reconciliation_status="ambiguous")
        self.assertEqual(lookup_catalogue("Example").status, "no_match")

    def test_incomplete_identity_and_no_match_are_distinct(self):
        self.product(strength_text="")
        self.assertEqual(lookup_catalogue("Example").status, "incomplete")
        self.assertEqual(lookup_catalogue("Exampl").status, "no_match")

    def test_truncated_search_does_not_report_unique_resolution(self):
        for _ in range(3):
            self.product()
        with patch("medicines.services.catalogue_lookup_service.MAX_SOURCE_ENTRIES", 2):
            result = lookup_catalogue("Example")
        self.assertTrue(result.truncated)
        self.assertEqual(result.status, "ambiguous")

    def test_database_failure_does_not_become_no_match_or_leak_details(self):
        with patch.object(CatalogImportBatch.objects, "filter", side_effect=DatabaseError("private connection string")):
            result = lookup_catalogue("Example")
        self.assertEqual(result.status, "unavailable")
        self.assertNotIn("private", str(result))
