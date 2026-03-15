# Image Generation — Translation Opening

You are translating a converged image canon into generation-ready files.

## Process

1. Read the complete dialog (canon) — this is the only source of truth
2. Generate the required files as described in `translate.md`:
   - `canon/{naam}/prompt.md` — detailed, generator-agnostic image description
   - `canon/{naam}/brief.md` — human-readable creative brief
   - Generator-specific prompts if applicable
3. Every file starts with: `<!-- Derived from: canon/{naam}/dialog.md, [date] -->`

## Key rules

- Source is ALWAYS the dialog, never the summary
- The prompt describes WHAT the image should express, derived from the converged intent
- Write the prompt in plain English, even if the dialog was in another language
- Do not add visual elements that are not in the dialog

## Critical translation steps

### 1. Negative prompts (never skip)
- Find ALL anti-references in the dialog ("niet X", "geen Y", "vermijd Z")
- Translate each into explicit negative guidance in the prompt
- Be specific and use multiple phrasings — generators need redundancy to respect negation
- Format negative prompts according to generator conventions (see translate.md)

### 2. Abstract → Concrete (never copy literally)
- Find abstract concepts used as visual intent ("convergentie", "groei", "kracht")
- Translate each into concrete visual elements (shapes, movements, compositions)
- If the dialog doesn't specify the visual metaphor, choose the most direct one and mark as FLEX

### 3. Prompt structure
- Structure as: subject, composition, style, color/mood, technical details
- Follow with: negative prompt section
- Include generator-specific formatting where applicable
