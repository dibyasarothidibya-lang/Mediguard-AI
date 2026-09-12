import json
import re
from datetime import UTC, datetime
from time import monotonic
from typing import Literal
from urllib.parse import urlencode

import httpx
from django.conf import settings
from django.utils import timezone

from .source_types import EvidenceRecord, SourceLookupResult

OPENFDA_LABEL_URL="https://api.fda.gov/drug/label.json"

RESULT_LIMIT= 5
REQUEST_TIMEOUT_SECONDS= 10
MAX_RESPONSE_BYTES = 2_000_000
def read_text_list(record: dict, field: str) -> list[str]:
    value = record.get(field)

    if value is None:
        return []

    if not isinstance(value, list):
        raise ValueError(f"Expected a list for {field}.")

    if any(not isinstance(item, str) for item in value):
        raise ValueError(f"Expected text entries for {field}.")

    return [item.strip() for item in value if item.strip()]
def lookup_openfda(medicine_name: str) -> SourceLookupResult:
    if not isinstance(medicine_name, str):
        raise TypeError("Medicine name must be a string.")

    medicine_name = medicine_name.strip()

    if not medicine_name:
        raise ValueError("Medicine name cannot be empty.")

    if len(medicine_name) > 200:
        raise ValueError("Medicine name cannot exceed 200 characters.")
        

    # Check whether settings.OPENFDA_API_KEY is empty
    if not settings.OPENFDA_API_KEY:
        return SourceLookupResult(
            source_id="openfda",
            source_name="openFDA",
            jurisdiction="US",
            query=medicine_name,
            status="not_configured",
            coverage="live_endpoint",
            message="The openFDA API key is not configured.",
        )

    # 1. Validate the search input
    # Allows only letters, numbers, spaces, and hyphens
    if not re.fullmatch(r"^[A-Za-z0-9 \-]+$", medicine_name):
        raise ValueError("The name contains unsupported search characters.")

    def empty_result(
        status: Literal["unavailable", "no_match"],
        message: str,
    ) -> SourceLookupResult:
        return SourceLookupResult(
            source_id="openfda",
            source_name="openFDA",
            jurisdiction="US",
            query=medicine_name,
            status=status,
            coverage="live_endpoint",
            checked_at=timezone.now(),
            message=message,
        )

    # 2. Build the search expression as a quoted phrase
    search_expression = f'openfda.brand_name:"{medicine_name}" OR openfda.generic_name:"{medicine_name}"'

    # 3. Create the parameters dictionary for the HTTPX request
    params = {
        "api_key": settings.OPENFDA_API_KEY,
        "search": search_expression,
        "limit": RESULT_LIMIT
    }

    try:
        with httpx.stream(
            "GET",
            OPENFDA_LABEL_URL,
            params=params,
            timeout=REQUEST_TIMEOUT_SECONDS,
            follow_redirects=False,
        ) as response:
            body = bytearray()
            for chunk in response.iter_bytes():
                if len(body) + len(chunk) > MAX_RESPONSE_BYTES:
                    return empty_result(
                        "unavailable",
                        "The openFDA response exceeded the size limit.",
                    )
                body.extend(chunk)
    except httpx.HTTPError:
        return empty_result(
            "unavailable",
            "The openFDA request failed.",
        )

    checked_at = timezone.now()    

    if response.status_code == 429:
        return empty_result(
            "unavailable",
            "The openFDA request limit was reached.",
        )

    if response.status_code not in (200, 404):
        return empty_result(
            "unavailable",
            "openFDA returned an unsuccessful HTTP response.",
        )

    try:
        data = json.loads(body)
    except (ValueError, UnicodeDecodeError, RecursionError):
        return empty_result(
            "unavailable",
            "openFDA returned invalid JSON.",
        )

    if not isinstance(data, dict):
        return empty_result(
            "unavailable",
            "openFDA returned an unexpected response structure.",
        )

    if response.status_code == 404:
        error = data.get("error")
        if (
            isinstance(error, dict)
            and error.get("code") == "NOT_FOUND"
            and error.get("message") == "No matches found!"
        ):
            return empty_result(
                "no_match",
                "No matching label records were returned by openFDA.",
            )

        return empty_result(
            "unavailable",
            "openFDA returned an unrecognized not-found response.",
        )

    raw_records = data.get("results")
    if (
        "error" in data
        or not isinstance(raw_records, list)
        or not raw_records
        or len(raw_records) > RESULT_LIMIT
        or not all(isinstance(record, dict) for record in raw_records)
    ):
        return empty_result(
            "unavailable",
            "openFDA returned an unexpected results structure.",
        )

    # The next section converts these records into evidence objects.
    section_fields = (
        "active_ingredient",
        "indications_and_usage",
        "purpose",
        "boxed_warning",
        "warnings",
        "warnings_and_cautions",
        "contraindications",
        "adverse_reactions",
        "drug_interactions",
        "dosage_and_administration",
        "dosage_forms_and_strengths",
        "storage_and_handling",
    )
    records: list[EvidenceRecord] = []

    try:
        for raw in raw_records:
            record_id = raw.get("id")
            if (
                not isinstance(record_id, str)
                or not re.fullmatch(
                    r"[0-9a-fA-F]{8}(?:-[0-9a-fA-F]{4}){3}-[0-9a-fA-F]{12}",
                    record_id,
                )
            ):
                raise ValueError("Missing or unexpected label identifier.")

            product = raw.get("openfda")
            if not isinstance(product, dict):
                raise TypeError("Missing product metadata.")

            brand_names = read_text_list(product, "brand_name")
            generic_names = read_text_list(product, "generic_name")
            names = brand_names or generic_names
            if not names:
                raise ValueError("Missing product name.")

            ingredients = read_text_list(product, "substance_name")
            manufacturers = read_text_list(product, "manufacturer_name")

            sections = []
            for field in section_fields:
                paragraphs = read_text_list(raw, field)
                if paragraphs:
                    heading = field.replace("_", " ").capitalize()
                    sections.append(heading + ":\n" + "\n".join(paragraphs))

            if not sections:
                raise ValueError("No supported label sections were supplied.")

            content = "\n\n".join(sections)
            if len(content) > 50_000:
                raise ValueError("Selected label content exceeds our limit.")

            source_date = None
            effective_time = raw.get("effective_time")
            if effective_time is not None:
                if (
                    not isinstance(effective_time, str)
                    or not re.fullmatch(r"[0-9]{8}", effective_time)
                ):
                    raise ValueError("Unexpected label date.")
                source_date = datetime.strptime(
                    effective_time, "%Y%m%d"
                ).replace(tzinfo=UTC).date()

            version = raw.get("version")
            if version is not None and not isinstance(version, str):
                raise ValueError("Unexpected label version.")

            record_query = urlencode({
                "search": f'id:"{record_id}"',
                "limit": 1,
            })

            records.append(EvidenceRecord.model_validate({
                "record_id": record_id,
                "product_name": "; ".join(names),
                "ingredient": "; ".join(ingredients) or None,
                "manufacturer": "; ".join(manufacturers) or None,
                "content": content,
                "official_url": f"{OPENFDA_LABEL_URL}?{record_query}",
                "evidence_type": "label",
                "source_date": source_date,
                "source_version": version,
                "retrieved_at": checked_at,
                "matching_notes": (
                    "Candidate returned by a name search. Exact product "
                    "identity, strength, and formulation are not confirmed. "
                    "Names and manufacturers may contain multiple entries. "
                    "Content contains selected label sections only."
                ),
            }))
    except (ValueError, TypeError):
        return empty_result(
            "unavailable",
            "The returned labels could not be converted into valid evidence.",
        )

    return SourceLookupResult(
        source_id="openfda",
        source_name="openFDA",
        jurisdiction="US",
        query=medicine_name,
        status="found",
        coverage="live_endpoint",
        checked_at=checked_at,
        records=records,
        message=(
            "Candidate label records were retrieved. "
            "These are not confirmed matches to the user's product."
        ),
    )





