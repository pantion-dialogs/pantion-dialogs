# /pantion-resume — Continue converging on an existing DRAFT canon

You have one or more canons that are not yet fully converged.
You pick up where you left off.

---

## WHEN YOU ARRIVE HERE

- A previous `/pantion-start` session was not completed (STATUS: DRAFT)
- There are OPEN QUESTIONS in `canon/index.md` that need to be answered
- A large decomposition spans multiple sessions
- After stakeholder feedback on a DRAFT canon

---

## STEP 1: RESTORE CONTEXT

Read `canon/index.md` and identify:

1. Which canons exist?
2. Which have STATUS: DRAFT?
3. Which OPEN QUESTIONS are there?

Then read the **dialog file** (the canon) to restore full context. The dialog contains the complete history of all previous sessions.

Report:

"Welcome back. Here is the current state:

**Canons:**
- [canon name]: [STATUS] — [N] open questions

**Open Questions (most important first):**
1. [question 1] (from [canon name])
2. [question 2] (from [canon name])
3. [question 3] (from [canon name])

Would you like to work through the open questions, or do you want to tackle something else first?"

---

## STEP 2: WORK THROUGH OPEN QUESTIONS

Take on the OPEN QUESTIONS one by one.

### Rules:
1. Ask ONE question at a time — wait for the answer before asking the next
2. Read the dialog file (canon) to restore full context
3. Re-pose the question, with context on why it was open
4. Classify the answer as HARD or FLEX
5. **Append the new dialog turns** to the existing dialog file (append-only — never edit previous turns)
6. Remove the question from the Open Questions Backlog in `canon/index.md`

### When new questions arise:
If answering a question raises new questions:
- Add them to the Open Questions Backlog
- Continue with the current question

### When there are dependencies:
If a question depends on another canon (during decomposition):
- Mark the dependency
- Skip the question and move to the next
- Come back when the dependent canon has been updated

---

## STEP 3: CONVERGENCE CHECK PER CANON

After working through the questions, check per canon:

- [ ] All OPEN QUESTIONS answered?
- [ ] Intent is unambiguous?
- [ ] Authority Budget is complete?
- [ ] Failure behavior is specified?
- [ ] Non-goals are documented?

### If the canon is NOW converged:

1. Update the stamp in the dialog file to CONVERGED:

        === DIALOGSPEC STAMP ===
        STATUS: CONVERGED
        DATE: [today]
        MODEL: [model-id (Display Name), e.g. claude-opus-4-6 (Claude Opus 4.6)]
        CANON TYPE: [type]
        PREVIOUS STATUS: DRAFT (resumed from [date of earlier session])
        SESSIONS: [number of sessions to convergence]
        OPEN QUESTIONS: none
        ...
        === /DIALOGSPEC STAMP ===

2. **Regenerate** the derived summary (`canon/dialogspec-summary.md`) from the complete dialog
3. Update `canon/index.md` with the new status

### If questions are still open:

1. Update the progress stamp in the dialog file:

        === DIALOGSPEC PROGRESS ===
        DATE: [today]
        STATUS: DRAFT (session [N])
        RESOLVED THIS SESSION: [list of answered questions]
        REMAINING OPEN QUESTIONS: [list]
        NEXT SESSION FOCUS: [suggestion for next session]
        === /DIALOGSPEC PROGRESS ===

2. **Regenerate** the derived summary from the dialog so far
3. Update `canon/index.md`

Say:

"There are still [N] questions open. The most important ones for the next session:

1. [question]
2. [question]

Progress has been saved. You can continue later with `/pantion-resume`."

---

## STEP 4: FLOW TO NEXT PHASE

If ALL canons are CONVERGED:

### For standalone:
"All questions have been answered and the canon has converged. Would you like to generate the project files and build? (That's the same as `/pantion-translate` followed by the build phase.)"

### For decomposition:
"All canons have converged:
- Architect Canon: completed
- Interface Canons: completed ([N] interfaces)
- Component Canons: completed ([N] components)

Would you like to run the consistency check? (`/pantion-check`)"

---

## STEP 5: UPDATE CANON INDEX

ALWAYS update `canon/index.md` at the end of a resume session:

- Update status per canon
- Remove resolved questions from backlog
- Add new questions to backlog
- Update "Last modified"
- Log any amendments
- Ensure references to both dialog file and summary file are present
