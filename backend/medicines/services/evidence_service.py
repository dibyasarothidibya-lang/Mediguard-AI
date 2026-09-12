import re
from time import monotonic
from typing import TYPE_CHECKING, Literal

from django.db import DatabaseError
from pydantic import BaseModel, Field

from ..models import TrustedSource
from .openfda_service import lookup_openfda
from .source_types import SourceLookupResult

if TYPE_CHECKING:
    from .gemini_service import ScopeDecision


SOURCE_IDS = (
    "dgda", "openfda", "dailymed", "who_alerts",
    "who_listings", "who_eml", "ema",
)
# Soft limit between calls, not cancellation of an in-progress connector.
EVIDENCE_BUDGET_SECONDS = 20


class SourceCheck(BaseModel):
    source_id: str
    query: str
    enabled: bool | None = None
    state: Literal[
        "completed", "disabled", "not_configured", "not_implemented",
        "unsupported_query", "configuration_error", "unavailable", "not_checked",
    ]
    # On completion, retain the connector's own status, coverage and timestamps.
    lookup: SourceLookupResult | None = None
    message: str | None = None


class MedicineEvidence(BaseModel):
    query: str
    sources: list[SourceCheck] = Field(default_factory=list)


class EvidenceBundle(BaseModel):
    state: Literal[
        "processed", "scope_not_eligible", "clarification_required", "no_medicines",
        "urgent_request", "configuration_unavailable",
    ]
    medicines: list[MedicineEvidence] = Field(default_factory=list)
    limitations: str = (
        "Name-search results are unverified candidates. Labels do not establish "
        "exact product identity, registration, physical authenticity, or that a "
        "combination of medicines is safe. Sources may overlap. A failed or "
        "skipped check is not a no-match; no-match is limited to the queried source."
    )


def collect_evidence(decision: "ScopeDecision") -> EvidenceBundle:
    """Check configured sources for every resolved name, at most five names.

    This performs read-only source configuration access and connector calls.
    It does not generate an answer, write evidence rows, or mint citations.
    """
    # Local import avoids a cycle when the chat service later calls this coordinator.
    from .gemini_service import ScopeDecision

    if not isinstance(decision, ScopeDecision):
        raise TypeError("Evidence collection requires a scope decision.")
    # Revalidate even an object mutated after initial Pydantic construction.
    decision = ScopeDecision.model_validate(decision.model_dump())
    if decision.category != "MEDICINE":
        return EvidenceBundle(state="scope_not_eligible")
    if decision.urgent_safety_concern:
        return EvidenceBundle(state="urgent_request")
    if decision.clarification_reason != "NONE":
        return EvidenceBundle(state="clarification_required")
    if not decision.medicine_names:
        return EvidenceBundle(state="no_medicines")

    deadline = monotonic() + EVIDENCE_BUDGET_SECONDS
    try:
        configurations = {
            row["source_id"]: row
            for row in TrustedSource.objects.filter(source_id__in=SOURCE_IDS).values(
                "source_id", "enabled", "access_method"
            )
        }
    except DatabaseError:
        return EvidenceBundle(
            state="configuration_unavailable",
            medicines=[MedicineEvidence(query=name, sources=[
                SourceCheck(source_id=source_id, query=name, state="unavailable",
                            message="Source configuration could not be read; no lookup was attempted.")
                for source_id in SOURCE_IDS
            ]) for name in decision.medicine_names],
        )

    medicines = []
    for name in decision.medicine_names:
        checks = []
        for source_id in SOURCE_IDS:
            config = configurations.get(source_id)
            check = SourceCheck(source_id=source_id, query=name, state="not_configured")
            if config is None:
                check.message = "This source has no saved configuration; no lookup was attempted."
            elif not config["enabled"]:
                check.enabled = False
                check.state = "disabled"
                check.message = "This source is disabled; no lookup was attempted."
            else:
                check.enabled = True
                if source_id != "openfda":
                    check.state = "not_implemented"
                    check.message = "This source is enabled but has no connected lookup implementation."
                elif config["access_method"] != "live_api":
                    check.state = "configuration_error"
                    check.message = "The openFDA connector requires the live_api access method."
                elif not re.fullmatch(r"[A-Za-z0-9 \-]+", name):
                    check.state = "unsupported_query"
                    check.message = (
                        "This connector currently accepts only ASCII letters, numbers, spaces "
                        "and hyphens. The name was not altered or searched."
                    )
                elif monotonic() >= deadline:
                    check.state = "not_checked"
                    check.message = "The evidence time budget expired before this lookup could start."
                else:
                    try:
                        raw = lookup_openfda(name)
                        if not isinstance(raw, SourceLookupResult):
                            raise ValueError("Invalid connector result.")
                        result = SourceLookupResult.model_validate(raw.model_dump())
                        if result.source_id != source_id or result.query != name:
                            raise ValueError("Mismatched connector result.")
                        if result.coverage != "live_endpoint":
                            raise ValueError("Unexpected connector coverage.")
                        if result.status == "found":
                            if not result.records or result.checked_at is None:
                                raise ValueError("Incomplete found result.")
                        elif result.records:
                            raise ValueError("Unexpected records on unsuccessful result.")
                        check.lookup = result
                        check.state = "completed"
                    except Exception:
                        # Source boundary: isolate connector/cache failures so other names
                        # remain reportable. Never expose exception text or keyed URLs.
                        check.state = "unavailable"
                        check.message = "The openFDA lookup could not be completed."
            checks.append(check)
        medicines.append(MedicineEvidence(query=name, sources=checks))
    return EvidenceBundle(state="processed", medicines=medicines)