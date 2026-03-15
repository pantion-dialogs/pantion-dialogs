# Pantion DialogSpec — Canon Structure & Translation

> Deferred protocol section. Loaded when saving canons or translating to project files.
> See `core.md` for core knowledge loaded during questioning.

## Canon Structure: Dialog is the Canon

The canon is the **verbatim dialog** (chronological Q/A log) between HUMAN and ASSISTENT. This is the only source of truth.

### File structure per canon:

```
canon/
├── index.md                      ← Overview of all canons
├── {naam}/
│   ├── dialog.md                 ← THE CANON (verbatim dialog)
│   ├── summary.md                ← DERIVED: structured summary for navigation
│   ├── traceability.md           ← DERIVED: canon → spec traceability
│   └── spec/                     ← DERIVED: project specification files
│       ├── requirements.md
│       ├── constraints.md
│       └── ...
```

### Why the dialog is the canon, not the summary:

1. **The dialog preserves nuance**: rejected options, hesitations, the order of discovery — information that a summary loses
2. **Future-proof**: a smarter model can re-read the dialog and conduct a redialog (`/pantion-redialog`) — identifying gaps the original model missed and conducting a supplementary dialog to fill them. Additionally, better models can re-derive better summaries and project files from the same dialog
3. **The summary is a convenience**: it helps humans and agents navigate, but it is never authoritative
4. **Traceability is richer**: derived files can point to specific dialog passages (turns), not just summary sections

### Rules:

- The dialog is ALWAYS saved verbatim (no editing, no cherry-picking)
- The summary is regenerated when the dialog changes (resume, amend)
- If the summary and dialog conflict, the dialog wins
- Traceability points to dialog passages where possible

## Canon Index

Each project has a `canon/index.md` as an overview page:
- Which canons exist, with type and status
- For each canon: reference to both the dialog file (canon) and the summary file (derived)
- Open Questions backlog (all unanswered questions collected)
- Last modified + amendments per canon

The index is updated with EVERY canon change (start, resume, amend, decompose).

## Canon → File Translation

After convergence, the canon is the primary instruction set for any connected agent (served via MCP resources). Additionally, project specification files may be derived. The source for translation is the dialog (canon). The summary is used for navigation but never as authoritative source.

### Primary Path (MCP-native)

Any MCP client reads the canon directly via:
- `pantion://canons/{name}/dialog` — the full dialog (source of truth)
- `pantion://canons/{name}/summary` — derived summary (for navigation)
- `pantion://dialogs/{name}/rules` — dialog-specific rules and translation instructions

No agent-specific intermediate files are needed. The canon IS the instruction set.

### Project Specification Files (via translate)

The translate step produces project-specific deliverables (not agent-specific instruction files):

| Canon element | Project specification file |
|--------------|--------------------------|
| System intent, requirements, success criteria | canon/{naam}/spec/requirements.md |
| HARD constraints, forbidden actions, data policies | canon/{naam}/spec/constraints.md |
| Success criteria, failure behavior | canon/{naam}/spec/success-criteria.md |
| API behavior (if applicable) | canon/{naam}/spec/api-spec.md |
| Data entities and retention (if applicable) | canon/{naam}/spec/data-model.md |
| Component structure (if applicable) | canon/{naam}/spec/architecture.md |
| Interfaces (if decomposed) | canon/{naam}/spec/interfaces/interface-*.md |

All derived files are generated from the dialog. The summary is itself a derived file.

## Traceability (always-on)

Traceability is not just a step in `/pantion-translate`. It is a discipline:

- With EVERY generation or regeneration of derived files → update `canon/{naam}/traceability.md`
- With EVERY amendment → update traceability for affected files
- During decomposition → traceability covers all canon levels

Each derived file contains a comment: `<!-- Derived from: canon/{naam}/dialog.md, [date] -->`
The summary file also contains this comment, as it is itself derived from the dialog.

## Phase Transitions

The transition from convergence to building is ALWAYS a deliberate moment:

1. Convergence reached → verification table produced
2. All 12 categories ✅ → stamp set
3. Checklist completed → all ✅
4. **HUMAN STAMP authorized** → human approves (`pantion_approve`) or auto-approved in dialog mode
5. Files generated → traceable to canon via Canon Anchors
6. ONLY THEN → build mode (following `protocol/commands/build.md`)

In full mode (the default), all steps require explicit completion. In dialog mode, steps 2-4 are accelerated: conservative assumptions are made and the canon is auto-approved.

Large projects may remain in DRAFT across multiple sessions. Use `/pantion-resume` to continue converging later.
