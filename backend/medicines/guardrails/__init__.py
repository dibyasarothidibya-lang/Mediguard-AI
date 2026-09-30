"""MediGuard AI Safety Guardrails and System Instructions.

These system prompts define domain classification, safety boundaries,
clinical grounding, and catalogue context rules for Google Gemini.
"""

from pathlib import Path

_BASE_DIR = Path(__file__).resolve().parent

SCOPE_SYSTEM_INSTRUCTION = (_BASE_DIR / "scope_guardrail.txt").read_text(encoding="utf-8")
MEDICINE_SYSTEM_INSTRUCTION = (_BASE_DIR / "medicine_guardrail.txt").read_text(encoding="utf-8")
GROUNDING_INSTRUCTION = (_BASE_DIR / "grounding_guardrail.txt").read_text(encoding="utf-8")
CATALOGUE_INSTRUCTION = (_BASE_DIR / "catalogue_guardrail.txt").read_text(encoding="utf-8")

__all__ = [
    "SCOPE_SYSTEM_INSTRUCTION",
    "MEDICINE_SYSTEM_INSTRUCTION",
    "GROUNDING_INSTRUCTION",
    "CATALOGUE_INSTRUCTION",
]
