# /pantion-start — Post-Convergence Phases

> Deferred command section. Loaded when translating or building from a converged canon.
> See `start.md` for the questioning-phase protocol.

## PHASE 2: TRANSLATION

Automatically generate project specification files based on the canon (the dialog).
The dialog is the primary source. The summary may be used for navigation but is never authoritative.

The active dialog's `translate.md` defines which files to generate. For the software skill, this typically produces:

### Always generate:

1. **`canon/{naam}/spec/requirements.md`** — requirements from intent, inputs/outputs, success criteria, non-goals
2. **`canon/{naam}/spec/constraints.md`** — HARD constraints, forbidden actions, data policies, inference policy
3. **`canon/{naam}/spec/success-criteria.md`** — Definition of Done, acceptance criteria, error handling

### Generate if applicable:

4. **`canon/{naam}/spec/api-spec.md`** — API specification
5. **`canon/{naam}/spec/data-model.md`** — data model and persistence
6. **`canon/{naam}/spec/architecture.md`** — component structure (if decomposed)

### Traceability (always-on):
- Add a comment to each generated file: `<!-- Derived from: canon/{naam}/dialog.md, [date] -->`
- Generate or update `canon/{naam}/traceability.md` with the complete mapping
- Where possible, reference specific dialog turns (e.g., "HUMAN turn 5", "ASSISTANT turn 8")

Say after completion: "Project specification files have been generated. I will now build."

---

## PHASE 3: BUILD

Switch to implementation mode. Follow the rules in `protocol/commands/build.md` (Coding Agent Instructions).

1. Read the canon (via MCP resources or from the just-generated spec files)
2. Build the system according to the canon — the canon is the ONLY source of truth
3. Respect ALL constraints from the spec files and canon
4. Implement NOTHING that is not in the canon
5. On ambiguity: follow the inference policy (don't guess)
6. Use Canon Anchors (H1, A3, etc.) in code comments to trace back to dialog turns
7. Enforce the Authority Budget as hard boundaries

### Deliverables:
- [ ] Working implementation
- [ ] README.md (what it does + installation + usage)
- [ ] Evidence (how to test/verify)
- [ ] Canon -> Implementation notes (which FLEX defaults were chosen, with Canon Anchors)

### After building:
Say: "The system has been built. Here is a summary of what I created, which FLEX choices I made, and how you can test it."
