import { z } from 'zod';
import { validateConvergence, loadSession, saveSession, assembleDeferredPrompt, } from '../core/index.js';
import { success, error } from '../utils/response.js';
const messageSchema = z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
});
export function registerCheckConvergence(server, context) {
    server.tool('pantion_check-convergence', 'Validate whether a dialog has structurally converged. Checks for DIALOGSPEC STAMP, required fields, and open questions.', {
        session_id: z.string().describe('Session ID from pantion_start'),
        dialog: z.array(messageSchema).describe('The full dialog to validate'),
    }, async ({ session_id, dialog }) => {
        try {
            const messages = dialog.map((m) => ({ role: m.role, content: m.content }));
            const result = validateConvergence(messages);
            // Save dialog to session for recovery
            const session = loadSession(context.projectPath, session_id);
            if (session) {
                session.messages = messages;
                if (result.stamp) {
                    session.stampRaw = result.stamp.raw;
                    session.status = result.status === 'converged' ? 'converged' : 'draft';
                }
                saveSession(context.projectPath, session);
            }
            // Load deferred stamp instructions so the LLM knows the stamp format
            let deferredInstructions;
            try {
                const commandName = session?.promptMode ?? 'start';
                deferredInstructions = assembleDeferredPrompt({
                    phase: 'stamps',
                    commandName,
                    protocolDir: context.protocolDir,
                });
            }
            catch {
                // Deferred loading is best-effort — check-convergence must never break
            }
            // Load ADVISOR instructions for convergence check (all modes)
            let advisorInstructions;
            try {
                const { loadProtocolCommand } = await import('../core/protocol/loader.js');
                advisorInstructions = loadProtocolCommand('advisor', context.protocolDir);
            }
            catch {
                // Advisor loading is best-effort — check-convergence must never break
            }
            return success({
                status: result.status,
                valid: result.valid,
                open_questions: result.openQuestions.length > 0 ? result.openQuestions : undefined,
                stamp: result.stamp ? {
                    type: result.stamp.type,
                    date: result.stamp.date,
                    model: result.stamp.model,
                    canonType: result.stamp.canonType,
                    openQuestions: result.stamp.openQuestions,
                    inferencePolicy: result.stamp.inferencePolicy,
                    stabilityZones: result.stamp.stabilityZones,
                    flexZones: result.stamp.flexZones,
                } : undefined,
                issues: result.issues,
                categories: result.categories,
                score: result.score,
                ...(deferredInstructions ? { deferred_instructions: deferredInstructions } : {}),
                ...(advisorInstructions ? {
                    advisor_instructions: advisorInstructions,
                    advisor_note: 'Include an ADVISOR convergence assessment in your response. The ADVISOR evaluates: unresolved ambiguity, decision conflicts, hidden assumptions, missing convergence elements, unclear HARD/FLEX classification. Produce a convergence score with qualitative verdict + 4 quantitative dimensions.',
                } : {}),
            });
        }
        catch (err) {
            return error(err instanceof Error ? err.message : String(err));
        }
    });
}
//# sourceMappingURL=check-convergence.js.map