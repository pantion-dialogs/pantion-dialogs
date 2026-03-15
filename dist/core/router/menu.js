/**
 * Menu builder — dynamic context menu for empty-input router calls.
 *
 * Three sections: continue (drafts), create (dialogs), manage (check/list/learn).
 * Max 7 items total, only relevant sections shown.
 */
const MAX_MENU_ITEMS = 7;
/**
 * Build a context-driven menu from project state.
 * Only includes sections with relevant items.
 */
export function buildMenu(context) {
    const sections = [];
    let totalItems = 0;
    // Section 1: continue — drafts and active sessions
    const continueItems = [];
    for (const canon of context.canons) {
        if (canon.status.toLowerCase().includes('draft') && totalItems + continueItems.length < MAX_MENU_ITEMS) {
            const oqCount = canon.openQuestions.length;
            const oqLabel = oqCount > 0 ? `, ${oqCount} open questions` : '';
            continueItems.push({
                label: `Resume "${canon.name}" (DRAFT${oqLabel})`,
                action: 'resume',
                args: { canon_name: canon.name },
                priority: 1,
            });
        }
    }
    // Note: pantion_resume currently accepts canon_name only (not session_id).
    // Session context is therefore handled indirectly via draft canons.
    // Keep sessions available for routing confidence, but do not emit
    // non-executable menu actions.
    if (continueItems.length > 0) {
        sections.push({ id: 'continue', title: 'Continue', items: continueItems });
        totalItems += continueItems.length;
    }
    // Section 2: create — available dialogs
    const createItems = [];
    for (const dialog of context.dialogs) {
        if (totalItems + createItems.length >= MAX_MENU_ITEMS)
            break;
        createItems.push({
            label: dialog.displayName,
            action: 'start',
            args: { dialog: dialog.name },
            reason: dialog.description,
            priority: 3,
        });
    }
    if (createItems.length > 0) {
        sections.push({ id: 'create', title: 'New', items: createItems });
        totalItems += createItems.length;
    }
    // Section 3: manage — check/list/learn (only if canons or patterns exist)
    const hasCanons = context.canons.length > 0;
    const hasPatterns = !!context.patterns;
    if (hasCanons || hasPatterns) {
        const manageItems = [];
        if (hasCanons && totalItems + manageItems.length < MAX_MENU_ITEMS) {
            const firstCanon = context.canons[0];
            manageItems.push({
                label: 'Quality check',
                action: 'check',
                args: firstCanon ? { canon_name: firstCanon.name } : undefined,
                priority: 4,
            });
        }
        if (totalItems + manageItems.length < MAX_MENU_ITEMS) {
            manageItems.push({
                label: 'List canons',
                action: 'list',
                priority: 5,
            });
        }
        if (hasPatterns && totalItems + manageItems.length < MAX_MENU_ITEMS) {
            manageItems.push({
                label: 'Learn from feedback',
                action: 'learn',
                priority: 6,
            });
        }
        if (manageItems.length > 0) {
            sections.push({ id: 'manage', title: 'Manage', items: manageItems });
        }
    }
    return sections;
}
/**
 * Build a short context summary for the response.
 */
export function buildContextSummary(context) {
    const parts = [];
    const canonCount = context.canons.length;
    const draftCount = context.canons.filter(c => c.status.toLowerCase().includes('draft')).length;
    const convergedCount = context.canons.filter(c => c.status.toLowerCase().includes('converged')).length;
    if (canonCount === 0) {
        parts.push('No canons yet');
    }
    else {
        parts.push(`${canonCount} canon${canonCount !== 1 ? 's' : ''}`);
        if (draftCount > 0)
            parts.push(`${draftCount} draft${draftCount !== 1 ? 's' : ''}`);
        if (convergedCount > 0)
            parts.push(`${convergedCount} converged`);
    }
    parts.push(`${context.dialogs.length} dialog${context.dialogs.length !== 1 ? 's' : ''} available`);
    return parts.join(', ');
}
//# sourceMappingURL=menu.js.map