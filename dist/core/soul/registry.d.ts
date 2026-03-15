import type { Soul } from '../types.js';
/**
 * List all available souls (deduplicated by name, project > user > bundled).
 */
export declare function listSouls(projectPath: string, soulsDir?: string): Soul[];
/**
 * Get a specific soul by name.
 */
export declare function getSoul(name: string, projectPath: string, soulsDir?: string): Soul | null;
//# sourceMappingURL=registry.d.ts.map