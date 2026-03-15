import { createPendingHumanStamp, createAutoApprovedHumanStamp, formatCanonMetadata } from '../protocol/stamp-parser.js';
/**
 * Normalize literal \n (backslash + n) sequences to real newlines.
 * Client LLMs sometimes send escaped strings via MCP.
 */
export function normalizeLiteralNewlines(text) {
    // Only replace if the text contains literal \n but no real newlines —
    // this indicates the entire content is on one line with escaped newlines.
    if (!text.includes('\n') && text.includes('\\n')) {
        return text.replace(/\\n/g, '\n');
    }
    return text;
}
/**
 * Format canon content from a session into a markdown dialog file.
 * Shared by both session/canon-writer (root canons) and dialog/canon-writer (dialog canons).
 *
 * @param session - The session containing messages and optional stamp
 * @param header - The top-level heading (e.g. '# DialogSpec Dialog')
 * @param headerComments - HTML comments to include after the header
 * @param mode - 'dialog'/'synthetic' for auto-approved, 'full' for pending human stamp
 * @param metadata - Optional canon metadata block
 */
export function formatCanonContent(session, header, headerComments, mode, metadata) {
    const lines = [];
    lines.push(header);
    for (const comment of headerComments) {
        lines.push(comment);
    }
    lines.push('');
    // Only add stampRaw at the top if the stamp is NOT already in the dialog messages.
    // The client may include the stamp in the last assistant message, which would cause duplication.
    const stampInMessages = session.stampRaw && session.messages.some((msg) => msg.content.includes('=== DIALOGSPEC STAMP ==='));
    if (session.stampRaw && !stampInMessages) {
        lines.push(session.stampRaw);
        lines.push('');
    }
    lines.push('---');
    lines.push('');
    for (const msg of session.messages) {
        // Check if message content starts with an explicit role prefix (ADVISOR:)
        // This allows the client-LLM to inject ADVISOR turns as assistant messages
        const hasAdvisorPrefix = msg.role === 'assistant' && msg.content.startsWith('ADVISOR:');
        const role = hasAdvisorPrefix
            ? '' // Content already has the ADVISOR: prefix
            : msg.role === 'user'
                ? (mode === 'synthetic' ? 'PANTION' : 'HUMAN')
                : 'ASSISTANT';
        lines.push(hasAdvisorPrefix ? msg.content : `${role}: ${msg.content}`);
        lines.push('');
    }
    // Append CANON METADATA block (server-generated replay context)
    if (metadata) {
        lines.push('');
        lines.push(formatCanonMetadata(metadata));
    }
    // Append HUMAN STAMP block (auto-approved for dialog mode, pending for full mode)
    lines.push('');
    const autoApprove = mode === 'dialog' || mode === 'synthetic';
    lines.push(autoApprove ? createAutoApprovedHumanStamp() : createPendingHumanStamp());
    lines.push('');
    return lines.join('\n');
}
/**
 * Format summary content with a derivation comment header.
 *
 * @param name - The canon/dialog name
 * @param date - The date string for the derivation comment
 * @param derivationPath - The path to the source dialog (e.g. 'canon/myproject/dialog.md')
 * @param rawContent - The raw summary content from the client
 * @param derivationNote - Optional second comment line (defaults to generic source-of-truth note)
 */
export function formatSummaryContent(_name, date, derivationPath, rawContent, derivationNote) {
    let content = normalizeLiteralNewlines(rawContent);
    if (!content.includes('Derived from:')) {
        const note = derivationNote ?? '<!-- This is a DERIVED file — the dialog is the only source of truth -->';
        content = `<!-- Derived from: ${derivationPath}, ${date} -->\n${note}\n\n${content}`;
    }
    return content;
}
//# sourceMappingURL=format.js.map