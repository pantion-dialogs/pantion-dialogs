export declare function loadProtocolCore(protocolDir: string, options?: {
    includeAdvanced?: boolean;
}): string;
export declare function loadProtocolCommand(name: string, protocolDir: string): string;
export type CoreSection = 'stamps' | 'save';
export type CommandPhase = 'stamps' | 'post';
export declare function loadProtocolCoreSection(protocolDir: string, section: CoreSection): string;
export declare function loadProtocolCommandPhase(commandName: string, phase: CommandPhase, protocolDir: string): string;
export declare function getProtocolDirectory(protocolDir: string): string;
//# sourceMappingURL=loader.d.ts.map