export const ALL_CLIENT_IDS = ['claude', 'cursor', 'windsurf', 'gemini', 'codex'];
/** Map user-friendly aliases to canonical ClientId */
const CLIENT_ALIASES = {
    'claude': 'claude',
    'claude-code': 'claude',
    'cursor': 'cursor',
    'windsurf': 'windsurf',
    'gemini': 'gemini',
    'gemini-cli': 'gemini',
    'codex': 'codex',
};
export function resolveClientId(value) {
    return CLIENT_ALIASES[value] ?? null;
}
//# sourceMappingURL=types.js.map