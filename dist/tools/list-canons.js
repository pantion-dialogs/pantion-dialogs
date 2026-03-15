import { z } from 'zod';
import { readCanonIndex } from '../core/index.js';
import { success, error } from '../utils/response.js';
export function registerListCanons(server, context) {
    server.tool('pantion_list-canons', 'List all canons in a project. Scans the canon/ directory and returns metadata for each canon.', {
        project_path: z.string().optional().describe('Project directory (defaults to server project path)'),
    }, async ({ project_path }) => {
        try {
            const projectPath = project_path ?? context.projectPath;
            const canons = readCanonIndex(projectPath);
            return success({
                canons: canons.map((c) => ({
                    name: c.name,
                    type: c.type,
                    status: c.status,
                    date: c.date,
                    has_summary: c.hasSummary,
                    open_questions: c.openQuestions,
                    human_stamp_status: c.humanStampStatus ?? 'PENDING',
                })),
            });
        }
        catch (err) {
            return error(err instanceof Error ? err.message : String(err));
        }
    });
}
//# sourceMappingURL=list-canons.js.map