import { z } from 'zod';
import { autoSelectDialog, listDialogs, getDialog, assembleSystemPrompt, createSession, saveSession, getSoul, } from '../core/index.js';
import { getRelevantSuggestions } from '../core/feedback/suggestions.js';
import { success, error } from '../utils/response.js';
export function registerDialog(server, context) {
    server.tool('pantion_dialog', 'Start a Pantion convergence dialog. Asks targeted questions until the user\'s intent is fully clear. Returns convergence instructions for the client LLM.', {
        project_path: z.string().optional().describe('Project directory (defaults to server project path)'),
        dialog: z.string().optional().describe('Explicit dialog name to use (e.g. "software", "image")'),
        domain: z.string().optional().describe('Domain hint for dialog auto-selection (e.g. "software", "image")'),
        user_message: z.string().optional().describe('The user\'s original message — used for dialog auto-selection via keyword matching'),
        soul: z.string().optional().describe('Interaction style (e.g. "default", "beginner", "young")'),
        mode: z.enum(['dialog', 'full', 'synthetic', 'deep']).default('full').describe('Convergence mode: "full" (default, complete protocol), "dialog" (alias for synthetic), "synthetic" (automatic — Pantion generates the dialog), or "deep" (full + ADVISOR on demand)'),
    }, async ({ project_path, dialog: dialogName, domain, user_message, soul, mode }) => {
        try {
            const projectPath = project_path ?? context.projectPath;
            // Select dialog: explicit name > domain hint > user message keywords
            let selection = dialogName
                ? (() => {
                    const s = getDialog(dialogName, projectPath, context.dialogsDir);
                    return s ? { dialog: s, matchedKeywords: [dialogName] } : null;
                })()
                : null;
            if (!selection) {
                const selectionInput = domain ?? user_message;
                selection = selectionInput
                    ? autoSelectDialog(selectionInput, projectPath, context.dialogsDir)
                    : null;
            }
            // If no dialog matched, list available dialogs for the client to present
            const availableDialogs = !selection
                ? listDialogs(projectPath, context.dialogsDir)
                    .filter((s) => s.manifest.name !== 'dialog-builder')
                    .filter((s) => s.manifest.name !== 'router')
                    .map((s) => ({ name: s.manifest.name, displayName: s.manifest.displayName, description: s.manifest.description }))
                : undefined;
            // Load soul (default if not specified)
            const soulObj = soul
                ? getSoul(soul, projectPath, context.soulsDir)
                : getSoul('default', projectPath, context.soulsDir);
            // Assemble convergence instructions (system prompt for client LLM)
            // 'dialog' is a backward-compat alias for 'synthetic'
            const effectiveMode = mode === 'dialog' ? 'synthetic' : mode;
            const promptMode = effectiveMode === 'full' ? 'start'
                : effectiveMode === 'deep' ? 'deep'
                    : 'synthetic';
            const convergenceInstructions = assembleSystemPrompt({
                mode: promptMode,
                dialogRules: selection?.dialog.convergenceRules,
                soulRules: soulObj?.rules,
                protocolDir: context.protocolDir,
            });
            // Create a session
            const sessionName = `session-${Date.now()}`;
            const session = createSession(projectPath, sessionName, convergenceInstructions);
            session.promptMode = promptMode;
            if (selection)
                session.dialog = selection.dialog.manifest.name;
            if (soulObj)
                session.soul = soulObj.manifest.name;
            saveSession(projectPath, session);
            const firstQuestion = selection
                ? `I've selected the **${selection.dialog.manifest.displayName}** dialog (matched: ${selection.matchedKeywords.join(', ')}). What would you like to build?`
                : availableDialogs && availableDialogs.length > 0
                    ? `Welcome to Pantion. Available domains: ${availableDialogs.map((s) => `**${s.displayName}**`).join(', ')}. Which fits best, or shall I proceed with a general convergence?`
                    : 'Welcome to Pantion. Describe in your own words what you want to build. Be as free as you like — I will ask the right questions to turn your idea into an unambiguous intent description.';
            // --- Feedback suggestions (graceful — never breaks start) ---
            let feedbackSuggestions;
            try {
                const feedbackDomain = selection?.dialog.manifest.name ?? domain ?? undefined;
                const feedbackKeywords = selection?.matchedKeywords;
                const suggestions = getRelevantSuggestions(projectPath, feedbackDomain, feedbackKeywords);
                if (suggestions.length > 0)
                    feedbackSuggestions = suggestions;
            }
            catch {
                // Feedback suggestions are best-effort — start must never break
            }
            return success({
                session_id: session.id,
                mode,
                dialog: selection ? {
                    name: selection.dialog.manifest.name,
                    displayName: selection.dialog.manifest.displayName,
                    matchedKeywords: selection.matchedKeywords,
                } : null,
                available_dialogs: availableDialogs?.length ? availableDialogs : undefined,
                soul: soulObj ? {
                    name: soulObj.manifest.name,
                    displayName: soulObj.manifest.displayName,
                } : null,
                convergence_instructions: convergenceInstructions,
                first_question: firstQuestion,
                ...(feedbackSuggestions ? { feedback_suggestions: feedbackSuggestions } : {}),
            });
        }
        catch (err) {
            return error(err instanceof Error ? err.message : String(err));
        }
    });
}
//# sourceMappingURL=dialog.js.map