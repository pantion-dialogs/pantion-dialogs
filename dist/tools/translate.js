import { z } from 'zod';
import { resolve } from 'node:path';
import { writeFile, ensureDir, readFileSafe, assertPathWithin, assertSafeName, extractHumanStamp, extractConvergenceStamp, extractCanonMetadata, generateManifest, assembleDeferredPrompt, stampDateTime, stampDate, canonDialogPath, canonTraceabilityPath, canonImplementationsDir } from '../core/index.js';
import { success, error } from '../utils/response.js';
const fileSchema = z.object({
    path: z.string().describe('Relative file path within the project'),
    content: z.string().describe('File content to write'),
});
export function registerTranslate(server, context) {
    server.tool('pantion_translate', 'Write project specification files derived from a converged canon. The client LLM generates the file contents (spec/requirements.md, spec/constraints.md, etc.); this tool writes them and updates traceability.', {
        canon_name: z.string().describe('Name of the source canon'),
        project_path: z.string().optional().describe('Project directory (defaults to server project path)'),
        files: z.array(fileSchema).describe('Files to write (path + content)'),
        rationale: z.string().optional().describe('Implementation rationale (key technical choices)'),
        deviations: z.string().optional().describe('Deviations from the canon ("none" if faithful)'),
    }, async ({ canon_name, project_path, files, rationale, deviations }) => {
        try {
            const projectPath = project_path ?? context.projectPath;
            assertSafeName(canon_name);
            // HUMAN STAMP gate: translation requires approval
            const dialogPath = canonDialogPath(projectPath, canon_name);
            const dialogContent = readFileSafe(dialogPath);
            if (dialogContent) {
                const humanStamp = extractHumanStamp(dialogContent);
                if (!humanStamp || (humanStamp.status !== 'APPROVED' && humanStamp.status !== 'AUTO-APPROVED')) {
                    const currentStatus = humanStamp?.status ?? 'PENDING';
                    return error(`Canon "${canon_name}" is not approved (HUMAN STAMP status: ${currentStatus}). Use pantion_approve to approve the canon before translation.`);
                }
            }
            const date = stampDateTime();
            const dateForFilename = stampDate();
            const filesWritten = [];
            const canonPrefix = `canon/${canon_name}/`;
            for (const file of files) {
                // Force files into canon/{canon_name}/ — clients may omit the prefix
                const normalizedPath = file.path.startsWith(canonPrefix)
                    ? file.path
                    : `${canonPrefix}${file.path}`;
                const fullPath = resolve(projectPath, normalizedPath);
                assertPathWithin(fullPath, projectPath);
                ensureDir(resolve(fullPath, '..'));
                writeFile(fullPath, ensureDerivationComment(file.content, canon_name, date));
                filesWritten.push(normalizedPath);
            }
            // Update traceability
            const traceabilityPath = canonTraceabilityPath(projectPath, canon_name);
            let traceability = readFileSafe(traceabilityPath) ?? createTraceabilityHeader();
            traceability = appendTraceabilityRows(traceability, filesWritten, canon_name, date);
            writeFile(traceabilityPath, traceability);
            // Generate implementation manifest
            let manifestPath;
            if (dialogContent) {
                const stamp = extractConvergenceStamp(dialogContent);
                const humanStamp = extractHumanStamp(dialogContent);
                const metadata = extractCanonMetadata(dialogContent);
                const manifest = generateManifest({
                    canonName: canon_name,
                    canonStatus: stamp?.type?.toUpperCase() ?? 'UNKNOWN',
                    humanStampStatus: humanStamp?.status ?? 'UNKNOWN',
                    date,
                    model: stamp?.model,
                    dialog: metadata?.dialog,
                    mode: metadata?.mode,
                    checkResult: metadata?.checkResult,
                    specFiles: filesWritten,
                    rationale,
                    deviations,
                });
                const implDir = canonImplementationsDir(projectPath, canon_name);
                ensureDir(implDir);
                const implPath = resolve(implDir, `${dateForFilename}-collapse.md`);
                writeFile(implPath, manifest);
                manifestPath = `canon/${canon_name}/implementations/${dateForFilename}-collapse.md`;
            }
            // Load deferred post-convergence instructions
            let deferredInstructions;
            try {
                // Determine mode from canon metadata or stamp
                const stamp = extractConvergenceStamp(dialogContent ?? '');
                const commandName = stamp?.type === 'converged-dialog' || stamp?.type === 'converged-quick' ? 'dialog' : 'start';
                deferredInstructions = assembleDeferredPrompt({
                    phase: 'post',
                    commandName,
                    protocolDir: context.protocolDir,
                });
            }
            catch {
                // Deferred loading is best-effort — translate must never break
            }
            return success({
                files_written: filesWritten,
                ...(manifestPath ? { manifest_path: manifestPath } : {}),
                ...(deferredInstructions ? { deferred_instructions: deferredInstructions } : {}),
            });
        }
        catch (err) {
            return error(err instanceof Error ? err.message : String(err));
        }
    });
}
function ensureDerivationComment(content, canonName, date) {
    if (content.includes('Derived from:'))
        return content;
    return `<!-- Derived from: canon/${canonName}/dialog.md, ${date} -->\n\n${content}`;
}
function createTraceabilityHeader() {
    return [
        '# Traceability: Canon -> Project Specification Files',
        '',
        '| File | Canon source | Dialog turns | Elements | Last generated |',
        '|------|-------------|--------------|----------|----------------|',
    ].join('\n');
}
function appendTraceabilityRows(traceabilityContent, filesWritten, canonName, date) {
    let output = traceabilityContent;
    if (!output.endsWith('\n'))
        output += '\n';
    for (const filePath of filesWritten) {
        output += `| \`${filePath}\` | \`${canonName}/dialog.md\` | all | derived artifact | ${date} |\n`;
    }
    output += `\nGenerated on: ${date}\n`;
    return output;
}
//# sourceMappingURL=translate.js.map