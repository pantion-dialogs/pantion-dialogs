import type { Message, ValidationResult } from '../types.js';
/**
 * Structural convergence validation (Level 2).
 * Checks the dialog for required convergence elements with 12-category scoring.
 */
export declare function validateConvergence(dialog: Message[]): ValidationResult;
/**
 * Validate an existing canon file on disk (used by pantion_check).
 * Parses the dialog from the file content and validates.
 */
export declare function validateCanonFile(dialogContent: string): ValidationResult;
//# sourceMappingURL=validator.d.ts.map