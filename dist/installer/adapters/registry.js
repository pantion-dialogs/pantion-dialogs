import { claude } from './claude.js';
import { cursor } from './cursor.js';
import { windsurf } from './windsurf.js';
import { gemini } from './gemini.js';
import { codex } from './codex.js';
const adapters = {
    'claude': claude,
    'cursor': cursor,
    'windsurf': windsurf,
    'gemini': gemini,
    'codex': codex,
};
export function getAdapter(id) {
    return adapters[id];
}
export function getAllAdapters() {
    return Object.values(adapters);
}
//# sourceMappingURL=registry.js.map