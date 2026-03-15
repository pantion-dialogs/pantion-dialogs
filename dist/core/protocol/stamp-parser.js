import { stampDateTime } from '../utils/datetime.js';
const STAMP_START = '=== DIALOGSPEC STAMP ===';
const STAMP_END = '=== /DIALOGSPEC STAMP ===';
const PROGRESS_START = '=== DIALOGSPEC PROGRESS ===';
const PROGRESS_END = '=== /DIALOGSPEC PROGRESS ===';
const HUMAN_START = '=== HUMAN STAMP ===';
const HUMAN_END = '=== /HUMAN STAMP ===';
const METADATA_START = '=== CANON METADATA ===';
const METADATA_END = '=== /CANON METADATA ===';
/**
 * Normalize stamp text to handle LLM variations:
 * - Different delimiters (---, ==, ***, varying = counts)
 * - Extra whitespace in delimiters
 * - Missing closing tags (infer block end)
 */
function normalizeStampText(text, stampType = 'convergence') {
    const keyword = stampType === 'progress' ? 'DIALOGSPEC PROGRESS' : 'DIALOGSPEC STAMP';
    const expectedStart = stampType === 'progress' ? PROGRESS_START : STAMP_START;
    const expectedEnd = stampType === 'progress' ? PROGRESS_END : STAMP_END;
    // Already has exact delimiters — no normalization needed
    if (text.includes(expectedStart) && text.includes(expectedEnd))
        return text;
    // Pattern: 2+ repeated delimiter chars (=, -, *), optional whitespace, optional /, keyword, optional whitespace, 2+ delimiter chars
    // Case-insensitive to handle "Dialogspec Stamp" etc.
    const delimChars = '[=\\-*]{2,}';
    const openPattern = new RegExp(`${delimChars}\\s*${keyword}\\s*${delimChars}`, 'i');
    const closePattern = new RegExp(`${delimChars}\\s*/?\\s*${keyword}\\s*${delimChars}`, 'i');
    let result = text;
    // Find and replace opening delimiter
    const openMatch = result.match(openPattern);
    if (!openMatch)
        return text; // No recognizable stamp at all
    // Check if the opening match is actually the closing (contains /)
    const openStr = openMatch[0];
    if (openStr.includes('/')) {
        // The first match is actually a closing tag; search for opening before it
        return text;
    }
    result = result.replace(openMatch[0], expectedStart);
    // Find and replace closing delimiter (must contain /)
    const closeMatch = result.match(closePattern);
    if (closeMatch && closeMatch[0] !== expectedStart) {
        result = result.replace(closeMatch[0], expectedEnd);
    }
    else {
        // Missing closing tag — infer block end
        const startPos = result.indexOf(expectedStart);
        const afterStart = result.slice(startPos + expectedStart.length);
        // Find the end: double newline or end of text
        const doubleNewline = afterStart.search(/\n\s*\n\s*\n/);
        const endPos = doubleNewline !== -1
            ? startPos + expectedStart.length + doubleNewline
            : result.length;
        result = result.slice(0, endPos) + '\n' + expectedEnd;
    }
    return result;
}
/**
 * Case-insensitive getValue: finds a line starting with prefix (any casing),
 * extracts the value after the colon.
 */
function getValue(lines, prefix) {
    const lowerPrefix = prefix.toLowerCase();
    const line = lines.find((l) => l.trim().toLowerCase().startsWith(lowerPrefix));
    if (!line)
        return '';
    const colonIdx = line.indexOf(':');
    return colonIdx !== -1 ? line.slice(colonIdx + 1).trim() : '';
}
/**
 * Case-insensitive getList: finds a list field by prefix (any casing),
 * supports inline comma-separated values, "none" keyword, and bullet/numbered lists.
 */
function getList(lines, prefix) {
    const lowerPrefix = prefix.toLowerCase();
    const lineIdx = lines.findIndex((l) => l.trim().toLowerCase().startsWith(lowerPrefix));
    if (lineIdx === -1)
        return [];
    const headerLine = lines[lineIdx];
    const colonIdx = headerLine.indexOf(':');
    const inline = colonIdx !== -1 ? headerLine.slice(colonIdx + 1).trim() : '';
    if (inline && inline.toLowerCase() !== 'none') {
        // "none (N resolved: ...)" is still "none" for the open questions list
        if (/^none\s*\(/i.test(inline))
            return [];
        return inline.split(',').map((s) => s.trim()).filter(Boolean);
    }
    if (inline.toLowerCase() === 'none')
        return [];
    const items = [];
    for (let i = lineIdx + 1; i < lines.length; i++) {
        const trimmed = lines[i].trim();
        if (!trimmed || trimmed.startsWith('==='))
            continue;
        // Case-insensitive section header detection (stops list parsing)
        if (/^[a-z][a-z\s-]+:/i.test(trimmed) && !trimmed.match(/^\d+\.\s+/) && !trimmed.startsWith('- '))
            break;
        if (trimmed.match(/^\d+\.\s+/) || trimmed.startsWith('- ')) {
            items.push(trimmed.replace(/^\d+\.\s+/, '').replace(/^- /, '').trim());
            continue;
        }
        break;
    }
    return items;
}
/**
 * Extract OPEN QUESTION [OQ-NNN] patterns from dialog text.
 * Returns an array of OpenQuestion objects (without resolvedAt — that comes from the stamp).
 */
export function extractOpenQuestionIds(text) {
    const pattern = /OPEN QUESTION \[OQ-(\d+)\]:\s*(.+)/gi;
    const questions = [];
    const seen = new Set();
    let match;
    while ((match = pattern.exec(text)) !== null) {
        const id = `OQ-${match[1]}`;
        if (!seen.has(id)) {
            seen.add(id);
            questions.push({ id, text: match[2].trim() });
        }
    }
    return questions;
}
/**
 * Parse resolved references from the OPEN QUESTIONS stamp field.
 * Format: "none (N resolved: OQ-001 at H[4], OQ-002 at A[7])"
 */
function parseResolvedReferences(value) {
    const resolved = [];
    const pattern = /OQ-(\d+)\s+at\s+([HA]\[\d+\])/gi;
    let match;
    while ((match = pattern.exec(value)) !== null) {
        resolved.push({
            id: `OQ-${match[1]}`,
            text: '', // text is not available in the resolved reference
            resolvedAt: match[2],
        });
    }
    return resolved;
}
export function extractConvergenceStamp(text) {
    const normalized = normalizeStampText(text, 'convergence');
    const startIdx = normalized.indexOf(STAMP_START);
    const endIdx = normalized.indexOf(STAMP_END);
    if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx)
        return null;
    const raw = normalized.slice(startIdx, endIdx + STAMP_END.length);
    const lines = raw.split('\n');
    const status = getValue(lines, 'STATUS').toLowerCase();
    let type = 'converged';
    if (status.includes('quick'))
        type = 'converged-quick';
    if (status.includes('dialog'))
        type = 'converged-dialog';
    if (status.includes('synthetic'))
        type = 'converged-synthetic';
    if (status.includes('draft'))
        type = 'draft';
    // Parse resolved references from OPEN QUESTIONS field value
    const oqRawValue = getValue(lines, 'OPEN QUESTIONS');
    const resolvedQuestions = parseResolvedReferences(oqRawValue);
    return {
        type,
        date: getValue(lines, 'DATE'),
        model: getValue(lines, 'MODEL') || undefined,
        canonType: getValue(lines, 'CANON TYPE'),
        parent: getValue(lines, 'PARENT'),
        openQuestions: getList(lines, 'OPEN QUESTIONS'),
        resolvedQuestions: resolvedQuestions.length > 0 ? resolvedQuestions : undefined,
        inferencePolicy: getValue(lines, 'INFERENCE POLICY'),
        stabilityZones: getList(lines, 'STABILITY ZONES'),
        flexZones: getList(lines, 'FLEX ZONES'),
        raw,
    };
}
export function extractProgressStamp(text) {
    const normalized = normalizeStampText(text, 'progress');
    const startIdx = normalized.indexOf(PROGRESS_START);
    const endIdx = normalized.indexOf(PROGRESS_END);
    if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx)
        return null;
    const raw = normalized.slice(startIdx, endIdx + PROGRESS_END.length);
    const lines = raw.split('\n');
    const statusVal = getValue(lines, 'STATUS');
    const sessionMatch = statusVal.match(/session\s+(\d+)/i);
    const session = sessionMatch ? parseInt(sessionMatch[1], 10) : 1;
    const extractListSection = (prefix) => {
        const lowerPrefix = prefix.toLowerCase();
        const items = [];
        let inSection = false;
        for (const line of lines) {
            if (line.trim().toLowerCase().startsWith(lowerPrefix)) {
                inSection = true;
                continue;
            }
            if (inSection) {
                const trimmed = line.trim();
                if (trimmed.match(/^\d+\.\s+/) || trimmed.startsWith('- ')) {
                    items.push(trimmed.replace(/^\d+\.\s+/, '').replace(/^- /, ''));
                }
                else if (trimmed && !trimmed.startsWith('===')) {
                    inSection = false;
                }
            }
        }
        return items;
    };
    return {
        type: 'draft',
        date: getValue(lines, 'DATE'),
        session,
        canonType: getValue(lines, 'CANON TYPE'),
        resolved: extractListSection('RESOLVED'),
        openQuestions: extractListSection('REMAINING OPEN QUESTIONS'),
        nextFocus: getValue(lines, 'NEXT SESSION FOCUS'),
        raw,
    };
}
/**
 * Extract the HUMAN STAMP from text.
 * Returns null if no HUMAN STAMP block found.
 */
export function extractHumanStamp(text) {
    const startIdx = text.indexOf(HUMAN_START);
    if (startIdx === -1)
        return null;
    let endIdx = text.indexOf(HUMAN_END);
    if (endIdx === -1 || endIdx <= startIdx) {
        // Infer end from double newline or end of text
        const afterStart = text.slice(startIdx + HUMAN_START.length);
        const doubleNewline = afterStart.search(/\n\s*\n\s*\n/);
        endIdx = doubleNewline !== -1
            ? startIdx + HUMAN_START.length + doubleNewline
            : text.length;
        // Reconstruct with closing tag for raw
    }
    const raw = text.slice(startIdx, endIdx + HUMAN_END.length);
    const lines = raw.split('\n');
    const statusVal = getValue(lines, 'STATUS').toUpperCase();
    let status = 'PENDING';
    if (statusVal === 'APPROVED')
        status = 'APPROVED';
    if (statusVal === 'REJECTED')
        status = 'REJECTED';
    if (statusVal === 'AUTO-APPROVED')
        status = 'AUTO-APPROVED';
    return {
        status,
        date: getValue(lines, 'DATE'),
        role: getValue(lines, 'ROLE'),
        note: getValue(lines, 'NOTE'),
        raw,
    };
}
/**
 * Format a HUMAN STAMP block as a string.
 */
export function formatHumanStamp(stamp) {
    return [
        HUMAN_START,
        `DATE: ${stamp.date ?? '[not set]'}`,
        `ROLE: ${stamp.role ?? '[not set]'}`,
        `STATUS: ${stamp.status}`,
        `NOTE: ${stamp.note ?? '[not set]'}`,
        HUMAN_END,
    ].join('\n');
}
/**
 * Create a pending HUMAN STAMP block (for new canons in full mode).
 */
export function createPendingHumanStamp() {
    return formatHumanStamp({ status: 'PENDING' });
}
/**
 * Create an auto-approved HUMAN STAMP block (for dialog mode canons).
 */
export function createAutoApprovedHumanStamp() {
    return formatHumanStamp({
        status: 'AUTO-APPROVED',
        date: stampDateTime(),
        role: 'dialog-mode',
        note: 'Auto-approved (dialog mode)',
    });
}
/**
 * Replace the HUMAN STAMP block in a text with a new one.
 * Returns the updated text, or null if no existing HUMAN STAMP found.
 */
export function replaceHumanStamp(text, newStamp) {
    const startIdx = text.indexOf(HUMAN_START);
    if (startIdx === -1)
        return null;
    let endIdx = text.indexOf(HUMAN_END);
    if (endIdx === -1)
        return null;
    endIdx += HUMAN_END.length;
    return text.slice(0, startIdx) + newStamp + text.slice(endIdx);
}
/**
 * Format a CANON METADATA block as a string.
 * Server-generated metadata about the canon (dialog, soul, mode, check result).
 */
export function formatCanonMetadata(meta) {
    const lines = [METADATA_START];
    if (meta.dialog)
        lines.push(`DIALOG: ${meta.dialog}`);
    if (meta.soul)
        lines.push(`SOUL: ${meta.soul}`);
    if (meta.mode)
        lines.push(`MODE: ${meta.mode}`);
    if (meta.checkResult)
        lines.push(`CHECK RESULT: ${meta.checkResult}`);
    lines.push(METADATA_END);
    return lines.join('\n');
}
/**
 * Extract the CANON METADATA block from text.
 * Returns null if no CANON METADATA block found (backward compat).
 */
export function extractCanonMetadata(text) {
    const startIdx = text.indexOf(METADATA_START);
    if (startIdx === -1)
        return null;
    const endIdx = text.indexOf(METADATA_END);
    if (endIdx === -1 || endIdx <= startIdx)
        return null;
    const raw = text.slice(startIdx, endIdx + METADATA_END.length);
    const lines = raw.split('\n');
    const dialog = getValue(lines, 'DIALOG') || getValue(lines, 'SKILL') || undefined;
    const soul = getValue(lines, 'SOUL') || undefined;
    const modeVal = getValue(lines, 'MODE') || undefined;
    const mode = (modeVal === 'dialog' || modeVal === 'full' || modeVal === 'synthetic' || modeVal === 'deep') ? modeVal : undefined;
    const checkResult = getValue(lines, 'CHECK RESULT') || undefined;
    return { dialog, soul, mode, checkResult };
}
//# sourceMappingURL=stamp-parser.js.map