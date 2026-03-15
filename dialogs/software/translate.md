# Software Development — Translation Instructions

After convergence, generate PROJECT SPECIFICATION files from the dialog canon.
These files describe the project for any developer or tool — they are NOT agent-specific instruction files.

The canon itself (served via MCP) is the authoritative instruction set for any connected agent.

## Always Generate

1. **`canon/{naam}/spec/requirements.md`**
   - Project intent and goals (from system intent)
   - Functional requirements (from inputs/outputs/success criteria)
   - Non-functional requirements (from constraints, authority budget)
   - Non-goals (explicit exclusions)

2. **`canon/{naam}/spec/constraints.md`**
   - All HARD constraints from the dialog
   - Forbidden actions from Authority Budget
   - Data access and retention policies
   - Inference policy

3. **`canon/{naam}/spec/success-criteria.md`**
   - Definition of Done (from success criteria)
   - Acceptance criteria (externally verifiable)
   - Error handling requirements (from failure behavior)

## Generate If Applicable

4. **`canon/{naam}/spec/api-spec.md`** — if the project exposes an API
   - Endpoints, inputs, outputs
   - Error responses
   - Authentication/authorization

5. **`canon/{naam}/spec/data-model.md`** — if the project manages persistent data
   - Entities and relationships
   - Storage requirements
   - Retention policies

6. **`canon/{naam}/spec/architecture.md`** — if the system has multiple components
   - Component overview
   - Interfaces between components
   - Deployment model

7. **`canon/{naam}/spec/interfaces/interface-[A]-[B].md`** — per interface (if decomposed)
   - Parties, guarantees, expectations
   - Data shape, error semantics
   - Rate/cost expectations

## Software-Specific Derived Artifacts

These use templates from `protocol/templates/` and are specific to software projects:

8. **`canon/{naam}/spec/behavior-map.md`** — from `protocol/templates/behavior-map.md`
   - Map each system behavior to Canon Anchors (H1, A3, etc.)
   - 10 sections: intent, inputs, outputs, core behaviors, constraints, non-goals, failure modes, observability, authority budget
   - Every entry MUST cite a Canon Anchor

9. **`canon/{naam}/spec/acceptance-tests.md`** — from `protocol/templates/acceptance-tests.md`
   - AT-### format: positive flows, negative tests, edge cases, failure tests, authority budget tests, non-goal tests
   - Each test cites Canon Anchors and is labeled HARD or FLEX
   - Define minimum acceptance set

10. **`canon/{naam}/spec/traceability-map.md`** — from `protocol/templates/traceability-map.md`
    - Canon Anchor -> Requirement -> Test -> Implementation -> Evidence
    - Coverage must be 100% (every Canon Anchor covered)

## Rules

- Source is ALWAYS the dialog, not the summary
- Each file starts with: `<!-- Derived from: canon/{naam}/dialog.md, [date] -->`
- Update `canon/{naam}/traceability.md` with complete mapping
- Focus on WHAT the project does, not HOW it should be built
- These are project artifacts readable by any developer or tool
- Canon Anchors use the notation: H[N] for HUMAN turn N, A[N] for ASSISTANT turn N (1-indexed)
