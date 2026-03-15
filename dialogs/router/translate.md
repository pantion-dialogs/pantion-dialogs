# Pantion Router — Translation Instructions

The router dialog does NOT produce project specification files. Its output is a tool invocation.

## Output

After successful routing, the router produces:

1. **Tool name** — the Pantion tool to invoke (e.g. `pantion_start`, `pantion_amend`)
2. **Arguments** — tool-specific arguments (e.g. `canon_name`, `mode`)
3. **User language** — detected language for the target tool to use

## No files generated

The router is a pass-through. It does not generate:
- No spec files
- No canon files
- No summary files
- No traceability

The only persistent artifact is the optional onboarding preference in `.pantion/preferences.json`.
