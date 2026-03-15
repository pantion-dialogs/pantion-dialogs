/**
 * Intent classifier — keyword matching + confidence scoring.
 *
 * English-only keyword register. Non-English intents fall through
 * to the LLM fallback zone (confidence < 0.75).
 */
import type { RouterAction } from './types.js';
import type { CanonEntry, SessionMeta } from '../types.js';
export declare const KEYWORD_REGISTER: Record<RouterAction, string[]>;
export declare const HIGH_RISK_ACTIONS: ReadonlySet<RouterAction>;
/** Map RouterAction to MCP tool name */
export declare const ACTION_TO_TOOL: Record<RouterAction, string>;
export interface ClassificationContext {
    canons?: CanonEntry[];
    sessions?: SessionMeta[];
    hasPatterns?: boolean;
}
export interface ClassificationResult {
    action: RouterAction;
    confidence: number;
    confidence_reason: string;
    decision_path: 'rules_only' | 'rules+context';
}
/**
 * Classify user intent into a RouterAction using keyword matching + context.
 * Returns null if no match found (confidence too low for deterministic routing).
 */
export declare function classifyIntent(userIntent: string, context?: ClassificationContext): ClassificationResult | null;
//# sourceMappingURL=classifier.d.ts.map