# Pantion DialogSpec — Core Knowledge

> This file contains the core knowledge of the Pantion DialogSpec Protocol.
> It is loaded by MCP clients via the protocol directory, and mirrored in .claude/rules/pantion-core.md for Claude Code.
> The developer does not need to read this — it guides agent behavior.

## Language

Pantion protocol files are in English. When interacting with the user, always match the user's language. Canons are written in the language of the dialog. Generated project files follow the project's language convention.

## What is Pantion?

Pantion is a protocol that lets natural-language dialogs converge into an unambiguous intent description. The result is not a program or schema, but a canonical intent that can be directly translated into project files and implementation.

## Core Principles

1. The verbatim dialog is the canon — the only source of truth
2. Everything stays in natural language
3. Structure is emergent, not imposed
4. A dialog is complete when further questions yield no new behavior
5. Implementation choices are NEVER made in the dialog (unless the human insists)
6. All derived artifacts (summaries, project files, tests) may NEVER override the canon
7. The dialog is always saved — this enables future models to re-derive better artifacts from the same canon

## HARD vs FLEX

- **HARD**: invariants that must never change — recognize by: "must", "never", "always", security, privacy, cost, retention, isolation
- **FLEX**: defaults that may evolve — recognize by: "MVP", "makes no difference", "prefer", "handy", "default"
- **Unclear**: mark as OPEN QUESTION

## Inference Policy

1. Explicit wins over implicit
2. Only one interpretation allowed
3. Multiple interpretations → OPEN QUESTION (don't guess)
4. Non-goals block "convenient" additions
5. Constraints win over everything

**Conservative** (default): smallest scope, least power, safest option.
**Strict**: rule 2 extremely strict, no implicit interpretation whatsoever.

## Authority Budget (always cover)

The Authority Budget consists of two categories:

### Rights (ceiling per component — not additive)
- Allowed Actions: what may the system do?
- Forbidden Actions: what NEVER?
- Data Access: what may it see?
- Data Retention: does it store anything? For how long?
- User Notification: when to inform the user?
- Auditability: what must be reconstructable?

### Consumption (rate/cost budget — additive and allocatable)
- Rate Limits: frequency limits per time unit
- Cost Limits: cost/token limits per period
- Budget Allocation: during decomposition, the Architect Canon can include an allocation (e.g., "component A max 30% of daily API budget")

During decomposition: Rights are a ceiling (component may have less, never more). Consumption is allocatable (total of components must not exceed system budget).

## Convergence Elements (always cover)

- Intent (what, not how)
- Inputs (explicit + implicit + defaults)
- Outputs (observable)
- Success criteria (externally verifiable)
- Failure behavior (no silent failure)
- Non-goals (what it does NOT do)
- Authority budget (Rights + Consumption)
- Persistence/restart behavior

## Decomposition (for large systems)

Signals that decomposition is needed (Decompose Score 0–5):
- (+1) More than 3 clearly independent behavior clusters
- (+1) Fundamentally different authority budgets per part
- (+1) Dialog is getting too long / context is being lost
- (+1) The human talks about "modules", "parts", "separate pieces"
- (+1) Different parts have different users or interfaces

Score 0–1: probably standalone. Score 2–3: discuss with the user. Score 4–5: actively propose decomposition.

## Deferred Protocol Sections

The following sections are loaded at the appropriate phase — not during questioning:
- **Stamps & Lifecycle** → loaded when checking convergence (see `core-stamps.md`)
- **Canon Structure & Translation** → loaded when saving/translating (see `core-save.md`)
