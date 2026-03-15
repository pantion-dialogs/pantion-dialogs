import { extractConvergenceStamp, extractProgressStamp } from './stamp-parser.js';
/**
 * Check if an LLM response contains a convergence or progress stamp.
 * Called after each assistant message to detect phase transitions.
 */
export function detectConvergence(assistantMessage) {
    const convergenceStamp = extractConvergenceStamp(assistantMessage);
    if (convergenceStamp && convergenceStamp.type !== 'draft') {
        return { type: 'converged', stamp: convergenceStamp };
    }
    const progressStamp = extractProgressStamp(assistantMessage);
    if (progressStamp) {
        return { type: 'draft', stamp: progressStamp };
    }
    return { type: 'none' };
}
/**
 * Check if text contains a signal that the user wants to stop.
 */
export function detectStopSignal(userMessage) {
    const lower = userMessage.toLowerCase().trim();
    const stopPhrases = [
        '/stop', '/quit', '/exit', '/pause',
        'stop', 'quit', 'exit', 'pause',
        'laten we stoppen', 'we stoppen',
        'genoeg voor nu', 'tot hier',
    ];
    return stopPhrases.some((p) => lower === p);
}
//# sourceMappingURL=convergence.js.map