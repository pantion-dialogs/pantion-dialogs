# Pantion Intent — Core Principles

> This document describes WHAT Pantion is and WHY it exists.
> It is the canon of Pantion itself — the source of truth for any protocol update.
> All protocol files, commands, dialogs, and tools are derived from this intent.

## Core Promise

**Code is replaceable. Intent is rebuildable.**

A well-converged intent description (canon) enables any competent agent to produce a functionally equivalent implementation — regardless of the technology, model, or era. The canon captures the **what** and the **why**, never the **how**.

## Core Principles

### Dialog as Canon

The verbatim dialog between human and assistant is the only source of truth. Everything else — summaries, project files, translated specs — is derived. Derived files may be regenerated; the dialog may not be edited.

**Why:** The dialog preserves nuance, rejected options, hesitations, and the order of discovery. A summary loses these. A better model can re-read the dialog and extract deeper understanding.

### Natural Language Only

Pantion stays in natural language. No formal schema, no DSL, no structured data format as the primary representation. Structure is emergent from the dialog, not imposed on it.

**Why:** Natural language is the most accessible, flexible, and future-proof representation. Schemas lock you into today's understanding; natural language adapts to tomorrow's.

### Convergence, Not Specification

A dialog converges when further questions yield no new behavior. This is not about completeness in an engineering sense — it's about stability: the intent "no longer moves." The stop criterion is: the assistant has nothing meaningful left to ask.

**Why:** Traditional specifications are written once and then maintained. Convergence dialogs discover intent through interaction. The process IS the product.

### Future-Proof Through Depth

The dialog is future-proof not because it's perfect, but because it's deep. A smarter model can re-read it, identify gaps, and conduct a supplementary dialog (reconvergence). Each generation of models builds on the previous dialog, not starting from scratch.

**Why:** Today's model will miss things. Tomorrow's model should be able to continue the conversation, not start over. Append-only preserves the human's voice and context.

### Tool-Agnostic, Model-Agnostic

Pantion works with any LLM and any coding agent. The protocol is independent of Claude, GPT, or any specific tool. The MCP server has no LLM — the client brings their own. Any MCP-compatible client can connect.

**Why:** Lock-in to a specific model or tool contradicts the promise of rebuildability. The canon must be usable by any competent system, now and in the future.

## The Two Directions

### Forward: Intent → Canon → Implementation

The primary flow. A human has an idea. Through dialog, the intent converges into a canon. The canon is translated into project specification files. Any agent builds from the specs.

### Reverse: Implementation → Canon → (Better) Implementation

The secondary flow. An existing codebase is analyzed. The intent is reconstructed as a synthetic dialog. The result is a canon that reads as if it were originally conducted. This canon can then be used to rebuild in a different technology, verify the original, or improve documentation.

## Scale Levels

Pantion operates at three scales:

1. **Standalone**: A single canon for a single system. Most projects start here.
2. **Decomposed**: An architect canon + interface canons + component canons. For larger systems where a single dialog would lose context.
3. **Recursive**: A component canon is itself decomposed. For very large systems.

Inheritance flows downward: constraints are additive (stricter is allowed, looser is not), authority budget rights are a ceiling, consumption is allocatable.

## What Pantion is NOT

- NOT a code generator (it produces intent descriptions, not code)
- NOT a project manager (it has no tasks, sprints, or timelines)
- NOT a deployment tool (it never runs, compiles, or deploys)
- NOT an LLM wrapper (the server has no LLM — the client brings their own)
- NOT a formal specification language (it uses natural language, not schemas)

## The Ultimate Test

> Can a human, after one convergence session with any competent model, produce a canon from which any competent agent can build a functionally equivalent system — without further interaction?

If yes: Pantion works.
If no: the protocol needs improvement.
