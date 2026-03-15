import * as fs from 'node:fs';
import * as path from 'node:path';
export function createBackup(filePath) {
    if (!fs.existsSync(filePath)) {
        return null;
    }
    const now = new Date();
    const timestamp = [
        now.getFullYear().toString(),
        (now.getMonth() + 1).toString().padStart(2, '0'),
        now.getDate().toString().padStart(2, '0'),
        '-',
        now.getHours().toString().padStart(2, '0'),
        now.getMinutes().toString().padStart(2, '0'),
    ].join('');
    const dir = path.dirname(filePath);
    const base = path.basename(filePath);
    const backupPath = path.join(dir, `${base}.bak-${timestamp}`);
    fs.copyFileSync(filePath, backupPath);
    return backupPath;
}
//# sourceMappingURL=backup.js.map