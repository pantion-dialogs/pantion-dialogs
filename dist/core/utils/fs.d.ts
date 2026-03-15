/**
 * Validate that a resolved path stays within the given base directory.
 * Throws if the path escapes (path traversal).
 */
export declare function assertPathWithin(filePath: string, baseDir: string): void;
/**
 * Validate that a name is safe for use in filenames (no path separators or traversal).
 */
export declare function assertSafeName(name: string): void;
export declare function ensureDir(dir: string): void;
export declare function writeFile(filePath: string, content: string): void;
export declare function readFileSafe(filePath: string): string | null;
export declare function canonDir(projectPath: string): string;
//# sourceMappingURL=fs.d.ts.map