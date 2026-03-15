interface ToolResponse {
    [x: string]: unknown;
    content: [{
        type: 'text';
        text: string;
    }];
    isError?: boolean;
}
export declare function success(data: Record<string, unknown>, warnings?: string[]): ToolResponse;
export declare function error(message: string): ToolResponse;
export {};
//# sourceMappingURL=response.d.ts.map