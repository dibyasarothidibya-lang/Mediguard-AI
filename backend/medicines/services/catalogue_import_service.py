"""Read original catalogue CSVs without changing files or querying the database."""

import csv
from collections.abc import Iterator, Sequence
from pathlib import Path

KAGGLE_PRODUCT_COLUMNS = (
    "brand id", "brand name", "type", "slug", "dosage form", "generic",
    "strength", "manufacturer", "package container", "Package Size",
)
MENDELEY_PRODUCT_COLUMNS = (
    "genericName", "brandName", "packageMark", "dosageType", "strength",
    "manufacturer",
)


class CatalogueCSVError(ValueError):
    """An input file has invalid CSV structure or unexpected headers."""


def read_catalogue_csv(
    path: str | Path, expected_columns: Sequence[str],
) -> Iterator[tuple[int, dict[str, str]]]:
    """Yield one-based data-row numbers and unchanged field values.

    Row numbers count CSV records, excluding the header, rather than physical
    lines: a quoted value may span several lines. Extra named columns are
    preserved. Missing values remain empty strings; normalization comes later.
    """
    path = Path(path)
    row_number = 0
    try:
        with path.open("r", encoding="utf-8-sig", newline="") as source:
            reader = csv.DictReader(source, strict=True)
            headers = reader.fieldnames
            if not headers:
                raise CatalogueCSVError(f"{path.name}: missing CSV header.")
            if any(not name.strip() for name in headers):
                raise CatalogueCSVError(f"{path.name}: blank column name in header.")
            if len(headers) != len(set(headers)):
                raise CatalogueCSVError(f"{path.name}: duplicate column names in header.")
            missing = [name for name in expected_columns if name not in headers]
            if missing:
                raise CatalogueCSVError(
                    f"{path.name}: missing required columns: {', '.join(missing)}."
                )
            for row_number, row in enumerate(reader, start=1):
                if None in row:
                    raise CatalogueCSVError(
                        f"{path.name}: data row {row_number} has more values than the header."
                    )
                if any(value is None for value in row.values()):
                    raise CatalogueCSVError(
                        f"{path.name}: data row {row_number} has fewer values than the header."
                    )
                # DictReader returns strings after the structural checks above.
                yield row_number, {name: row[name] for name in headers}
    except csv.Error as exc:
        raise CatalogueCSVError(
            f"{path.name}: malformed CSV near data row {row_number + 1}: {exc}"
        ) from exc









def validate_catalogue_row(original_row: dict, dataset_code: str) -> tuple[dict, list[str]]:
    """
    Validates a single catalogue row from either the 'kaggle' or 'mendeley' dataset.
    
    Returns:
        tuple: (mapped_product_and_source_fields, list_of_validation_errors)
    """
    # 1. Define source to target mappings based on Step 1
    kaggle_mapping = {
        "brand name": "brand_name",
        "generic": "generic_name",
        "strength": "strength_text",
        "dosage form": "dosage_form",
        "manufacturer": "manufacturer",
        "type": "medicine_type",
        "brand id": "source_record_id",
        "slug": "source_slug"
    }

    mendeley_mapping = {
        "brandName": "brand_name",
        "genericName": "generic_name",
        "strength": "strength_text",
        "dosageType": "dosage_form",
        "manufacturer": "manufacturer",
        # medicine_type is not supplied, maps to nothing
        "packageMark": "source_slug" # Special rule: packageMark maps to source slug
    }

    # Assign correct mapping schema based on dataset code
    if dataset_code.lower() == 'kaggle':
        mapping = kaggle_mapping
    elif dataset_code.lower() == 'mendeley':
        mapping = mendeley_mapping
    else:
        return {}, [f"Invalid dataset code: {dataset_code}"]

    # 2. Extract and map fields into the standardized structure
    mapped_fields = {}
    
    # Initialize absent text fields as empty strings, matching the models
    target_fields = [
        "brand_name", "generic_name", "strength_text", 
        "dosage_form", "manufacturer", "medicine_type", 
        "source_record_id", "source_slug"
    ]
    for field in target_fields:
        mapped_fields[field] = ""

    # Map raw fields to the model fields
    for source_key, val in original_row.items():
        if source_key in mapping:
            target_key = mapping[source_key]
            mapped_fields[target_key] = val

    errors = []

    # 3. Apply Validation Rules
    
    # --- Brand Name Validation ---
    brand = mapped_fields.get("brand_name")
    # Rule: Required (whitespace alone is invalid)
    if brand is None or (isinstance(brand, str) and not brand.strip()):
        errors.append("Brand name is required and cannot be empty or whitespace only.")
    # Rule: Max 500 characters
    elif isinstance(brand, str) and len(brand) > 500:
        errors.append(f"Brand name exceeds maximum limit of 500 characters (Length: {len(brand)}).")

    # --- Generic Name Validation (Max 1,000 characters) ---
    generic = mapped_fields.get("generic_name")
    if isinstance(generic, str) and len(generic) > 1000:
        errors.append(f"Generic name exceeds maximum limit of 1,000 characters (Length: {len(generic)}).")

    # --- Strength Text Validation (Max 500 characters) ---
    strength = mapped_fields.get("strength_text")
    if isinstance(strength, str) and len(strength) > 500:
        errors.append(f"Strength text exceeds maximum limit of 500 characters (Length: {len(strength)}).")

    # --- Dosage Form Validation (Max 300 characters) ---
    dosage = mapped_fields.get("dosage_form")
    if isinstance(dosage, str) and len(dosage) > 300:
        errors.append(f"Dosage form exceeds maximum limit of 300 characters (Length: {len(dosage)}).")

    # --- Manufacturer Validation (Max 500 characters) ---
    mfg = mapped_fields.get("manufacturer")
    if isinstance(mfg, str) and len(mfg) > 500:
        errors.append(f"Manufacturer exceeds maximum limit of 500 characters (Length: {len(mfg)}).")

    # --- Medicine Type Validation (Max 100 characters) ---
    med_type = mapped_fields.get("medicine_type")
    if isinstance(med_type, str) and len(med_type) > 100:
        errors.append(f"Medicine type exceeds maximum limit of 100 characters (Length: {len(med_type)}).")

    # --- Source Identifier Validation (Max 255 characters) ---
    # Note: Only validated if it exists (Mendeley has an empty string here)
    source_id = mapped_fields.get("source_record_id")
    if isinstance(source_id, str) and len(source_id) > 255:
        errors.append(f"Source identifier exceeds maximum limit of 255 characters (Length: {len(source_id)}).")

    # --- Slug / packageMark Validation (Max 1,000 characters) ---
    slug = mapped_fields.get("source_slug")
    if isinstance(slug, str) and len(slug) > 1000:
        errors.append(f"Slug / packageMark exceeds maximum limit of 1,000 characters (Length: {len(slug)}).")

    return mapped_fields, errors
