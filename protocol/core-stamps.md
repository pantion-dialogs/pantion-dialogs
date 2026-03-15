# Pantion DialogSpec — Stamps & Lifecycle

> Deferred protocol section. Loaded when checking convergence or producing stamps.
> See `core.md` for core knowledge loaded during questioning.

## Canon Lifecycle

A canon progresses through these statuses:

- **DRAFT**: dialog has started but has not yet converged (OPEN QUESTIONS exist)
- **CONVERGED**: all questions answered, stamp set, ready for translation/building
- **CONVERGED (DIALOG)**: converged in dialog mode with conservative assumptions (⚡ marked) — the fast variant
- **CONVERGED (QUICK)**: legacy name for CONVERGED (DIALOG), kept for backward compatibility
- **CONVERGED (REVERSE)**: intent reconstructed from existing code
- **AMENDED**: converged and later modified via amendment
- **RECONVERGED**: a converged canon re-evaluated by a newer/better model that identified and explored gaps in the original convergence

Large projects often span multiple sessions: DRAFT → resume → resume → CONVERGED. This is normal and expected. A RECONVERGED canon may be reconverged again as models improve (iterative deepening).

## Convergence Verification Table

Before setting the DIALOGSPEC STAMP, the converger produces a Convergence Verification Table as proof that all 12 categories have been treated. This table is part of the last assistant message in the dialog, directly before the stamp.

Format (12 rows matching the Readiness Checklist categories):

| Criterium | Status |
|-----------|--------|
| Canon status | ✅ / ❌ |
| Intent clarity | ✅ / ❌ |
| Observable success | ✅ / ❌ |
| Inputs complete | ✅ / ❌ |
| Outputs unambiguous | ✅ / ❌ |
| Failure specified | ✅ / ❌ |
| Constraints absolute | ✅ / ❌ |
| Non-goals documented | ✅ / ❌ |
| Ambiguity handled | ✅ / ❌ |
| Authority Budget | ✅ / ❌ |
| Inference Policy | ✅ / ❌ |
| Dialog stability | ✅ / ❌ |

For quick mode: use ⚡ ASSUMPTION for items handled by conservative defaults.

The table concludes with: "A competent coding agent can, without further interaction, build a functionally equivalent system." (or the reason why not).

## DIALOGSPEC STAMP — Required Fields

Every converged dialog ends with a machine-readable `=== DIALOGSPEC STAMP ===` block. The stamp contains at minimum:

- **STATUS**: CONVERGED | CONVERGED (DIALOG) | CONVERGED (QUICK) | CONVERGED (REVERSE) | AMENDED | RECONVERGED | DRAFT
- **DATE**: YYYY-MM-DD
- **MODEL**: model-id and display name, format: `model-id (Display Name)` (e.g. `claude-opus-4-6 (Claude Opus 4.6)`, `gpt-4o-2025-01 (GPT-4o)`)
- **CANON TYPE**: standalone | architect | interface | component
- **PARENT**: canonical name or "none"
- **OPEN QUESTIONS**: "none" for converged stamps, list otherwise
- **INFERENCE POLICY**: conservative | strict
- **STABILITY ZONES**: HARD constraints (list)
- **FLEX ZONES**: FLEX defaults (list)

Additional fields depend on status and command (see command-specific documentation). The MODEL field enables reconvergence decisions: which canons were produced by older models that might benefit from redialog with a newer model.

A canon cannot be saved without a valid stamp. The server enforces this structurally.

## HUMAN STAMP — Authorization Gate

Every saved canon includes a `=== HUMAN STAMP ===` block that tracks human authorization. This is a mandatory gate between convergence and translation/building.

### Structure

```
=== HUMAN STAMP ===
DATE: [not set]
ROLE: [not set]
STATUS: PENDING
NOTE: [not set]
=== /HUMAN STAMP ===
```

### Status values

- **PENDING**: default for new canons in full mode — awaiting human review
- **APPROVED**: human has reviewed and authorized the canon for translation/building
- **REJECTED**: human has reviewed and rejected the canon — needs changes
- **AUTO-APPROVED**: automatically approved in dialog mode — the canon is immediately ready for translation

### Rules

1. A canon with STATUS other than APPROVED or AUTO-APPROVED may NOT be translated (`pantion_translate` blocks)
2. The HUMAN STAMP is set via `pantion_approve` or `pantion_reject`, or automatically to AUTO-APPROVED in dialog mode
3. When a canon is amended (`pantion_amend`) or reconverged (`pantion_redialog`), the HUMAN STAMP resets to PENDING
4. Existing canons without a HUMAN STAMP block are treated as PENDING
5. The HUMAN STAMP is the only allowed in-place mutation of a saved dialog file (all other changes are append-only)
6. `pantion_check` reports HUMAN STAMP status as a warning if not APPROVED or AUTO-APPROVED
7. `pantion_list-canons` includes the HUMAN STAMP status for each canon

### Design rationale

The HUMAN STAMP ensures that no canon proceeds to translation or building without authorization. In full mode (the default), this requires explicit human approval (`pantion_approve`). In dialog mode, canons are auto-approved for fast iteration. The fill-in-place design (rather than append-only) avoids cluttering the dialog with administrative stamps.
