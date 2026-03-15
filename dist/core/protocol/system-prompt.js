import { loadProtocolCore, loadProtocolCommand, loadProtocolCoreSection, loadProtocolCommandPhase } from './loader.js';
import { stampDateTime } from '../utils/datetime.js';
const MODE_LABELS = {
    start: 'DIALOG',
    resume: 'RESUME',
    quick: 'DIALOG',
    dialog: 'SYNTHETIC',
    synthetic: 'SYNTHETIC',
    deep: 'DEEP',
    amend: 'AMEND',
    check: 'CHECK',
    translate: 'TRANSLATE',
    reconverge: 'REDIALOG',
    decompose: 'DECOMPOSE',
    reverse: 'REVERSE',
    onboard: 'ONBOARD',
    update: 'UPDATE',
    migrate: 'MIGRATE',
};
function getModeLabel(mode) {
    return MODE_LABELS[mode] ?? mode.toUpperCase();
}
/**
 * Assemble the full system prompt from protocol core + command + skill rules.
 * This is the bridge between the protocol .md files and the LLM.
 */
export function assembleSystemPrompt(options) {
    const parts = [];
    // 1. Core protocol knowledge (advanced sections only for modes that need them)
    const advancedModes = ['reconverge', 'decompose', 'reverse', 'create-dialog', 'redialog'];
    const needsAdvanced = advancedModes.includes(options.mode);
    parts.push(loadProtocolCore(options.protocolDir, { includeAdvanced: needsAdvanced }));
    // 2. Mode-specific command protocol
    parts.push('\n---\n');
    const commandName = options.mode === 'reconverge' ? 'redialog'
        : options.mode === 'synthetic' ? 'synthetic'
            : options.mode === 'deep' ? 'start'
                : options.mode;
    parts.push(loadProtocolCommand(commandName, options.protocolDir));
    // Deep mode: append ADVISOR instructions so the client-LLM knows the advisor role
    if (options.mode === 'deep') {
        parts.push('\n---\n');
        parts.push('# ADVISOR Role — Available on demand\n\n');
        parts.push(loadProtocolCommand('advisor', options.protocolDir));
    }
    // 3. Dialog-specific convergence rules (if a dialog is active)
    if (options.dialogRules) {
        parts.push('\n---\n');
        parts.push('# Active Dialog — Additional Convergence Rules\n\n');
        parts.push(options.dialogRules);
    }
    // 4. Soul interaction style (if configured)
    if (options.soulRules) {
        parts.push('\n---\n');
        parts.push('# Active Soul — Interaction Style\n\n');
        parts.push(options.soulRules);
    }
    // 5. Visual identity — show prompt with every response during active dialog
    // Skip if the dialog provides its own Visual Identity section (e.g. router)
    const dialogHasOwnVisualIdentity = options.dialogRules?.includes('## Visual Identity');
    if (!dialogHasOwnVisualIdentity) {
        const modeLabel = getModeLabel(options.mode);
        parts.push('\n---\n');
        parts.push('# Visual Identity\n\n');
        parts.push(`You are operating inside an active Pantion dialog. To make this visually clear to the user, prefix EVERY response with this prompt:\n\n`);
        parts.push(`\`\`\`text\n        (o<\nPANTION <_)  ${modeLabel}\n\`\`\`\n\n`);
        parts.push('Show the prompt first, then your response. No exceptions — every message during the dialog gets the prompt.\n\n');
        parts.push('When the dialog ends (convergence complete, canon saved, or user stops), show this exit banner as your final Pantion output:\n\n');
        parts.push('```\n        (o<\n_______ <_)\n```\n');
    }
    // 6. Context
    parts.push('\n---\n');
    parts.push('# Session Context\n\n');
    if (options.canonName) {
        parts.push(`Canon name: ${options.canonName}\n`);
    }
    if (options.userLanguage) {
        parts.push(`User language: ${options.userLanguage}. Respond in this language.\n`);
    }
    parts.push(`Date: ${stampDateTime()}\n`);
    // 7. Inference Policy enforcement (dynamic based on stamp value)
    if (options.inferencePolicy === 'strict') {
        parts.push('\n---\n');
        parts.push('# Inference Policy: STRICT\n\n');
        parts.push('This canon operates under STRICT inference policy. You MUST:\n');
        parts.push('- On ANY ambiguity: STOP and formulate OPEN QUESTIONS. Do not guess.\n');
        parts.push('- Make NO implicit assumptions — every decision must trace to an explicit dialog turn.\n');
        parts.push('- Do NOT choose between alternatives — present them as open questions for the user.\n');
        parts.push('- If a concept has multiple interpretations, ask which one the user means.\n');
        parts.push('- Treat FLEX zones as "undecided", not as "your choice".\n');
    }
    // 8. For resume/reconverge/decompose: include the existing dialog
    if (options.existingDialog) {
        parts.push('\n---\n');
        if (options.mode === 'reconverge') {
            parts.push('# Existing Dialog (reconvergence context)\n\n');
            parts.push('The following dialog has already been conducted and converged. Analyze it for gaps — questions that should have been asked, assumptions that were never made explicit, edge cases not explored. Do NOT continue the dialog yet. First produce a gap analysis, then conduct a targeted supplementary dialog for the gaps the user selects.\n\n');
        }
        else if (options.mode === 'decompose') {
            parts.push('# Existing Dialog (decomposition context)\n\n');
            parts.push('The following dialog has already been conducted and converged as a standalone canon. It is now being decomposed into subsystems. Use the existing dialog as a starting point — summarize what you already know and focus on decomposition.\n\n');
        }
        else {
            parts.push('# Existing Dialog (resume context)\n\n');
            parts.push('The following dialog has already been conducted. Continue from where it left off.\n\n');
        }
        parts.push(options.existingDialog);
    }
    return parts.join('\n');
}
/**
 * Assemble deferred protocol content for injection into tool responses.
 * This content was removed from the initial system prompt to reduce token cost
 * and is loaded at the natural moment it's needed:
 * - 'stamps': core-stamps + command-stamps (for check-convergence)
 * - 'save': core-save + command-stamps (for save-canon)
 * - 'post': command-post (for translate)
 */
export function assembleDeferredPrompt(options) {
    const parts = [];
    parts.push('# Deferred Protocol Instructions\n');
    parts.push('The following protocol sections are relevant for this phase of the dialog.\n\n');
    if (options.phase === 'stamps') {
        // Check-convergence needs stamp formats from both core and command
        parts.push(loadProtocolCoreSection(options.protocolDir, 'stamps'));
        parts.push('\n---\n');
        parts.push(loadProtocolCommandPhase(options.commandName, 'stamps', options.protocolDir));
    }
    else if (options.phase === 'save') {
        // Save-canon needs canon structure + saving rules
        parts.push(loadProtocolCoreSection(options.protocolDir, 'save'));
        parts.push('\n---\n');
        parts.push(loadProtocolCommandPhase(options.commandName, 'stamps', options.protocolDir));
    }
    else if (options.phase === 'post') {
        // Translate needs post-convergence rules
        parts.push(loadProtocolCommandPhase(options.commandName, 'post', options.protocolDir));
    }
    return parts.join('\n');
}
//# sourceMappingURL=system-prompt.js.map