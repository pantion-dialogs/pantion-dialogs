/**
 * Intent classifier — keyword matching + confidence scoring.
 *
 * English-only keyword register. Non-English intents fall through
 * to the LLM fallback zone (confidence < 0.75).
 */
export const KEYWORD_REGISTER = {
    start: ['start', 'new', 'create', 'build', 'make', 'begin', 'kickoff'],
    resume: ['resume', 'continue', 'pick up', 'go on', 'carry on'],
    amend: ['amend', 'change', 'modify', 'add', 'update', 'revise', 'tweak'],
    check: ['check', 'validate', 'quality', 'ready', 'done', 'verify', 'health', 'complete'],
    approve: ['approve', 'accept', 'authorize', 'sign off', 'ship', 'greenlight'],
    translate: ['translate', 'generate', 'spec', 'files', 'write specs', 'generate requirements'],
    reflect: ['reflect', 'reality', "didn't work", 'unexpected', 'retrospective', 'postmortem'],
    feedback: ['feedback', 'missed', 'wrong', 'should have', 'missed question', 'should ask'],
    learn: ['learn', 'patterns', 'aggregate', 'improve', 'insights', 'trends'],
    list: ['list', 'show', 'overview', 'status', 'where', 'what do we have'],
};
export const HIGH_RISK_ACTIONS = new Set(['approve', 'translate', 'amend']);
/** Map RouterAction to MCP tool name */
export const ACTION_TO_TOOL = {
    start: 'pantion_start',
    resume: 'pantion_resume',
    amend: 'pantion_amend',
    check: 'pantion_check',
    approve: 'pantion_approve',
    translate: 'pantion_translate',
    reflect: 'pantion_reflect',
    feedback: 'pantion_feedback',
    learn: 'pantion_learn',
    list: 'pantion_list-canons',
};
/**
 * Classify user intent into a RouterAction using keyword matching + context.
 * Returns null if no match found (confidence too low for deterministic routing).
 */
export function classifyIntent(userIntent, context) {
    const normalized = userIntent.toLowerCase().trim();
    if (!normalized)
        return null;
    // Phase 1: keyword matching — find best match
    let bestAction = null;
    let bestScore = 0;
    let matchedKeyword = '';
    for (const [action, keywords] of Object.entries(KEYWORD_REGISTER)) {
        for (const keyword of keywords) {
            if (normalized.includes(keyword)) {
                // Prefer longer keyword matches (more specific)
                const score = keyword.length;
                if (score > bestScore) {
                    bestScore = score;
                    bestAction = action;
                    matchedKeyword = keyword;
                }
            }
        }
    }
    if (!bestAction) {
        // No keyword match at all
        return null;
    }
    // Phase 2: context enrichment
    let confidence = 0.9;
    let confidence_reason = `Keyword match: "${matchedKeyword}"`;
    let decision_path = 'rules_only';
    if (context) {
        const contextSignal = checkContextAlignment(bestAction, context);
        decision_path = 'rules+context';
        if (contextSignal === 'confirms') {
            confidence = 0.95;
            confidence_reason = `Keyword "${matchedKeyword}" + context confirms`;
        }
        else if (contextSignal === 'conflicts') {
            confidence = 0.3;
            confidence_reason = `Keyword "${matchedKeyword}" but context conflicts`;
        }
        // 'neutral' keeps 0.9
    }
    // Phase 3: multi-signal boost
    if (confidence >= 0.9 && hasMultipleSignals(normalized, bestAction)) {
        confidence = 0.97;
        confidence_reason += ' + multi-signal boost';
    }
    return {
        action: bestAction,
        confidence,
        confidence_reason,
        decision_path,
    };
}
function checkContextAlignment(action, context) {
    const { canons, sessions } = context;
    switch (action) {
        case 'resume': {
            const hasDrafts = canons?.some(c => c.status.toLowerCase().includes('draft'));
            const hasActiveSessions = sessions && sessions.length > 0;
            if (hasDrafts || hasActiveSessions)
                return 'confirms';
            if (canons && canons.length > 0 && !hasDrafts)
                return 'conflicts';
            return 'neutral';
        }
        case 'approve': {
            const hasConvergedPending = canons?.some(c => c.status.toLowerCase().includes('converged') && c.humanStampStatus === 'PENDING');
            if (hasConvergedPending)
                return 'confirms';
            if (canons && canons.length > 0 && !hasConvergedPending)
                return 'conflicts';
            return 'neutral';
        }
        case 'translate': {
            const hasApproved = canons?.some(c => c.humanStampStatus === 'APPROVED' || c.humanStampStatus === 'AUTO-APPROVED');
            if (hasApproved)
                return 'confirms';
            if (canons && canons.length > 0 && !hasApproved)
                return 'conflicts';
            return 'neutral';
        }
        case 'check': {
            const hasCanons = canons && canons.length > 0;
            if (hasCanons)
                return 'confirms';
            return 'neutral';
        }
        case 'amend': {
            const hasConverged = canons?.some(c => c.status.toLowerCase().includes('converged'));
            if (hasConverged)
                return 'confirms';
            if (canons && canons.length > 0 && !hasConverged)
                return 'conflicts';
            return 'neutral';
        }
        case 'learn': {
            if (context.hasPatterns)
                return 'confirms';
            return 'neutral';
        }
        default:
            return 'neutral';
    }
}
/**
 * Check for multi-signal boost: intent contains action keyword + object reference + temporal marker.
 */
function hasMultipleSignals(normalized, action) {
    // Object references (canon names, dialog types, etc.)
    const objectPatterns = [
        /(?:canon|project|dialog|software|image)\b/,
        /["'][^"']+["']/,
    ];
    // Temporal markers
    const temporalPatterns = [
        /\b(?:now|next|first|then|after|before|today|please)\b/,
    ];
    const hasObject = objectPatterns.some(p => p.test(normalized));
    const hasTemporal = temporalPatterns.some(p => p.test(normalized));
    const hasKeyword = KEYWORD_REGISTER[action].some(k => normalized.includes(k));
    return hasKeyword && hasObject && hasTemporal;
}
//# sourceMappingURL=classifier.js.map