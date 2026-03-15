/**
 * Next-actions engine — follow-up action suggestions.
 *
 * Static successors (baseline) + context-aware ranking.
 * Only valid, executable actions. Max 3 items.
 */
import { isToolEnabled } from '../../feature-set.js';
import { ACTION_TO_TOOL } from './classifier.js';
const MAX_NEXT_ACTIONS = 3;
/** Baseline follow-up actions per flow */
export const STATIC_SUCCESSORS = {
    start: ['check'],
    resume: ['check'],
    amend: ['check', 'approve'],
    check: ['approve', 'amend'],
    approve: ['translate'],
    translate: ['list'],
    reflect: ['feedback', 'amend'],
    feedback: ['learn'],
    learn: ['start', 'list'],
    list: ['start', 'check'],
};
/** Fallback mapping for disabled tools — all non-mutative */
export const TOOL_FALLBACKS = {
    reflect: 'list',
    feedback: 'list',
    learn: 'list',
    translate: 'check',
};
/**
 * Build up to 3 next actions based on static successors + context ranking.
 */
export function buildNextActions(action, context) {
    const successors = STATIC_SUCCESSORS[action] ?? [];
    const candidates = [];
    for (const next of successors) {
        const toolName = ACTION_TO_TOOL[next];
        if (!toolName || !isToolEnabled(toolName))
            continue;
        // Status-gated: skip actions that don't make sense in current context
        if (!isActionValid(next, context))
            continue;
        candidates.push({
            label: actionLabel(next),
            action: next,
            args: argsForAction(next, context),
            reason: actionReason(next, context),
            priority: actionPriority(next, context),
        });
    }
    // Sort by priority (lower = higher priority) and take max 3
    candidates.sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99));
    return candidates.slice(0, MAX_NEXT_ACTIONS);
}
function argsForAction(action, context) {
    switch (action) {
        case 'start': {
            const firstDialog = context.dialogs[0];
            return firstDialog ? { dialog: firstDialog.name } : undefined;
        }
        case 'resume': {
            const draft = context.canons.find((c) => c.status.toLowerCase().includes('draft'));
            return draft ? { canon_name: draft.name } : undefined;
        }
        case 'check':
        case 'approve':
        case 'translate':
        case 'amend':
        case 'reflect':
        case 'feedback': {
            const firstCanon = context.canons[0];
            return firstCanon ? { canon_name: firstCanon.name } : undefined;
        }
        default:
            return undefined;
    }
}
function isActionValid(action, context) {
    const { canons } = context;
    switch (action) {
        case 'approve': {
            // Only valid if there are converged canons with PENDING stamp
            return canons.some(c => c.status.toLowerCase().includes('converged') && c.humanStampStatus === 'PENDING');
        }
        case 'translate': {
            // Only valid if there are approved canons
            return canons.some(c => c.humanStampStatus === 'APPROVED' || c.humanStampStatus === 'AUTO-APPROVED');
        }
        case 'amend': {
            // Only valid if there are converged canons
            return canons.some(c => c.status.toLowerCase().includes('converged'));
        }
        case 'check': {
            return canons.length > 0;
        }
        case 'resume': {
            return canons.some(c => c.status.toLowerCase().includes('draft'));
        }
        default:
            return true;
    }
}
function actionLabel(action) {
    const labels = {
        start: 'Start new dialog',
        resume: 'Resume draft',
        amend: 'Amend canon',
        check: 'Run quality check',
        approve: 'Approve canon',
        translate: 'Generate spec files',
        reflect: 'Reality check',
        feedback: 'Submit feedback',
        learn: 'Learn from feedback',
        list: 'List canons',
    };
    return labels[action];
}
function actionReason(action, context) {
    switch (action) {
        case 'approve': {
            const pending = context.canons.filter(c => c.status.toLowerCase().includes('converged') && c.humanStampStatus === 'PENDING');
            return `${pending.length} canon${pending.length !== 1 ? 's' : ''} awaiting approval`;
        }
        case 'check':
            return 'Verify canon quality before proceeding';
        case 'translate':
            return 'Generate project spec files from approved canon';
        case 'amend':
            return 'Modify existing converged canon';
        case 'start':
            return 'Begin a new convergence dialog';
        case 'list':
            return 'View project status';
        default:
            return '';
    }
}
function actionPriority(action, context) {
    // 1 = must-next, 2 = risk-reduction, 3 = momentum
    switch (action) {
        case 'approve': {
            const hasPending = context.canons.some(c => c.status.toLowerCase().includes('converged') && c.humanStampStatus === 'PENDING');
            return hasPending ? 1 : 3;
        }
        case 'check':
            return 2;
        case 'translate':
            return 1;
        default:
            return 3;
    }
}
//# sourceMappingURL=next-actions.js.map