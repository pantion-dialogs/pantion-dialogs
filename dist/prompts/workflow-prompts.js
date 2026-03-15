import { z } from 'zod';
import { isToolEnabled } from '../feature-set.js';
/**
 * Action-oriented prompts that instruct the client LLM to call the corresponding tool.
 * These are exposed as slash commands in Claude Code.
 * Only prompts for enabled tools are registered.
 */
export function registerWorkflowPrompts(server, _context) {
    const prompts = [
        {
            name: 'pantion_check-convergence',
            description: 'Validate whether a dialog has structurally converged. Checks for DIALOGSPEC STAMP, required fields, and open questions.',
            schema: { session_id: z.string().optional().describe('Session ID to check') },
            handler: ({ session_id }) => ({
                messages: [{
                        role: 'user',
                        content: {
                            type: 'text',
                            text: session_id
                                ? `Check whether the dialog in session "${session_id}" has converged. Call pantion_check-convergence with the session_id and the current dialog messages.`
                                : `The user wants to check if their current dialog has converged. Call pantion_check-convergence with the active session_id and dialog messages to validate convergence.`,
                        },
                    }],
            }),
        },
        {
            name: 'pantion_save-canon',
            description: 'Write canon files to disk after convergence. Saves the dialog (THE CANON) and optionally a summary.',
            schema: { name: z.string().optional().describe('Name for the canon') },
            handler: ({ name }) => ({
                messages: [{
                        role: 'user',
                        content: {
                            type: 'text',
                            text: name
                                ? `Save the converged dialog as canon "${name}". Call pantion_save-canon with the session_id, dialog messages, and name="${name}". Optionally generate a summary.`
                                : `The user wants to save their converged dialog as a canon. Ask for a canon name, then call pantion_save-canon with the session_id, dialog messages, and chosen name.`,
                        },
                    }],
            }),
        },
        {
            name: 'pantion_translate',
            description: 'Translate a converged canon into project specification files (spec/requirements.md, spec/constraints.md, etc.).',
            schema: { canon_name: z.string().optional().describe('Canon to translate') },
            handler: ({ canon_name }) => ({
                messages: [{
                        role: 'user',
                        content: {
                            type: 'text',
                            text: canon_name
                                ? `Translate canon "${canon_name}" into project specification files. Read the canon dialog, derive spec files (requirements.md, constraints.md, success-criteria.md, etc.), then call pantion_translate with the canon_name and generated file contents.`
                                : `The user wants to translate a canon into project specification files. Use pantion_list-canons to show available canons, then read the chosen canon and call pantion_translate with derived spec files.`,
                        },
                    }],
            }),
        },
        {
            name: 'pantion_check',
            description: 'Run structural quality checks on a canon. Returns a scorecard with readiness verdict.',
            schema: { canon_name: z.string().optional().describe('Canon to check') },
            handler: ({ canon_name }) => ({
                messages: [{
                        role: 'user',
                        content: {
                            type: 'text',
                            text: canon_name
                                ? `Run a quality check on canon "${canon_name}". Call pantion_check with canon_name="${canon_name}" and report the scorecard results.`
                                : `The user wants to run a quality check on a canon. Use pantion_list-canons to show available canons, then call pantion_check on the chosen canon.`,
                        },
                    }],
            }),
        },
        {
            name: 'pantion_amend',
            description: 'Append an amendment to an existing converged canon. The amendment dialog is appended to the canon file.',
            schema: { canon_name: z.string().optional().describe('Canon to amend') },
            handler: ({ canon_name }) => ({
                messages: [{
                        role: 'user',
                        content: {
                            type: 'text',
                            text: canon_name
                                ? `Amend canon "${canon_name}". Call pantion_amend with the canon_name, the amendment dialog, and a convergence stamp. The HUMAN STAMP will be reset to PENDING after amendment.`
                                : `The user wants to amend a converged canon. Use pantion_list-canons to show available canons, then conduct the amendment dialog and call pantion_amend.`,
                        },
                    }],
            }),
        },
        {
            name: 'pantion_list-canons',
            description: 'List all canons in the project with their status and metadata.',
            schema: {},
            handler: () => ({
                messages: [{
                        role: 'user',
                        content: {
                            type: 'text',
                            text: `List all canons in this project. Call pantion_list-canons and present the results to the user, showing canon names, status, and HUMAN STAMP status.`,
                        },
                    }],
            }),
        },
        {
            name: 'pantion_approve',
            description: 'Approve a converged canon by filling in the HUMAN STAMP with APPROVED status. Required before translation.',
            schema: { canon_name: z.string().optional().describe('Canon to approve') },
            handler: ({ canon_name }) => ({
                messages: [{
                        role: 'user',
                        content: {
                            type: 'text',
                            text: canon_name
                                ? `Approve canon "${canon_name}". Ask the user for their role (e.g. "Product Owner", "Developer"), then call pantion_approve with canon_name="${canon_name}" and the specified role.`
                                : `The user wants to approve a canon. Use pantion_list-canons to show available canons, ask which one to approve and for their role, then call pantion_approve.`,
                        },
                    }],
            }),
        },
        {
            name: 'pantion_reject',
            description: 'Reject a converged canon by filling in the HUMAN STAMP with REJECTED status.',
            schema: { canon_name: z.string().optional().describe('Canon to reject') },
            handler: ({ canon_name }) => ({
                messages: [{
                        role: 'user',
                        content: {
                            type: 'text',
                            text: canon_name
                                ? `Reject canon "${canon_name}". Ask the user for their role and optionally a reason, then call pantion_reject with canon_name="${canon_name}", the role, and an optional note.`
                                : `The user wants to reject a canon. Use pantion_list-canons to show available canons, ask which one to reject, their role, and optionally a reason, then call pantion_reject.`,
                        },
                    }],
            }),
        },
        {
            name: 'pantion_reflect',
            description: 'Append a Reality Convergence block to an existing canon. Post-build learning: captures empirical observations. Observational only — does not modify intent.',
            schema: { canon_name: z.string().optional().describe('Canon to reflect on') },
            handler: ({ canon_name }) => ({
                messages: [{
                        role: 'user',
                        content: {
                            type: 'text',
                            text: canon_name
                                ? `Reflect on canon "${canon_name}" with reality feedback. Conduct a structured Reality Convergence dialog: what worked, what surprised, which assumptions were wrong, what failure modes appeared. Classify each observation (intent-mismatch, unknown-unknown, hard-constraint-conflict, implementation-gap), link to canon anchors, and create open questions. Then call pantion_reflect. Note: RC is observational — it does NOT modify intent. Use pantion_amend for intent changes.`
                                : `The user wants to reflect on a canon with reality feedback from a built implementation. Use pantion_list-canons to show available canons, then conduct the Reality Convergence dialog and call pantion_reflect. Note: RC is observational only — intent changes require pantion_amend.`,
                        },
                    }],
            }),
        },
        {
            name: 'pantion_feedback',
            description: 'Submit feedback on a convergence dialog. Records what was missed, insufficient, or wrongly assumed.',
            schema: { canon_name: z.string().optional().describe('Canon to give feedback on') },
            handler: ({ canon_name }) => ({
                messages: [{
                        role: 'user',
                        content: {
                            type: 'text',
                            text: canon_name
                                ? `Submit feedback on canon "${canon_name}". Ask what went wrong or was missed (type: missed-question, insufficient-answer, unexpected-edge-case, or wrong-assumption), the domain, severity, a description, and a suggestion for improvement. Then call pantion_feedback with these details.`
                                : `The user wants to submit feedback on a convergence dialog. Use pantion_list-canons to show available canons, ask which one to give feedback on, then gather the feedback details (type, domain, severity, description, suggestion) and call pantion_feedback.`,
                        },
                    }],
            }),
        },
        {
            name: 'pantion_learn',
            description: 'Aggregate feedback from all canons into learned patterns. Detects recurring issues and proposes rules for future convergences.',
            schema: {},
            handler: () => ({
                messages: [{
                        role: 'user',
                        content: {
                            type: 'text',
                            text: `Aggregate all feedback into learned patterns. Call pantion_learn to scan feedback across all canons, detect recurring patterns, and propose rules for improving future convergences. Present the results and explain that proposed rules need human approval in .pantion/feedback/patterns.md (change [PROPOSED] to [APPROVED]).`,
                        },
                    }],
            }),
        },
        {
            name: 'pantion_build',
            description: 'Build from a converged, approved, and translated canon. For software: provides build instructions referencing spec files and dialog. For image/other: returns the prompt with instructions for the external tool.',
            schema: { canon_name: z.string().optional().describe('Canon to build from') },
            handler: ({ canon_name }) => ({
                messages: [{
                        role: 'user',
                        content: {
                            type: 'text',
                            text: canon_name
                                ? `Build from canon "${canon_name}". Call pantion_build with canon_name="${canon_name}" to get build instructions. For software canons, this returns file references to read and build from. For image/other canons, this returns the prompt to use with external tools.`
                                : `The user wants to build from a canon. Use pantion_list-canons to show available canons, then call pantion_build on the chosen canon to get build instructions.`,
                        },
                    }],
            }),
        },
        {
            name: 'pantion_dialog',
            description: 'Start a Pantion convergence dialog. Asks targeted questions until intent is fully clear.',
            schema: {
                dialog: z.string().optional().describe('Dialog name (e.g. "software", "image")'),
                user_message: z.string().optional().describe('What the user wants to build'),
            },
            handler: ({ dialog, user_message }) => ({
                messages: [{
                        role: 'user',
                        content: {
                            type: 'text',
                            text: dialog
                                ? `Start a Pantion convergence dialog using the "${dialog}" domain. Call pantion_dialog with dialog="${dialog}"${user_message ? ` and user_message="${user_message}"` : ''}.`
                                : user_message
                                    ? `Start a Pantion convergence dialog. Call pantion_dialog with user_message="${user_message}" to auto-select the right domain.`
                                    : `Start a Pantion convergence dialog. Call pantion_dialog to begin asking the user targeted questions about what they want to build.`,
                        },
                    }],
            }),
        },
        {
            name: 'pantion',
            enabledBy: 'pantion_start',
            description: 'Pantion entrypoint. Opens the router to guide the user to the right action.',
            schema: { user_intent: z.string().optional().describe('What the user wants to do') },
            handler: ({ user_intent }) => ({
                messages: [{
                        role: 'user',
                        content: {
                            type: 'text',
                            text: user_intent
                                ? `Open Pantion with this intent: "${user_intent}". Call pantion_start with user_message="${user_intent}" to let the router handle it.`
                                : `The user invoked Pantion. Call pantion_start to open the router dialog.`,
                        },
                    }],
            }),
        },
        {
            name: 'pantion_router',
            description: 'Route a user\'s intent to the right Pantion tool. Returns routing instructions, a context menu, or a clarifying question.',
            schema: { user_intent: z.string().optional().describe('What the user wants to do') },
            handler: ({ user_intent }) => ({
                messages: [{
                        role: 'user',
                        content: {
                            type: 'text',
                            text: user_intent
                                ? `Route this intent to the right Pantion tool: "${user_intent}". Call pantion_router with user_intent="${user_intent}" and follow the routing instructions in the response.`
                                : `The user wants to use Pantion. Call pantion_router without user_intent to get a context-driven menu of available actions, then present the options to the user.`,
                        },
                    }],
            }),
        },
        {
            name: 'pantion_create-dialog',
            description: 'Start a new dialog creation dialog using the dialog-builder meta-dialog.',
            schema: { dialog_name: z.string().optional().describe('Name for the new dialog') },
            handler: ({ dialog_name }) => ({
                messages: [{
                        role: 'user',
                        content: {
                            type: 'text',
                            text: dialog_name
                                ? `Create a new Pantion dialog named "${dialog_name}". Call pantion_create-dialog with dialog_name="${dialog_name}" to start the dialog-builder convergence dialog.`
                                : `The user wants to create a new Pantion skill. Ask for a dialog name (lowercase, hyphenated), then call pantion_create-dialog to start the dialog-builder convergence dialog.`,
                        },
                    }],
            }),
        },
        // pantion_redialog prompt is in convergence-prompts.ts (assembles full system prompt)
        {
            name: 'pantion_decompose',
            description: 'Decompose a converged canon into subsystems (architect, interface, and component canons).',
            schema: { canon_name: z.string().optional().describe('Canon to decompose') },
            handler: ({ canon_name }) => ({
                messages: [{
                        role: 'user',
                        content: {
                            type: 'text',
                            text: canon_name
                                ? `Decompose canon "${canon_name}" into subsystems. Call pantion_decompose with canon_name="${canon_name}" to generate architect, interface, and component canons.`
                                : `The user wants to decompose a canon into subsystems. Use pantion_list-canons to show available converged canons, then call pantion_decompose on the chosen canon.`,
                        },
                    }],
            }),
        },
        {
            name: 'pantion_reverse',
            description: 'Extract intent from an existing codebase and reconstruct it as a DialogSpec Canon.',
            schema: { canon_name: z.string().optional().describe('Name for the resulting canon') },
            handler: ({ canon_name }) => ({
                messages: [{
                        role: 'user',
                        content: {
                            type: 'text',
                            text: canon_name
                                ? `Start a reverse Pantion session. Call pantion_reverse with canon_name="${canon_name}" to extract intent from the existing codebase and reconstruct it as a canon.`
                                : `The user wants to extract intent from an existing codebase. Call pantion_reverse to start a reverse Pantion session that reconstructs the codebase intent as a DialogSpec Canon.`,
                        },
                    }],
            }),
        },
        {
            name: 'pantion_onboard',
            description: 'Add Pantion to an existing project. Guides through forward-only, full reverse, or partial canonization strategies.',
            schema: {},
            handler: () => ({
                messages: [{
                        role: 'user',
                        content: {
                            type: 'text',
                            text: `The user wants to add Pantion to their existing project. Call pantion_onboard to guide them through three strategies: forward-only (start fresh canons), full reverse (reconstruct all intent from code), or partial canonization (selective reverse for key components).`,
                        },
                    }],
            }),
        },
        {
            name: 'pantion_update',
            description: 'Upgrade the Pantion Protocol itself. Performs delta analysis and provides regeneration instructions.',
            schema: {},
            handler: () => ({
                messages: [{
                        role: 'user',
                        content: {
                            type: 'text',
                            text: `The user wants to upgrade the Pantion Protocol. Call pantion_update to read intent documents, perform delta analysis, and get instructions for regenerating protocol files.`,
                        },
                    }],
            }),
        },
        {
            name: 'pantion_migrate',
            description: 'Migrate a project to the current Pantion protocol version.',
            schema: {},
            handler: () => ({
                messages: [{
                        role: 'user',
                        content: {
                            type: 'text',
                            text: `The user wants to migrate their project to the current Pantion protocol version. Call pantion_migrate to detect version mismatches, evaluate canon compatibility, and get migration instructions.`,
                        },
                    }],
            }),
        },
        {
            name: 'pantion_workflow',
            description: 'Guided workflow: walks through converge → save → approve → translate → build. Call repeatedly — returns the next step each time.',
            schema: {
                domain: z.string().optional().describe('Domain (e.g. "software", "image", "openclaw")'),
                canon_name: z.string().optional().describe('Canon name (provide after convergence)'),
            },
            handler: ({ domain, canon_name }) => ({
                messages: [{
                        role: 'user',
                        content: {
                            type: 'text',
                            text: domain
                                ? `Start a guided Pantion workflow for the "${domain}" domain. Call pantion_workflow with domain="${domain}"${canon_name ? ` and canon_name="${canon_name}"` : ''} to get the current phase and next step.`
                                : `The user wants a guided Pantion workflow. Call pantion_workflow to determine the current phase and get instructions for the next step.`,
                        },
                    }],
            }),
        },
        {
            name: 'pantion_workflow-software',
            enabledBy: 'pantion_workflow',
            description: 'Start a guided software development workflow: converge → save → approve → translate → build.',
            schema: {
                canon_name: z.string().optional().describe('Canon name (provide after convergence)'),
            },
            handler: ({ canon_name }) => ({
                messages: [{
                        role: 'user',
                        content: {
                            type: 'text',
                            text: `Start a guided Pantion workflow for software development. Call pantion_workflow with domain="software"${canon_name ? ` and canon_name="${canon_name}"` : ''}. Follow each phase the workflow returns: converge the intent, save the canon, get human approval, translate to spec files, then build.`,
                        },
                    }],
            }),
        },
        {
            name: 'pantion_diff',
            description: 'Detect changes in a canon after amend/redialog/reflect. Shows change blocks and spec staleness.',
            schema: { canon_name: z.string().optional().describe('Canon to diff') },
            handler: ({ canon_name }) => ({
                messages: [{
                        role: 'user',
                        content: {
                            type: 'text',
                            text: canon_name
                                ? `Diff canon "${canon_name}" to detect changes since initial convergence. Call pantion_diff with canon_name="${canon_name}" to see amendments, reality convergences, and stale spec files.`
                                : `The user wants to see what changed in a canon. Use pantion_list-canons to show available canons, then call pantion_diff on the chosen canon.`,
                        },
                    }],
            }),
        },
        {
            name: 'pantion_version',
            description: 'Show the installed Pantion version.',
            schema: {},
            handler: () => ({
                messages: [{
                        role: 'user',
                        content: {
                            type: 'text',
                            text: `Show the installed Pantion version. Call pantion_version and report the version number to the user.`,
                        },
                    }],
            }),
        },
    ];
    for (const prompt of prompts) {
        const gate = prompt.enabledBy ?? prompt.name;
        if (isToolEnabled(gate)) {
            server.prompt(prompt.name, prompt.description, prompt.schema, prompt.handler);
        }
    }
}
//# sourceMappingURL=workflow-prompts.js.map