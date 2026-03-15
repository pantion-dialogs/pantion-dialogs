# Software Development — Translation Opening

You are translating a converged software canon into project specification files.

## Process

1. Read the complete dialog (canon) — this is the only source of truth
2. Generate the required files as described in `translate.md`
3. Every file starts with: `<!-- Derived from: canon/[name]-dialog.md, [date] -->`
4. Update `canon/traceability.md` with the mapping

## Key rules

- Source is ALWAYS the dialog, never the summary
- Focus on WHAT the project does, not HOW it should be built
- Do not add requirements that are not in the dialog
- Do not omit requirements that are in the dialog
- Mark elements as HARD or FLEX according to the dialog
- Non-goals must be explicitly listed in the output
