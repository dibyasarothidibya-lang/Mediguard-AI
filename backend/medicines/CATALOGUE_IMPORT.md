# Catalogue import, lookup, and chat integration

The CSV audit and importer run independently of chat. The read-only catalogue lookup now supplies historical product metadata to the existing openFDA/Gemini chat flow.

## Run from the activated backend environment

1. Run the focused regression tests: `python manage.py test medicines.test_catalogue_audit`.
2. Run the real-file dry run: `python manage.py check_catalogue --data-dir "data/catalogue/raw" --report "data/catalogue/reports/catalogue-audit.json"`.
3. Review the terminal summary and JSON report before designing the import decisions.

Use a new report filename for another run; the command refuses to overwrite an existing report. Reports must be outside the raw directory. Omitting --report prints the summary without writing a report file.

## Files and responsibilities

- services/catalogue_import_service.py: existing CSV structure reader and field validator.
- services/catalogue_audit_service.py: normalization, duplicate groups, file checksums, and dataset correspondence.
- management/commands/check_catalogue.py: command arguments, console summary, and optional JSON report.
- test_catalogue_audit.py: tests for ambiguity, conflicts, CSV parsing, file preservation, and report path protection.

## What the counts mean

Accepted/rejected counts concern field validation only. Rejected rows do not participate in duplicate analysis or reconciliation. An empty file generates a warning and is not useful evidence of import readiness.

Duplicate counts are counts of groups, not rows to delete. Categories overlap: the same rows can appear in a product-key group, a source-ID group, and a slug group. Do not add these group counts together as a count of unique problems.

The comparison-only product key contains brand, generic, strength, dosage form, and manufacturer. NFC Unicode normalization, whitespace cleanup, and case folding are applied to these values. Original values are preserved. Punctuation, strength units, and ingredient order are not rewritten. Slugs and source IDs remain exact strings.

- exact_duplicate_rows: all original CSV fields agree.
- repeated_product_keys: the five normalized product attributes agree; other attributes may differ.
- repeated_source_ids: the same nonempty source ID appears more than once.
- conflicting_source_ids: rows with the same ID have different original content, including packaging differences.
- repeated_slugs: the same nonempty slug appears more than once.
- conflicting_slugs: one slug has more than one normalized product key.

## Mendeley to Kaggle correspondence

The report's six-column correspondence is checked using the five product fields plus slug/packageMark. Exact comparisons come first; otherwise normalized product fields plus the exact slug are compared.

- matched_exact: one exact candidate, complete identity fields, and no conflicting source ID.
- matched_normalized: one candidate after comparison normalization, complete identity fields, and no conflicting source ID.
- ambiguous: incomplete product details or slug, multiple candidate source rows, or a conflicting Kaggle source ID. Even identical duplicate source rows remain unresolved at this stage.
- unmatched: no six-field candidate. A five-field candidate with a different slug is reported for review, not automatically linked.

The separate exact-correspondence count includes rows that have an exact six-field candidate but are still ambiguous. Therefore it can be higher than matched_exact. Counts concern accepted Mendeley rows; they do not prove equal duplicate multiplicities or one-to-one correspondence between the datasets.

Missing optional fields are allowed by field validation, but a record lacking identity details does not qualify for automatic matching. A match reports catalogue correspondence, not current DGDA registration, physical-pack authenticity, or medical suitability.

## Report contents

Each report has an audit version, creation timestamp, original-file SHA-256 checksums, validation rejections, complete duplicate group row numbers, and a reconciliation entry for every accepted Mendeley row. Row numbers count data records starting at 1, excluding the CSV header; quoted multiline values do not create extra records. Console examples are capped; the JSON retains the full results.

The checksum is checked before and after reading each file to detect changes during processing. A report timestamp is an audit time, not the dataset publication date or proof of data freshness.

## Release scope

The first importer, repeated-import protection, database lookup and chat connection are implemented. The generic and reference CSVs are preserved but not processed by this command. DailyMed and additional sources are outside this release.

## Learning references

- [Python CSV documentation](https://docs.python.org/3/library/csv.html) explains DictReader and quoted records.
- [Django management commands](https://docs.djangoproject.com/en/6.0/howto/custom-management-commands/) explains the command wrapper and CommandError.


## First import after reviewing the audit

The command `import_catalogue` uses the existing PostgreSQL tables. No new migration is required. It reads the CSVs again and verifies their fingerprints against the reviewed audit before applying changes. It does not trust the audit's matching decisions as input: it recomputes them from the files.

Run tests from the activated backend environment:

`python manage.py test medicines.test_catalogue_audit medicines.test_catalogue_persistence`

The persistence tests use Django's separate test database and require PostgreSQL. They exercise real inserts, rerun behavior, changed-file refusal, original-row preservation, and transaction rollback. They do not test concurrent worker timing; the implementation uses PostgreSQL dataset row locks in a consistent order to serialize imports.

Optional preview, with no catalogue writes:

`python manage.py import_catalogue --data-dir "data/catalogue/raw" --reviewed-report "data/catalogue/reports/catalogue-audit.json"`

Apply after the tests pass:

`python manage.py import_catalogue --data-dir "data/catalogue/raw" --reviewed-report "data/catalogue/reports/catalogue-audit.json" --apply`

Repeat the identical apply command to verify that it reports `already_imported` without adding duplicates. It checks source-row contents, counts, links, and product fields. If these were manually edited or partially removed, it stops rather than silently repairing them.

### Import rules for the reviewed CSV pair

- Each Kaggle source row gets its own catalogue product entry. The current file should create 21,714 entries. This is not a claim of 21,714 distinct formulations: repeated product keys remain separate source entries until their packaging and identity differences have been reviewed.
- Every CSV row is preserved verbatim as a JSON object in CatalogSourceRecord, including packaging columns. Source IDs and slugs are retained separately.
- Only exact, complete, unambiguous Mendeley matches are linked automatically. The current audit predicts 20,489 linked Mendeley source rows and 872 unlinked ambiguous rows: 757 with incomplete details and 115 with multiple Kaggle candidates.
- Normalized-only matches and unmatched rows remain unlinked with pending status. Neither occurs in the currently reviewed files.
- No additional products are created from Mendeley. The initial import should store 43,075 original source rows, two batches, and two dataset records, assuming the catalogue is initially empty.
- Imported source rows marked matched only mean that they are linked to a local catalogue entry. This is not an official registration or authenticity claim.
- Both datasets commit in one transaction. Failures roll back products, source records, and batch changes together. Failed attempts therefore do not leave a persistent failed-batch record in this version; the command reports the error.
- Blank/duplicate Kaggle IDs, invalid rows, empty files, and NUL characters stop the first import. Original files and the audit retain the data for correction and review.
- File fingerprints are the snapshot identifiers. Dataset version strings are left blank rather than inferred from a filename or download date. Publication metadata can be recorded separately when confirmed.
- Dataset defaults name the Kaggle and Mendeley publications and their dataset-page licences. The importer does not label them as official DGDA data.
- Changed-file updates, multiple historical batches, and reconciliation edits need a separate reviewed workflow. Reruns never overwrite product attributes or delete original rows.

### Implementation files

- services/catalogue_persistence_service.py: prepare records, check existing imports, lock dataset rows, and commit the initial import atomically.
- management/commands/import_catalogue.py: preview by default; --apply requires a reviewed report with matching CSV fingerprints.
- test_catalogue_persistence.py: PostgreSQL regression tests for the import workflow.

The importer does not modify the existing Gemini/openFDA pipeline or import generic clinical descriptions. The lookup and chat extension described below read these imported records.


## Current database checkpoint

The user confirmed the first import and an identical rerun on 13 September 2026:

- 21,714 Kaggle product entries and 43,075 preserved source rows.
- 20,489 Mendeley source rows linked; 872 ambiguous rows retained without links.
- The rerun reported already_imported and verified source contents, product fields and links without adding duplicates.

Do not reimport or create another migration for the lookup/chat extension. Representative database lookups and live chat behavior remain to be checked using the commands below.

## Read-only brand lookup

Run from the activated backend environment:

```bash
python manage.py lookup_catalogue --name "Napa" --name "Napa Extra"
```

This prints JSON from your imported database; it does not call providers or write records. Check candidate brand, ingredient, strength, form, manufacturer and source row numbers against the original CSV rows. To select a formulation, use values actually returned by the command:

```bash
python manage.py lookup_catalogue --name "Napa" --strength "500 mg" --form "Tablet" --manufacturer "Beximco Pharmaceuticals Ltd."
```

The example details must match your stored snapshot. details_not_found means those exact details did not match; it does not establish that a medicine does not exist.

Lookup uses the same NFC, whitespace and case normalization as import. It does not fuzzy-match misspellings, convert strength units or guess synonyms. Only completed Kaggle imports with linked source records participate. Linked Mendeley provenance is retained; unlinked ambiguous Mendeley rows cannot select a product. Entries sharing all five normalized identity fields plus medicine type are displayed together without merging database rows.

Statuses:

- resolved: one complete catalogue formulation after filtering, still unverified product identity.
- ambiguous: multiple formulations or a search limit prevented unique resolution.
- incomplete: one candidate has missing identity fields; no ingredient-query substitution.
- no_match: no eligible entry for that brand in this snapshot.
- details_not_found: brand candidates exist but supplied details do not match.
- not_ready: no completed Kaggle batch exists.
- unavailable: database lookup failed; this is not a no-match.
- invalid_query: unsupported query shape or length.

Search reads at most 101 product entries to detect the 100-entry limit and displays at most five candidates. A truncated result cannot be reported as uniquely resolved. These conservative limits may require later manual review for an unusually common brand.

## Chat connection and boundaries

The existing classifier, ScopeDecision, GroundedAnswer, gemini_response_schema compatibility adapter, automatic-function-call disabling, openFDA connector, evidence coordinator, citation renderer, HTTP response shape and frontend are preserved. The integration is a small wrapper inside ask_gemini:

1. Classify using the existing schema and scope rules.
2. Read catalogue candidates for extracted names. Urgent requests bypass catalogue lookup; ambiguous formulations receive a backend clarification before label retrieval or answer generation.
3. For a unique complete formulation, pass a separate validated ingredient search decision to the existing evidence coordinator when the ingredient matches its existing query grammar. Preserve original extracted names and explicitly describe each mapping in the answer input.
4. Add bounded catalogue identity/provenance context to the existing evidence input, then run the existing answer generation and citation validation.
5. Append escaped catalogue details and fixed dataset-page links separately from official openFDA citations.

Catalogue metadata is historical dataset information, not a live DGDA check or proof of current registration, physical-pack authenticity, or personal suitability. Duplicate datasets are not independent corroboration. No clinical description CSVs are fed to Gemini, and no additional source connectors are enabled.

An openFDA ingredient result is general label context, not confirmation that a US product and a Bangladesh brand are the same formulation. Ingredients containing unsupported punctuation, such as combinations with a plus sign, are not split or rewritten. Their original brand name remains the evidence query. An unsupported or unmatched search does not become evidence that a product is safe.

### Answering a formulation clarification

Chat displays numbered formulations with strength, form and manufacturer. A shared manufacturer is shown once above the options. Users can reply with 1 or option 1; comparisons accept one number per ambiguous medicine, such as 1, 3. Already resolved or unmatched names remain part of the original question.

The backend uses only the immediately preceding choice exchange (and consecutive numeric retries) from the supplied conversation history. It reclassifies the original question using the existing schema, recreates the menu from current catalogue rows, compares it with the displayed menu and runs the normal filtered lookup again. Client history is not trusted as product data. A number cannot force an ambiguous identity into a resolved one. If rows or ordering changed, the user receives refreshed choices instead of silently selecting a different product.

Invalid or incomplete selections redisplay the choices. Numbers after an unrelated answer do not reuse an older menu. Replies containing additional prose continue through normal classification, so emergency details and unrelated tasks are not stripped. Conversation history remains limited by the existing API; if the original exchange has fallen out of that window, ask the original question again. A truncated or altered menu cannot authorize a selection.

After a valid selection, the answer request contains the original question and the selected catalogue context. Thus selecting a product after asking about side effects answers the side-effects question. No new Gemini schema, API response field, database model or frontend parser is introduced.

The first five catalogue candidates are displayed. Existing exact labelled selections remain supported for compatibility and explicit details; no heuristic strength/unit conversion or ingredient aliases are introduced. Subsequent new questions still perform the usual lookup. This change makes the clarification reply simpler, rather than adding persistent product selection across an entire conversation.

## Combined test checkpoint

Run these yourself after saving the implementation:

```bash
python manage.py check
python manage.py test medicines --keepdb
python manage.py lookup_catalogue --name "Napa" --name "Napa Extra"
```

The suite includes the existing openFDA/Gemini tests plus audit, persistence, lookup and chat integration tests. Provider calls are mocked in chat tests. Database tests use Django's test database; they must not be configured to use the real catalogue database. The legacy provider unit tests disable catalogue lookup so their existing assertions remain isolated; new integration tests enable it and include a database-backed chat case.

After tests pass, restart the backend if necessary and use the existing chat UI:

- Ask about a brand with several returned formulations: expect choices before a medicine answer.
- Reply with 1 or option 1: expect the original question to be answered with catalogue attribution and the existing answer format.
- Ask about Napa Extra: check its displayed ingredients against your lookup output. Combination ingredients must not be silently split for retrieval.
- Ask about a medicine absent from the catalogue: expect the existing evidence path, with no invented catalogue match.
- Send hello: expect the existing static greeting.

Automated tests do not establish live Gemini schema acceptance or answer quality. Check those in the existing UI after the suite passes. Report any error output; do not change the schema adapter to work around a catalogue issue.

### Rollback switch

Catalogue chat is enabled by default. To temporarily restore the previous chat input/output path, set the Django setting CATALOGUE_CHAT_ENABLED = False in your settings module and restart the backend. This is a Django setting; an environment variable alone has no effect unless your settings module reads it. The switch does not remove imported records or disable the lookup command.

### Added implementation files

- services/catalogue_lookup_service.py: bounded database lookup and provenance.
- services/catalogue_chat_service.py: selection, explicit ingredient mapping, bounded context and attribution.
- management/commands/lookup_catalogue.py: representative medicine inspection.
- test_catalogue_lookup.py and test_catalogue_chat.py: database and mocked-provider regression coverage.

The changes are prepared for the user-run test checkpoint; do not describe the new tests or live chat checks as passed until their outputs are reviewed.

## Numbered-choice regression checkpoint

Run python manage.py check and python manage.py test medicines --keepdb. Eight additional tests cover the original question, invalid choices, stale/forged menus, extra user text, retries, multi-medicine selections, unresolved candidates and the disable switch. The user previously confirmed all 125 tests before this UX change; the updated suite and live choice flow remain to be run.
