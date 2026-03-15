# Video Generation — Additional Convergence Rules

In addition to the standard Pantion convergence elements, always cover:

## Video Intent
- What is the core emotion, concept, or story?
- What should the viewer feel or understand?
- What happens in this video? (action, transformation, journey, reveal)
- If the intent is abstract (e.g., "speed", "calm", "power"), ask: "How would you visualize that in motion? For example, a racing camera, slow-motion water, an explosion of particles — or do you want me to suggest options?"
- Always arrive at concrete visual AND motion descriptions. Abstract concepts must be translated into something a viewer can see and experience over time.

## Context and Usage (ask early — determines duration and format)
- Where will this video be used? (social media, website, presentation, film, advertisement)
- Which platform? (TikTok, Instagram Reels, YouTube, cinema, internal)
- Who is the audience?
- This determines duration, aspect ratio, pacing, and appropriate style — ask BEFORE detailed questions.

## Duration (ask early — determines complexity)
- How long should the video be?
- A 3-second loop requires a fundamentally different approach than a 60-second narrative.
- Duration determines: number of scenes, pacing, whether a story arc is possible, and generator capabilities.
- If the user doesn't know, help them decide based on context and platform norms.

## Subject and Action
- What are the key visual elements? What is the main subject?
- What happens? What moves? What changes over time?
- Is there a transformation (A → B)?
- Are there characters, objects, or environments that need to be described?

## Camera and Motion
- Camera movement? (static, pan, tilt, zoom, dolly, tracking, orbit, aerial, handheld)
- Shot type? (wide/establishing, medium, close-up, extreme close-up, bird's eye)
- Shot transitions? (cut, dissolve, morph, continuous — or single-shot?)
- Speed? (real-time, slow-motion, time-lapse, speed ramp)
- If the user doesn't specify camera work, ask — it is the most impactful video-specific decision.

## Temporal Structure
- Is this a single continuous shot or multiple scenes?
- Is it linear (beginning → middle → end) or looping (seamless repeat)?
- If multiple scenes: what is the sequence? How do they connect?
- What is the pacing? (gradual build, sudden impact, steady rhythm)
- Is there a climax or key moment?

## Visual Style
- Art style or aesthetic? (photorealistic, cinematic, animated, 3D render, abstract, documentary, retro, etc.)
- Color palette or mood? (warm, cold, muted, vibrant, monochrome)
- Lighting? (natural, dramatic, neon, golden hour, dark/moody)
- References? ("like X" — helps generators understand the target)

## Audio (ask explicitly — silence is also a choice)
- Should the video have audio?
- Music? (genre, mood, tempo — or a specific reference track?)
- Sound effects? (ambient, foley, impact sounds)
- Voice-over or narration?
- Silence? (deliberate silence is a valid and powerful choice)
- Note: not all generators support audio. If the chosen generator doesn't, audio intent is still captured for post-production.

## Anti-References (CRITICAL — drives negative prompts)
- What should this NOT look like? Be specific.
- What visual or motion clichés to avoid?
- What tonal boundaries? (e.g., "not corporate", "not cheesy", "not AI-looking")
- What movement to avoid? (e.g., "no shaky cam", "no fast cuts", "no morphing artifacts")
- These are HARD constraints. They MUST appear in the generated prompt as negative guidance.

## Technical
- Target aspect ratio? (16:9, 9:16, 1:1, 4:3, 2.35:1 — may follow from Context)
- Frame rate? (24fps cinematic, 30fps standard, 60fps smooth — FLEX)
- Resolution? (HD, 4K — depends on generator capabilities)
- Generator preference? (Sora, Runway, Kling, Pika, Luma, Minimax, Veo — FLEX)

## Question Order

Follow this order to avoid redundant questions:

1. **Video intent** — what, why, and what happens
2. **Context/usage** — where and for whom (determines duration and format)
3. **Duration** — how long (determines complexity and structure)
4. **Subject and action** — what we see, what moves
5. **Camera and motion** — how we see it (movement, angles, speed)
6. **Temporal structure** — how it's built (scenes, pacing, loop)
7. **Visual style** — how it looks (aesthetic, colors, lighting)
8. **Audio** — what we hear (music, sfx, voice, silence)
9. **Anti-references** — what it must NOT be
10. **Technical** — generator preference, fps, resolution (only if user cares)

Skip questions whose answers are already implied by earlier answers. If aspect ratio follows logically from platform (e.g., "TikTok" → 9:16), confirm rather than ask.

## IMPORTANT
- Do NOT choose a generator unless the user insists — mark as FLEX
- Focus on the VISUAL AND TEMPORAL INTENT, not the technical prompt syntax
- The canon describes what the video should express and how it moves, not prompt engineering
- Abstract concepts MUST be translated into concrete visual AND motion descriptions before convergence is complete
- Anti-references are HARD constraints, not suggestions — treat them with the same weight as positive requirements
- Camera movement is the single most impactful video-specific decision — never leave it unresolved
- Duration determines everything — always establish it early
- Audio intent should be captured even if the chosen generator doesn't support it — it informs post-production
