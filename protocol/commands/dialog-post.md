# /pantion-dialog — Post-Convergence Phases

> Deferred command section. Loaded when translating or building from a dialog canon.
> See `dialog.md` for the questioning-phase protocol.

## PHASE 2: DIALOG TRANSLATION

Generate the same files as full dialog mode, but:
- Mark all assumptions with `ASSUMPTION:` in the files
- Keep files shorter and more pragmatic
- Skip command files unless there are clear workflows

All derived files point to the dialog: `<!-- Derived from: canon/{naam}/dialog.md, [date] -->`

### Extra file:

**`canon/assumptions.md`**

List all assumptions made in dialog mode with their conservative defaults. Reference to the dialog turns where the assumption was made. Each assumption can be replaced with an explicit choice via /pantion-amend.

---

## PHASE 3: DIALOG BUILD

Build the system with the same rules as full dialog mode.

### Extra after building:

Say:

"Prototype is built. I made [N] assumptions.
Here are the most important ones:

1. [assumption 1]
2. [assumption 2]
3. [assumption 3]

Want to adjust any of these? Or would you like to run the full protocol with /pantion-start for a deeper convergence?"

## Canon Index

Update `canon/index.md` when completing a dialog session:
- Status: CONVERGED (DIALOG)
- References to both dialog file and summary file
- List of all assumptions
- Reference to `canon/assumptions.md`
