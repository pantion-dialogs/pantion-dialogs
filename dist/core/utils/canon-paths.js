import { resolve } from 'node:path';
import { canonDir } from './fs.js';
/**
 * Centralized canon path construction.
 * All canon file paths flow through here — no inline resolve() in tools.
 */
export function canonNameDir(projectPath, canonName) {
    return resolve(canonDir(projectPath), canonName);
}
export function canonIndexPath(projectPath) {
    return resolve(canonDir(projectPath), 'index.md');
}
export function canonDialogPath(projectPath, canonName) {
    return resolve(canonDir(projectPath), canonName, 'dialog.md');
}
export function canonSummaryPath(projectPath, canonName) {
    return resolve(canonDir(projectPath), canonName, 'summary.md');
}
export function canonTraceabilityPath(projectPath, canonName) {
    return resolve(canonDir(projectPath), canonName, 'traceability.md');
}
export function canonImplementationsDir(projectPath, canonName) {
    return resolve(canonDir(projectPath), canonName, 'implementations');
}
export function canonSpecDir(projectPath, canonName) {
    return resolve(canonDir(projectPath), canonName, 'spec');
}
export function canonPromptPath(projectPath, canonName) {
    return resolve(canonDir(projectPath), canonName, 'prompt.md');
}
export function canonBriefPath(projectPath, canonName) {
    return resolve(canonDir(projectPath), canonName, 'brief.md');
}
export function canonFeedbackPath(projectPath, canonName) {
    return resolve(canonDir(projectPath), canonName, 'feedback.md');
}
/**
 * Dynamic dialog canon paths (for dynamic-dialogs/{dialogName}/canon/).
 */
export function dialogCanonDir(projectPath, dialogName) {
    return resolve(projectPath, 'dynamic-dialogs', dialogName, 'canon');
}
export function dialogCanonDialogPath(projectPath, dialogName) {
    return resolve(dialogCanonDir(projectPath, dialogName), 'dialog.md');
}
export function dialogCanonSummaryPath(projectPath, dialogName) {
    return resolve(dialogCanonDir(projectPath, dialogName), 'summary.md');
}
//# sourceMappingURL=canon-paths.js.map