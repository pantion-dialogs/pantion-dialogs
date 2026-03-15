import { isToolEnabled } from '../feature-set.js';
/**
 * Tool registry: maps tool names to their module paths.
 * Modules are loaded dynamically so that the free edition (which strips
 * pro tool files from dist/) does not crash on missing imports.
 */
const TOOL_MODULES = [
    ['pantion_start', './start.js'],
    ['pantion_dialog', './dialog.js'],
    ['pantion_check-convergence', './check-convergence.js'],
    ['pantion_save-canon', './save-canon.js'],
    ['pantion_translate', './translate.js'],
    ['pantion_check', './check.js'],
    ['pantion_amend', './amend.js'],
    ['pantion_resume', './resume.js'],
    ['pantion_redialog', './reconverge.js'],
    ['pantion_list-canons', './list-canons.js'],
    ['pantion_create-dialog', './create-dialog.js'],
    ['pantion_decompose', './decompose.js'],
    ['pantion_reverse', './reverse.js'],
    ['pantion_onboard', './onboard.js'],
    ['pantion_update', './update.js'],
    ['pantion_migrate', './migrate.js'],
    ['pantion_approve', './approve.js'],
    ['pantion_reject', './reject.js'],
    ['pantion_reflect', './reflect.js'],
    ['pantion_feedback', './feedback.js'],
    ['pantion_learn', './learn.js'],
    ['pantion_router', './router.js'],
    ['pantion_build', './build.js'],
    ['pantion_workflow', './workflow.js'],
    ['pantion_diff', './diff.js'],
    ['pantion_version', './version.js'],
];
export const TOOL_REGISTRY_NAMES = TOOL_MODULES.map(([name]) => name);
export async function registerTools(server, context) {
    for (const [name, modulePath] of TOOL_MODULES) {
        if (!isToolEnabled(name))
            continue;
        try {
            const mod = await import(modulePath);
            // Each tool module exports exactly one register function
            const registerFn = Object.values(mod).find((v) => typeof v === 'function');
            if (registerFn) {
                registerFn(server, context);
            }
        }
        catch {
            // Module not available (e.g. pro tool in free edition) — skip silently
        }
    }
}
//# sourceMappingURL=index.js.map