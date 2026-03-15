import { ALL_CLIENT_IDS, resolveClientId } from './types.js';
function parseClientArg(args) {
    const allIndex = args.indexOf('--all');
    if (allIndex !== -1) {
        return [...ALL_CLIENT_IDS];
    }
    const clientIndex = args.indexOf('--client');
    if (clientIndex === -1 || clientIndex + 1 >= args.length) {
        return null;
    }
    const value = args[clientIndex + 1];
    const resolved = resolveClientId(value);
    if (!resolved) {
        return null;
    }
    return [resolved];
}
export function parseInstallerArgs(args) {
    if (args.length === 0 || args[0] === 'help' || args[0] === '--help' || args[0] === '-h') {
        return { command: 'help' };
    }
    const command = args[0];
    const dryRun = args.includes('--dry-run');
    switch (command) {
        case 'doctor':
            return { command: 'doctor' };
        case 'install': {
            const clients = parseClientArg(args);
            if (!clients) {
                return { command: 'help' };
            }
            return { command: 'install', clients, dryRun };
        }
        case 'verify': {
            const clients = parseClientArg(args);
            if (!clients) {
                return { command: 'help' };
            }
            return { command: 'verify', clients };
        }
        case 'uninstall': {
            const clients = parseClientArg(args);
            if (!clients) {
                return { command: 'help' };
            }
            return { command: 'uninstall', clients, dryRun };
        }
        case 'restore': {
            const restoreIndex = args.indexOf('--restore');
            const fileArg = restoreIndex !== -1 ? args[restoreIndex + 1] : args[1];
            if (!fileArg || fileArg.startsWith('--')) {
                return { command: 'help' };
            }
            return { command: 'restore', backupFile: fileArg, dryRun };
        }
        default:
            return { command: 'help' };
    }
}
export function printHelp() {
    console.log(`
@pantion/dialogs — MCP server + installer

Usage:
  npx @pantion/dialogs install --client <name>     Configure Pantion for a coding tool
  npx @pantion/dialogs install --all               Configure Pantion for all detected tools
  npx @pantion/dialogs doctor                      Check prerequisites and detected tools
  npx @pantion/dialogs verify --client <name>      Check if Pantion is correctly configured
  npx @pantion/dialogs uninstall --client <name>   Remove Pantion configuration
  npx @pantion/dialogs uninstall --all             Remove Pantion from all clients
  npx @pantion/dialogs restore <backup-file>       Restore a config from backup

Clients:
  claude      Claude Code
  cursor      Cursor
  windsurf    Windsurf
  gemini      Gemini CLI
  codex       Codex

Options:
  --client <name>   Target client (see list above)
  --all             Target all supported clients
  --dry-run         Show what would change without writing files
  --help, -h        Show this help message

Examples:
  npx @pantion/dialogs install --client claude
  npx @pantion/dialogs install --all
  npx @pantion/dialogs install --all --dry-run
  npx @pantion/dialogs verify --client cursor
  npx @pantion/dialogs uninstall --client windsurf
  npx @pantion/dialogs doctor
`);
}
//# sourceMappingURL=cli.js.map