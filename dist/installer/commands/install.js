import * as fs from 'node:fs';
import * as path from 'node:path';
import { getAdapter } from '../adapters/registry.js';
import { createBackup } from '../utils/backup.js';
import { heading, ok, fail, info, blank } from '../utils/output.js';
function installOne(clientId, dryRun, homeDir) {
    const adapter = getAdapter(clientId);
    const configPath = adapter.configPath(homeDir);
    let existing = adapter.emptyConfig();
    const configExists = fs.existsSync(configPath);
    if (configExists) {
        try {
            existing = fs.readFileSync(configPath, 'utf-8');
        }
        catch (err) {
            return {
                clientId,
                success: false,
                action: 'failed',
                configPath,
                error: `Cannot read ${configPath}: ${err instanceof Error ? err.message : String(err)}`,
            };
        }
        if (adapter.hasPantionEntry(existing) && adapter.isPantionEntryCorrect(existing)) {
            return { clientId, success: true, action: 'already-installed', configPath };
        }
    }
    const merged = adapter.mergePantionEntry(existing);
    if (dryRun) {
        info(`Would write to ${configPath}:`);
        console.log(merged);
        return { clientId, success: true, action: 'installed', configPath };
    }
    const dir = path.dirname(configPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    let backupPath;
    if (configExists) {
        const backup = createBackup(configPath);
        if (backup)
            backupPath = backup;
    }
    try {
        fs.writeFileSync(configPath, merged, 'utf-8');
    }
    catch (err) {
        return {
            clientId,
            success: false,
            action: 'failed',
            configPath,
            backupPath,
            error: `Cannot write ${configPath}: ${err instanceof Error ? err.message : String(err)}`,
        };
    }
    return { clientId, success: true, action: 'installed', configPath, backupPath };
}
export function install(clients, dryRun, homeDir) {
    const results = [];
    heading(dryRun ? 'Install (dry run)' : 'Install');
    for (const clientId of clients) {
        const adapter = getAdapter(clientId);
        const result = installOne(clientId, dryRun, homeDir);
        results.push(result);
        switch (result.action) {
            case 'installed':
                if (!dryRun) {
                    ok(`${adapter.displayName}: configured`);
                    if (result.backupPath) {
                        info(`  Backup: ${result.backupPath}`);
                    }
                }
                break;
            case 'already-installed':
                ok(`${adapter.displayName}: already configured`);
                break;
            case 'failed':
                fail(`${adapter.displayName}: ${result.error}`);
                break;
        }
    }
    blank();
    return results;
}
//# sourceMappingURL=install.js.map