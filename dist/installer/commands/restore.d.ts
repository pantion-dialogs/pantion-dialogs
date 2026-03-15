export interface RestoreResult {
    success: boolean;
    backupFile: string;
    targetFile: string;
    safetyBackupPath?: string;
    error?: string;
}
export declare function restore(backupFile: string, dryRun: boolean): RestoreResult;
//# sourceMappingURL=restore.d.ts.map