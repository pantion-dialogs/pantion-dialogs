# /pantion-dialog — Stamps & Saving

> Deferred command section. Loaded when checking convergence or saving a dialog canon.
> See `dialog.md` for the questioning-phase protocol.

## Saving the dialog (CRITICAL — the dialog IS the canon)

Same principle as full dialog mode: the verbatim dialog is always saved.

**Two files are always produced:**
- `canon/{naam}/dialog.md` — THE CANON: the verbatim dialog (dialog status is in the stamp, not the filename)
- `canon/{naam}/summary.md` — DERIVED: structured summary for navigation

## Pre-stamp quality check (recommended)

Before setting the convergence stamp, it is recommended to run `pantion_check` on the dialog. This provides a structural quality scorecard that can surface gaps before the stamp is finalized. This is not blocking — the HUMAN STAMP remains the actual authorization gate.

## Convergence Verification Table (dialog variant)

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

    **Conclusion:** Sufficient for prototype. [N] assumptions made — see assumptions list.

## Convergence Stamp (dialog variant)

The stamp is placed at the top of the dialog file:

    === DIALOGSPEC STAMP ===
    STATUS: CONVERGED (DIALOG)
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

### Auto-translate (dialog mode)

In dialog mode, canons are AUTO-APPROVED. After saving:
1. Immediately call `pantion_translate` with the canon name
2. Follow the dialog's translate.md for which files to generate
3. Say: "Files generated. Here is what was created."
