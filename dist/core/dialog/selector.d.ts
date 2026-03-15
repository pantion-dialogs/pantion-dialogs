import type { Dialog } from '../types.js';
export interface DialogSelection {
    dialog: Dialog;
    matchedKeywords: string[];
}
/**
 * Auto-select a dialog based on the user's first message.
 * Matches against dialog keywords. Returns the dialog and which keywords matched.
 */
export declare function autoSelectDialog(userMessage: string, projectPath: string, dialogsDir?: string): DialogSelection | null;
//# sourceMappingURL=selector.d.ts.map