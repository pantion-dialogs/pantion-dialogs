import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { homedir } from 'node:os';
/**
 * Dialog search order: project-local > user-global > bundled.
 * dialogsDir allows explicitly specifying where bundled dialogs live.
 */
function getDialogDirs(projectPath, dialogsDir) {
    const dirs = [];
    // Project-local dialogs
    const projectDialogs = resolve(projectPath, 'dialogs');
    if (existsSync(projectDialogs)) {
        dirs.push({ dir: projectDialogs, source: 'project' });
    }
    // User-global dialogs
    const userDialogs = resolve(homedir(), '.pantion', 'dialogs');
    if (existsSync(userDialogs)) {
        dirs.push({ dir: userDialogs, source: 'user' });
    }
    // Bundled dialogs (explicit or relative)
    if (dialogsDir && existsSync(dialogsDir)) {
        dirs.push({ dir: dialogsDir, source: 'bundled' });
    }
    return dirs;
}
function loadDialog(dir, source) {
    const manifestPath = resolve(dir, 'dialog.json');
    if (!existsSync(manifestPath))
        return null;
    try {
        const raw = JSON.parse(readFileSync(manifestPath, 'utf-8'));
        if (!raw ||
            typeof raw !== 'object' ||
            typeof raw.name !== 'string' ||
            typeof raw.displayName !== 'string' ||
            typeof raw.description !== 'string' ||
            typeof raw.version !== 'string' ||
            !Array.isArray(raw.keywords)) {
            return null;
        }
        const manifest = raw;
        const convergenceRulesPath = resolve(dir, 'convergence-rules.md');
        const translatePath = resolve(dir, 'translate.md');
        const convergenceRules = existsSync(convergenceRulesPath)
            ? readFileSync(convergenceRulesPath, 'utf-8')
            : '';
        const translatePrompt = existsSync(translatePath)
            ? readFileSync(translatePath, 'utf-8')
            : '';
        const prompts = {};
        const promptsDir = resolve(dir, 'prompts');
        if (existsSync(promptsDir)) {
            for (const file of readdirSync(promptsDir)) {
                if (file.endsWith('.md')) {
                    prompts[file.replace('.md', '')] = readFileSync(resolve(promptsDir, file), 'utf-8');
                }
            }
        }
        // Check for dynamic dialog canon
        const canonDialogPath = resolve(dir, 'canon', 'dialog.md');
        const hasCanon = existsSync(canonDialogPath);
        return {
            manifest,
            convergenceRules,
            translatePrompt,
            prompts,
            path: dir,
            source: hasCanon ? 'dynamic' : source,
            hasCanon,
        };
    }
    catch {
        return null;
    }
}
/**
 * List all available dialogs (deduplicated by name, project > user > bundled).
 */
export function listDialogs(projectPath, dialogsDir) {
    const dialogs = new Map();
    // Iterate in reverse priority order so higher-priority overwrites
    const dirs = getDialogDirs(projectPath, dialogsDir).reverse();
    for (const { dir, source } of dirs) {
        if (!existsSync(dir))
            continue;
        for (const entry of readdirSync(dir)) {
            const entryDir = resolve(dir, entry);
            const dlg = loadDialog(entryDir, source);
            if (dlg) {
                dialogs.set(dlg.manifest.name, dlg);
            }
        }
    }
    return Array.from(dialogs.values());
}
/**
 * Get a specific dialog by name.
 */
export function getDialog(name, projectPath, dialogsDir) {
    return listDialogs(projectPath, dialogsDir).find((s) => s.manifest.name === name) ?? null;
}
//# sourceMappingURL=registry.js.map