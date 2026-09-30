# MediGuard AI Domain Safety Guardrails

This directory contains the system prompts and behavioral guardrails that govern MediGuard AI's interactions with Google Gemini.

## Architectural Layers

1. **`scope_guardrail.txt`**: Domain classification & entity extraction guardrail.
   - Restricts assistant operation exclusively to pharmaceutical questions.
   - Enforces refusal of out-of-scope tasks (general chat, programming, politics, etc.).
   - Extracts candidate medicine names without guessing or inventing details.
   - Prioritizes emergency safety flags (overdose, adverse reactions, accidental exposure).

2. **`medicine_guardrail.txt`**: Clinical disclaimer & medical boundary guardrail.
   - Strictly enforces educational scope vs. clinical prescribing.
   - Mandates direction to healthcare professionals (pharmacists/physicians) for diagnosis and personalized dosages.
   - Prohibits hallucinated authenticity claims.

3. **`grounding_guardrail.txt`**: Evidence grounding & citation contract.
   - Enforces structured JSON output schema.
   - Mandates that facts must be strictly substantiated by retrieved openFDA label evidence.
   - Prohibits fabricated URLs, markdown links, or arbitrary citations.

4. **`catalogue_guardrail.txt`**: Local DGDA catalogue context contract.
   - Ensures DGDA-aligned domestic catalogue lookups are treated as candidate references.
   - Prohibits treating local catalogue matches as physical medicine authenticity verification.
