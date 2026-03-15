import { resolve } from 'node:path';
import { readdirSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { readFileSafe, writeFile, canonDir, ensureDir } from '../utils/fs.js';
import { canonFeedbackPath } from '../utils/canon-paths.js';
// --- Path helpers ---
export { canonFeedbackPath as feedbackFilePath } from '../utils/canon-paths.js';
export function projectFeedbackDir(projectPath) {
    return resolve(projectPath, '.pantion', 'feedback');
}
export function projectPatternsPath(projectPath) {
    return resolve(projectFeedbackDir(projectPath), 'patterns.md');
}
export function globalFeedbackDir() {
    return resolve(homedir(), '.pantion', 'feedback');
}
export function globalPatternsPath() {
    return resolve(globalFeedbackDir(), 'patterns.md');
}
export function feedbackConfigPath(projectPath) {
    return resolve(projectFeedbackDir(projectPath), 'config.json');
}
// --- Config ---
const DEFAULT_SCOPE = 'project-and-global';
export function readFeedbackConfig(projectPath) {
    const raw = readFileSafe(feedbackConfigPath(projectPath));
    if (!raw)
        return { scope: DEFAULT_SCOPE };
    try {
        const parsed = JSON.parse(raw);
        if (parsed.scope === 'project-only' || parsed.scope === 'project-and-global') {
            return { scope: parsed.scope };
        }
        return { scope: DEFAULT_SCOPE };
    }
    catch {
        return { scope: DEFAULT_SCOPE };
    }
}
// --- Format ---
export function formatFeedbackEntry(entry) {
    return [
        `> **[${entry.type}]** (${entry.severity}) — ${entry.domain}`,
        `> ${entry.description}`,
        `> **Suggestion:** ${entry.suggestion}`,
        `> *Source: ${entry.source} | Canon: ${entry.canonName} | Date: ${entry.date}*`,
        '',
    ].join('\n');
}
// --- Append ---
export function appendFeedbackEntry(projectPath, canonName, entry) {
    const path = canonFeedbackPath(projectPath, canonName);
    const existing = readFileSafe(path);
    const formatted = formatFeedbackEntry(entry);
    if (existing) {
        writeFile(path, existing.trimEnd() + '\n\n' + formatted);
    }
    else {
        const header = `# Feedback — ${canonName}\n\n`;
        writeFile(path, header + formatted);
    }
    return path;
}
// --- Read ---
export function readFeedbackForCanon(projectPath, canonName) {
    return readFileSafe(canonFeedbackPath(projectPath, canonName));
}
export function readAllFeedback(projectPath) {
    const dir = canonDir(projectPath);
    if (!existsSync(dir))
        return [];
    const results = [];
    let entries;
    try {
        entries = readdirSync(dir, { withFileTypes: true })
            .filter((e) => e.isDirectory())
            .map((e) => e.name);
    }
    catch {
        return [];
    }
    for (const name of entries) {
        const content = readFileSafe(canonFeedbackPath(projectPath, name));
        if (content) {
            results.push({ canonName: name, content });
        }
    }
    return results;
}
// --- Patterns (read/write) ---
export function readProjectPatterns(projectPath) {
    return readFileSafe(projectPatternsPath(projectPath));
}
export function readGlobalPatterns() {
    return readFileSafe(globalPatternsPath());
}
export function writeProjectPatterns(projectPath, content) {
    ensureDir(projectFeedbackDir(projectPath));
    writeFile(projectPatternsPath(projectPath), content);
}
export function writeGlobalPatterns(content) {
    try {
        ensureDir(globalFeedbackDir());
        writeFile(globalPatternsPath(), content);
    }
    catch {
        // Silently skip if global dir is not writable (sandbox, CI, restricted envs)
    }
}
//# sourceMappingURL=store.js.map