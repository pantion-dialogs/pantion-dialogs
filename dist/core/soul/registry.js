import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { homedir } from 'node:os';
/**
 * Soul search order: project-local > user-global > bundled.
 * soulsDir allows explicitly specifying where bundled souls live.
 */
function getSoulDirs(projectPath, soulsDir) {
    const dirs = [];
    // Project-local souls
    const projectSouls = resolve(projectPath, 'souls');
    if (existsSync(projectSouls)) {
        dirs.push({ dir: projectSouls, source: 'project' });
    }
    // User-global souls
    const userSouls = resolve(homedir(), '.pantion', 'souls');
    if (existsSync(userSouls)) {
        dirs.push({ dir: userSouls, source: 'user' });
    }
    // Bundled souls (explicit or relative)
    if (soulsDir && existsSync(soulsDir)) {
        dirs.push({ dir: soulsDir, source: 'bundled' });
    }
    return dirs;
}
function loadSoul(dir, source) {
    const manifestPath = resolve(dir, 'soul.json');
    if (!existsSync(manifestPath))
        return null;
    try {
        const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
        const rulesPath = resolve(dir, 'rules.md');
        const rules = existsSync(rulesPath)
            ? readFileSync(rulesPath, 'utf-8')
            : '';
        return {
            manifest,
            rules,
            path: dir,
            source,
        };
    }
    catch {
        return null;
    }
}
/**
 * List all available souls (deduplicated by name, project > user > bundled).
 */
export function listSouls(projectPath, soulsDir) {
    const souls = new Map();
    // Iterate in reverse priority order so higher-priority overwrites
    const dirs = getSoulDirs(projectPath, soulsDir).reverse();
    for (const { dir, source } of dirs) {
        if (!existsSync(dir))
            continue;
        for (const entry of readdirSync(dir)) {
            const soulDir = resolve(dir, entry);
            const soul = loadSoul(soulDir, source);
            if (soul) {
                souls.set(soul.manifest.name, soul);
            }
        }
    }
    return Array.from(souls.values());
}
/**
 * Get a specific soul by name.
 */
export function getSoul(name, projectPath, soulsDir) {
    return listSouls(projectPath, soulsDir).find((s) => s.manifest.name === name) ?? null;
}
//# sourceMappingURL=registry.js.map