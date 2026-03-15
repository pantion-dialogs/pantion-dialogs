import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import * as jsonMerge from '../utils/json-merge.js';
export const gemini = {
    id: 'gemini',
    displayName: 'Gemini CLI',
    configPath(homeDir) {
        const home = homeDir ?? os.homedir();
        return path.join(home, '.gemini', 'settings.json');
    },
    isInstalled(homeDir) {
        const home = homeDir ?? os.homedir();
        return fs.existsSync(path.join(home, '.gemini'));
    },
    hasPantionEntry: jsonMerge.hasPantionEntry,
    isPantionEntryCorrect: jsonMerge.isPantionEntryCorrect,
    mergePantionEntry: jsonMerge.mergePantionEntry,
    removePantionEntry: jsonMerge.removePantionEntry,
    emptyConfig: () => '{}\n',
};
//# sourceMappingURL=gemini.js.map