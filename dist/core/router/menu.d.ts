/**
 * Menu builder — dynamic context menu for empty-input router calls.
 *
 * Three sections: continue (drafts), create (dialogs), manage (check/list/learn).
 * Max 7 items total, only relevant sections shown.
 */
import type { MenuSection } from './types.js';
import type { RouterContext } from './context.js';
/**
 * Build a context-driven menu from project state.
 * Only includes sections with relevant items.
 */
export declare function buildMenu(context: RouterContext): MenuSection[];
/**
 * Build a short context summary for the response.
 */
export declare function buildContextSummary(context: RouterContext): string;
//# sourceMappingURL=menu.d.ts.map