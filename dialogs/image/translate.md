# Image Generation — Translation Instructions

After convergence, generate the following files from the dialog canon.

## Always Generate

1. **`canon/{naam}/prompt.md`**
   - A detailed, generator-agnostic image description
   - Structured sections (see Prompt Structure below)
   - Written in plain English (even if dialog was in another language)
   - Anti-references as explicit negative guidance section

2. **`canon/{naam}/brief.md`**
   - A human-readable creative brief
   - Captures the intent, context, and constraints
   - Useful for sharing with designers or for future reference

## Generate If Applicable

3. **Generator-specific prompts** (if a generator was chosen or for convenience):
   - `canon/{naam}/prompt-dalle.md` — optimized for DALL-E / ChatGPT
   - `canon/{naam}/prompt-midjourney.md` — optimized for Midjourney
   - `canon/{naam}/prompt-sd.md` — optimized for Stable Diffusion
   - `canon/{naam}/prompt-gemini.md` — optimized for Gemini

## Prompt Structure

Every prompt (universal and generator-specific) MUST include these sections:

### Positive prompt
- **Subject**: what is depicted (concrete, visual)
- **Composition**: layout, positioning, visual hierarchy
- **Style**: art style, aesthetic, rendering approach
- **Color**: palette, mood, lighting
- **Technical**: format, background, resolution

### Negative prompt (CRITICAL)
- Translate ALL anti-references from the dialog into explicit negative guidance
- "Niet kinderlijk" → "not childish, not cute, not infantile, no rounded baby-like features"
- "Niet realistisch" → "not photorealistic, not hyper-detailed, no photo textures"
- Be specific and redundant — generators need multiple phrasings to respect negation

### Generator-specific formatting
- **DALL-E**: Negative guidance woven into the prompt text ("Do not make it childish. Avoid...")
- **Midjourney**: Use `--no` parameter for key negatives, plus textual negatives in prompt
- **Stable Diffusion**: Separate `negative_prompt:` field with comma-separated terms
- **Gemini**: Negative guidance woven into the prompt text, similar to DALL-E

## Abstract → Concrete Translation (CRITICAL)

The dialog may contain abstract concepts as visual intent (e.g., "convergence", "growth", "freedom"). These MUST be translated into concrete visual elements in the prompt:

- **Abstract concept in dialog** → **Concrete visual in prompt**
- "convergentie" → "lines converging to a focal point, funnel shape, elements gathering toward center"
- "groei" → "plant sprouting, upward movement, expanding forms"
- "vrijheid" → "open sky, spread wings, unbound flowing elements"

If the dialog does not specify how to visualize an abstract concept, choose the most direct visual metaphor and note it as a FLEX choice.

## Rules

- Source is ALWAYS the dialog, not the summary
- Each file starts with: `<!-- Derived from: canon/{naam}/dialog.md, [date] -->`
- The prompt captures WHAT the image should express, derived from the converged intent
- Anti-references MUST appear as negative prompt/guidance — never omit them
- Abstract concepts MUST be translated to concrete visuals — never copy them literally
- Update `canon/{naam}/traceability.md` with complete mapping
