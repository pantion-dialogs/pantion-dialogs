import type { Session, CanonMetadata } from '../types.js';
/**
 * Write the dialog file (THE CANON — verbatim dialog).
 * No LLM dependency — this is purely file I/O.
 */
export declare function writeDialogFile(session: Session, name: string, date: string, projectPath: string, mode?: 'dialog' | 'full' | 'synthetic' | 'deep', metadata?: CanonMetadata): string;
/**
 * Write a summary file (DERIVED — content provided by the client LLM).
 * The server does not generate summaries; it writes what the client provides.
 */
export declare function writeSummaryFile(name: string, date: string, summaryContent: string, projectPath: string): string;
/**
 * Append an amendment block to an existing dialog file.
 */
export declare function appendAmendment(canonName: string, projectPath: string, amendmentDialog: Array<{
    role: string;
    content: string;
}>, stampRaw: string): string;
/**
 * Append a Reality Convergence block to an existing dialog file.
 * Reality Convergence captures empirical feedback from a built implementation
 * back into the canon as intent-deepening.
 */
export declare function appendRealityConvergence(canonName: string, projectPath: string, validationDialog: Array<{
    role: string;
    content: string;
}>, stampRaw: string): string;
/**
 * Update the canon index.
 * Regenerates the full index from filesystem state.
 *
 * Accepts the legacy 4-arg signature (name, status, date, projectPath) for
 * backward compatibility. Prefer the 1-arg form: updateCanonIndex(projectPath).
 */
export declare function updateCanonIndex(nameOrProjectPath: string, _status?: string, _date?: string, projectPath?: string): void;
//# sourceMappingURL=canon-writer.d.ts.map