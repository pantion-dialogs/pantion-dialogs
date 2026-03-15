import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { ServerContext } from '../server.js';
/**
 * Action-oriented prompts that instruct the client LLM to call the corresponding tool.
 * These are exposed as slash commands in Claude Code.
 * Only prompts for enabled tools are registered.
 */
export declare function registerWorkflowPrompts(server: McpServer, _context: ServerContext): void;
//# sourceMappingURL=workflow-prompts.d.ts.map