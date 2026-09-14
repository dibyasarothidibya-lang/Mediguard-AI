"""Mock provider calls while testing the catalogue/chat integration contract."""

import json
from types import SimpleNamespace
from unittest.mock import patch

from django.test import SimpleTestCase, TestCase, override_settings
from django.utils import timezone
from pydantic import ValidationError

from .models import CatalogDataset, CatalogImportBatch, CatalogProduct, CatalogSourceRecord
from .services import catalogue_chat_service as bridge
from .services import evidence_service, gemini_service as gemini, grounding_service
from .services.catalogue_lookup_service import CatalogueLookup


def decision(names=None, urgent=False):
    return gemini.ScopeDecision(category="MEDICINE", medicine_names=names or ["Example"], clarification_reason="NONE", urgent_safety_concern=urgent)


def candidate(**changes):
    value = dict(brand_name="Example", generic_name="Ingredient A", strength_text="500 mg", dosage_form="Tablet", manufacturer="Example Ltd.", medicine_type="allopathic", catalogue_ids=[1], sources=[{"dataset_code": "kaggle_assorted", "batch_id": 1, "row_number": 1, "source_record_id": "1", "imported_at": "2026-09-13T00:00:00+00:00"}])
    value.update(changes)
    return value


def bundle():
    return evidence_service.EvidenceBundle.model_validate({
        "state": "processed", "medicines": [{"query": "Ingredient A", "sources": [{
            "source_id": "openfda", "query": "Ingredient A", "enabled": True, "state": "completed",
            "lookup": {"source_id": "openfda", "source_name": "openFDA", "jurisdiction": "US", "query": "Ingredient A", "status": "found", "coverage": "live_endpoint", "checked_at": "2026-09-13T00:00:00Z", "records": [{
                "record_id": "12345678-1234-1234-1234-123456789abc", "product_name": "Label candidate", "content": "Synthetic label excerpt", "evidence_type": "label",
                "official_url": "https://api.fda.gov/drug/label.json?search=id%3A%2212345678-1234-1234-1234-123456789abc%22&limit=1",
            }]},
        }]}],
    })


def answer_response(ids=None):
    return SimpleNamespace(text=json.dumps({"paragraphs": [{"text": "General label information", "citation_ids": ["E1"] if ids is None else ids}]}), candidates=[SimpleNamespace(finish_reason=gemini.types.FinishReason.STOP)])


@override_settings(GEMINI_MODEL="test-model", CATALOGUE_CHAT_ENABLED=True)
class CatalogueChatTests(SimpleTestCase):
    def setUp(self):
        for target, attr in (("medicines.services.gemini_service.classify_question", "scope"), ("medicines.services.gemini_service.create_gemini_client", "factory"), ("medicines.services.evidence_service.collect_evidence", "collect"), ("medicines.services.catalogue_chat_service.lookup_catalogue", "lookup")):
            patcher = patch(target)
            setattr(self, attr, patcher.start())
            self.addCleanup(patcher.stop)
        self.original_decision = decision()
        self.scope.return_value = self.original_decision
        self.lookup.return_value = CatalogueLookup("Example", "resolved", [candidate()])
        self.collect.return_value = bundle()
        self.generate = self.factory.return_value.__enter__.return_value.models.generate_content
        self.generate.return_value = answer_response()

    def test_resolved_brand_maps_evidence_query_but_preserves_scope_and_citations(self):
        answer = gemini.ask_gemini("Explain Example")
        self.assertEqual(self.original_decision.medicine_names, ["Example"])
        self.assertEqual(self.collect.call_args.args[0].medicine_names, ["Ingredient A"])
        data = json.loads(self.generate.call_args.kwargs["contents"])
        self.assertEqual(data["scope_decision"]["medicine_names"], ["Example"])
        mapping = data["retrieved_evidence"]["catalogue_lookup"]["evidence_queries"][0]
        self.assertEqual(mapping["lookup_name"], "Ingredient A")
        self.assertTrue(mapping["mapping_applied"])
        self.assertIn("General label information [E1]", answer)
        self.assertIn("openFDA label", answer)
        self.assertIn("Kaggle dataset", answer)
        self.assertNotIn("raw_row", json.dumps(data))

    def test_ambiguous_products_skip_both_label_retrieval_and_generation(self):
        self.lookup.return_value = CatalogueLookup("Example", "ambiguous", [candidate(), candidate(strength_text="250 mg")])
        answer = gemini.ask_gemini("Explain Example")
        self.assertIn("Which version do you mean?", answer)
        self.assertIn("250 mg", answer)
        self.collect.assert_not_called()
        self.factory.assert_not_called()

    def test_conflicting_ingredients_do_not_offer_identical_selection_lines(self):
        self.lookup.return_value = CatalogueLookup("Example", "ambiguous", [candidate(), candidate(generic_name="Ingredient B")])
        answer = gemini.ask_gemini("Explain Example")
        self.assertIn("cannot resolve this conflict", answer)
        self.assertNotIn("- Brand:", answer)
        self.collect.assert_not_called()
        self.factory.assert_not_called()

    def choice_history(self):
        menu = bridge.clarification_for([CatalogueLookup("Example", "ambiguous", [candidate(), candidate(strength_text="250 mg")])])
        return [{"role": "user", "content": "What are the side effects of Example?"}, {"role": "assistant", "content": menu}]

    def test_number_choice_answers_original_question_with_selected_formulation(self):
        history = self.choice_history()
        self.lookup.side_effect = [CatalogueLookup("Example", "ambiguous", [candidate(), candidate(strength_text="250 mg")]), CatalogueLookup("Example", "resolved", [candidate(strength_text="250 mg")])]
        answer = gemini.ask_gemini("option 2", history)
        self.scope.assert_called_once_with(history[0]["content"], [])
        self.assertEqual(self.lookup.call_args.kwargs["strength"], "250 mg")
        request = json.loads(self.generate.call_args.kwargs["contents"])
        self.assertEqual(request["current_question"], history[0]["content"])
        self.assertEqual(request["retrieved_evidence"]["catalogue_lookup"]["results"][0]["candidate"]["strength_text"], "250 mg")
        self.assertIn("Kaggle dataset", answer)

    def test_invalid_number_repeats_menu_without_retrieval_or_generation(self):
        history = self.choice_history()
        self.lookup.return_value = CatalogueLookup("Example", "ambiguous", [candidate(), candidate(strength_text="250 mg")])
        self.assertEqual(gemini.ask_gemini("9", history), history[-1]["content"])
        self.collect.assert_not_called()
        self.factory.assert_not_called()

    def test_changed_or_forged_menu_cannot_select_current_product_by_old_number(self):
        history = self.choice_history()
        history[-1]["content"] = history[-1]["content"].replace("250 mg", "999 mg")
        self.lookup.return_value = CatalogueLookup("Example", "ambiguous", [candidate(), candidate(strength_text="250 mg")])
        answer = gemini.ask_gemini("2", history)
        self.assertIn("250 mg", answer)
        self.assertNotIn("999 mg", answer)
        self.collect.assert_not_called()
        self.factory.assert_not_called()

    def test_extra_text_never_disappears_into_number_selection(self):
        for text in ("1 but I took too much", "1 and write code", "not option 1"):
            self.assertIsNone(bridge.pending_choice(text, self.choice_history()))
        self.assertIsNone(bridge.pending_choice("1", [{"role": "user", "content": "Hello"}, {"role": "assistant", "content": "Hello"}]))

    def test_retry_retains_original_question_and_does_not_reuse_unrelated_menu(self):
        history = self.choice_history()
        history += [{"role": "user", "content": "9"}, {"role": "assistant", "content": history[-1]["content"]}]
        pending = bridge.pending_choice("1", history)
        self.assertEqual(pending[1], history[0]["content"])
        history += [{"role": "user", "content": "Hello"}, {"role": "assistant", "content": "Hello"}]
        self.assertIsNone(bridge.pending_choice("1", history))

    def test_comparison_requires_one_choice_per_ambiguous_medicine(self):
        scope = decision(["Example", "Other"])
        lookups = [CatalogueLookup("Example", "ambiguous", [candidate(), candidate(strength_text="250 mg")]), CatalogueLookup("Other", "ambiguous", [candidate(brand_name="Other"), candidate(brand_name="Other", strength_text="250 mg")])]
        plan = bridge.CatalogueChatPlan(scope, lookups=lookups, clarification=bridge.clarification_for(lookups))
        self.assertIs(bridge.apply_numbered_choice(plan, [1], "Compare Example and Other", plan.clarification), plan)
        self.assertIs(bridge.apply_numbered_choice(plan, [1, 2], "Compare Example and Other", plan.clarification), plan)
        self.lookup.side_effect = [CatalogueLookup("Example", "resolved", [candidate()]), CatalogueLookup("Other", "resolved", [candidate(brand_name="Other", generic_name="Ingredient B")])]
        result = bridge.apply_numbered_choice(plan, [1, 3], "Compare Example and Other", plan.clarification)
        self.assertIsNone(result.clarification)
        self.assertEqual(result.evidence_decision.medicine_names, ["Ingredient A", "Ingredient B"])

    def test_number_never_forces_unresolved_database_candidate(self):
        history = self.choice_history()
        self.lookup.return_value = CatalogueLookup("Example", "ambiguous", [candidate(), candidate(strength_text="250 mg")])
        self.assertEqual(gemini.ask_gemini("1", history), history[-1]["content"])
        self.collect.assert_not_called()

    def test_number_choice_feature_respects_disabled_catalogue_setting(self):
        with override_settings(CATALOGUE_CHAT_ENABLED=False):
            self.assertIsNone(bridge.pending_choice("1", self.choice_history()))

    def test_explicit_selection_passes_details_without_heuristic_extraction(self):
        line = "Brand: Example; Strength: 500 mg; Form: Tablet; Manufacturer: Example Ltd."
        gemini.ask_gemini(line)
        self.lookup.assert_called_once_with("Example", strength="500 mg", dosage_form="Tablet", manufacturer="Example Ltd.")
        self.assertEqual(bridge.parse_labelled_selection("Do not use " + line), {})

    def test_multiple_explicit_selections_keep_both_original_names(self):
        self.scope.return_value = decision(["Example", "Other"])
        self.lookup.side_effect = [CatalogueLookup("Example", "resolved", [candidate()]), CatalogueLookup("Other", "resolved", [candidate(brand_name="Other", generic_name="Ingredient B")])]
        gemini.ask_gemini("Brand: Example; Strength: 500 mg; Form: Tablet; Manufacturer: Example Ltd.\nBrand: Other; Strength: 500 mg; Form: Tablet; Manufacturer: Example Ltd.")
        self.assertEqual(self.collect.call_args.args[0].medicine_names, ["Ingredient A", "Ingredient B"])
        self.assertEqual(json.loads(self.generate.call_args.kwargs["contents"])["scope_decision"]["medicine_names"], ["Example", "Other"])

    def test_one_ambiguous_medicine_prevents_partial_combination_answer(self):
        self.scope.return_value = decision(["Example", "Other"])
        self.lookup.side_effect = [CatalogueLookup("Example", "resolved", [candidate()]), CatalogueLookup("Other", "ambiguous", [candidate(brand_name="Other"), candidate(brand_name="Other", strength_text="250 mg")])]
        answer = gemini.ask_gemini("Compare Example and Other")
        self.assertIn("Example", answer)
        self.assertIn("Other", answer)
        self.collect.assert_not_called()
        self.factory.assert_not_called()

    def test_urgent_requests_and_greetings_never_wait_for_catalogue(self):
        self.scope.return_value = decision(urgent=True)
        gemini.ask_gemini("I took too much Example")
        self.lookup.assert_not_called()
        self.assertTrue(self.collect.call_args.args[0].urgent_safety_concern)
        self.assertEqual(gemini.ask_gemini("hello"), gemini.GREETING_REPLY)
        self.lookup.assert_not_called()

    def test_no_match_keeps_original_name_and_has_no_catalogue_attribution(self):
        self.lookup.return_value = CatalogueLookup("Example", "no_match")
        answer = gemini.ask_gemini("Explain Example")
        self.assertEqual(self.collect.call_args.args[0].medicine_names, ["Example"])
        self.assertNotIn("Kaggle dataset", answer)
        data = json.loads(self.generate.call_args.kwargs["contents"])
        self.assertEqual(data["retrieved_evidence"]["catalogue_lookup"]["results"][0]["status"], "no_match")

    def test_combination_ingredients_are_not_split_or_guessed(self):
        self.lookup.return_value = CatalogueLookup("Example", "resolved", [candidate(generic_name="Ingredient A + Ingredient B")])
        gemini.ask_gemini("Explain Example")
        self.assertEqual(self.collect.call_args.args[0].medicine_names, ["Example"])

    def test_disabled_extension_retains_previous_request_shape(self):
        with override_settings(CATALOGUE_CHAT_ENABLED=False):
            answer = gemini.ask_gemini("Explain Example")
        self.lookup.assert_not_called()
        data = json.loads(self.generate.call_args.kwargs["contents"])
        self.assertNotIn("catalogue_lookup", data["retrieved_evidence"])
        self.assertNotIn("Kaggle dataset", answer)

    def test_unknown_catalogue_citation_is_still_rejected(self):
        self.generate.return_value = answer_response(["C1"])
        with self.assertRaises(RuntimeError):
            gemini.ask_gemini("Explain Example")

    def test_catalogue_markup_cannot_create_extra_links(self):
        self.lookup.return_value = CatalogueLookup("Example", "resolved", [candidate(manufacturer="[Fake](https://evil.example)")])
        answer = gemini.ask_gemini("Explain Example")
        self.assertNotIn("[Fake](https://evil.example)", answer)
        self.assertIn("Kaggle dataset", answer)

    def test_context_budget_removes_stale_citations_without_mutating_input(self):
        plan = bridge.prepare_catalogue_chat(decision(), "Explain Example")
        evidence = grounding_service.prepare_evidence(bundle())
        evidence.payload["entries"][0]["excerpt"] = "x" * 10000
        with patch.object(grounding_service, "MAX_CONTEXT_CHARACTERS", 5000):
            result = bridge.attach_catalogue_context(evidence, plan)
        self.assertEqual(result.citations, {})
        self.assertEqual(result.payload["entries"], [])
        self.assertIn("E1", evidence.citations)
        self.assertEqual(len(evidence.payload["entries"]), 1)

    def test_schema_compatibility_and_strict_local_validation_remain(self):
        def contains_additional_properties(value):
            if isinstance(value, dict):
                return "additionalProperties" in value or any(contains_additional_properties(item) for item in value.values())
            if isinstance(value, list):
                return any(contains_additional_properties(item) for item in value)
            return False
        for model in (gemini.ScopeDecision, grounding_service.GroundedAnswer):
            self.assertFalse(contains_additional_properties(gemini.gemini_response_schema(model)))
        data = decision().model_dump()
        data["unexpected"] = True
        with self.assertRaises(ValidationError):
            gemini.ScopeDecision.model_validate(data)


@override_settings(GEMINI_MODEL="test-model", CATALOGUE_CHAT_ENABLED=True)
class CatalogueChatDatabaseTests(TestCase):
    def test_imported_database_record_reaches_the_existing_answer_flow(self):
        dataset = CatalogDataset.objects.create(code="kaggle_assorted", name="Kaggle", dataset_url="https://example.com")
        batch = CatalogImportBatch.objects.create(dataset=dataset, filename="medicine.csv", checksum="a" * 64, status="completed", completed_at=timezone.now())
        product = CatalogProduct.objects.create(brand_name="Example", normalized_brand_name="example", generic_name="Ingredient A", strength_text="500 mg", dosage_form="Tablet", manufacturer="Example Ltd.")
        CatalogSourceRecord.objects.create(import_batch=batch, product=product, row_number=1, raw_row={"brand name": "Example"}, reconciliation_status="matched")
        with patch.object(gemini, "classify_question", return_value=decision()), patch.object(evidence_service, "collect_evidence", return_value=bundle()) as collect, patch.object(gemini, "create_gemini_client") as factory:
            factory.return_value.__enter__.return_value.models.generate_content.return_value = answer_response()
            answer = gemini.ask_gemini("Explain Example")
        self.assertEqual(collect.call_args.args[0].medicine_names, ["Ingredient A"])
        self.assertIn("Kaggle dataset", answer)
        self.assertEqual(CatalogProduct.objects.count(), 1)
        self.assertEqual(CatalogSourceRecord.objects.count(), 1)
