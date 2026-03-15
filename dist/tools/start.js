import { z } from 'zod';
import { getDialog, assembleSystemPrompt, createSession, saveSession, getSoul, } from '../core/index.js';
import { success, error } from '../utils/response.js';
export function registerStart(server, context) {
    server.tool('pantion_start', 'Open Pantion. Shows a routing dialog that guides the user to the right action (new dialog, continue, amend, etc.). Always call this when the user invokes Pantion.', {
        project_path: z.string().optional().describe('Project directory (defaults to server project path)'),
        user_message: z.string().optional().describe('Optional user message for the router to interpret directly'),
    }, async ({ project_path, user_message }) => {
        try {
            const projectPath = project_path ?? context.projectPath;
            // Always load the router dialog
            const routerDialog = getDialog('router', projectPath, context.dialogsDir);
            if (!routerDialog) {
                return error('Router dialog not found. Pantion may not be installed correctly.');
            }
            const soulObj = getSoul('default', projectPath, context.soulsDir);
            const convergenceInstructions = assembleSystemPrompt({
                mode: 'start',
                dialogRules: routerDialog.convergenceRules,
                soulRules: soulObj?.rules,
                protocolDir: context.protocolDir,
            });
            const sessionName = `session-${Date.now()}`;
            const session = createSession(projectPath, sessionName, convergenceInstructions);
            session.promptMode = 'start';
            session.dialog = 'router';
            if (soulObj)
                session.soul = soulObj.manifest.name;
            saveSession(projectPath, session);
            return success({
                session_id: session.id,
                dialog: {
                    name: 'router',
                    displayName: 'Pantion Router',
                },
                convergence_instructions: convergenceInstructions,
                ...(user_message ? { user_message } : {}),
            });
        }
        catch (err) {
            return error(err instanceof Error ? err.message : String(err));
        }
    });
}
//# sourceMappingURL=start.js.map