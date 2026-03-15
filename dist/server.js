import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { createRequire } from 'node:module';
import { registerTools } from './tools/index.js';
import { registerResources } from './resources/canon-resources.js';
import { registerPrompts } from './prompts/index.js';
const require = createRequire(import.meta.url);
const packageJson = require('../package.json');
export async function createServer(context) {
    const server = new McpServer({
        name: 'pantion',
        version: packageJson.version,
    }, {
        instructions: [
            'You are connected to the Pantion Dialog MCP server.',
            'Pantion turns ideas into unambiguous intent through structured dialog.',
            '',
            'How it works: the user describes what they want to build in natural language.',
            'You call pantion_start to begin a convergence dialog — a structured conversation',
            'that asks targeted questions until the intent is fully clear.',
            'The result is a "canon": a permanent record of what was intended,',
            'from which any agent can build a functionally equivalent system.',
            '',
            'When the user describes something they want to build, create, or design,',
            'call pantion_start with their message as user_message.',
            '',
            'When the user invokes Pantion without a clear building intent',
            '(e.g. just "pantion", "/pantion", or "start pantion"),',
            'call pantion_start with user_message: "pantion-start" to show a context-driven menu.',
            'The router dialog guides the user to the right action (start new, continue, amend, etc.).',
            '',
            'If the user seems unsure where to start, suggest: "Describe what you want to build,',
            'and I\'ll use Pantion to ask the right questions to turn your idea into a clear intent."',
            'For a list of all commands, suggest /pantion-help.',
            '',
            'Always match the user\'s language. If the user writes in Dutch, respond in Dutch.',
        ].join('\n'),
    });
    await registerTools(server, context);
    registerResources(server, context);
    registerPrompts(server, context);
    return server;
}
//# sourceMappingURL=server.js.map