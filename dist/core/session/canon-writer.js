import { writeFile, readFileSafe, canonDir, ensureDir, assertSafeName } from '../utils/fs.js';
import { canonDialogPath, canonSummaryPath } from '../utils/canon-paths.js';
import { regenerateIndex } from '../canon/index-manager.js';
import { formatCanonContent, formatSummaryContent } from '../canon/format.js';
/**
 * Write the dialog file (THE CANON — verbatim dialog).
 * No LLM dependency — this is purely file I/O.
 */
export function writeDialogFile(session, name, date, projectPath, mode, metadata) {
    assertSafeName(name);
    const dir = canonDir(projectPath);
    ensureDir(dir);
    const content = formatCanonContent(session, '# DialogSpec Dialog', [
        '<!-- This is the canon — the verbatim dialog is the only source of truth -->',
        '<!-- All other files (summary, project files, tests) are derived from this dialog -->',
    ], mode, metadata);
    const filePath = canonDialogPath(projectPath, name);
    writeFile(filePath, content);
    return filePath;
}
/**
 * Write a summary file (DERIVED — content provided by the client LLM).
 * The server does not generate summaries; it writes what the client provides.
 */
export function writeSummaryFile(name, date, summaryContent, projectPath) {
    assertSafeName(name);
    const dir = canonDir(projectPath);
    ensureDir(dir);
    const content = formatSummaryContent(name, date, `canon/${name}/dialog.md`, summaryContent, '<!-- This is a DERIVED file for navigation — the dialog is the only source of truth -->');
    const filePath = canonSummaryPath(projectPath, name);
    writeFile(filePath, content);
    return filePath;
}
/**
 * Append an amendment block to an existing dialog file.
 */
export function appendAmendment(canonName, projectPath, amendmentDialog, stampRaw) {
    assertSafeName(canonName);
    const filePath = canonDialogPath(projectPath, canonName);
    const existing = readFileSafe(filePath);
    if (!existing) {
        throw new Error(`Canon dialog not found: ${filePath}`);
    }
    const lines = [
        existing,
        '',
        '---',
        '',
        '# Amendment',
        '',
        stampRaw,
        '',
        '---',
        '',
    ];
    for (const msg of amendmentDialog) {
        const role = msg.role === 'user' ? 'HUMAN' : 'ASSISTANT';
        lines.push(`${role}: ${msg.content}`);
        lines.push('');
    }
    const content = lines.join('\n');
    writeFile(filePath, content);
    return filePath;
}
/**
 * Append a Reality Convergence block to an existing dialog file.
 * Reality Convergence captures empirical feedback from a built implementation
 * back into the canon as intent-deepening.
 */
export function appendRealityConvergence(canonName, projectPath, validationDialog, stampRaw) {
    assertSafeName(canonName);
    const filePath = canonDialogPath(projectPath, canonName);
    const existing = readFileSafe(filePath);
    if (!existing) {
        throw new Error(`Canon dialog not found: ${filePath}`);
    }
    const lines = [
        existing,
        '',
        '---',
        '',
        '# Reality Convergence',
        '',
        stampRaw,
        '',
        '---',
        '',
    ];
    for (const msg of validationDialog) {
        const role = msg.role === 'user' ? 'HUMAN' : 'ASSISTANT';
        lines.push(`${role}: ${msg.content}`);
        lines.push('');
    }
    const content = lines.join('\n');
    writeFile(filePath, content);
    return filePath;
}
/**
 * Update the canon index.
 * Regenerates the full index from filesystem state.
 *
 * Accepts the legacy 4-arg signature (name, status, date, projectPath) for
 * backward compatibility. Prefer the 1-arg form: updateCanonIndex(projectPath).
 */
export function updateCanonIndex(nameOrProjectPath, _status, _date, projectPath) {
    // Backward compat: if 4 args were passed, projectPath is the 4th arg
    const resolvedPath = projectPath ?? nameOrProjectPath;
    regenerateIndex(resolvedPath);
}
//# sourceMappingURL=canon-writer.js.map