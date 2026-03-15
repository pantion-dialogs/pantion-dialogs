import * as fs from 'node:fs';
import { getAdapter } from '../adapters/registry.js';
import { heading, ok, warn, fail, blank } from '../utils/output.js';
function verifyOne(clientId, homeDir) {
    const adapter = getAdapter(clientId);
    const configPath = adapter.configPath(homeDir);
    if (!fs.existsSync(configPath)) {
        return {
            clientId,
            configExists: false,
            configPath,
            hasPantionEntry: false,
            entryCorrect: false,
        };
    }
    let content;
    try {
        content = fs.readFileSync(configPath, 'utf-8');
    }
    catch (err) {
        return {
            clientId,
            configExists: true,
            configPath,
            hasPantionEntry: false,
            entryCorrect: false,
            error: `Cannot read ${configPath}: ${err instanceof Error ? err.message : String(err)}`,
        };
    }
    const hasEntry = adapter.hasPantionEntry(content);
    const correct = hasEntry ? adapter.isPantionEntryCorrect(content) : false;
    return {
        clientId,
        configExists: true,
        configPath,
        hasPantionEntry: hasEntry,
        entryCorrect: correct,
    };
}
export function verify(clients, homeDir) {
    const results = [];
    heading('Verify');
    for (const clientId of clients) {
        const adapter = getAdapter(clientId);
        const result = verifyOne(clientId, homeDir);
        results.push(result);
        if (result.error) {
            fail(`${adapter.displayName}: ${result.error}`);
        }
        else if (!result.configExists) {
            fail(`${adapter.displayName}: config file not found (${result.configPath})`);
        }
        else if (!result.hasPantionEntry) {
            warn(`${adapter.displayName}: config exists but no Pantion entry`);
        }
        else if (!result.entryCorrect) {
            warn(`${adapter.displayName}: Pantion entry found but incorrect`);
        }
        else {
            ok(`${adapter.displayName}: correctly configured`);
        }
    }
    blank();
    return results;
}
//# sourceMappingURL=verify.js.map