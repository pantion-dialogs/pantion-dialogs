import { z } from 'zod';
import { isToolEnabled } from '../feature-set.js';
import { assembleSystemPrompt, getDialog, getSoul, } from '../core/index.js';
export function registerConvergencePrompts(server, context) {
    // Prompt: pantion_start — always opens the router
    if (isToolEnabled('pantion_start')) {
        server.prompt('pantion_start', 'Open Pantion. Shows the router dialog that guides the user to the right action.', {}, () => {
            const routerDialog = getDialog('router', context.projectPath, context.dialogsDir);
            const soulObj = getSoul('default', context.projectPath, context.soulsDir);
            const systemPrompt = assembleSystemPrompt({
                mode: 'start',
                dialogRules: routerDialog?.convergenceRules,
                soulRules: soulObj?.rules,
                protocolDir: context.protocolDir,
            });
            return {
                messages: [{
                        role: 'user',
                        content: {
                            type: 'text',
                            text: systemPrompt,
                        },
                    }],
            };
        });
    }
    // Prompt: resume a DRAFT canon
    if (isToolEnabled('pantion_resume')) {
        server.prompt('pantion_resume', 'Resume a DRAFT canon for continued convergence. Returns the existing dialog and convergence instructions.', {
            canon_name: z.string().optional().describe('Name of the DRAFT canon to resume'),
        }, ({ canon_name }) => ({
            messages: [{
                    role: 'user',
                    content: {
                        type: 'text',
                        text: canon_name
                            ? `Resume converging on the DRAFT canon "${canon_name}". Call pantion_resume with canon_name="${canon_name}" to load the existing dialog and convergence instructions, then continue the convergence dialog with the user.`
                            : `The user wants to resume a DRAFT canon. Use pantion_list-canons to show available canons, identify DRAFT canons, then call pantion_resume with the chosen canon_name to continue convergence.`,
                    },
                }],
        }));
    }
    // Prompt: redialog (re-evaluate converged canon with better model)
    if (isToolEnabled('pantion_redialog')) {
        server.prompt('pantion_redialog', 'Re-evaluate an existing converged canon with a better model. Conducts gap analysis and supplementary convergence.', {
            existing_dialog: z.string().describe('The existing converged dialog to re-evaluate'),
            canon_name: z.string().optional().describe('Name of the canon being reconverged'),
        }, ({ existing_dialog, canon_name }) => {
            const systemPrompt = assembleSystemPrompt({
                mode: 'reconverge',
                existingDialog: existing_dialog,
                canonName: canon_name,
                protocolDir: context.protocolDir,
            });
            return {
                messages: [{
                        role: 'user',
                        content: {
                            type: 'text',
                            text: systemPrompt,
                        },
                    }],
            };
        });
    }
}
//# sourceMappingURL=convergence-prompts.js.map