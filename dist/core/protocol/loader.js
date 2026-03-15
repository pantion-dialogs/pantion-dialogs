import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
function assertDir(protocolDir) {
    if (existsSync(protocolDir))
        return protocolDir;
    throw new Error(`Protocol directory not found: ${protocolDir}`);
}
export function loadProtocolCore(protocolDir, options) {
    const dir = assertDir(protocolDir);
    const corePath = resolve(dir, 'core.md');
    let content = readFileSync(corePath, 'utf-8');
    if (options?.includeAdvanced) {
        const advancedPath = resolve(dir, 'core-advanced.md');
        if (existsSync(advancedPath)) {
            content += '\n\n' + readFileSync(advancedPath, 'utf-8');
        }
    }
    return content;
}
export function loadProtocolCommand(name, protocolDir) {
    const dir = assertDir(protocolDir);
    const cmdPath = resolve(dir, 'commands', `${name}.md`);
    if (!existsSync(cmdPath)) {
        throw new Error(`Protocol command not found: ${name}`);
    }
    return readFileSync(cmdPath, 'utf-8');
}
export function loadProtocolCoreSection(protocolDir, section) {
    const dir = assertDir(protocolDir);
    const filePath = resolve(dir, `core-${section}.md`);
    if (!existsSync(filePath)) {
        throw new Error(`Protocol core section not found: core-${section}.md`);
    }
    return readFileSync(filePath, 'utf-8');
}
export function loadProtocolCommandPhase(commandName, phase, protocolDir) {
    const dir = assertDir(protocolDir);
    const filePath = resolve(dir, 'commands', `${commandName}-${phase}.md`);
    if (!existsSync(filePath)) {
        throw new Error(`Protocol command phase not found: ${commandName}-${phase}.md`);
    }
    return readFileSync(filePath, 'utf-8');
}
export function getProtocolDirectory(protocolDir) {
    return assertDir(protocolDir);
}
//# sourceMappingURL=loader.js.map