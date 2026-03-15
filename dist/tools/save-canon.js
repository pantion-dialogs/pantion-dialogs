import { z } from 'zod';
import { loadSession, saveSession, writeDialogFile, writeSummaryFile, updateCanonIndex, writeDialogCanonFile, writeDialogSummaryFile, extractConvergenceStamp, extractProgressStamp, assembleDeferredPrompt, stampDateTime, } from '../core/index.js';
import { success, error } from '../utils/response.js';
const messageSchema = z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
});
export function registerSaveCanon(server, context) {
    server.tool('pantion_save-canon', 'Write canon files to disk after convergence. Writes the dialog file (THE CANON) and optionally a summary.', {
        session_id: z.string().describe('Session ID from pantion_start'),
        dialog: z.array(messageSchema).describe('The full converged dialog'),
        name: z.string().describe('Canon name (e.g. "my-project")'),
        summary: z.string().optional().describe('Client-generated summary content'),
        dialog_name: z.string().optional().describe('Target dialog name — writes to dynamic-dialogs/{name}/canon/ instead of canon/'),
        mode: z.enum(['dialog', 'full', 'synthetic', 'deep']).optional().describe('Convergence mode used. Dialog and synthetic modes auto-approve the canon. Deep mode uses full approval flow.'),
        check_result: z.string().optional().describe('Last pantion_check result summary (e.g. "PASS (12/13)")'),
    }, async ({ session_id, dialog, name, summary, dialog_name, mode, check_result }) => {
        try {
            const projectPath = context.projectPath;
            const date = stampDateTime();
            const messages = dialog.map((m) => ({ role: m.role, content: m.content }));
            // Check for convergence stamp or progress stamp
            const fullText = dialog.map((m) => m.content).join('\n');
            const stamp = extractConvergenceStamp(fullText);
            const progressStamp = !stamp ? extractProgressStamp(fullText) : null;
            const isDraft = !!progressStamp;
            if (!stamp && !progressStamp) {
                return error('Dialog does not contain a DIALOGSPEC STAMP or PROGRESS STAMP. A stamp is required to save.');
            }
            // Update session
            const session = loadSession(projectPath, session_id);
            if (session) {
                session.messages = messages;
                session.canonName = name;
                session.status = isDraft ? 'draft' : 'converged';
                if (dialog_name) {
                    session.canonType = 'dialog';
                    session.targetDialogName = dialog_name;
                }
                saveSession(projectPath, session);
            }
            // Build a session-like object for the canon writer
            const sessionForWriter = session ?? {
                id: session_id,
                name,
                status: 'converged',
                messages,
                systemPrompt: '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                canonName: name,
            };
            // Build canon metadata from session state + parameters
            const metadata = {};
            if (session?.dialog)
                metadata.dialog = session.dialog;
            if (session?.soul)
                metadata.soul = session.soul;
            if (mode)
                metadata.mode = mode;
            if (check_result)
                metadata.checkResult = check_result;
            const hasMetadata = Object.keys(metadata).length > 0;
            let canonPath;
            let summaryPath;
            if (dialog_name) {
                // Dialog canon → dynamic-dialogs/{dialog_name}/canon/
                canonPath = writeDialogCanonFile(sessionForWriter, dialog_name, date, projectPath, mode, hasMetadata ? metadata : undefined);
                if (summary) {
                    summaryPath = writeDialogSummaryFile(dialog_name, date, summary, projectPath);
                }
                // Dialog canons do NOT go in the project canon index
            }
            else {
                // Project canon → canon/ (existing behavior)
                canonPath = writeDialogFile(sessionForWriter, name, date, projectPath, mode, hasMetadata ? metadata : undefined);
                if (summary) {
                    summaryPath = writeSummaryFile(name, date, summary, projectPath);
                }
                updateCanonIndex(projectPath);
            }
            // Load deferred save instructions (only for converged canons, not DRAFT)
            let deferredInstructions;
            if (!isDraft) {
                try {
                    const commandName = session?.promptMode ?? (mode === 'dialog' || mode === 'synthetic' ? 'dialog' : 'start');
                    deferredInstructions = assembleDeferredPrompt({
                        phase: 'save',
                        commandName,
                        protocolDir: context.protocolDir,
                    });
                }
                catch {
                    // Deferred loading is best-effort — save-canon must never break
                }
            }
            return success({
                canon_path: canonPath,
                summary_path: summaryPath,
                index_updated: !dialog_name,
                dialog_name: dialog_name ?? undefined,
                stamp_type: isDraft ? 'draft' : stamp.type,
                stamp_model: isDraft ? undefined : stamp.model,
                is_draft: isDraft,
                ...(deferredInstructions ? { deferred_instructions: deferredInstructions } : {}),
            });
        }
        catch (err) {
            return error(err instanceof Error ? err.message : String(err));
        }
    });
}
//# sourceMappingURL=save-canon.js.map