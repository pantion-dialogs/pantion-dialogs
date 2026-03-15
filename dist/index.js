#!/usr/bin/env node
// Pantion Dialogs — Free Edition
process.env.PANTION_EDITION = process.env.PANTION_EDITION ?? 'free';
import { resolve, dirname } from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const __dirname = dirname(fileURLToPath(import.meta.url));
// Installer commands — intercept before starting MCP server
const INSTALLER_COMMANDS = ['install', 'uninstall', 'verify', 'doctor', 'restore', 'help', '--help', '-h'];
const firstArg = process.argv[2];
if (firstArg && INSTALLER_COMMANDS.includes(firstArg)) {
    // Run installer CLI
    const { parseInstallerArgs, printHelp } = await import('./installer/cli.js');
    const { doctor } = await import('./installer/commands/doctor.js');
    const { install } = await import('./installer/commands/install.js');
    const { verify } = await import('./installer/commands/verify.js');
    const { uninstall } = await import('./installer/commands/uninstall.js');
    const { restore } = await import('./installer/commands/restore.js');
    const parsed = parseInstallerArgs(process.argv.slice(2));
    switch (parsed.command) {
        case 'doctor':
            doctor();
            break;
        case 'install': {
            const results = install(parsed.clients, parsed.dryRun);
            const anyFailed = results.some((r) => !r.success);
            if (anyFailed)
                process.exitCode = 1;
            break;
        }
        case 'verify': {
            const results = verify(parsed.clients);
            const anyFailed = results.some((r) => !r.entryCorrect);
            if (anyFailed)
                process.exitCode = 1;
            break;
        }
        case 'uninstall': {
            const results = uninstall(parsed.clients, parsed.dryRun);
            const anyFailed = results.some((r) => !r.success);
            if (anyFailed)
                process.exitCode = 1;
            break;
        }
        case 'restore': {
            const result = restore(parsed.backupFile, parsed.dryRun);
            if (!result.success)
                process.exitCode = 1;
            break;
        }
        case 'help':
            printHelp();
            break;
    }
}
else {
    // Start MCP server (default behavior)
    const { StdioServerTransport } = await import('@modelcontextprotocol/sdk/server/stdio.js');
    const { createServer } = await import('./server.js');
    function parseArgs(args) {
        let projectPath = process.cwd();
        for (let i = 0; i < args.length; i++) {
            if (args[i] === '--project-path' && args[i + 1]) {
                projectPath = resolve(args[i + 1]);
                i++;
            }
        }
        return { projectPath };
    }
    function resolveAssetDir(name, projectPath) {
        const projectLocal = resolve(projectPath, name);
        if (existsSync(projectLocal))
            return projectLocal;
        return resolveBundledDir(name);
    }
    function resolveBundledDir(name) {
        const bundled = resolve(__dirname, '..', name);
        if (existsSync(bundled))
            return bundled;
        const repoRoot = resolve(__dirname, '..', '..', '..', name);
        if (existsSync(repoRoot))
            return repoRoot;
        throw new Error(`Cannot find bundled ${name}/ directory. Looked in:\n  - ${bundled}\n  - ${repoRoot}`);
    }
    const { projectPath } = parseArgs(process.argv.slice(2));
    const protocolDir = resolveAssetDir('protocol', projectPath);
    const dialogsDir = resolveBundledDir('dialogs');
    const soulsDir = resolveBundledDir('souls');
    const server = await createServer({ projectPath, protocolDir, dialogsDir, soulsDir });
    const transport = new StdioServerTransport();
    await server.connect(transport);
}
//# sourceMappingURL=index.js.map