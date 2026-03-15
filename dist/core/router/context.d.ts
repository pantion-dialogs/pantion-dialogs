/**
 * Context collector — layered context collection for the router.
 *
 * Always: readCanonIndex + listDialogs
 * Conditional: readProjectPatterns (learn/feedback/start), listSessions (resume or low confidence)
 */
import type { CanonEntry, SessionMeta } from '../types.js';
import type { RouterAction } from './types.js';
export interface DialogInfo {
    name: string;
    displayName: string;
    description: string;
}
export interface RouterContext {
    canons: CanonEntry[];
    dialogs: DialogInfo[];
    sessions?: SessionMeta[];
    patterns?: string;
    warnings: string[];
}
/**
 * Collect context for routing decisions.
 *
 * Layer 1 (always): canons + dialogs
 * Layer 2 (conditional): patterns (learn/feedback/start) + sessions (resume or low confidence)
 */
export declare function collectContext(projectPath: string, dialogsDir: string, intent?: RouterAction | null, confidence?: number): RouterContext;
//# sourceMappingURL=context.d.ts.map