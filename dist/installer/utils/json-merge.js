const NPX_COMMAND = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const DEFAULT_PANTION_ENTRY = {
    command: NPX_COMMAND,
    args: ['@pantion/dialogs@latest'],
};
export function getPantionEntry() {
    return { ...DEFAULT_PANTION_ENTRY, args: [...DEFAULT_PANTION_ENTRY.args] };
}
/** Accept both npx and npx.cmd as correct */
function isNpxCommand(cmd) {
    return cmd === 'npx' || cmd === 'npx.cmd';
}
export function hasPantionEntry(json) {
    try {
        const config = JSON.parse(json);
        return config.mcpServers?.pantion !== undefined;
    }
    catch {
        return false;
    }
}
export function isPantionEntryCorrect(json) {
    try {
        const config = JSON.parse(json);
        const entry = config.mcpServers?.pantion;
        if (!entry)
            return false;
        const expected = getPantionEntry();
        return entry.command === expected.command
            && Array.isArray(entry.args)
            && entry.args.length === expected.args.length
            && entry.args.every((arg, i) => arg === expected.args[i]);
    }
    catch {
        return false;
    }
}
export function mergePantionEntry(json) {
    let config;
    try {
        config = JSON.parse(json);
    }
    catch {
        config = {};
    }
    if (!config.mcpServers) {
        config.mcpServers = {};
    }
    config.mcpServers.pantion = getPantionEntry();
    return JSON.stringify(config, null, 2) + '\n';
}
export function removePantionEntry(json) {
    const config = JSON.parse(json);
    if (config.mcpServers?.pantion !== undefined) {
        delete config.mcpServers.pantion;
    }
    if (!config.mcpServers) {
        config.mcpServers = {};
    }
    return JSON.stringify(config, null, 2) + '\n';
}
//# sourceMappingURL=json-merge.js.map