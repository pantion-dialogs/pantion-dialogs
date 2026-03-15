# Traceability Map Template

> **Artifact Type:** Derived / Non-Canonical
> **Rule:** If this document conflicts with the Canonical Dialog, the Canon wins.

---

## 1) Source Canon Reference

- **Canon Name:** [name]
- **Canon Date:** [date]
- **Canon Location:** [path]
- **Convergence Stamp:**
  - STATUS: [status]
  - INFERENCE POLICY: [policy]

---

## 2) How to Use This Map

Each Canon statement (anchored) must map to:
1. One or more **Derived Requirements** (from spec files)
2. One or more **Acceptance Tests** (AT-### IDs)
3. One or more **Implementation References** (file:function)
4. **Evidence** (logs/screenshots/test output) proving it works

If any row cannot be completed without guessing, the Canon needs an AMENDMENT.

---

## 3) Traceability Table

| Canon Anchor | Canon Statement (short quote) | Requirement ID | Test IDs | Implementation Ref | Evidence |
|---|---|---|---|---|---|
| H1 | [quote] | R-001 | AT-001, AT-002 | src/...:... | [evidence] |
| A2 | [quote] | R-002 | AT-101 | src/...:... | [evidence] |
| H3 | [quote] | R-003 | AT-401 | src/...:... | [evidence] |

(Add rows until all Canon Anchors are covered.)

---

## 4) Coverage Summary

- **Total Canon Anchors:** [number]
- **Covered in table:** [number]
- **Missing coverage:** [number] (must be zero for release)

---

## 5) Change Control

When a Canon AMENDMENT is added:
- Add new rows for new/changed Canon Anchors
- Mark superseded requirements/tests
- Re-run the minimum acceptance set + changed tests
