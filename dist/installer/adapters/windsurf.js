import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import * as jsonMerge from '../utils/json-merge.js';
export const windsurf = {
    id: 'windsurf',
    displayName: 'Windsurf',
    configPath(homeDir) {
        const home = homeDir ?? os.homedir();
        return path.join(home, '.codeium', 'windsurf', 'mcp_config.json');
    },
    isInstalled(homeDir) {
        const home = homeDir ?? os.homedir();
        return fs.existsSync(path.join(home, '.codeium', 'windsurf'));
    },
    hasPantionEntry: jsonMerge.hasPantionEntry,
    isPantionEntryCorrect: jsonMerge.isPantionEntryCorrect,
    mergePantionEntry: jsonMerge.mergePantionEntry,
    removePantionEntry: jsonMerge.removePantionEntry,
    emptyConfig: () => '{}\n',
};
//# sourceMappingURL=windsurf.js.map