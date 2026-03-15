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
export declare const FREE_TOOLS: readonly string[];
/** Advanced tools — private build only */
export declare const PRO_TOOLS: readonly string[];
/** Build edition: 'full' includes all tools, 'free' includes only FREE_TOOLS */
export type Edition = 'full' | 'free';
export declare const ENABLED_TOOLS: readonly string[];
export declare function isToolEnabled(name: string): boolean;
export declare function getEdition(): Edition;
//# sourceMappingURL=feature-set.d.ts.map