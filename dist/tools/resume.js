import { z } from 'zod';
import { readFileSafe, extractConvergenceStamp, extractProgressStamp, assembleSystemPrompt, createSession, saveSession, assertSafeName, canonDialogPath, } from '../core/index.js';
import { success, error } from '../utils/response.js';
export function registerResume(server, context) {
    server.tool('pantion_resume', 'Resume a DRAFT canon for continued convergence. Returns the existing dialog and convergence instructions.', {
        canon_name: z.string().describe('Name of the canon to resume'),
        project_path: z.string().optional().describe('Project directory (defaults to server project path)'),
    }, async ({ canon_name, project_path }) => {
        try {
            const projectPath = project_path ?? context.projectPath;
            assertSafeName(canon_name);
            const dialogPath = canonDialogPath(projectPath, canon_name);
            const dialog = readFileSafe(dialogPath);
            if (!dialog) {
                return error(`Canon dialog not found: ${dialogPath}`);
            }
            // Extract open questions from stamp
            let openQuestions = [];
            const convergenceStamp = extractConvergenceStamp(dialog);
            if (convergenceStamp) {
                openQuestions = convergenceStamp.openQuestions;
            }
            else {
                const progressStamp = extractProgressStamp(dialog);
                if (progressStamp) {
                    openQuestions = progressStamp.openQuestions;
                }
            }
            // Extract inference policy from stamp (if available)
            const inferencePolicy = convergenceStamp?.inferencePolicy;
            // Assemble resume system prompt
            const convergenceInstructions = assembleSystemPrompt({
                mode: 'resume',
                existingDialog: dialog,
                protocolDir: context.protocolDir,
                inferencePolicy: inferencePolicy === 'strict' ? 'strict' : undefined,
            });
            // Create a new session for the resumed work
            const session = createSession(projectPath, `resume-${canon_name}`, convergenceInstructions);
            session.canonName = canon_name;
            saveSession(projectPath, session);
            return success({
                dialog,
                open_questions: openQuestions,
                session_id: session.id,
                convergence_instructions: convergenceInstructions,
            });
        }
        catch (err) {
            return error(err instanceof Error ? err.message : String(err));
        }
    });
}
//# sourceMappingURL=resume.js.map