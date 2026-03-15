import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
export function detectProjectContext(projectPath) {
    const dir = resolve(projectPath, 'canon');
    const sessionsDir = resolve(projectPath, '.pantion', 'sessions');
    const result = {
        hasCanonDir: false,
        hasCanons: false,
        hasDrafts: false,
        hasSessions: false,
        canonCount: 0,
        draftCount: 0,
    };
    if (existsSync(dir)) {
        result.hasCanonDir = true;
        const files = readdirSync(dir).filter((f) => f.endsWith('-dialog.md'));
        result.canonCount = files.length;
        result.hasCanons = files.length > 0;
    }
    if (existsSync(sessionsDir)) {
        const sessionFiles = readdirSync(sessionsDir).filter((f) => f.endsWith('.json'));
        result.hasSessions = sessionFiles.length > 0;
        for (const file of sessionFiles) {
            try {
                const content = JSON.parse(readFileSync(resolve(sessionsDir, file), 'utf-8'));
                if (content.status === 'draft') {
                    result.draftCount++;
                    result.hasDrafts = true;
                }
            }
            catch {
                // skip corrupt files
            }
        }
    }
    return result;
}
//# sourceMappingURL=project-detect.js.map