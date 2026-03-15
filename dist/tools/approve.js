import { z } from 'zod';
import { readFileSafe, extractConvergenceStamp, extractHumanStamp, formatHumanStamp, replaceHumanStamp, writeFile, assertSafeName, stampDateTime, canonDialogPath, } from '../core/index.js';
import { success, error } from '../utils/response.js';
export function registerApprove(server, context) {
    server.tool('pantion_approve', 'Approve a converged canon. Fills in the HUMAN STAMP with APPROVED status. Required before translation or building.', {
        canon_name: z.string().describe('Name of the canon to approve'),
        role: z.string().describe('Role of the approver (e.g. "Product Owner", "Opdrachtgever")'),
        note: z.string().optional().describe('Optional note from the approver'),
        project_path: z.string().optional().describe('Project directory (defaults to server project path)'),
    }, async ({ canon_name, role, note, project_path }) => {
        try {
            const projectPath = project_path ?? context.projectPath;
            assertSafeName(canon_name);
            const dialogPath = canonDialogPath(projectPath, canon_name);
            const content = readFileSafe(dialogPath);
            if (!content) {
                return error(`Canon dialog not found: ${canon_name}`);
            }
            const stamp = extractConvergenceStamp(content);
            if (!stamp || stamp.type === 'draft') {
                return error('Canon is not converged. Only converged canons can be approved.');
            }
            const humanStamp = extractHumanStamp(content);
            if (humanStamp && (humanStamp.status === 'APPROVED' || humanStamp.status === 'AUTO-APPROVED')) {
                return error('Canon is already approved. Use pantion_amend or pantion_redialog to make changes, which will reset the approval.');
            }
            const date = stampDateTime();
            const newStamp = formatHumanStamp({
                status: 'APPROVED',
                date,
                role,
                note: note ?? '[not set]',
            });
            let updated;
            if (humanStamp) {
                updated = replaceHumanStamp(content, newStamp);
            }
            else {
                updated = content + '\n\n' + newStamp + '\n';
            }
            if (!updated) {
                return error('Failed to update HUMAN STAMP in dialog file.');
            }
            writeFile(dialogPath, updated);
            return success({
                approved: true,
                canon_name,
                date,
                role,
                note: note ?? undefined,
            });
        }
        catch (err) {
            return error(err instanceof Error ? err.message : String(err));
        }
    });
}
//# sourceMappingURL=approve.js.map