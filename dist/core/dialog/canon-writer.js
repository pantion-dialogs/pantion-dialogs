import { existsSync } from 'node:fs';
import { writeFile, readFileSafe, ensureDir, assertSafeName } from '../utils/fs.js';
import { dialogCanonDir as _dialogCanonDir, dialogCanonDialogPath, dialogCanonSummaryPath } from '../utils/canon-paths.js';
import { formatCanonContent, formatSummaryContent } from '../canon/format.js';
/**
 * Get the dialog canon directory: dynamic-dialogs/{dialogName}/canon/
 * Re-exported from canon-paths for backward compatibility.
 */
export function dialogCanonDir(projectPath, dialogName) {
    return _dialogCanonDir(projectPath, dialogName);
}
/**
 * Write a dialog dialog file (THE CANON for the dialog).
 */
export function writeDialogCanonFile(session, dialogName, date, projectPath, mode, metadata) {
    assertSafeName(dialogName);
    const dir = dialogCanonDir(projectPath, dialogName);
    ensureDir(dir);
    const content = formatCanonContent(session, '# Dialog DialogSpec Dialog', [
        `<!-- Dialog canon for: ${dialogName} -->`,
        '<!-- This is the canon — the verbatim dialog is the only source of truth -->',
        '<!-- All dialog files (dialog.json, convergence-rules.md, translate.md, prompts/) are derived from this dialog -->',
    ], mode, metadata);
    const dialogPath = dialogCanonDialogPath(projectPath, dialogName);
    writeFile(dialogPath, content);
    return dialogPath;
}
/**
 * Write a dialog summary file (DERIVED from dialog canon).
 */
export function writeDialogSummaryFile(dialogName, date, summaryContent, projectPath) {
    assertSafeName(dialogName);
    const dir = dialogCanonDir(projectPath, dialogName);
    ensureDir(dir);
    const content = formatSummaryContent(dialogName, date, `dynamic-dialogs/${dialogName}/canon/dialog.md`, summaryContent, '<!-- This is a DERIVED file — the dialog dialog is the only source of truth -->');
    const summaryPath = dialogCanonSummaryPath(projectPath, dialogName);
    writeFile(summaryPath, content);
    return summaryPath;
}
/**
 * Check if a dialog has a canon (is a dynamic dialog).
 */
export function dialogHasCanon(projectPath, dialogName) {
    assertSafeName(dialogName);
    const dialogPath = dialogCanonDialogPath(projectPath, dialogName);
    return existsSync(dialogPath);
}
/**
 * Read a dialog's canon dialog.
 */
export function readDialogCanon(projectPath, dialogName) {
    assertSafeName(dialogName);
    const dialogPath = dialogCanonDialogPath(projectPath, dialogName);
    return readFileSafe(dialogPath);
}
//# sourceMappingURL=canon-writer.js.map