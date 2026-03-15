/**
 * Context collector — layered context collection for the router.
 *
 * Always: readCanonIndex + listDialogs
 * Conditional: readProjectPatterns (learn/feedback/start), listSessions (resume or low confidence)
 */
import { readCanonIndex } from '../canon/index-manager.js';
import { listDialogs } from '../dialog/registry.js';
import { listSessions } from '../session/manager.js';
import { readProjectPatterns } from '../feedback/store.js';
function toDialogInfo(dialog) {
    return {
        name: dialog.manifest.name,
        displayName: dialog.manifest.displayName,
        description: dialog.manifest.description,
    };
}
/**
 * Collect context for routing decisions.
 *
 * Layer 1 (always): canons + dialogs
 * Layer 2 (conditional): patterns (learn/feedback/start) + sessions (resume or low confidence)
 */
export function collectContext(projectPath, dialogsDir, intent, confidence) {
    const warnings = [];
    // Layer 1: always
    let canons = [];
    let dialogs = [];
    try {
        canons = readCanonIndex(projectPath);
    }
    catch {
        warnings.push('Failed to read canon index');
    }
    try {
        dialogs = listDialogs(projectPath, dialogsDir).map(toDialogInfo);
    }
    catch {
        warnings.push('Failed to list dialogs');
    }
    const ctx = { canons, dialogs, warnings };
    // Layer 2: conditional
    const needsPatterns = intent === 'learn' || intent === 'feedback' || intent === 'start';
    const needsSessions = intent === 'resume' || (confidence !== undefined && confidence < 0.75);
    if (needsPatterns) {
        try {
            const patterns = readProjectPatterns(projectPath);
            if (patterns)
                ctx.patterns = patterns;
        }
        catch {
            warnings.push('Failed to read project patterns');
        }
    }
    if (needsSessions) {
        try {
            ctx.sessions = listSessions(projectPath);
        }
        catch {
            warnings.push('Failed to list sessions');
        }
    }
    return ctx;
}
//# sourceMappingURL=context.js.map