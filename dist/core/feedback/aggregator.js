import { readAllFeedback, readFeedbackConfig, readProjectPatterns, readGlobalPatterns, writeProjectPatterns, writeGlobalPatterns, } from './store.js';
import { stampDateTime } from '../utils/datetime.js';
// --- Parse feedback entries from markdown ---
const ENTRY_REGEX = /> \*\*\[([^\]]+)\]\*\* \((\w+)\) — (.+)\n> (.+)\n> \*\*Suggestion:\*\* (.+)\n> \*Source: (\w+) \| Canon: ([^ |]+) \| Date: ([^*]+)\*/g;
export function parseFeedbackEntries(content) {
    const entries = [];
    let match;
    // Reset regex state
    ENTRY_REGEX.lastIndex = 0;
    while ((match = ENTRY_REGEX.exec(content)) !== null) {
        entries.push({
            type: match[1],
            severity: match[2],
            domain: match[3].trim(),
            description: match[4].trim(),
            suggestion: match[5].trim(),
            source: match[6],
            canonName: match[7].trim(),
            date: match[8].trim(),
        });
    }
    return entries;
}
const PATTERN_THRESHOLD = 2;
export function detectPatterns(entries) {
    // Group by domain + type
    const groups = new Map();
    for (const entry of entries) {
        const key = `${entry.domain}::${entry.type}`;
        const existing = groups.get(key);
        if (existing) {
            existing.entries.push(entry);
        }
        else {
            groups.set(key, { domain: entry.domain, type: entry.type, entries: [entry] });
        }
    }
    const rules = [];
    const today = stampDateTime();
    for (const group of groups.values()) {
        if (group.entries.length < PATTERN_THRESHOLD)
            continue;
        // Find the most common suggestion
        const suggestionCounts = new Map();
        for (const e of group.entries) {
            suggestionCounts.set(e.suggestion, (suggestionCounts.get(e.suggestion) ?? 0) + 1);
        }
        const topSuggestion = [...suggestionCounts.entries()].sort((a, b) => b[1] - a[1])[0][0];
        rules.push({
            date: today,
            sources: [...new Set(group.entries.map((e) => e.canonName))],
            pattern: `${group.type} in ${group.domain} (${group.entries.length} occurrences)`,
            rule: topSuggestion,
            domain: group.domain,
            approved: false,
        });
    }
    return rules;
}
// --- Format patterns file ---
export function formatPatternsFile(rules) {
    const lines = [
        '# Learned Patterns',
        '',
        `*Generated: ${stampDateTime()}*`,
        '',
    ];
    if (rules.length === 0) {
        lines.push('No patterns detected yet.');
        return lines.join('\n');
    }
    for (const rule of rules) {
        const status = rule.approved ? 'APPROVED' : 'PROPOSED';
        lines.push(`## [${status}] ${rule.pattern}`, '', `- **Rule:** ${rule.rule}`, `- **Domain:** ${rule.domain}`, `- **Sources:** ${rule.sources.join(', ')}`, `- **Date:** ${rule.date}`, '');
    }
    return lines.join('\n');
}
// --- Signal patterns (lightweight, no writes) ---
export function signalPatterns(projectPath, canonName, description) {
    // Read existing patterns from project and global
    const projectContent = readProjectPatterns(projectPath);
    const globalContent = readGlobalPatterns();
    if (!projectContent && !globalContent)
        return undefined;
    const combined = [projectContent, globalContent].filter(Boolean).join('\n');
    // Simple keyword matching against existing patterns
    const words = description.toLowerCase().split(/\s+/);
    const patternLines = combined.split('\n').filter((l) => l.startsWith('- **Rule:**'));
    for (const line of patternLines) {
        const rule = line.replace('- **Rule:** ', '').toLowerCase();
        const matchCount = words.filter((w) => rule.includes(w)).length;
        if (matchCount >= 2) {
            return `Related pattern found: ${line.replace('- **Rule:** ', '')}`;
        }
    }
    return undefined;
}
// --- Full aggregation (rebuild from source data) ---
export function aggregateFeedback(projectPath) {
    const config = readFeedbackConfig(projectPath);
    // Scan all canon dirs for feedback.md (source data)
    const allFeedback = readAllFeedback(projectPath);
    // Parse all entries
    const entries = [];
    for (const { content } of allFeedback) {
        entries.push(...parseFeedbackEntries(content));
    }
    // Detect patterns
    const rules = detectPatterns(entries);
    // Write project patterns (always)
    const content = formatPatternsFile(rules);
    writeProjectPatterns(projectPath, content);
    // Write global patterns (if scope allows)
    if (config.scope === 'project-and-global') {
        writeGlobalPatterns(content);
    }
    return rules;
}
//# sourceMappingURL=aggregator.js.map