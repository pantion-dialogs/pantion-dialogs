import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { execSync } from 'node:child_process';
import * as jsonMerge from '../utils/json-merge.js';
export const claude = {
    id: 'claude',
    displayName: 'Claude Code',
    configPath(homeDir) {
        const home = homeDir ?? os.homedir();
        return path.join(home, '.claude.json');
    },
    isInstalled(homeDir) {
        const configExists = fs.existsSync(this.configPath(homeDir));
        if (configExists)
            return true;
        if (!homeDir) {
            try {
                execSync('which claude', { stdio: 'ignore' });
                return true;
            }
            catch {
                // binary not found
            }
        }
        return false;
    },
    hasPantionEntry: jsonMerge.hasPantionEntry,
    isPantionEntryCorrect: jsonMerge.isPantionEntryCorrect,
    mergePantionEntry: jsonMerge.mergePantionEntry,
    removePantionEntry: jsonMerge.removePantionEntry,
    emptyConfig: () => '{}\n',
};
//# sourceMappingURL=claude.js.map