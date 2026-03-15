import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
export interface ServerContext {
    projectPath: string;
    protocolDir: string;
    dialogsDir: string;
    soulsDir: string;
}
export declare function createServer(context: ServerContext): Promise<McpServer>;
//# sourceMappingURL=server.d.ts.map