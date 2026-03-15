import type { CanonEntry } from '../types.js';
/**
 * Read the canon index by scanning the canon/ directory.
 * Does not rely on index.md being present — scans subdirectories containing dialog.md.
 */
export declare function readCanonIndex(projectPath: string): CanonEntry[];
/**
 * Regenerate index.md from the filesystem state.
 * Scans all canons via readCanonIndex() and renders a fresh index.md.
 */
export declare function regenerateIndex(projectPath: string): void;
/**
 * Add a new canon entry to the index.
 */
export declare function addCanonToIndex(projectPath: string, _meta: {
    name: string;
    status: string;
    date: string;
}): void;
/**
 * Update a canon entry in the index.
 */
export declare function updateCanonInIndex(projectPath: string, _name: string, _updates: {
    status?: string;
    date?: string;
}): void;
//# sourceMappingURL=index-manager.d.ts.map