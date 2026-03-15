# Pantion DialogSpec — Advanced Protocol Knowledge

> This file contains advanced protocol knowledge that is loaded on-demand
> for specific commands (decompose, reverse, redialog, create-dialog, redialog).
> For core protocol knowledge loaded in every session, see core.md.

## Decomposition — Full Protocol

Three levels:
- **Architect Canon**: decomposes the system, defines shared boundaries
- **Interface Canon**: describes the contract between two subsystems
- **Component Canon**: buildable part with its own convergence

Inheritance: constraints are additive (stricter is allowed, looser is not), authority budget Rights are a ceiling, Consumption is allocatable.

## Interface Canon — Contract Fields

Each Interface Canon describes at minimum:
- Parties (which subsystems)
- Delivered value (both directions)
- Guarantees (what is always true)
- Expectations (what may the receiver assume)
- Failure behavior (what if something goes wrong)

Plus five additional fields:
- **Data Shape**: what is exchanged, described enumeratively (in natural language, not as a schema)
- **Versioning/Compat**: what breaks compatibility? What is a backward-compatible change?
- **Error Semantics**: what specific errors may B expect from A? How are they signaled?
- **Privacy/Classification**: which data is PII, confidential, or classified? Which side may see what?
- **Rate/Cost Expectations**: what is "normal" usage? What is a peak? Where are the limits?

## Canon Anchors

Canon Anchors are references to specific dialog turns. They enable traceability from derived artifacts (behavior map, acceptance tests, implementation) back to the canonical dialog.

Notation: **H[N]** for HUMAN turn N, **A[N]** for ASSISTANT turn N (1-indexed).

Example: H1 = first human message, A3 = third assistant message.

Canon Anchors are used in:
- Behavior Maps: every behavior links to the dialog turn that defines it
- Acceptance Tests: every test cites the dialog turn it validates
- Traceability Maps: full mapping from Canon Anchor to requirement to test to implementation
- Implementation code comments: `// Canon Anchor: H3, A4`

## Blind Reconstruction Test

The ultimate validation of a converged canon: can a coding agent, without seeing source code, reconstruct the system from only the canon?

Use `/pantion-reflect` to capture post-build observations. See `protocol/commands/reflect.md` for the full methodology.

## Reverse Pantion (Code → Canon)

In addition to the normal flow (Intent → Canon → Code), Pantion supports the reverse direction: analyzing an existing codebase and reconstructing the intent as a canon.

Core principle: extract **what** the code does, not **how**. The output is a synthetic dialog that reads as if it were originally conducted.

Applications: legacy migration, technology swap, documentation, audit, proof that intent canonization works.

The output is a synthetic dialog that reads as if it were originally conducted. This dialog is the canon. A derived summary is generated alongside it.

The generated canon gets STATUS: CONVERGED (REVERSE) and contains an extra AMBIGUITIES field for "bug or feature?" points. Traceability points in reverse: from canon element to source code location, with a confidence level (high/medium/low).

The ultimate test: Code → Canon → Code' → behavior(Code) ≈ behavior(Code')

## Re-convergence (Canon → Better Canon)

The dialog is conducted by a specific model at a specific time. A newer or more capable model may identify gaps: questions that should have been asked, assumptions that were never made explicit, edge cases that were not explored. The answers to never-asked questions are simply not in the canon.

**Re-convergence** is the solution: a better model reads the existing dialog, produces a gap analysis, and conducts a supplementary dialog with the user to fill those gaps. The original dialog stays intact (append-only).

### How re-convergence differs from other commands

| | Resume | Amend | Reconverge |
|---|--------|-------|------------|
| **Entry condition** | DRAFT with open questions | CONVERGED — user wants a change | CONVERGED — model identifies gaps |
| **Who initiates** | User (wants to finish) | User (wants to change something) | Model (detects gaps) |
| **Primary action** | Answer remaining open questions | Apply a specific change | Gap analysis → targeted supplementary dialog |
| **Result status** | CONVERGED | AMENDED | RECONVERGED |

### When to reconverge

- **Model upgrade**: a significantly better model is available
- **Periodic review**: important canons should be re-evaluated periodically
- **Dissatisfaction**: the implementation reveals that the original convergence was too shallow
- **New domain knowledge**: insights that weren't available during the original dialog
- **Check recommendation**: `/pantion-check` detected thin or missing elements

### Gap analysis dimensions

1. **Unexplored convergence elements** — checklist items that are thin or absent
2. **Implicit assumptions** — things assumed without being made explicit
3. **Ambiguous resolutions** — vague answers that should have been probed further
4. **Missing edge cases** — failure modes, boundary conditions not discussed
5. **Authority budget gaps** — rights, consumption, or forbidden actions underspecified
6. **Interface gaps** — contracts between components incomplete (for decomposed systems)

### The future-proof promise

The true future-proofing of Pantion is not just re-derivation (better artifacts from the same dialog) but **re-convergence** (a deeper dialog built on top of the original). The original dialog preserves the user's voice, decisions, priorities, and domain context — a better model uses this as a foundation, not a limitation.

Use `/pantion-redialog` (alias: `/pantion-reconverge`) to initiate a redialog.

## Souls (Interaction Style)

A **soul** is a configurable interaction style that determines *how* the convergence dialog is conducted — the tone, pacing, jargon level, and questioning approach. It does NOT change *what* is discussed: convergence requirements (intent, constraints, success criteria, authority budget) remain identical regardless of soul.

### How souls differ from skills

| | Dialog | Soul |
|---|-------|------|
| **Determines** | What convergence elements to cover (domain-specific) | How to communicate during convergence |
| **Examples** | Software Development, Image Description | Balanced Professional, Beginner Friendly, Young Builder |
| **Composable** | One skill per session | One soul per session, works with any skill |
| **Location** | `dialogs/` directory | `souls/` directory |

### Soul structure

```
souls/{name}/
├── soul.json     (manifest: name, displayName, description, version)
└── rules.md      (interaction rules — injected into system prompt)
```

### Search order

Same as skills: project-local (`souls/`) → user-global (`~/.pantion/souls/`) → bundled.

### Built-in souls

- **default** — Balanced Professional: clear, direct, systematic. Used when no soul is specified.
- **beginner** — Beginner Friendly: extra explanation, less jargon, smaller steps, understanding checks.
- **young** — Young Builder: simple language, concrete examples, encouraging tone. For young users building their first project.

### Rules

- Soul rules are injected into the system prompt after skill rules
- The soul is saved in the session (traceability: which style was used)
- If no soul is specified, the "default" soul is used
- Soul rules must never weaken convergence requirements — they only change presentation
- Custom souls can be created by adding a directory to `souls/` (project-local or `~/.pantion/souls/`)

## Dynamic Skills (Skills from Canons)

Skills can be created through Pantion dialogs, making them **model-proof**. Instead of hand-crafting dialog files, a user converges on domain knowledge through a dialog-builder dialog. The resulting canon is the source of truth from which all dialog files are derived.

### Dialog Canon Structure

Dynamic dialogs store their source canon alongside the derived dialog files:

```
dialogs/{name}/
├── dialog.json                 ← DERIVED from skill-canon
├── convergence-rules.md       ← DERIVED from skill-canon
├── translate.md               ← DERIVED from skill-canon
├── prompts/                   ← DERIVED from skill-canon
│   ├── convergence-intro.md
│   └── translate-intro.md
└── canon/                     ← SOURCE (model-proof)
    ├── dialog.md        ← THE CANON
    └── summary.md       ← DERIVED
```

### The Dialog-Builder Meta-Skill

The `dialog-builder` is a bundled meta-dialog that knows how to converge on domain knowledge. It guides the user through: what is this domain? What decisions matter? What do agents get wrong? What output should the dialog produce?

### Dialog Canon Lifecycle

- `pantion_create-dialog`: start a dialog dialog using the dialog-builder
- `pantion_save-canon` (with `skill_name`): save the dialog canon to `dialogs/{name}/canon/`
- `pantion_translate`: translate the dialog canon into dialog files
- `pantion_redialog`: reconverge an existing dialog canon to deepen domain knowledge

### Compatibility

- Existing bundled dialogs (software, image) work exactly as before — no canon needed
- Dynamic dialogs are loaded by the same registry with `source: 'dynamic'`
- The three-tier search (project > user > bundled) works for both hand-crafted and dynamic dialogs
- A dynamic dialog can override a bundled skill (project-local takes priority)

### Rules

- The dialog dialog is the canon — dialog files are derived
- Dialog canons are stored in `dialogs/{name}/canon/`, NOT in the project `canon/` directory
- Dialog canons do NOT appear in the project `canon/index.md`
- Reconvergence on a dialog canon (`pantion_redialog`) uses dialog-builder rules
- The dialog-builder meta-dialog is bundled and evolves only through protocol updates
