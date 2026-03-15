import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import * as tomlMerge from '../utils/toml-merge.js';
export const codex = {
    id: 'codex',
    displayName: 'Codex',
    configPath(homeDir) {
        const home = homeDir ?? os.homedir();
        return path.join(home, '.codex', 'config.toml');
    },
    isInstalled(homeDir) {
        const home = homeDir ?? os.homedir();
        return fs.existsSync(path.join(home, '.codex'));
    },
    hasPantionEntry: tomlMerge.hasPantionEntry,
    isPantionEntryCorrect: tomlMerge.isPantionEntryCorrect,
    mergePantionEntry: tomlMerge.mergePantionEntry,
    removePantionEntry: tomlMerge.removePantionEntry,
    emptyConfig: () => '',
};
//# sourceMappingURL=codex.js.map