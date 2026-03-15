> **Legacy**: This file is kept for backward compatibility. New sessions use "dialog" mode. See `dialog.md`.

# /pantion-quick — Quick prototyping (experiment mode)

You are now in Pantion Quick mode. This is the accelerated variant for prototyping and discovery.
You follow the same protocol as /pantion-start, but with these adjustments:

---

## Difference from /pantion-start

| Aspect | /pantion-start | /pantion-quick |
|--------|---------------|----------------|
| Questions | Resolve all ambiguity | Only ask critical questions |
| Assumptions | None (OPEN QUESTION) | Make conservative assumptions |
| Authority Budget | Cover completely | Cover basics, rest with conservative defaults |
| Non-goals | Document explicitly | Document basics |
| Build speed | After full convergence | After sufficient convergence |
| Marking | Everything is checked | Assumptions are marked with lightning |

---

## PHASE 1: QUICK CONVERGENCE

### Start
Say:

"Quick mode: I'll get moving fast. I'll only ask the crucial questions and make conservative assumptions for the rest. I'll mark those so you can adjust them later. Tell me what you want to build."

### Rules
1. Ask ONE question at a time — wait for the answer before asking the next
2. Ask at most 5-8 essential questions (don't exhaustively converge)
3. Focus on: what does it do, for whom, what are the hard boundaries
4. On ambiguity: make a conservative assumption and mark with ASSUMPTION
5. Authority budget: use conservative defaults where not explicitly discussed
6. Non-goals: base on what logically is NOT in scope

### Conservative defaults for undiscussed elements:
- **Data retention**: store nothing unless explicitly requested
- **Data access**: only what is minimally necessary
- **Rate limits**: no explicit limits (but note as ASSUMPTION)
- **Auditability**: basic logging
- **Failure behavior**: graceful fail with user notification
- **Inference policy**: conservative

### Saving the dialog (CRITICAL — the dialog IS the canon)

Same principle as /pantion-start: the verbatim dialog is always saved.

**Two files are always produced:**
- `canon/{naam}/dialog.md` — THE CANON: the verbatim dialog (quick status is in the stamp, not the filename)
- `canon/{naam}/summary.md` — DERIVED: structured summary for navigation

### Convergence Verification Table (quick variant)

Before the stamp, include the verification table (with assumptions marked):

    **Convergence Verification:**

    | Criterium | Status |
    |-----------|--------|
    | Canon status | ✅ |
    | Intent clarity | ✅ |
    | Observable success | ✅ |
    | Inputs complete | ✅ |
    | Outputs unambiguous | ✅ |
    | Failure specified | ⚡ ASSUMPTION: graceful fail |
    | Constraints absolute | ✅ |
    | Non-goals documented | ⚡ ASSUMPTION: basic non-goals |
    | Ambiguity handled | ⚡ ASSUMPTION: conservative |
    | Authority Budget | ⚡ ASSUMPTION: conservative defaults |
    | Inference Policy | ✅ conservative |
    | Dialog stability | ✅ |

    **Conclusion:** Sufficient for quick prototype. [N] assumptions made — see assumptions list.

### Convergence Stamp (quick variant)

The stamp is placed at the top of the dialog file:

    === DIALOGSPEC STAMP ===
    STATUS: CONVERGED (QUICK)
    DATE: [today]
    MODEL: [model-id (Display Name), e.g. claude-opus-4-6 (Claude Opus 4.6)]
    CANON TYPE: standalone
    PARENT: none
    OPEN QUESTIONS: none (assumptions marked)
    INFERENCE POLICY: conservative
    AUTHORITY BUDGET: partial (conservative defaults for undiscussed elements)
    STABILITY ZONES: [HARD invariants]
    FLEX ZONES: [FLEX defaults + assumptions]
    ASSUMPTIONS: [list of all assumptions]
    === /DIALOGSPEC STAMP ===

Save the verbatim dialog as `canon/{naam}/dialog.md`.
Generate the derived summary as `canon/{naam}/summary.md`.

---

## PHASE 2: QUICK TRANSLATION

Generate the same files as /pantion-start, but:
- Mark all assumptions with `ASSUMPTION:` in the files
- Keep files shorter and more pragmatic
- Skip command files unless there are clear workflows

All derived files point to the dialog: `<!-- Derived from: canon/{naam}/dialog.md, [date] -->`

### Extra file:

**`canon/assumptions.md`**

List all assumptions made in quick mode with their conservative defaults. Reference to the dialog turns where the assumption was made. Each assumption can be replaced with an explicit choice via /pantion-amend.

---

## PHASE 3: QUICK BUILD

Build the system with the same rules as /pantion-start.

### Extra after building:

Say:

"Prototype is built. I made [N] assumptions.
Here are the most important ones:

1. [assumption 1]
2. [assumption 2]
3. [assumption 3]

Want to adjust any of these? Or would you like to run the full protocol with /pantion-start?"

---

## When to escalate

### To /pantion-start (full protocol)

If during quick mode it becomes clear that:
- There are safety-critical aspects that cannot be covered by assumptions
- The user corrects assumptions multiple times
- Authority Budget questions are too complex for conservative defaults

Then say:
"This system has aspects that cannot be covered by assumptions. I recommend switching to /pantion-start for the full protocol. The quick dialog will be carried over as a starting point."

### To /pantion-decompose (split up)

If during quick mode it becomes clear that:
- Multiple independent modules/interfaces are emerging
- The Decompose Score is 3 or higher (see /pantion-start for criteria)
- Different parts have fundamentally different rights/restrictions

Then say:
"This system is too large for a single quick canon. I recommend switching to /pantion-decompose. I'll carry the quick dialog over as input for the Architect Canon — what we already know doesn't need to be discussed again."

When switching to decompose:
1. Save the current quick dialog as DRAFT
2. Start /pantion-decompose
3. Use the quick dialog as starting point (don't start from scratch)
4. Mark in `canon/index.md` that the quick canon has been absorbed into the Architect Canon

## Canon Index

Update `canon/index.md` when completing a quick session:
- Status: CONVERGED (QUICK)
- References to both dialog file and summary file
- List of all assumptions
- Reference to `canon/assumptions.md`
