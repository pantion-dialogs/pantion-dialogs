import * as fs from 'node:fs';
import { getAdapter } from '../adapters/registry.js';
import { createBackup } from '../utils/backup.js';
import { heading, ok, fail, info, blank } from '../utils/output.js';
import { verify } from './verify.js';
function uninstallOne(clientId, dryRun, homeDir) {
    const adapter = getAdapter(clientId);
    const configPath = adapter.configPath(homeDir);
    if (!fs.existsSync(configPath)) {
        return { clientId, success: true, action: 'not-installed', configPath };
    }
    let content;
    try {
        content = fs.readFileSync(configPath, 'utf-8');
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
    if (!adapter.hasPantionEntry(content)) {
        return { clientId, success: true, action: 'not-installed', configPath };
    }
    const updated = adapter.removePantionEntry(content);
    if (dryRun) {
        info(`Would write to ${configPath}:`);
        console.log(updated);
        return { clientId, success: true, action: 'removed', configPath };
    }
    let backupPath;
    const backup = createBackup(configPath);
    if (backup)
        backupPath = backup;
    try {
        fs.writeFileSync(configPath, updated, 'utf-8');
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
    return { clientId, success: true, action: 'removed', configPath, backupPath };
}
export function uninstall(clients, dryRun, homeDir) {
    const results = [];
    heading(dryRun ? 'Uninstall (dry run)' : 'Uninstall');
    for (const clientId of clients) {
        const adapter = getAdapter(clientId);
        const result = uninstallOne(clientId, dryRun, homeDir);
        results.push(result);
        switch (result.action) {
            case 'removed':
                if (!dryRun) {
                    ok(`${adapter.displayName}: Pantion entry removed`);
                    if (result.backupPath) {
                        info(`  Backup: ${result.backupPath}`);
                    }
                }
                break;
            case 'not-installed':
                ok(`${adapter.displayName}: no Pantion entry found`);
                break;
            case 'failed':
                fail(`${adapter.displayName}: ${result.error}`);
                break;
        }
    }
    blank();
    const removed = results.filter((r) => r.action === 'removed');
    if (!dryRun && removed.length > 0) {
        const removedClients = removed.map((r) => r.clientId);
        const verifyResults = verify(removedClients, homeDir);
        const allGone = verifyResults.every((v) => !v.hasPantionEntry);
        if (!allGone) {
            fail('Post-uninstall verify: Pantion entry still present in some configs');
        }
    }
    return results;
}
//# sourceMappingURL=uninstall.js.map