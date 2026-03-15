/**
 * Centralized canon path construction.
 * All canon file paths flow through here — no inline resolve() in tools.
 */
export declare function canonNameDir(projectPath: string, canonName: string): string;
export declare function canonIndexPath(projectPath: string): string;
export declare function canonDialogPath(projectPath: string, canonName: string): string;
export declare function canonSummaryPath(projectPath: string, canonName: string): string;
export declare function canonTraceabilityPath(projectPath: string, canonName: string): string;
export declare function canonImplementationsDir(projectPath: string, canonName: string): string;
export declare function canonSpecDir(projectPath: string, canonName: string): string;
export declare function canonPromptPath(projectPath: string, canonName: string): string;
export declare function canonBriefPath(projectPath: string, canonName: string): string;
export declare function canonFeedbackPath(projectPath: string, canonName: string): string;
/**
 * Dynamic dialog canon paths (for dynamic-dialogs/{dialogName}/canon/).
 */
export declare function dialogCanonDir(projectPath: string, dialogName: string): string;
export declare function dialogCanonDialogPath(projectPath: string, dialogName: string): string;
export declare function dialogCanonSummaryPath(projectPath: string, dialogName: string): string;
//# sourceMappingURL=canon-paths.d.ts.map