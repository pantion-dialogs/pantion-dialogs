/**
 * Next-actions engine — follow-up action suggestions.
 *
 * Static successors (baseline) + context-aware ranking.
 * Only valid, executable actions. Max 3 items.
 */
import type { RouterAction, RouterMenuItem } from './types.js';
import type { RouterContext } from './context.js';
/** Baseline follow-up actions per flow */
export declare const STATIC_SUCCESSORS: Record<RouterAction, RouterAction[]>;
/** Fallback mapping for disabled tools — all non-mutative */
export declare const TOOL_FALLBACKS: Record<string, RouterAction>;
/**
 * Build up to 3 next actions based on static successors + context ranking.
 */
export declare function buildNextActions(action: RouterAction, context: RouterContext): RouterMenuItem[];
//# sourceMappingURL=next-actions.d.ts.map