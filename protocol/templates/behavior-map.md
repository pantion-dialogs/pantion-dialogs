# Behavior Map Template

> **Artifact Type:** Derived / Non-Canonical
> **Rule:** If this document conflicts with the Canonical Dialog, the Canon wins.

---

## 1) Source Canon Reference

- **Canon Name:** [e.g., "Grap van de Dag"]
- **Canon Date:** [e.g., 2026-02-23]
- **Canon Location:** [repo path]
- **Convergence Stamp:**
  - STATUS: [CONVERGED / etc.]
  - OPEN QUESTIONS: [none / list]
  - INFERENCE POLICY: [strict / conservative]

---

## 2) System Intent

- **Primary intent:**
  - [Description]
  - **Canon Anchor:** [e.g., H1, A2]

- **Secondary intents (if any):**
  - [Description]
  - **Canon Anchor:** [e.g., H3]

---

## 3) Inputs

### 3.1 Input Channels
- **Channel(s):** [e.g., browser page load, button click]
- **Canon Anchor:** [e.g., H1]

### 3.2 Input Format
- **Pattern(s):**
  - Pattern: [description]
  - Example: [example]
  - **Canon Anchor:** [e.g., H2, A3]

### 3.3 Validation Rules
- Required fields: [list]
- Allowed formats: [list]
- **Canon Anchor:** [e.g., A5]

---

## 4) Outputs

### 4.1 Output Channels
- Channel: [e.g., browser DOM, API response]
- **Canon Anchor:** [e.g., A2]

### 4.2 Output Payload
- Template: [description]
- **Canon Anchor:** [e.g., A4]

---

## 5) Core Behaviors

> Each behavior is a testable statement. No implementation details.

### B-01 — [Behavior name]
- **Trigger:** [what initiates this behavior]
- **Steps (logical):** [what happens]
- **Success outcome:** [expected result]
- **Failure outcome(s):** [what happens on failure]
- **Canon Anchor:** [e.g., H1, A2]

### B-02 — [Behavior name]
- **Trigger:** ...
- **Success:** ...
- **Failures:** ...
- **Canon Anchor:** ...

(Add/remove behaviors as needed.)

---

## 6) Constraints (Absolute)

> Constraints override convenience. Unclear constraints must be OPEN QUESTIONS in the Canon.

- **C-01:** [constraint]
  - **Canon Anchor:** [e.g., H5]
- **C-02:** [constraint]
  - **Canon Anchor:** [e.g., A6]

---

## 7) Non-Goals (Explicitly Out of Scope)

- **NG-01:** [what is NOT done]
  - **Canon Anchor:** [e.g., A8]
- **NG-02:** [what is NOT done]
  - **Canon Anchor:** [e.g., H4]

---

## 8) Failure Modes & Recovery

- **F-01 [Failure type]:**
  - User-visible response: [message/behavior]
  - Retry behavior: [yes/no/backoff]
  - **Canon Anchor:** [e.g., A7]

- **F-02 [Failure type]:**
  - User-visible response: ...
  - **Canon Anchor:** ...

---

## 9) Observability

- Logs/events required: [list]
- User-facing confirmations: [list]
- Audit trail requirements: [list]
- **Canon Anchor:** [e.g., A9]

---

## 10) Authority Budget (Operationalized)

> Restated from Canon as executable checks.

- **Allowed actions:** [list]
- **Forbidden actions:** [list]
- **Data access:** [what may be accessed]
- **Data retention:** [what is stored, for how long]
- **Rate limits:** [if applicable]
- **Canon Anchor:** [e.g., H6, A10]
