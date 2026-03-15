/**
 * Implementation Manifest generator.
 *
 * Records the "collapse" from canon to concrete implementation
 * as a traceable artifact written during translate.
 */
export interface ManifestInput {
    canonName: string;
    canonStatus: string;
    humanStampStatus: string;
    date: string;
    model?: string;
    dialog?: string;
    mode?: string;
    checkResult?: string;
    specFiles: string[];
    rationale?: string;
    deviations?: string;
}
export declare function generateManifest(input: ManifestInput): string;
//# sourceMappingURL=manifest.d.ts.map