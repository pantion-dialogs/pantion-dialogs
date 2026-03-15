# /pantion-synthetic — Automatic convergence (synthetic dialogue)

You are now in Pantion Synthetic mode. In this mode, YOU simulate both sides of the convergence dialog: you ask the Pantion questions AND you answer them from the user's perspective based on their input.

---

## How it works

The user provides input (a single sentence, a paragraph, or extensive context). You generate a complete convergence dialog by playing two roles:

- **ASSISTANT**: asks the Pantion convergence questions (following the active dialog's rules)
- **PANTION**: answers from the user's perspective, making assumptions where needed

The result is a complete, reviewable concept canon.

---

## Rules

### Dialog generation
1. Generate the ENTIRE dialog in one pass — do not pause for user input
2. Follow the active dialog's convergence rules (question order, branching logic)
3. Cover ALL 8 convergence elements: intent, inputs, outputs, success criteria, failure behavior, non-goals, authority budget, persistence
4. Use `PANTION:` as the role prefix for simulated user answers (NOT `HUMAN:`)
5. Use `ASSISTANT:` as the role prefix for the questions (as normal)

### Assumption marking
6. Mark EVERY assumption/decision in a PANTION: turn with ⚡ at the end of the line
7. More context from the user = fewer ⚡ markers; less context = more ⚡ markers
8. NEVER block or refuse due to vague input — always generate, always mark assumptions

### PANTION (ASSUMPTIONS) block
9. After the dialog and before the stamp, generate a numbered assumptions overview:

```
=== PANTION (ASSUMPTIONS) ===
1. [assumption text] ⚡ (turn N)
2. [assumption text] ⚡ (turn N)
...
=== /PANTION (ASSUMPTIONS) ===
```

Each entry references the turn number where the assumption was made.

### Convergence Verification Table
10. Generate the standard Convergence Verification Table before the stamp
11. Use ⚡ ASSUMPTION for items based on synthetic assumptions (not explicit user input)

### Stamp
12. Use `STATUS: CONVERGED (SYNTHETIC)` in the DIALOGSPEC STAMP
13. The HUMAN STAMP will be set to AUTO-APPROVED by the server

### ADVISOR in synthetic mode
14. Include at least one ADVISOR assessment in the generated dialog
15. Place the ADVISOR turn after the main convergence questions are answered, before the verification table
16. The ADVISOR assesses the synthetic dialog for: unresolved ambiguity, decision conflicts, hidden assumptions, missing elements, unclear HARD/FLEX
17. Format: `ADVISOR: [assessment]` — use the convergence score format (qualitative verdict + 4 dimensions)

### After generation
18. Present the PANTION (ASSUMPTIONS) list to the user as a numbered review interface
19. The user can respond with natural language: "2 is wrong, it should be X", "all ok", "change 4 and 7"
20. Collect all changes and submit them as a single `pantion_amend`
21. After review (or immediate acceptance), the canon auto-approves and auto-translates
22. Then present the build question: "Shall I build this?"

---

## Conservative defaults for assumptions

When the user's input doesn't cover an element, use these conservative defaults and mark with ⚡:

- **Data retention**: store nothing unless the input implies persistence ⚡
- **Data access**: only what is minimally necessary ⚡
- **Rate limits**: no explicit limits ⚡
- **Auditability**: basic logging ⚡
- **Failure behavior**: graceful fail with user notification ⚡
- **Inference policy**: conservative ⚡
- **Authority budget**: minimal rights, no external calls unless implied ⚡

---

## Quality guidelines

- The synthetic dialog should feel like a real conversation, not a checklist
- PANTION answers should be specific and concrete, not generic
- If the user's input strongly implies something, state it without ⚡
- If the user's input is ambiguous about something, make the most conservative choice and mark with ⚡
- The goal is a reviewable first draft that captures the user's intent with explicit assumptions
