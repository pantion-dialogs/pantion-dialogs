# /pantion-onboard — Add Pantion to an existing project

You have an existing project with code. You want to introduce Pantion.
This command guides you through the choice of how, and executes it.

---

## STEP 1: EXPLORE THE PROJECT

Scan the project:

- How much code is there? (files, lines, languages)
- Is there documentation? (README, docs/, comments)
- Are there tests?
- Is there already a `.claude/` directory?
- Are there existing specs, PRDs, tickets, or other intent descriptions?

Report:

"I've explored your project:

**Code:** [N] files, [N] lines, languages: [list]
**Documentation:** [present/not present, what]
**Tests:** [present/not present, coverage if estimable]
**Existing specs:** [present/not present, what]

Based on this, I'll present you with three options."

---

## STEP 2: CHOOSE STRATEGY

Present the three strategies:

"How do you want to use Pantion in this project?

**A) Forward only** — Pantion for all new changes
- Existing code stays as-is
- Every new feature, change, or bugfix goes through a canon
- Lightest approach, immediately productive
- No traceability to existing code

**B) Full reverse** — First canonize the entire codebase
- I'll run /pantion-reverse on the complete codebase
- You get a complete canon of what the system currently does
- Then you continue working via the canon
- Heaviest approach, but full traceability

**C) Partial** — Only canonize what you're going to touch
- You point out which part you're going to change
- I'll run /pantion-reverse on only that part
- The rest stays undocumented until you touch it
- Pragmatic, grows organically

Which fits your situation?"

---

## STEP 3A: FORWARD ONLY

### Installation
1. Create `canon/` directory
2. Initialize `canon/index.md`
3. Create `canon/baseline.md`:

```markdown
# Baseline

This project existed before Pantion was introduced.
The code present on [date] has no canon.

Pantion is active for all changes from [date] onward.
Existing code will be canonized when it is touched (see strategy C: partial).

## Existing project
- **Languages:** [list]
- **Size:** [estimate]
- **Documentation:** [what exists]
- **Tests:** [what exists]
```

4. Project specification files (`spec/`) come with the first canon via `/pantion-translate`.

### Wrap up

"Pantion has been installed alongside your existing project.

From now on:
- New feature: use `pantion_start`
- Change to canonized code: use `pantion_amend`
- Touching existing code: use `pantion_onboard` again (strategy C for that part)

The existing codebase has no canon. That's fine — you build up organically."

---

## STEP 3B: FULL REVERSE

### Size estimation
Scale the approach based on project size:

**Small (< 20 files, < 2000 lines):**
- Run `/pantion-reverse` directly on the entire codebase
- One standalone canon

**Medium (20-100 files, 2000-15000 lines):**
- Run `/pantion-reverse` on the entire codebase
- Consider hierarchical decomposition if there are clearly distinct parts

**Large (> 100 files, > 15000 lines):**
- Hierarchical approach is almost certainly needed
- Start with an Architect Canon (system overview)
- Decompose into components
- Reverse per component

### Execution
1. Run `/pantion-reverse` (see that command for the full process)
2. Let the user review the generated canon
3. Resolve OPEN QUESTIONS and AMBIGUITIES with the user
4. Generate project files via `/pantion-translate`

### Wrap up

"The complete codebase has been canonized.

- Canon (dialog): `canon/dialogspec-dialog.md`
- Summary (derived): `canon/dialogspec-summary.md`
- Status: [CONVERGED (REVERSE) | DRAFT with N open questions]
- Traceability: `canon/traceability.md` (canon -> source code)

From now on, the project works entirely via Pantion.
Changes via `pantion_amend`, new features via `pantion_start`."

---

## STEP 3C: PARTIAL

### Determine scope

Ask: "Which part of the project are you going to touch? Describe it in your own words, or point me to the files/directories."

Identify the scope:
- Which files/modules/directories belong to it?
- Where does this part touch the rest of the project? (interfaces)
- Is this part independent enough to canonize separately?

### Boundary detection

Analyze the boundaries of the selected part:

"This part touches the rest of the project at these points:
- [interface 1: description]
- [interface 2: description]

Would you like to canonize these interfaces as well, or treat them as 'existing environment'?"

**Option 1 — Include interfaces:** Generate Interface Canons for the couplings. This gives sharper contracts but takes more time.

**Option 2 — Treat interfaces as given:** Describe the interfaces as external constraints in the component canon. Faster, but less traceability.

### Execution
1. Run `/pantion-reverse` on only the selected part
2. Treat the rest of the project as context (not as code to be canonized)
3. Generate a component canon with:
   - `INHERITED CONSTRAINTS: derived from the broader codebase`
   - `EXTERNAL INTERFACES: [description of how this part touches the rest]`
4. Resolve OPEN QUESTIONS with the user
5. Generate project files for this part

### Wrap up

"Part [name] has been canonized.

- Canon (dialog): `canon/components/component-[name]-dialog.md`
- Summary (derived): `canon/components/component-[name]-summary.md`
- Status: [CONVERGED (REVERSE) | DRAFT]
- Interfaces: [canonized | described as constraint]

The rest of the project has no canon. When you touch another part,
run `pantion_onboard` again for that part — it grows organically."

---

## STEP 4: HYGIENE CHECK

Regardless of the chosen strategy, check at the end:

- [ ] `canon/index.md` has been created and is current
- [ ] `canon/baseline.md` describes the starting situation
- [ ] Existing project configuration has not been broken
- [ ] Existing documentation has been supplemented, not overwritten
- [ ] The user knows which flow to follow for their next change

---

## SPECIAL SITUATIONS

### There are already specs/PRDs/tickets
"I see there are already specification documents: [list]. Would you like me to include these as input for the canonization? They then become part of the dialog — not the canon itself."

Use existing specs as context during the reverse process, but the canon remains the verbatim dialog.

### The project already uses another spec method
"This project uses [method]. Pantion doesn't necessarily replace it — it adds a canonical intent layer. The existing [specs/tickets/PRDs] can serve as input for convergence. Would you like to work side by side, or switch over completely?"

### Multiple developers
"Are multiple people working on this project? If so, it's important that everyone knows:
- The canon in `canon/` is the source of truth
- Changes go through `pantion_amend`
- The generated files in `spec/` are derived — don't edit them manually"
