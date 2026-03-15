/**
 * Implementation Manifest generator.
 *
 * Records the "collapse" from canon to concrete implementation
 * as a traceable artifact written during translate.
 */
export function generateManifest(input) {
    const lines = [];
    lines.push(`<!-- Derived from: canon/${input.canonName}/dialog.md, ${input.date} -->`);
    lines.push('');
    lines.push('# Implementation Manifest');
    lines.push('');
    // Meta
    lines.push('## Meta');
    lines.push(`- **Canon**: ${input.canonName}`);
    lines.push(`- **Canon Status**: ${input.canonStatus} (HUMAN STAMP: ${input.humanStampStatus})`);
    lines.push(`- **Collapse Date**: ${input.date}`);
    lines.push(`- **Model**: ${input.model ?? '[unknown]'}`);
    lines.push(`- **Dialog**: ${input.dialog ?? '[none]'}`);
    lines.push(`- **Mode**: ${input.mode ?? '[unknown]'}`);
    if (input.checkResult) {
        lines.push(`- **Check Result**: ${input.checkResult}`);
    }
    lines.push('');
    // Inputs
    lines.push('## Inputs');
    lines.push(`- Canon dialog: canon/${input.canonName}/dialog.md`);
    if (input.specFiles.length > 0) {
        lines.push('- Spec files:');
        for (const file of input.specFiles) {
            lines.push(`  - ${file}`);
        }
    }
    lines.push('');
    // Outputs
    lines.push('## Outputs');
    if (input.specFiles.length > 0) {
        for (const file of input.specFiles) {
            lines.push(`- ${file}`);
        }
    }
    else {
        lines.push('- [no files generated]');
    }
    lines.push('');
    // Rationale
    lines.push('## Rationale');
    lines.push(input.rationale ?? '[To be filled by implementing agent]');
    lines.push('');
    // Deviations
    lines.push('## Deviations');
    lines.push(input.deviations ?? 'none');
    lines.push('');
    return lines.join('\n');
}
//# sourceMappingURL=manifest.js.map