import * as fs from 'node:fs';
import { checkAllPrereqs } from '../utils/prereqs.js';
import { getAllAdapters } from '../adapters/registry.js';
import { heading, ok, fail, warn, info, blank } from '../utils/output.js';
function getClientStatus(homeDir) {
    return getAllAdapters().map((adapter) => {
        const installed = adapter.isInstalled(homeDir);
        let hasPantion = false;
        if (installed) {
            try {
                const configPath = adapter.configPath(homeDir);
                if (fs.existsSync(configPath)) {
                    const content = fs.readFileSync(configPath, 'utf-8');
                    hasPantion = adapter.hasPantionEntry(content);
                }
            }
            catch {
                // config unreadable
            }
        }
        return {
            clientId: adapter.id,
            displayName: adapter.displayName,
            installed,
            hasPantionConfig: hasPantion,
        };
    });
}
export function doctor(homeDir) {
    const prereqs = checkAllPrereqs();
    const clients = getClientStatus(homeDir);
    heading('Prerequisites');
    for (const p of prereqs) {
        if (p.passed) {
            ok(p.message);
        }
        else {
            fail(p.message);
        }
    }
    heading('Coding Tools');
    for (const c of clients) {
        if (!c.installed) {
            info(`${c.displayName}: not detected`);
        }
        else if (c.hasPantionConfig) {
            ok(`${c.displayName}: Pantion configured`);
        }
        else {
            warn(`${c.displayName}: detected, Pantion not configured`);
        }
    }
    blank();
    return { prereqs, clients };
}
//# sourceMappingURL=doctor.js.map