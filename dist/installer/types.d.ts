export type ClientId = 'claude' | 'cursor' | 'windsurf' | 'gemini' | 'codex';
export declare const ALL_CLIENT_IDS: ClientId[];
export declare function resolveClientId(value: string): ClientId | null;
export interface PantionMcpEntry {
    command: string;
    args: string[];
}
export interface McpConfig {
    mcpServers?: Record<string, PantionMcpEntry>;
    [key: string]: unknown;
}
export interface InstallResult {
    clientId: ClientId;
    success: boolean;
    action: 'installed' | 'already-installed' | 'failed';
    configPath: string;
    backupPath?: string;
    error?: string;
}
export interface VerifyResult {
    clientId: ClientId;
    configExists: boolean;
    configPath: string;
    hasPantionEntry: boolean;
    entryCorrect: boolean;
    error?: string;
}
export interface UninstallResult {
    clientId: ClientId;
    success: boolean;
    action: 'removed' | 'not-installed' | 'failed';
    configPath: string;
    backupPath?: string;
    error?: string;
}
export interface PrereqCheck {
    name: string;
    passed: boolean;
    version?: string;
    message: string;
}
export interface ClientStatus {
    clientId: ClientId;
    displayName: string;
    installed: boolean;
    hasPantionConfig: boolean;
}
export interface DoctorResult {
    prereqs: PrereqCheck[];
    clients: ClientStatus[];
}
//# sourceMappingURL=types.d.ts.map