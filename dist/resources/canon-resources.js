import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { resolve } from 'node:path';
import { readFileSafe, canonDialogPath, canonSummaryPath, canonIndexPath, assertSafeName, listDialogs, getDialog, listSouls, readDialogCanon, readCanonIndex, } from '../core/index.js';
// NOTE: resolve() still used for protocol paths (not canon paths)
export function registerResources(server, context) {
    // Resource template: canon dialog
    server.resource('canon-dialog', new ResourceTemplate('pantion://canons/{name}/dialog', {
        list: async () => {
            const canons = readCanonIndex(context.projectPath);
            return {
                resources: canons.map((c) => ({
                    uri: `pantion://canons/${c.name}/dialog`,
                    name: `${c.name} dialog`,
                    mimeType: 'text/markdown',
                })),
            };
        },
    }), async (uri, variables) => {
        const name = String(variables.name);
        assertSafeName(name);
        const content = readFileSafe(canonDialogPath(context.projectPath, name));
        return {
            contents: [{
                    uri: uri.href,
                    mimeType: 'text/markdown',
                    text: content ?? `Canon dialog not found: ${name}`,
                }],
        };
    });
    // Resource template: canon summary
    server.resource('canon-summary', new ResourceTemplate('pantion://canons/{name}/summary', {
        list: async () => {
            const canons = readCanonIndex(context.projectPath);
            return {
                resources: canons.filter((c) => c.hasSummary).map((c) => ({
                    uri: `pantion://canons/${c.name}/summary`,
                    name: `${c.name} summary`,
                    mimeType: 'text/markdown',
                })),
            };
        },
    }), async (uri, variables) => {
        const name = String(variables.name);
        assertSafeName(name);
        const content = readFileSafe(canonSummaryPath(context.projectPath, name));
        return {
            contents: [{
                    uri: uri.href,
                    mimeType: 'text/markdown',
                    text: content ?? `Canon summary not found: ${name}`,
                }],
        };
    });
    // Static resource: canon index
    server.resource('canon-index', 'pantion://canons/index', async (uri) => {
        const content = readFileSafe(canonIndexPath(context.projectPath));
        return {
            contents: [{
                    uri: uri.href,
                    mimeType: 'text/markdown',
                    text: content ?? 'No canon index found.',
                }],
        };
    });
    // Static resource: dialogs list
    server.resource('dialogs-list', 'pantion://dialogs', async (uri) => {
        const dialogs = listDialogs(context.projectPath, context.dialogsDir);
        const text = dialogs.map((s) => `## ${s.manifest.displayName}\n- Name: ${s.manifest.name}\n- Version: ${s.manifest.version}\n- Source: ${s.source}\n- Has Canon: ${s.hasCanon ? 'yes' : 'no'}\n- Keywords: ${s.manifest.keywords.join(', ')}\n- Description: ${s.manifest.description}`).join('\n\n');
        return {
            contents: [{
                    uri: uri.href,
                    mimeType: 'text/markdown',
                    text: text || 'No dialogs found.',
                }],
        };
    });
    // Static resource: souls list
    server.resource('souls-list', 'pantion://souls', async (uri) => {
        const souls = listSouls(context.projectPath, context.soulsDir);
        const text = souls.map((s) => `## ${s.manifest.displayName}\n- Name: ${s.manifest.name}\n- Version: ${s.manifest.version}\n- Source: ${s.source}\n- Description: ${s.manifest.description}`).join('\n\n');
        return {
            contents: [{
                    uri: uri.href,
                    mimeType: 'text/markdown',
                    text: text || 'No souls found.',
                }],
        };
    });
    // Resource template: dialog canon dialog
    server.resource('skill-canon-dialog', new ResourceTemplate('pantion://dialogs/{name}/canon/dialog', {
        list: undefined,
    }), async (uri, variables) => {
        const name = String(variables.name);
        assertSafeName(name);
        const content = readDialogCanon(context.projectPath, name);
        return {
            contents: [{
                    uri: uri.href,
                    mimeType: 'text/markdown',
                    text: content ?? `Dialog canon dialog not found: ${name}`,
                }],
        };
    });
    // Static resource: protocol intent document
    server.resource('protocol-intent', 'pantion://protocol/intent', async (uri) => {
        const content = readFileSafe(resolve(context.protocolDir, 'pantion-intent.md'));
        return {
            contents: [{
                    uri: uri.href,
                    mimeType: 'text/markdown',
                    text: content ?? 'Protocol intent document not found.',
                }],
        };
    });
    // Static resource: protocol future prompt
    server.resource('protocol-future-prompt', 'pantion://protocol/future-prompt', async (uri) => {
        const content = readFileSafe(resolve(context.protocolDir, 'pantion-future-prompt.md'));
        return {
            contents: [{
                    uri: uri.href,
                    mimeType: 'text/markdown',
                    text: content ?? 'Protocol future prompt document not found.',
                }],
        };
    });
    // Resource template: skill rules
    server.resource('skill-rules', new ResourceTemplate('pantion://dialogs/{name}/rules', {
        list: undefined,
    }), async (uri, variables) => {
        const name = String(variables.name);
        assertSafeName(name);
        const skill = getDialog(name, context.projectPath, context.dialogsDir);
        if (!skill) {
            return {
                contents: [{
                        uri: uri.href,
                        mimeType: 'text/markdown',
                        text: `Skill not found: ${name}`,
                    }],
            };
        }
        const text = [
            `# ${skill.manifest.displayName} — Convergence Rules`,
            '',
            skill.convergenceRules,
            '',
            '---',
            '',
            `# ${skill.manifest.displayName} — Translation Instructions`,
            '',
            skill.translatePrompt,
        ].join('\n');
        return {
            contents: [{
                    uri: uri.href,
                    mimeType: 'text/markdown',
                    text,
                }],
        };
    });
}
//# sourceMappingURL=canon-resources.js.map