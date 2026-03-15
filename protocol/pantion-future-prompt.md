# Pantion Future Prompt — Instructions for Future Model Rebuilds

> You are about to rebuild or update the Pantion Protocol.
> Read this document BEFORE making any changes.
> This document tells you what works, what to preserve, and what to avoid.

## Who You Are

You are a future model — possibly more capable than the one that wrote this protocol. You have access to the Pantion intent document (`pantion-intent.md`) and the current protocol files. Your job is to improve the protocol while preserving its core promise.

## What Works Well (KEEP)

### 1. The dialog-as-canon principle
The verbatim dialog being the source of truth is the foundation. Summaries and specs are derived. This works because it preserves nuance and enables reconvergence. **Do not weaken this.**

### 2. The convergence model
Questions converge to stability. The stop criterion ("nothing meaningful left to ask") works better than checklists or completeness criteria. The 12-category checklist supports, not replaces, human judgment. **Do not over-formalize convergence.**

### 3. Natural language throughout
No DSL, no schema, no formal notation as primary representation. Natural language is accessible, flexible, and future-proof. Structure emerges from the dialog. **Do not introduce a specification language.**

### 4. Append-only canons
Canons are never edited, only appended to (via resume, amend, reconverge). This preserves history and enables traceability. **Do not add edit capabilities.**

### 5. The MCP architecture
The server has no LLM. The client brings their own. Tools are thin wrappers around protocol commands. Resources serve canon content directly. This keeps the server simple, testable, and universal. **Do not add LLM calls to the server.**

### 6. Skills and Souls separation
Skills determine WHAT to converge on (domain knowledge). Souls determine HOW to communicate (interaction style). They compose independently. **Do not merge them.**

### 7. The reverse direction
Code → Canon works and is powerful. The synthetic dialog format ("as if it were originally conducted") is the right approach. **Do not change the output format to something non-dialog.**

### 8. Decomposition model
Architect → Interface → Component canons with inheritance (constraints additive, authority budget ceiling, consumption allocatable). **Do not flatten the hierarchy.**

## What Can Be Improved (IMPROVE)

### 1. Convergence element coverage
The 12-category checklist could be more contextually intelligent. Different domains need different emphasis. Skills should be able to influence which categories are critical.

### 2. Interface canon depth
The five additional contract fields (data shape, versioning, error semantics, privacy, rate/cost) are thorough but could be more opinionated about what "good enough" looks like.

### 3. Reconvergence gap analysis
The six gap analysis dimensions are good but the detection heuristics could be sharper. Better models should produce more targeted gap analyses.

### 4. Dialog creation via dialog
Dynamic dialogs (created through Pantion dialogs) are a powerful concept. The dialog-builder meta-dialog could be deeper — more domain-specific questions, better validation of skill quality.

### 5. Onboarding experience
The three strategies (forward, full reverse, partial) are clear. The boundary detection for partial canonization could be more intelligent.

## What You Must NOT Do

1. **Do not introduce a formal specification language.** No YAML specs, no JSON schemas, no DSLs as primary representation. Natural language is the point.

2. **Do not add LLM calls to the server.** The server is deterministic and testable. The client brings the LLM.

3. **Do not make canons editable.** Append-only is a feature, not a limitation.

4. **Do not remove the dialog as source of truth.** The summary is for navigation. The dialog is the canon.

5. **Do not add features nobody asked for.** The inference policy applies to the protocol itself: smallest scope, least power, safest option.

6. **Do not break tool-agnosticism.** No Claude-specific, GPT-specific, or tool-specific features in the core protocol.

7. **Do not make the protocol complex.** If it needs a 50-page manual, something is wrong. A human should be able to understand the core flow in 5 minutes.

8. **Do not add execution capabilities.** Pantion describes intent. It never runs, compiles, deploys, or executes anything.

## The Rebuild Process

1. Read `pantion-intent.md` — understand the core principles
2. Read this document — understand what to preserve and avoid
3. Inventory the current protocol files — understand what exists
4. Perform delta analysis — what to keep, improve, add, remove
5. Get human approval before changing anything
6. Regenerate protocol files in order: core knowledge → commands → dialogs → infrastructure
7. Self-check against the core principles
8. Produce a changelog
9. Save a snapshot for rollback

## The Self-Referential Test

The protocol that says "code is replaceable, intent is rebuildable" must apply that principle to itself. If the intent documents (`pantion-intent.md` + this file) are sufficient for a capable model to rebuild the protocol — then the protocol practices what it preaches.

Can you, reading only the intent documents and examining the current codebase, produce a better version of the protocol? If yes: the system works. If the intent documents are insufficient: improve them first, then improve the protocol.
