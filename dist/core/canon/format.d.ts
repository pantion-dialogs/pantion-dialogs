import type { Session, CanonMetadata } from '../types.js';
/**
 * Normalize literal \n (backslash + n) sequences to real newlines.
 * Client LLMs sometimes send escaped strings via MCP.
 */
export declare function normalizeLiteralNewlines(text: string): string;
/**
 * Format canon content from a session into a markdown dialog file.
 * Shared by both session/canon-writer (root canons) and dialog/canon-writer (dialog canons).
 *
 * @param session - The session containing messages and optional stamp
 * @param header - The top-level heading (e.g. '# DialogSpec Dialog')
 * @param headerComments - HTML comments to include after the header
 * @param mode - 'dialog'/'synthetic' for auto-approved, 'full' for pending human stamp
 * @param metadata - Optional canon metadata block
 */
export declare function formatCanonContent(session: Session, header: string, headerComments: string[], mode?: 'dialog' | 'full' | 'synthetic' | 'deep', metadata?: CanonMetadata): string;
/**
 * Format summary content with a derivation comment header.
 *
 * @param name - The canon/dialog name
 * @param date - The date string for the derivation comment
 * @param derivationPath - The path to the source dialog (e.g. 'canon/myproject/dialog.md')
 * @param rawContent - The raw summary content from the client
 * @param derivationNote - Optional second comment line (defaults to generic source-of-truth note)
 */
export declare function formatSummaryContent(_name: string, date: string, derivationPath: string, rawContent: string, derivationNote?: string): string;
//# sourceMappingURL=format.d.ts.map