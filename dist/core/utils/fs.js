import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
/**
 * Validate that a resolved path stays within the given base directory.
 * Throws if the path escapes (path traversal).
 */
export function assertPathWithin(filePath, baseDir) {
    const resolved = resolve(filePath);
    const base = resolve(baseDir) + '/';
    if (!resolved.startsWith(base) && resolved !== resolve(baseDir)) {
        throw new Error(`Path escapes allowed directory: ${filePath}`);
    }
}
/**
 * Validate that a name is safe for use in filenames (no path separators or traversal).
 */
export function assertSafeName(name) {
    if (!name || /[/\\]|\.\./.test(name)) {
        throw new Error(`Unsafe name: ${name}`);
    }
}
export function ensureDir(dir) {
    if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
    }
}
export function writeFile(filePath, content) {
    ensureDir(dirname(filePath));
    writeFileSync(filePath, content, 'utf-8');
}
export function readFileSafe(filePath) {
    if (!existsSync(filePath))
        return null;
    try {
        return readFileSync(filePath, 'utf-8');
    }
    catch {
        return null;
    }
}
export function canonDir(projectPath) {
    return resolve(projectPath, 'canon');
}
//# sourceMappingURL=fs.js.map