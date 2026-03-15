# Acceptance Tests Template

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

## 2) Test Conventions

- **Test ID format:** AT-### (e.g., AT-001)
- **Canon Anchors:** Every test MUST cite Canon Anchors (e.g., H2, A3).
- **No invented behavior:** If a test requires guessing, add an OPEN QUESTION to the Canon instead.
- **HARD/FLEX label:** Mark each test as testing a HARD constraint or FLEX default.

---

## 3) Positive Flow Tests

### AT-001 — [Test name]
- **Canon Anchors:** [e.g., H1, A2]
- **HARD/FLEX:** [HARD / FLEX]
- **Preconditions:** [setup required]
- **Steps:**
  1. [step]
  2. [step]
- **Expected:** [result]
- **Evidence:** [log line / screenshot / observable effect]

### AT-002 — [Test name]
- Canon Anchors: ...
- HARD/FLEX: ...
- Steps: ...
- Expected: ...

---

## 4) Negative / Validation Tests

### AT-101 — [Test name]
- **Canon Anchors:** [e.g., A5, H3]
- **HARD/FLEX:** HARD
- **Input:** [invalid input]
- **Expected:** [rejection / error message]
- **Evidence:** [observable effect]

### AT-102 — [Test name]
- Canon Anchors: ...
- ...

---

## 5) Edge Cases

### AT-201 — [Test name]
- **Canon Anchors:** [e.g., H4]
- **Scenario:** [boundary condition]
- **Expected:** [conservative handling per inference policy]

### AT-202 — [Test name]
- Canon Anchors: ...
- Expected: ...

---

## 6) Failure / Reliability Tests

### AT-301 — [Test name]
- **Canon Anchors:** [e.g., A7]
- **Fault injection:** [what fails]
- **Expected:** [graceful degradation / user notification]

### AT-302 — [Test name]
- Canon Anchors: ...
- Expected: ...

---

## 7) Authority Budget Tests

> These must pass even if they reduce "user convenience".

### AT-401 — [No access beyond allowed actions]
- **Canon Anchors:** [e.g., H6]
- **Attempt:** [forbidden action]
- **Expected:** blocked / denied / ignored

### AT-402 — [Data retention obeyed]
- Canon Anchors: ...
- Expected: ...

---

## 8) Non-Goals Confirmed

### AT-501 — [Feature creep is blocked]
- **Canon Anchors:** [e.g., A8]
- **Scenario:** user asks for out-of-scope feature
- **Expected:** system does not provide the feature

---

## 9) Regression Suite

- **Minimum acceptance set:** AT-001, AT-002, AT-101, AT-301, AT-401
- **Release Gate:** All required tests pass, plus any tests tied to recent amendments.
