/**
 * Feature set — determines which tools and prompts are registered.
 *
 * Tools not in this list are not registered with the MCP server:
 * the client cannot see them, cannot call them, they do not exist.
 *
 * FREE_TOOLS: included in the open source package (@pantion/dialogs)
 * PRO_TOOLS: only available in the full (private) build
 *
 * All resources are always registered (they are read-only and harmless).
 */
/** Core convergence tools — open source, FSL licensed */
export const FREE_TOOLS = [
    'pantion_start',
    'pantion_dialog', // full + synthetic mode
    'pantion_check-convergence',
    'pantion_save-canon',
    'pantion_resume',
    'pantion_approve',
    'pantion_reject',
    'pantion_list-canons',
    'pantion_translate',
    'pantion_version',
];
/** Advanced tools — private build only */
export const PRO_TOOLS = [
    'pantion_build',
    'pantion_check',
    'pantion_amend',
    'pantion_reflect',
    'pantion_feedback',
    'pantion_redialog',
    'pantion_decompose',
    'pantion_reverse',
    'pantion_onboard',
    'pantion_create-dialog',
    'pantion_update',
    'pantion_migrate',
    'pantion_workflow',
    'pantion_diff',
];
const BUILD_EDITION = process.env.PANTION_EDITION ?? 'full';
export const ENABLED_TOOLS = BUILD_EDITION === 'free'
    ? [...FREE_TOOLS]
    : [...FREE_TOOLS, ...PRO_TOOLS];
// --- Internal (not user-facing) ---
// 'pantion_learn',    // background feedback aggregation
// 'pantion_router',   // replaced by pantion_start with dialog: "router"
export function isToolEnabled(name) {
    return ENABLED_TOOLS.includes(name);
}
export function getEdition() {
    return BUILD_EDITION;
}
//# sourceMappingURL=feature-set.js.map