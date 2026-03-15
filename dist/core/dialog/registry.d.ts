import type { Dialog } from '../types.js';
/**
 * List all available dialogs (deduplicated by name, project > user > bundled).
 */
export declare function listDialogs(projectPath: string, dialogsDir?: string): Dialog[];
/**
 * Get a specific dialog by name.
 */
export declare function getDialog(name: string, projectPath: string, dialogsDir?: string): Dialog | null;
//# sourceMappingURL=registry.d.ts.map