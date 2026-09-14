from datetime import date
from typing import Literal

from pydantic import AwareDatetime, BaseModel, Field, HttpUrl


class EvidenceRecord(BaseModel):
    # fields here
    record_id: str | None = None
    product_name: str
    content: str
    ingredient: str | None = None
    strength: str | None = None
    dosage_form: str | None = None 
    manufacturer: str | None = None
    source_date: date | None = None
    batch: str | None = None
    affected_market: str | None = None
    listing_status: str | None = None
    retrieved_at: AwareDatetime | None = None
    reviewed_at: AwareDatetime | None = None
    next_review_at: AwareDatetime | None = None
    source_version: str | None = None
    matched_fields: list[str] = Field(default_factory=list)
    matching_notes: str | None = None
    official_url: HttpUrl
    evidence_type: Literal[
                "label",
                "registration",
                "alert",
                "product_listing",
                "essential_medicine",
    ]


class SourceLookupResult(BaseModel):

    source_id: str
    source_name: str
    jurisdiction: str
    query: str
    checked_at: AwareDatetime | None = None
    status: Literal[
        "not_configured",
        "not_loaded",
        "not_checked",
        "found",
        "no_match",
        "unavailable",
        "stale",
    ]
    coverage: Literal[
        "live_endpoint",
        "downloaded_snapshot",
        "reviewed_imported_subset",
    ]

    records: list[EvidenceRecord] = Field(default_factory=list)
    message: str | None = None







