import type { ClientId } from './types.js';
export type ParsedCommand = {
    command: 'doctor';
} | {
    command: 'install';
    clients: ClientId[];
    dryRun: boolean;
} | {
    command: 'verify';
    clients: ClientId[];
} | {
    command: 'uninstall';
    clients: ClientId[];
    dryRun: boolean;
} | {
    command: 'restore';
    backupFile: string;
    dryRun: boolean;
} | {
    command: 'help';
};
export declare function parseInstallerArgs(args: string[]): ParsedCommand;
export declare function printHelp(): void;
//# sourceMappingURL=cli.d.ts.map