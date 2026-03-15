export interface SystemPromptOptions {
    mode: 'start' | 'resume' | 'quick' | 'dialog' | 'synthetic' | 'deep' | 'amend' | 'check' | 'translate' | 'reconverge' | 'decompose' | 'reverse' | 'onboard' | 'update' | 'migrate';
    dialogRules?: string;
    soulRules?: string;
    canonName?: string;
    existingDialog?: string;
    userLanguage?: string;
    protocolDir: string;
    inferencePolicy?: 'conservative' | 'strict';
}
/**
 * Assemble the full system prompt from protocol core + command + skill rules.
 * This is the bridge between the protocol .md files and the LLM.
 */
export declare function assembleSystemPrompt(options: SystemPromptOptions): string;
export interface DeferredPromptOptions {
    /** Which deferred phase to load */
    phase: 'stamps' | 'save' | 'post';
    /** The command name (e.g. 'start', 'dialog') */
    commandName: string;
    /** Path to the protocol directory */
    protocolDir: string;
}
/**
 * Assemble deferred protocol content for injection into tool responses.
 * This content was removed from the initial system prompt to reduce token cost
 * and is loaded at the natural moment it's needed:
 * - 'stamps': core-stamps + command-stamps (for check-convergence)
 * - 'save': core-save + command-stamps (for save-canon)
 * - 'post': command-post (for translate)
 */
export declare function assembleDeferredPrompt(options: DeferredPromptOptions): string;
//# sourceMappingURL=system-prompt.d.ts.map