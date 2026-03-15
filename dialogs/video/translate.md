# Video Generation — Translation Instructions

After convergence, generate the following files from the dialog canon.

## Always Generate

1. **`canon/{naam}/prompt.md`**
   - A detailed, generator-agnostic video description
   - Structured sections (see Prompt Structure below)
   - Written in plain English (even if dialog was in another language)
   - Anti-references as explicit negative guidance section
   - Audio intent included (even if generator doesn't support audio)

2. **`canon/{naam}/brief.md`**
   - A human-readable creative brief
   - Captures the intent, context, duration, style, and constraints
   - Useful for sharing with directors, editors, or for future reference

## Generate If Applicable

3. **Generator-specific prompts** (if a generator was chosen or for convenience):
   - `canon/{naam}/prompt-sora.md` — optimized for OpenAI Sora
   - `canon/{naam}/prompt-runway.md` — optimized for Runway Gen-3/4
   - `canon/{naam}/prompt-kling.md` — optimized for Kling AI
   - `canon/{naam}/prompt-pika.md` — optimized for Pika
   - `canon/{naam}/prompt-luma.md` — optimized for Luma Dream Machine
   - `canon/{naam}/prompt-minimax.md` — optimized for Minimax/Hailuo
   - `canon/{naam}/prompt-veo.md` — optimized for Google Veo

## Prompt Structure

Every prompt (universal and generator-specific) MUST include these sections:

### Positive prompt
- **Subject/Action**: what is depicted, what happens, what moves (concrete, visual, temporal)
- **Camera/Motion**: camera movement, shot type, speed, transitions
- **Visual Style**: art style, aesthetic, rendering approach
- **Mood/Color**: palette, lighting, atmosphere
- **Temporal**: duration, pacing, scene structure, loop behavior
- **Audio**: music, sound effects, voice-over (if applicable — note: some generators don't support audio)
- **Technical**: aspect ratio, fps, resolution

### Negative prompt (CRITICAL)
- Translate ALL anti-references from the dialog into explicit negative guidance
- "Niet corporate" → "not corporate, no stock footage look, no generic business imagery"
- "Geen snelle cuts" → "no rapid cuts, no fast editing, no jump cuts, no montage"
- "Niet AI-achtig" → "no morphing artifacts, no uncanny motion, no warping, no flickering"
- Be specific and redundant — generators need multiple phrasings to respect negation

### Generator-specific formatting
- **Sora**: Single descriptive paragraph with camera and motion woven in, negative guidance as separate instruction
- **Runway**: Scene description with motion parameters, style reference support
- **Kling**: Scene description with camera control parameters, motion intensity settings
- **Pika**: Concise motion description, motion strength parameter
- **Luma**: Natural language scene description with camera movement keywords
- **Minimax**: Detailed scene description, supports longer generation
- **Veo**: Detailed descriptive prompt with cinematic language, style keywords

## Abstract → Concrete Translation (CRITICAL)

The dialog may contain abstract concepts as video intent (e.g., "speed", "calm", "chaos"). These MUST be translated into concrete visual AND motion elements in the prompt:

- **Abstract concept in dialog** → **Concrete visual + motion in prompt**
- "snelheid" → "rapid camera push forward, motion blur on surroundings, objects streaking past, accelerating movement"
- "rust" → "slow dolly out, static wide shot, minimal subject movement, soft dissolve transitions, long holds"
- "chaos" → "shaky handheld camera, rapid cuts between angles, overlapping elements, distorted perspectives, unstable framing"
- "groei" → "time-lapse upward movement, expanding forms, slow zoom out revealing scale, gradual brightening"
- "kracht" → "low-angle shot, slow-motion impact, dramatic lighting shift, camera shake on impact"

If the dialog does not specify how to visualize an abstract concept in motion, choose the most direct visual + motion metaphor and note it as a FLEX choice.

## Rules

- Source is ALWAYS the dialog, not the summary
- Each file starts with: `<!-- Derived from: canon/{naam}/dialog.md, [date] -->`
- The prompt captures WHAT the video should express AND HOW IT MOVES, derived from the converged intent
- Anti-references MUST appear as negative prompt/guidance — never omit them
- Abstract concepts MUST be translated to concrete visuals AND motion — never copy them literally
- Audio intent is always included in the universal prompt, even when the generator doesn't support audio
- Camera movement descriptions must be specific (not "dynamic camera" but "slow tracking shot from left to right")
- Update `canon/{naam}/traceability.md` with complete mapping
