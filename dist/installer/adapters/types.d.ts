import type { ClientId } from '../types.js';
export interface ClientAdapter {
    id: ClientId;
    displayName: string;
    configPath(homeDir?: string): string;
    isInstalled(homeDir?: string): boolean;
    hasPantionEntry(content: string): boolean;
    isPantionEntryCorrect(content: string): boolean;
    mergePantionEntry(content: string): string;
    removePantionEntry(content: string): string;
    emptyConfig(): string;
}
//# sourceMappingURL=types.d.ts.map