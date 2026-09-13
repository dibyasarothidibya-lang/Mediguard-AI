"""Read-only duplicate analysis and cross-dataset correspondence.

No ORM, Gemini, openFDA, network calls, or source-file writes belong here.
"""

from collections import Counter, defaultdict
from dataclasses import dataclass
from datetime import UTC, datetime
from hashlib import file_digest
from pathlib import Path
import unicodedata

from .catalogue_import_service import (
    CatalogueCSVError,
    KAGGLE_PRODUCT_COLUMNS,
    MENDELEY_PRODUCT_COLUMNS,
    read_catalogue_csv,
    validate_catalogue_row,
)

PRODUCT_FIELDS = (
    "brand_name", "generic_name", "strength_text", "dosage_form", "manufacturer",
)
AUDIT_VERSION = 1


def normalize_catalogue_text(value: str) -> str:
    """Normalize for comparison only; retain punctuation, units and ingredient order."""
    return " ".join(unicodedata.normalize("NFC", value).split()).casefold()


def catalogue_product_key(fields: dict[str, str]) -> tuple[str, ...]:
    return tuple(normalize_catalogue_text(fields[name]) for name in PRODUCT_FIELDS)


@dataclass
class CatalogueRow:
    number: int
    original: dict[str, str]
    fields: dict[str, str]

    @property
    def product_key(self):
        return catalogue_product_key(self.fields)

    @property
    def exact_key(self):
        # Six fields from the supplied report, in a fixed order.
        return tuple(self.fields[name] for name in PRODUCT_FIELDS) + (self.fields["source_slug"],)

    @property
    def comparison_key(self):
        # Source slugs are opaque identifiers, so do not normalize them.
        return self.product_key + (self.fields["source_slug"],)


def file_checksum(path: Path) -> str:
    with path.open("rb") as source:
        return file_digest(source, "sha256").hexdigest()


def read_dataset(path: Path, code: str, columns: tuple[str, ...]):
    before = file_checksum(path)
    accepted = []
    rejected = []
    total = 0
    for number, original in read_catalogue_csv(path, columns):
        total += 1
        fields, errors = validate_catalogue_row(original, code)
        if errors:
            rejected.append({"row_number": number, "errors": errors, "original_row": original})
        else:
            accepted.append(CatalogueRow(number, original, fields))
    if file_checksum(path) != before:
        raise CatalogueCSVError(f"{path.name}: file changed during the check; rerun it.")
    summary = {
        "dataset_code": code, "filename": path.name, "sha256": before,
        "rows_read": total, "rows_accepted": len(accepted),
        "rows_rejected": len(rejected), "rejections": rejected,
    }
    return accepted, summary


def group_rows(rows, key_function, skip_empty=False):
    groups = defaultdict(list)
    for row in rows:
        key = key_function(row)
        if skip_empty and not key.strip():
            continue
        groups[key].append(row)
    return groups


def describe_group(key, rows):
    return {
        "key": key,
        "row_numbers": [row.number for row in rows],
        "distinct_product_keys": len({row.product_key for row in rows}),
        "distinct_original_rows": len({tuple(sorted(row.original.items())) for row in rows}),
        "distinct_medicine_types": sorted({row.fields["medicine_type"] for row in rows}),
    }


def duplicate_report(rows):
    product_groups = group_rows(rows, lambda row: row.product_key)
    id_groups = group_rows(rows, lambda row: row.fields["source_record_id"], skip_empty=True)
    slug_groups = group_rows(rows, lambda row: row.fields["source_slug"], skip_empty=True)
    originals = group_rows(rows, lambda row: tuple(sorted(row.original.items())))
    repeated_ids = [describe_group(key, group) for key, group in id_groups.items() if len(group) > 1]
    return {
        "exact_duplicate_rows": [
            {"row_numbers": [row.number for row in group]}
            for group in originals.values() if len(group) > 1
        ],
        "repeated_product_keys": [
            describe_group(key, group) for key, group in product_groups.items() if len(group) > 1
        ],
        "repeated_source_ids": repeated_ids,
        # Any content difference under the same source ID needs review, even
        # when the five identity attributes happen to agree.
        "conflicting_source_ids": [group for group in repeated_ids if group["distinct_original_rows"] > 1],
        "repeated_slugs": [
            describe_group(key, group) for key, group in slug_groups.items() if len(group) > 1
        ],
        "conflicting_slugs": [
            describe_group(key, group) for key, group in slug_groups.items()
            if len({row.product_key for row in group}) > 1
        ],
    }


def reconcile_rows(kaggle_rows, mendeley_rows, conflicting_ids):
    exact_index = group_rows(kaggle_rows, lambda row: row.exact_key)
    comparison_index = group_rows(kaggle_rows, lambda row: row.comparison_key)
    product_index = group_rows(kaggle_rows, lambda row: row.product_key)
    counts = Counter({"matched_exact": 0, "matched_normalized": 0, "ambiguous": 0, "unmatched": 0})
    details = []
    exact_correspondence = 0
    for row in mendeley_rows:
        exact = exact_index.get(row.exact_key, [])
        if exact:
            exact_correspondence += 1
        candidates = exact or comparison_index.get(row.comparison_key, [])
        basis = "exact_six_fields" if exact else "normalized_product_fields_and_exact_slug"
        missing_fields = [name for name in PRODUCT_FIELDS if not normalize_catalogue_text(row.fields[name])]
        if missing_fields or not row.fields["source_slug"].strip():
            state, reason = "ambiguous", "incomplete_identity_or_slug"
        elif not candidates:
            state = "unmatched"
            candidates = product_index.get(row.product_key, [])
            reason = "product_fields_agree_but_slug_differs" if candidates else "no_six_field_candidate"
            basis = "product_fields_only" if candidates else "none"
        elif len(candidates) > 1:
            state, reason = "ambiguous", "multiple_kaggle_rows"
        elif candidates[0].fields["source_record_id"] in conflicting_ids:
            state, reason = "ambiguous", "conflicting_kaggle_source_id"
        else:
            state = "matched_exact" if exact else "matched_normalized"
            reason = "one_candidate_for_the_comparison_fields"
        counts[state] += 1
        details.append({
            "mendeley_row_number": row.number, "status": state, "basis": basis,
            "reason": reason, "missing_product_fields": missing_fields,
            "kaggle_row_numbers": [candidate.number for candidate in candidates],
        })
    return {
        "counts": dict(counts),
        "mendeley_rows_with_exact_six_field_correspondence": exact_correspondence,
        "details": details,
    }


def build_catalogue_report(data_dir: str | Path) -> dict:
    """Inspect the two product files. Never assume that the report's overlap is true."""
    root = Path(data_dir).expanduser().resolve()
    kaggle, kaggle_summary = read_dataset(root / "kaggle" / "medicine.csv", "kaggle", KAGGLE_PRODUCT_COLUMNS)
    mendeley, mendeley_summary = read_dataset(root / "mendeley" / "MENDLY.csv", "mendeley", MENDELEY_PRODUCT_COLUMNS)
    kaggle_summary["duplicates"] = duplicate_report(kaggle)
    mendeley_summary["duplicates"] = duplicate_report(mendeley)
    conflicting_ids = {group["key"] for group in kaggle_summary["duplicates"]["conflicting_source_ids"]}
    return {
        "audit_version": AUDIT_VERSION,
        "created_at": datetime.now(UTC).isoformat(),
        "mode": "dry_run_no_database_writes",
        "product_key_fields": list(PRODUCT_FIELDS),
        "datasets": {"kaggle": kaggle_summary, "mendeley": mendeley_summary},
        "reconciliation": reconcile_rows(kaggle, mendeley, conflicting_ids),
        "limitations": [
            "Only medicine.csv and MENDLY.csv are checked in this milestone.",
            "Accepted means field validation passed, not regulatory or clinical verification.",
            "Groups count duplicate candidates, not products to remove or merge.",
            "Matching compares six supplied fields; source copies are not independent corroboration.",
            "No database comparison, product merging, or import has occurred.",
            "No unit conversion, ingredient substitution, fuzzy search, or slug-only matching is used.",
        ],
    }
