# /pantion-translate — Translate canon to project specification files

You have an existing converged canon. Translate it into project specification files.
The canon itself is served to agents via MCP — these spec files are project artifacts for developers and tools.

---

## WHEN YOU ARRIVE HERE

- The user already has a canon (dialog conducted in another environment)
- After a /pantion-amend to regenerate affected files
- To regenerate files after a manual change to the canon

---

## STEP 1: LOCATE CANON

Search for canon dialog files in the project:

    canon/
    +-- index.md                           (overview of all canons)
    +-- {naam}/
    |   +-- dialog.md                      (THE CANON — verbatim dialog)
    |   +-- summary.md                     (DERIVED — structured summary)
    |   +-- traceability.md                (DERIVED — canon → spec traceability)
    |   +-- spec/                          (DERIVED — project specification files)
    |       +-- requirements.md
    |       +-- constraints.md
    |       +-- ...
    +-- architect/
    |   +-- dialog.md                      (hierarchical — THE CANON)
    |   +-- summary.md                     (DERIVED)
    +-- interfaces/
    |   +-- interface-{A}-{B}/
    |       +-- dialog.md                  (THE CANON)
    |       +-- summary.md                 (DERIVED)
    +-- components/
        +-- {component}/
            +-- dialog.md                  (THE CANON)
            +-- summary.md                 (DERIVED)

The dialog file is always the primary source. The summary is derived and never authoritative.

If no dialog file is found but a summary/canon file exists (legacy format), say:
"I found a summary file but no dialog file. The dialog is the canon in Pantion. Do you have the original dialog? If not, I can work from the summary but traceability will be limited."

If no canon is found at all, say:
"I cannot find a canon in canon/. Do you have a canon file I can read? Or would you like to run /pantion-start first?"

---

## STEP 2: VALIDATE CANON

Read the dialog file(s) and check:

- [ ] Has a DIALOGSPEC STAMP
- [ ] STATUS is CONVERGED (or CONVERGED (QUICK))
- [ ] AUTHORITY BUDGET is complete or partial
- [ ] No unresolved OPEN QUESTIONS (unless the user accepts this)

On problems: report them and ask if the user wants to proceed or converge first.

---

## STEP 3: GENERATE FILES

The translate step produces PROJECT SPECIFICATION files, not agent-specific instruction files. The canon itself (served via MCP) is the instruction set for any connected agent.

### Determine output from active dialog

Read the dialog's `translate.md` for domain-specific translation instructions. The dialog defines which project specification files to generate.

### For a standalone canon (software skill default):

Generate from the dialog (using the summary for navigation only):

1. **`canon/{naam}/spec/requirements.md`**
   - Project intent and goals
   - Functional requirements (inputs/outputs)
   - Non-functional requirements
   - Non-goals

2. **`canon/{naam}/spec/constraints.md`**
   - HARD constraints
   - Forbidden actions
   - Data access and retention policies
   - Inference policy

3. **`canon/{naam}/spec/success-criteria.md`**
   - Definition of Done
   - Acceptance criteria
   - Error handling requirements

4. **Additional spec files as determined by the dialog and canon content**

### For a hierarchical system:

Generate everything above at the system level, PLUS:

5. **`canon/architect/spec/architecture.md`** — from Architect Canon (components, boundaries, authority budget)
6. **`canon/interfaces/interface-[A]-[B]/spec/interface.md`** — per Interface Canon
7. **`canon/components/[name]/spec/requirements.md`** — per Component Canon

### Also generate/regenerate the summary:

If the summary file doesn't exist yet or is outdated, generate it from the dialog.
The summary always contains: `<!-- Derived from: canon/{naam}/dialog.md, [date] -->`

---

## STEP 4: TRACEABILITY MAP (always-on)

Traceability is not just a step in /pantion-translate — it is a discipline that is updated with every generation or regeneration of files.

Generate or update:

**`canon/{naam}/traceability.md`**

    # Traceability: Canon -> Project Specification Files

    | File | Canon source | Dialog turns | Elements | Last generated |
    |------|-------------|----------------|----------|----------------|
    | canon/{naam}/spec/requirements.md | {naam}/dialog.md | HUMAN 1, ASSISTANT 2 | intent, requirements | [date] |
    | canon/{naam}/spec/constraints.md | {naam}/dialog.md | HUMAN 5, ASSISTANT 6 | HARD constraints | [date] |
    | canon/{naam}/summary.md | {naam}/dialog.md | all | derived summary | [date] |
    | ... | ... | ... | ... | ... |

    Generated on: [date]

### Per generated file:
Add a comment at the beginning:
`<!-- Derived from: canon/{naam}/dialog.md, [date] -->`

---

## STEP 5: UPDATE CANON INDEX

Update `canon/index.md`:
- Confirm STATUS per canon
- Remove any Open Questions resolved during translation
- Log that files were generated (date)
- Ensure references to both dialog and summary files are present

---

## STEP 6: REPORT

Say:

"I have generated the following project specification files from the canon:

[list of files]

All files are traceable to the dialog (canon) via canon/traceability.md.
The dialog in canon/ remains the source of truth — the summary and all generated files are derived.

Would you like to review the files or proceed to building?"
