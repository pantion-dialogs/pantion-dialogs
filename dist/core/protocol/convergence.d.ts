import type { ConvergenceEvent } from '../types.js';
/**
 * Check if an LLM response contains a convergence or progress stamp.
 * Called after each assistant message to detect phase transitions.
 */
export declare function detectConvergence(assistantMessage: string): ConvergenceEvent;
/**
 * Check if text contains a signal that the user wants to stop.
 */
export declare function detectStopSignal(userMessage: string): boolean;
//# sourceMappingURL=convergence.d.ts.map