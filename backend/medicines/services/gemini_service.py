import json
import logging
from typing import Any, Literal

import httpx
from django.conf import settings
from google import genai
from google.genai import errors, types
from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    ValidationError,
    field_validator,
    model_validator,
)

from . import catalogue_chat_service, evidence_service
from .grounding_service import (
    GROUNDING_INSTRUCTION,
    GroundedAnswer,
    prepare_evidence,
    render_grounded_answer,
)

logger = logging.getLogger(__name__)


def log_chat_failure(stage, error=None):
    # Only fixed labels and numeric HTTP codes leave this function.
    # Provider text is inspected locally, never printed or logged.
    code = getattr(error, "code", None)
    provider_status = code if type(code) is int and 100 <= code <= 599 else "unknown"
    status = getattr(error, "status", None)
    allowed_statuses = {
        "INVALID_ARGUMENT", "FAILED_PRECONDITION", "PERMISSION_DENIED",
        "UNAUTHENTICATED", "NOT_FOUND", "RESOURCE_EXHAUSTED", "UNAVAILABLE",
        "INTERNAL", "DEADLINE_EXCEEDED",
    }
    provider_reason = status if isinstance(status, str) and status in allowed_statuses else "unknown"
    message = getattr(error, "message", None)
    message = message.lower() if isinstance(message, str) else ""
    hint_patterns = {
        "api_key": ("api key", "api_key", "api-key"),
        "key_expired": ("key expired", "key has expired"),
        "key_blocked": ("key was reported", "key has been blocked", "leaked"),
        "schema": ("schema", "additionalproperties", "additional_properties"),
        "additional_properties": ("additionalproperties", "additional_properties"),
        "json_payload": ("invalid json payload",),
        "unknown_field": ("unknown name", "cannot find field"),
        "billing": ("billing", "free tier", "paid tier"),
        "location": ("country", "location", "region"),
        "model": ("model",),
        "unsupported": ("not supported", "unsupported"),
        "quota": ("quota", "rate limit"),
    }
    hints = [label for label, patterns in hint_patterns.items()
             if any(pattern in message for pattern in patterns)]
    logger.warning(
        "mediguard_chat_failure stage=%s provider_status=%s provider_reason=%s reason_hints=%s",
        stage, provider_status, provider_reason, ",".join(hints) or "unknown",
    )


OUT_OF_SCOPE_REPLY = "sorry i can't answer that question"

from ..guardrails import (
    SCOPE_SYSTEM_INSTRUCTION,
    MEDICINE_SYSTEM_INSTRUCTION,
)
MAX_MEDICINE_NAMES = 5
MAX_MEDICINE_NAME_LENGTH = 200
SCOPE_FAILURE_REPLY = "The medicine scope check could not be completed. Please try again."
CLARIFICATION_REPLIES = {
    "MISSING_NAME": "Which medicine are you asking about? Please type its name or paste the label text.",
    "AMBIGUOUS_REFERENCE": "Which medicine or medicines do you mean? Please type their names.",
    "TOO_MANY_MEDICINES": (
        "This chat can process up to five medicine names at once. "
        "Are you asking about an interaction across the full list, or a different medicine question? "
        "For a review of interactions across the full list, a pharmacist or clinician should review all medicines together."
    ),
}
UNCERTAIN_REPLY = "Could you clarify the medicine-related question you want help with?"


class ScopeDecision(BaseModel):
    model_config = ConfigDict(extra="forbid", strict=True)

    category: Literal["MEDICINE", "OUT_OF_SCOPE", "MIXED", "UNCERTAIN"]
    medicine_names: list[str] = Field(max_length=MAX_MEDICINE_NAMES)
    clarification_reason: Literal[
        "NONE", "MISSING_NAME", "AMBIGUOUS_REFERENCE", "TOO_MANY_MEDICINES"
    ]
    urgent_safety_concern: bool

    @field_validator("medicine_names")
    @classmethod
    def validate_names(cls, names):
        cleaned = []
        seen = set()
        for name in names:
            name = name.strip()
            if not name or len(name) > MAX_MEDICINE_NAME_LENGTH:
                raise ValueError("Medicine names must contain 1 to 200 characters.")
            if any(ord(character) < 32 or ord(character) == 127 for character in name):
                raise ValueError("Medicine names must not contain control characters.")
            if name.casefold() in seen:
                raise ValueError("Medicine names must not be duplicated.")
            seen.add(name.casefold())
            cleaned.append(name)
        return cleaned

    @model_validator(mode="after")
    def validate_decision(self):
        if self.category != "MEDICINE" and (
            self.medicine_names or self.clarification_reason != "NONE"
            or self.urgent_safety_concern
        ):
            raise ValueError("Non-medicine decisions must not contain medicine actions.")
        if self.clarification_reason != "NONE" and self.medicine_names:
            raise ValueError("Unresolved decisions must not contain selected medicines.")
        return self


def gemini_response_schema(model: type[BaseModel]) -> dict[str, Any]:
    """Adapt JSON Schema to this endpoint without relaxing local validation."""
    def adapt(value: Any) -> Any:
        if isinstance(value, dict):
            return {
                key: adapt(item)
                for key, item in value.items()
                if key != "additionalProperties"
            }
        if isinstance(value, list):
            return [adapt(item) for item in value]
        return value

    # model_json_schema returns a fresh schema; never alter the Pydantic model.
    return adapt(model.model_json_schema())


def create_gemini_client():

    return genai.Client(
        api_key=settings.GEMINI_API_KEY,
        http_options=types.HttpOptions(
            timeout=settings.GEMINI_TIMEOUT_MS,
        ),
    )

def build_request_content(question, history=None, decision=None, evidence=None):
    content = {"current_question": question, "recent_history": history or []}
    if decision is not None:
        content["scope_decision"] = decision.model_dump()
    if evidence is not None:
        content["retrieved_evidence"] = evidence.payload
    return json.dumps(content, ensure_ascii=False)


def classify_question(question: str, history=None) -> ScopeDecision:
    if not isinstance(question, str):
        raise TypeError("The question must be text.")

    question = question.strip()

    if not question:
        raise ValueError("The question must not be empty.")

    if len(question) > 4000:
        raise ValueError("The question must not exceed 4000 characters.")

    try:
        with create_gemini_client() as client:
            response = execute_gemini_with_fallback(
                client,
                contents=build_request_content(question, history),
                config=types.GenerateContentConfig(
                    system_instruction=SCOPE_SYSTEM_INSTRUCTION,
                    response_mime_type="application/json",
                    response_schema=gemini_response_schema(ScopeDecision),
                    max_output_tokens=2048,
                    automatic_function_calling=(
                        types.AutomaticFunctionCallingConfig(
                            disable=True,
                        )
                    ),
                ),
            )

    except (errors.APIError, httpx.HTTPError) as error:
        log_chat_failure("scope_request", error)
        raise RuntimeError(
            "The medicine scope check is temporarily unavailable."
        ) from None

    if (
        not response.candidates
        or response.candidates[0].finish_reason != types.FinishReason.STOP
    ):
        log_chat_failure("scope_incomplete")
        raise RuntimeError(SCOPE_FAILURE_REPLY) from None

    try:
        decision = ScopeDecision.model_validate_json(
            response.text or ""
        )
    except ValidationError:
        log_chat_failure("scope_schema")
        raise RuntimeError(SCOPE_FAILURE_REPLY) from None

    return decision


IDENTITY_REPLY = (
    "I'm MediGuard AI, your medicine-information assistant. "
    "I can help explain medicine labels, ingredients, uses, side effects, and precautions."
)
GREETING_REPLY = (
    "Hello! I'm MediGuard AI. I'm here to help with medicine information. "
    "What would you like to know?"
)
CAPABILITIES_REPLY = (
    "I can explain medicine labels, ingredients, uses, side effects, precautions, "
    "storage, and interaction information. I provide educational information; "
    "I cannot diagnose you, prescribe treatment, or confirm that a physical medicine is genuine."
)


def static_chat_reply(question: str) -> str | None:
    # Validate before taking a shortcut around the classifier.
    if not isinstance(question, str):
        raise TypeError("The question must be text.")
    question = question.strip()
    if not question:
        raise ValueError("The question must not be empty.")
    if len(question) > 4000:
        raise ValueError("The question must not exceed 4000 characters.")

    normalized = " ".join(question.casefold().replace("’", "'").split())
    normalized = normalized.rstrip(" .?!")
    # Match the complete message, never a substring or a greeting prefix.
    if normalized in {
        "what is your name", "what's your name", "whats your name",
        "who are you", "introduce yourself", "tell me about yourself",
        "are you mediguard", "are you mediguard ai", "are you mediguard1",
    }:
        return IDENTITY_REPLY
    if normalized in {
        "what can you do", "how can you help", "how can you help me",
        "what do you do", "what can you help me with",
    }:
        return CAPABILITIES_REPLY
    for name in ("", " mediguard", " mediguard ai", " mediguard1"):
        for greeting in ("hi", "hello", "hey", "how are you"):
            if normalized in {greeting + name, greeting + ("," + name if name else "")}:
                return GREETING_REPLY
    return None


NOT_MEDICINE_REPLY = "Please provide a medicine image or QR code."

def execute_gemini_with_fallback(client, contents, config=None):
    primary = getattr(settings, "GEMINI_MODEL", "gemini-3.8-flash")
    fallbacks = ["gemini-3.5-flash", "gemini-3.5-flash-lite"]
    fallbacks = [m for m in fallbacks if m != primary]

    if config is None:
        config = types.GenerateContentConfig(
            automatic_function_calling=types.AutomaticFunctionCallingConfig(disable=True)
        )

    try:
        return client.models.generate_content(
            model=primary,
            contents=contents,
            config=config,
        )
    except Exception as exc:
        code = getattr(exc, "code", None)
        status = getattr(exc, "status", None)
        exc_str = str(exc).lower()
        is_server_issue = (
            code in (503, 504, 429)
            or status in ("UNAVAILABLE", "DEADLINE_EXCEEDED", "RESOURCE_EXHAUSTED")
            or isinstance(exc, (httpx.ReadTimeout, httpx.WriteTimeout, TimeoutError))
            or any(marker in exc_str for marker in [
                "504", "503", "429", "deadline", "high demand",
                "timed out", "read operation timed out", "temporarily unavailable"
            ])
        )
        if is_server_issue and fallbacks:
            for fallback in fallbacks:
                try:
                    logger.warning(
                        "Primary Gemini model %s failed (%s), attempting fallback to %s",
                        primary, exc, fallback,
                    )
                    return client.models.generate_content(
                        model=fallback,
                        contents=contents,
                        config=config,
                    )
                except Exception as fb_exc:
                    logger.warning("Fallback model %s failed: %s", fallback, fb_exc)
                    continue
        raise exc


def inspect_image_content(image_data: str) -> tuple[bool, str]:
    """Inspect base64 image to verify medicine packaging/label and extract text."""
    import base64
    if not image_data or not isinstance(image_data, str):
        return True, ""

    try:
        if "," in image_data:
            header, encoded = image_data.split(",", 1)
            mime_type = "image/jpeg"
            if "png" in header:
                mime_type = "image/png"
            elif "webp" in header:
                mime_type = "image/webp"
        else:
            encoded = image_data
            mime_type = "image/jpeg"

        image_bytes = base64.b64decode(encoded)
        if len(image_bytes) == 0:
            return True, ""

        part = types.Part.from_bytes(data=image_bytes, mime_type=mime_type)
        prompt = (
            "Analyze this image carefully. "
            "Is this image related to medicine, pharmaceutical products, drug packaging, a prescription, blister pack, pills, syrup, capsules, or a medicine label? "
            "If NO (for example: person, selfie, food, animals, vehicles, clothing, landscapes, non-medical items), respond with exactly: NOT_MEDICINE. "
            "If YES, transcribe and extract the medicine brand/generic name, active ingredients, dosage, and manufacturer clearly."
        )

        with create_gemini_client() as client:
            res = execute_gemini_with_fallback(client, contents=[part, prompt])
            result_text = (res.text or "").strip()
            if "NOT_MEDICINE" in result_text.upper():
                return False, ""
            return True, result_text
    except Exception as e:
        logger.warning("inspect_image_content error: %s", e)
        return True, ""


def inspect_qr_content(text: str) -> tuple[bool, str]:
    """If the question contains scanned QR/barcode content, ensure it relates to medicine."""
    if not isinstance(text, str):
        return True, ""

    lower = text.lower()
    prefixes = [
        "scanned qr content:",
        "scanned qr:",
        "qr content:",
        "qr code:",
        "scanned barcode:",
        "barcode:",
    ]
    matched_prefix = next((p for p in prefixes if p in lower), None)
    if not matched_prefix:
        return True, ""

    idx = lower.find(matched_prefix)
    raw_code = text[idx + len(matched_prefix):].strip()
    if not raw_code:
        return False, ""

    prompt = (
        f"Analyze this scanned barcode or QR code text: '{raw_code}'. "
        "Is this code or text associated with a medicine, pharmaceutical package, drug registration, GS1 healthcare barcode, prescription, or medical supply? "
        "If NO (for example: non-medical website URL, Wi-Fi config, consumer products like electronics/clothes/shoes, arbitrary text, contact card), respond with exactly: NOT_MEDICINE. "
        "If YES, identify the medicine name, generic name, active ingredients, or GTIN/NDC product details associated with this code."
    )
    try:
        with create_gemini_client() as client:
            res = execute_gemini_with_fallback(client, contents=prompt)
            output = (res.text or "").strip()
            if "NOT_MEDICINE" in output.upper():
                return False, ""
            return True, output
    except Exception as e:
        logger.warning("inspect_qr_content error: %s", e)
        return True, ""


def ask_gemini(question: str, history=None, image_data: str = "") -> str:
    if not isinstance(question, str):
        raise TypeError("The question must be text.")
    clean_question = question.strip()
    if not clean_question:
        raise ValueError("The question must not be empty.")
    if len(clean_question) > 4000:
        raise ValueError("The question must not exceed 4000 characters.")

    # 1. Non-medicine image check
    if image_data:
        is_medicine_img, extracted_text = inspect_image_content(image_data)
        if not is_medicine_img:
            return NOT_MEDICINE_REPLY
        if extracted_text:
            clean_question = f"{clean_question}\n\nVisible details on medicine package: {extracted_text}".strip()

    # 2. Non-medicine QR check
    is_medicine_qr, qr_details = inspect_qr_content(clean_question)
    if not is_medicine_qr:
        return NOT_MEDICINE_REPLY
    if qr_details:
        clean_question = f"{clean_question}\n\nDetails from scanned medicine code: {qr_details}".strip()

    static_reply = static_chat_reply(clean_question[:4000])
    if static_reply is not None:
        return static_reply

    question = clean_question

    choice = catalogue_chat_service.pending_choice(question, history)
    if choice is not None:
        numbers, question, history, previous_prompt = choice
    decision = classify_question(question, history)

    if decision.category in {"OUT_OF_SCOPE", "MIXED"}:
        return OUT_OF_SCOPE_REPLY
    if decision.category == "UNCERTAIN":
        return UNCERTAIN_REPLY
    if decision.clarification_reason != "NONE" and not decision.urgent_safety_concern:
        return CLARIFICATION_REPLIES[decision.clarification_reason]

    catalogue_plan = catalogue_chat_service.prepare_catalogue_chat(decision, question)
    if choice is not None and not decision.urgent_safety_concern:
        catalogue_plan = catalogue_chat_service.apply_numbered_choice(
            catalogue_plan, numbers, question, previous_prompt,
        )
        if catalogue_plan is None:
            return "Those options are no longer available. Please ask your medicine question again."
    if catalogue_plan.clarification is not None:
        return catalogue_plan.clarification

    try:
        evidence = prepare_evidence(evidence_service.collect_evidence(catalogue_plan.evidence_decision))
        evidence = catalogue_chat_service.attach_catalogue_context(evidence, catalogue_plan)
    except RuntimeError:
        log_chat_failure("evidence_preparation")
        raise

    try:
        with create_gemini_client() as client:
            response = execute_gemini_with_fallback(
                client,
                contents=build_request_content(question.strip(), history, decision, evidence),
                config=types.GenerateContentConfig(
                    system_instruction=(MEDICINE_SYSTEM_INSTRUCTION + GROUNDING_INSTRUCTION
                        + (catalogue_chat_service.CATALOGUE_INSTRUCTION if catalogue_plan.lookups else "")),
                    response_mime_type="application/json",
                    response_schema=gemini_response_schema(GroundedAnswer),
                    max_output_tokens=2048,
                    automatic_function_calling=(
                        types.AutomaticFunctionCallingConfig(
                            disable=True,
                        )
                    ),
                ),
            )

    except (errors.APIError, httpx.HTTPError) as error:
        log_chat_failure("answer_request", error)
        raise RuntimeError(
            "The medicine assistant is temporarily unavailable."
        ) from None

    if (
        not response.candidates
        or response.candidates[0].finish_reason != types.FinishReason.STOP
    ):
        log_chat_failure("answer_incomplete")
        raise RuntimeError(
            "The assistant could not complete its answer. Please try again."
        )

    answer = (response.text or "").strip()

    if not answer:
        log_chat_failure("answer_empty")
        raise RuntimeError(
            "The assistant returned an empty answer. Please try again."
        )

    try:
        rendered = render_grounded_answer(answer, evidence)
        return catalogue_chat_service.append_catalogue_attribution(rendered, catalogue_plan)
    except RuntimeError:
        log_chat_failure("answer_validation")
        raise

