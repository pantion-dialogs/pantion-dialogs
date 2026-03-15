# /pantion-start — Stamps & Saving

> Deferred command section. Loaded when checking convergence or saving a canon.
> See `start.md` for the questioning-phase protocol.

## Saving the dialog (CRITICAL — the dialog IS the canon)

The verbatim dialog MUST be saved at every stage. The dialog is the only source of truth.

**Two files are always produced:**
- `canon/{naam}/dialog.md` — THE CANON: the verbatim dialog (chronological Q/A)
- `canon/{naam}/summary.md` — DERIVED: a structured summary for navigation (never authoritative)

The summary contains a derivation comment: `<!-- Derived from: canon/{naam}/dialog.md, [date] -->`

The dialog file format:

    # DialogSpec Dialog
    <!-- This is the canon — the verbatim dialog is the only source of truth -->
    <!-- All other files (summary, project files, tests) are derived from this dialog -->

    [STAMP or PROGRESS STAMP here]

    ---

    HUMAN: [verbatim text]

    ASSISTANT: [verbatim text]

    HUMAN: [verbatim text]

    ASSISTANT: [verbatim text]

    ...

## DRAFT flow (if the session can't be completed in one go)

If the user indicates they want to stop, or if the session is getting too long:

1. Save the **verbatim dialog** as `canon/{naam}/dialog.md` with a PROGRESS stamp
2. Generate a **derived summary** as `canon/{naam}/summary.md`
3. Note all OPEN QUESTIONS explicitly
4. Update `canon/index.md` with the DRAFT status, OPEN QUESTIONS, and references to both files

The PROGRESS stamp format:

    === DIALOGSPEC PROGRESS ===
    DATE: [today]
    STATUS: DRAFT (session 1)
    CANON TYPE: standalone
    RESOLVED: [list of answered elements]
    REMAINING OPEN QUESTIONS:
      1. [question]
      2. [question]
    NEXT SESSION FOCUS: [suggestion]
    === /DIALOGSPEC PROGRESS ===

Say: "Progress has been saved as DRAFT with [N] open questions. You can continue later with `/pantion-resume`."

## Pre-stamp quality check (recommended)

Before setting the convergence stamp, it is recommended to run `pantion_check` on the dialog. This provides a structural quality scorecard that can surface gaps before the stamp is finalized. This is not blocking — the HUMAN STAMP remains the actual authorization gate.

## Convergence check (when everything has been answered)
Before proceeding, check internally:

- [ ] Intent is unambiguous
- [ ] Success criteria are externally verifiable
- [ ] All inputs named (explicit + implicit)
- [ ] Outputs are observable
- [ ] Failure behavior is specified
- [ ] Constraints are absolute (not "unless convenient")
- [ ] Non-goals are documented
- [ ] Authority Budget - Rights complete (allowed/forbidden/data/retention/audit)
- [ ] Authority Budget - Consumption complete (rate/cost limits)
- [ ] Persistence/restart behavior specified (what survives a restart? what is ephemeral?)
- [ ] Inference policy is determined
- [ ] New questions no longer yield new behavior

If all checked, produce the **Convergence Verification Table** followed by the Convergence Stamp in the dialog file.

The verification table is placed in the last assistant message, immediately before the stamp:

    **Convergence Verification:**

    | Criterium | Status |
    |-----------|--------|
    | Canon status | ✅ |
    | Intent clarity | ✅ |
    | Observable success | ✅ |
    | Inputs complete | ✅ |
    | Outputs unambiguous | ✅ |
    | Failure specified | ✅ |
    | Constraints absolute | ✅ |
    | Non-goals documented | ✅ |
    | Ambiguity handled | ✅ |
    | Authority Budget | ✅ |
    | Persistence/restart | ✅ |
    | Inference Policy | ✅ |
    | Dialog stability | ✅ |

    **Conclusion:** A competent coding agent can, without further interaction, build a functionally equivalent system.

Then produce the Convergence Stamp:

    === DIALOGSPEC STAMP ===
    STATUS: CONVERGED
    DATE: [today]
    MODEL: [model-id (Display Name), e.g. claude-opus-4-6 (Claude Opus 4.6)]
    CANON TYPE: standalone
    PARENT: none
    OPEN QUESTIONS: none (N resolved: OQ-001 at H[4], OQ-002 at A[7])
    INFERENCE POLICY: conservative
    AUTHORITY BUDGET RIGHTS: complete
    AUTHORITY BUDGET CONSUMPTION: complete | n/a
    STABILITY ZONES: [list of HARD invariants]
    FLEX ZONES: [list of FLEX defaults]
    INHERITED CONSTRAINTS: none
    INTERFACE CANONS: none
    === /DIALOGSPEC STAMP ===

Save the complete verbatim dialog as `canon/{naam}/dialog.md`.
Generate the derived summary as `canon/{naam}/summary.md`.
Update `canon/index.md` with STATUS: CONVERGED.

Say: "The intent has converged. I will now generate the project files."

### Auto-translate (HARD — always translate after convergence)

After saving the converged canon:
1. If the HUMAN STAMP is APPROVED or AUTO-APPROVED → immediately call `pantion_translate` with the canon name and the files specified by the active dialog's translate.md
2. If the HUMAN STAMP is PENDING (full mode default) → say: "The dialog is complete and saved. It needs approval before files can be generated. Use `/pantion` to approve."
3. Never skip translation for approved canons — it is the natural next step after convergence.
