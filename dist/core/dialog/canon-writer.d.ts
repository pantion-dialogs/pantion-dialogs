import type { Session, CanonMetadata } from '../types.js';
/**
 * Get the dialog canon directory: dynamic-dialogs/{dialogName}/canon/
 * Re-exported from canon-paths for backward compatibility.
 */
export declare function dialogCanonDir(projectPath: string, dialogName: string): string;
/**
 * Write a dialog dialog file (THE CANON for the dialog).
 */
export declare function writeDialogCanonFile(session: Session, dialogName: string, date: string, projectPath: string, mode?: 'dialog' | 'full' | 'synthetic' | 'deep', metadata?: CanonMetadata): string;
/**
 * Write a dialog summary file (DERIVED from dialog canon).
 */
export declare function writeDialogSummaryFile(dialogName: string, date: string, summaryContent: string, projectPath: string): string;
/**
 * Check if a dialog has a canon (is a dynamic dialog).
 */
export declare function dialogHasCanon(projectPath: string, dialogName: string): boolean;
/**
 * Read a dialog's canon dialog.
 */
export declare function readDialogCanon(projectPath: string, dialogName: string): string | null;
//# sourceMappingURL=canon-writer.d.ts.map