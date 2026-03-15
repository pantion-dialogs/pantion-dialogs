import type { ConvergenceStamp, ProgressStamp, HumanStamp, HumanStampStatus, CanonMetadata, OpenQuestion } from '../types.js';
/**
 * Extract OPEN QUESTION [OQ-NNN] patterns from dialog text.
 * Returns an array of OpenQuestion objects (without resolvedAt — that comes from the stamp).
 */
export declare function extractOpenQuestionIds(text: string): OpenQuestion[];
export declare function extractConvergenceStamp(text: string): ConvergenceStamp | null;
export declare function extractProgressStamp(text: string): ProgressStamp | null;
/**
 * Extract the HUMAN STAMP from text.
 * Returns null if no HUMAN STAMP block found.
 */
export declare function extractHumanStamp(text: string): HumanStamp | null;
/**
 * Format a HUMAN STAMP block as a string.
 */
export declare function formatHumanStamp(stamp: {
    status: HumanStampStatus;
    date?: string;
    role?: string;
    note?: string;
}): string;
/**
 * Create a pending HUMAN STAMP block (for new canons in full mode).
 */
export declare function createPendingHumanStamp(): string;
/**
 * Create an auto-approved HUMAN STAMP block (for dialog mode canons).
 */
export declare function createAutoApprovedHumanStamp(): string;
/**
 * Replace the HUMAN STAMP block in a text with a new one.
 * Returns the updated text, or null if no existing HUMAN STAMP found.
 */
export declare function replaceHumanStamp(text: string, newStamp: string): string | null;
/**
 * Format a CANON METADATA block as a string.
 * Server-generated metadata about the canon (dialog, soul, mode, check result).
 */
export declare function formatCanonMetadata(meta: CanonMetadata): string;
/**
 * Extract the CANON METADATA block from text.
 * Returns null if no CANON METADATA block found (backward compat).
 */
export declare function extractCanonMetadata(text: string): CanonMetadata | null;
//# sourceMappingURL=stamp-parser.d.ts.map