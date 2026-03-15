import * as fs from 'node:fs';
import { createBackup } from '../utils/backup.js';
import { heading, ok, fail, info, blank } from '../utils/output.js';
export function restore(backupFile, dryRun) {
    heading(dryRun ? 'Restore (dry run)' : 'Restore');
    if (!fs.existsSync(backupFile)) {
        fail(`Backup file not found: ${backupFile}`);
        blank();
        return { success: false, backupFile, targetFile: '', error: `Backup file not found: ${backupFile}` };
    }
    const bakMatch = backupFile.match(/^(.+)\.bak-\d{8}-\d{4}$/);
    if (!bakMatch) {
        fail(`Not a valid backup file (expected *.bak-YYYYMMDD-HHmm): ${backupFile}`);
        blank();
        return { success: false, backupFile, targetFile: '', error: 'Not a valid backup filename' };
    }
    const targetFile = bakMatch[1];
    if (dryRun) {
        info(`Would restore ${backupFile}`);
        info(`         → ${targetFile}`);
        blank();
        return { success: true, backupFile, targetFile };
    }
    let safetyBackupPath;
    if (fs.existsSync(targetFile)) {
        const safety = createBackup(targetFile);
        if (safety)
            safetyBackupPath = safety;
    }
    try {
        fs.copyFileSync(backupFile, targetFile);
    }
    catch (err) {
        fail(`Cannot restore: ${err instanceof Error ? err.message : String(err)}`);
        blank();
        return { success: false, backupFile, targetFile, safetyBackupPath, error: String(err) };
    }
    ok(`Restored ${targetFile}`);
    info(`  From: ${backupFile}`);
    if (safetyBackupPath) {
        info(`  Safety backup: ${safetyBackupPath}`);
    }
    blank();
    return { success: true, backupFile, targetFile, safetyBackupPath };
}
//# sourceMappingURL=restore.js.map