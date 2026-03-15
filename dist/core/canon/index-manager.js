import { existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { canonDir, readFileSafe, writeFile, ensureDir } from '../utils/fs.js';
import { canonDialogPath, canonSummaryPath } from '../utils/canon-paths.js';
import { extractConvergenceStamp, extractHumanStamp } from '../protocol/stamp-parser.js';
/**
 * Read the canon index by scanning the canon/ directory.
 * Does not rely on index.md being present — scans subdirectories containing dialog.md.
 */
export function readCanonIndex(projectPath) {
    const dir = canonDir(projectPath);
    if (!existsSync(dir))
        return [];
    // Scan for subdirectories that contain a dialog.md file
    const subdirs = readdirSync(dir, { withFileTypes: true })
        .filter((d) => d.isDirectory() && existsSync(canonDialogPath(projectPath, d.name)));
    const entries = [];
    for (const subdir of subdirs) {
        const name = subdir.name;
        const dialogPath = canonDialogPath(projectPath, name);
        const summaryFile = canonSummaryPath(projectPath, name);
        const hasSummary = existsSync(summaryFile);
        let status = 'unknown';
        let date = '';
        let openQuestions = [];
        let type = 'standalone';
        const content = readFileSafe(dialogPath);
        let humanStampStatus;
        if (content) {
            const stamp = extractConvergenceStamp(content);
            if (stamp) {
                status = stamp.type;
                date = stamp.date;
                openQuestions = stamp.openQuestions;
                type = stamp.canonType || 'standalone';
            }
            else {
                status = 'draft';
            }
            const humanStamp = extractHumanStamp(content);
            humanStampStatus = humanStamp?.status ?? 'PENDING';
        }
        entries.push({
            name,
            type,
            status,
            date,
            hasSummary,
            openQuestions,
            humanStampStatus,
        });
    }
    return entries;
}
/**
 * Regenerate index.md from the filesystem state.
 * Scans all canons via readCanonIndex() and renders a fresh index.md.
 */
export function regenerateIndex(projectPath) {
    const entries = readCanonIndex(projectPath);
    const content = renderIndexFile(entries);
    const dir = canonDir(projectPath);
    ensureDir(dir);
    writeFile(resolve(dir, 'index.md'), content);
}
/**
 * Add a new canon entry to the index.
 */
export function addCanonToIndex(projectPath, _meta) {
    regenerateIndex(projectPath);
}
/**
 * Update a canon entry in the index.
 */
export function updateCanonInIndex(projectPath, _name, _updates) {
    regenerateIndex(projectPath);
}
/**
 * Render a full index.md from CanonEntry[].
 */
function renderIndexFile(entries) {
    const lines = [
        '# Canon Index',
        '<!-- Single pane of glass for all canons in this project -->',
        '',
        '## Overview',
        '',
    ];
    if (entries.length > 0) {
        lines.push('| Dialog (Canon) | Summary (Derived) | Type | Status | Open Questions | Last Modified | Amendments |');
        lines.push('|-----------------|-------------------|------|--------|---------------|--------------|------------|');
        for (const entry of entries) {
            lines.push(renderIndexRow(entry));
        }
    }
    else {
        lines.push('_No canons yet._');
    }
    lines.push('');
    lines.push('## Open Questions Backlog');
    lines.push('');
    lines.push('| # | Question | Source Canon | Status |');
    lines.push('|---|----------|-------------|--------|');
    lines.push('');
    lines.push('## Rules');
    lines.push('');
    lines.push('1. This index is updated with EVERY canon change (start, resume, amend, decompose)');
    lines.push('2. The dialog file is THE CANON — the summary is derived');
    lines.push('3. Open questions from all canons are collected in the backlog above');
    lines.push('4. Status lifecycle: DRAFT → CONVERGED → AMENDED');
    lines.push('5. Each canon has TWO files: the dialog (canon) and the summary (derived)');
    lines.push('6. If dialog and summary conflict, the dialog wins');
    lines.push('');
    return lines.join('\n');
}
/**
 * Render a single index table row from a CanonEntry.
 */
function renderIndexRow(entry) {
    const questions = entry.openQuestions.length > 0
        ? entry.openQuestions.join(', ')
        : '—';
    const summaryLink = entry.hasSummary
        ? `[${entry.name}/summary.md](${entry.name}/summary.md)`
        : '—';
    return `| [${entry.name}/dialog.md](${entry.name}/dialog.md) | ${summaryLink} | ${entry.type} | ${entry.status.toUpperCase()} | ${questions} | ${entry.date || '—'} | — |`;
}
//# sourceMappingURL=index-manager.js.map