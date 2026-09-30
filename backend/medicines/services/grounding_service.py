import json
import re
from dataclasses import dataclass
from typing import Any
from urllib.parse import parse_qs, urlsplit
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, ValidationError, field_validator

from .evidence_service import EvidenceBundle

MAX_RECORDS_PER_MEDICINE = 2
MAX_EXCERPT_CHARACTERS = 2500
MAX_CONTEXT_CHARACTERS = 45000
ANSWER_FAILURE = "The assistant returned an invalid evidence reference or answer. Please try again."

from ..guardrails import GROUNDING_INSTRUCTION


class AnswerParagraph(BaseModel):
    model_config = ConfigDict(extra="forbid", strict=True)
    text: str = Field(min_length=1, max_length=2500)
    citation_ids: list[str] = Field(max_length=5)

    @field_validator("text")
    @classmethod
    def validate_text(cls, value):
        value = value.strip()
        if not value or re.search(r"[\[\]<>]|://|www\.", value, re.IGNORECASE):
            raise ValueError("Answer text must not contain links or citation markup.")
        return value


class GroundedAnswer(BaseModel):
    model_config = ConfigDict(extra="forbid", strict=True)
    paragraphs: list[AnswerParagraph] = Field(min_length=1, max_length=8)


@dataclass
class PreparedEvidence:
    payload: dict[str, Any]
    citations: dict[str, str]


def official_label_url(record) -> str | None:
    """Only the currently implemented openFDA per-record URL is eligible."""
    try:
        record_id = str(UUID(record.record_id))
        url = str(record.official_url)
        parsed = urlsplit(url)
        if (
            parsed.scheme != "https" or parsed.netloc != "api.fda.gov"
            or parsed.path != "/drug/label.json" or parsed.fragment
            or parse_qs(parsed.query, keep_blank_values=True)
            != {"search": [f'id:"{record_id}"'], "limit": ["1"]}
        ):
            return None
        return url
    except (ValueError, TypeError, AttributeError):
        return None


def prepare_evidence(bundle: EvidenceBundle) -> PreparedEvidence:
    payload: dict[str, Any] = {
        "state": bundle.state, "limitations": bundle.limitations,
        "source_checks": [], "entries": [], "omitted_records": 0,
    }
    citations: dict[str, str] = {}
    for medicine in bundle.medicines:
        for check in medicine.sources:
            lookup = check.lookup
            payload["source_checks"].append({
                "query": medicine.query, "source_id": check.source_id,
                "enabled": check.enabled, "coordinator_state": check.state,
                "lookup_status": lookup.status if lookup is not None else None,
                "coverage": lookup.coverage if lookup is not None else None,
                "checked_at": lookup.checked_at.isoformat()
                if lookup is not None and lookup.checked_at is not None else None,
            })
    for medicine in bundle.medicines:
        selected = 0
        for check in medicine.sources:
            lookup = check.lookup
            if check.state != "completed" or lookup is None or lookup.status != "found":
                continue
            for record in lookup.records:
                url = official_label_url(record) if check.source_id == "openfda" else None
                if selected >= MAX_RECORDS_PER_MEDICINE or url is None or not record.content.strip():
                    payload["omitted_records"] += 1
                    continue
                citation_id = f"E{len(citations) + 1}"
                entry = {
                    "citation_id": citation_id, "query": medicine.query,
                    "source_id": check.source_id, "evidence_type": record.evidence_type,
                    "product_name": record.product_name[:300],
                    "ingredient": (record.ingredient or "")[:500],
                    "strength": (record.strength or "")[:150],
                    "dosage_form": (record.dosage_form or "")[:150],
                    "matching_notes": (record.matching_notes or "")[:500],
                    "source_date": record.source_date.isoformat() if record.source_date else None,
                    "retrieved_at": record.retrieved_at.isoformat() if record.retrieved_at else None,
                    "excerpt": record.content[:MAX_EXCERPT_CHARACTERS],
                    "excerpt_truncated": len(record.content) > MAX_EXCERPT_CHARACTERS,
                }
                payload["entries"].append(entry)
                if len(json.dumps(payload, ensure_ascii=False)) > MAX_CONTEXT_CHARACTERS - 100:
                    payload["entries"].pop()
                    payload["omitted_records"] += 1
                    continue
                citations[citation_id] = url
                selected += 1
    if len(json.dumps(payload, ensure_ascii=False)) > MAX_CONTEXT_CHARACTERS:
        raise RuntimeError("The evidence context exceeded its size limit.")
    return PreparedEvidence(payload=payload, citations=citations)


def render_grounded_answer(text: str, evidence: PreparedEvidence) -> str:
    try:
        answer = GroundedAnswer.model_validate_json(text)
        paragraphs = []
        used = []
        for paragraph in answer.paragraphs:
            if len(set(paragraph.citation_ids)) != len(paragraph.citation_ids):
                raise ValueError("Duplicate citation ID.")
            for citation_id in paragraph.citation_ids:
                if citation_id not in evidence.citations:
                    raise ValueError("Unknown citation ID.")
                if citation_id not in used:
                    used.append(citation_id)
            # The model supplies plain text; the backend owns Markdown formatting.
            plain = re.sub(r"([\\`*_{}\[\]()#+.!|>~-])", r"\\\1", paragraph.text)
            suffix = "".join(f" [{citation_id}]" for citation_id in paragraph.citation_ids)
            paragraphs.append(plain + suffix)
        if used:
            paragraphs.append("Sources — candidate labels; product identity is unverified:\n" + "\n".join(
                f"- [{citation_id}: openFDA label]({evidence.citations[citation_id]})" for citation_id in used
            ))
        return "\n\n".join(paragraphs)
    except (ValidationError, ValueError):
        raise RuntimeError(ANSWER_FAILURE) from None