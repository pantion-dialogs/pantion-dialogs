import { z } from 'zod';
import { readFileSafe, extractConvergenceStamp, extractHumanStamp, formatHumanStamp, replaceHumanStamp, writeFile, assertSafeName, stampDateTime, canonDialogPath, } from '../core/index.js';
import { success, error } from '../utils/response.js';
export function registerReject(server, context) {
    server.tool('pantion_reject', 'Reject a converged canon. Fills in the HUMAN STAMP with REJECTED status. A rejected canon can be approved later after changes (amend/redialog).', {
        canon_name: z.string().describe('Name of the canon to reject'),
        role: z.string().describe('Role of the reviewer (e.g. "Product Owner", "Opdrachtgever")'),
        note: z.string().optional().describe('Optional note explaining the rejection'),
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
                return error('Canon is not converged. Only converged canons can be rejected.');
            }
            const date = stampDateTime();
            const newStamp = formatHumanStamp({
                status: 'REJECTED',
                date,
                role,
                note: note ?? '[not set]',
            });
            let updated;
            const humanStamp = extractHumanStamp(content);
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
                rejected: true,
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
//# sourceMappingURL=reject.js.map