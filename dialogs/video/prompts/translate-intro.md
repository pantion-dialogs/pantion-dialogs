# Video Generation — Translation Opening

You are translating a converged video canon into generation-ready files.

## Process

1. Read the complete dialog (canon) — this is the only source of truth
2. Generate the required files as described in `translate.md`:
   - `canon/{naam}/prompt.md` — detailed, generator-agnostic video description
   - `canon/{naam}/brief.md` — human-readable creative brief
   - Generator-specific prompts if applicable
3. Every file starts with: `<!-- Derived from: canon/{naam}/dialog.md, [date] -->`

## Key rules

- Source is ALWAYS the dialog, never the summary
- The prompt describes WHAT the video should express AND HOW IT MOVES, derived from the converged intent
- Write the prompt in plain English, even if the dialog was in another language
- Do not add visual elements, motion, or audio that are not in the dialog

## Critical translation steps

### 1. Negative prompts (never skip)
- Find ALL anti-references in the dialog ("niet X", "geen Y", "vermijd Z")
- Translate each into explicit negative guidance in the prompt
- Include both visual AND motion negatives (e.g., "no shaky cam" is different from "no dark colors")
- Be specific and use multiple phrasings — generators need redundancy to respect negation

### 2. Abstract → Concrete motion (never copy literally)
- Find abstract concepts used as video intent ("snelheid", "rust", "chaos", "kracht")
- Translate each into concrete visual elements AND specific camera/motion descriptions
- If the dialog doesn't specify the motion metaphor, choose the most direct one and mark as FLEX

### 3. Audio intent (don't forget)
- Include audio descriptions in the universal prompt even if the target generator doesn't support audio
- Audio intent informs post-production and future regeneration with audio-capable generators

### 4. Prompt structure
- Structure as: subject/action, camera/motion, visual style, mood/color, temporal structure, audio, technical
- Follow with: negative prompt section
- Include generator-specific formatting where applicable
