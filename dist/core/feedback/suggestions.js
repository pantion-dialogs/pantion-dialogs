import { readProjectPatterns, readGlobalPatterns } from './store.js';
// --- Parse approved rules from patterns.md ---
const RULE_BLOCK_REGEX = /## \[APPROVED\] (.+)\n\n- \*\*Rule:\*\* (.+)\n- \*\*Domain:\*\* (.+)\n- \*\*Sources:\*\* (.+)\n- \*\*Date:\*\* (.+)/g;
export function parseApprovedRules(content) {
    const rules = [];
    RULE_BLOCK_REGEX.lastIndex = 0;
    let match;
    while ((match = RULE_BLOCK_REGEX.exec(content)) !== null) {
        rules.push({
            pattern: match[1].trim(),
            rule: match[2].trim(),
            domain: match[3].trim(),
            sources: match[4].trim().split(', '),
            date: match[5].trim(),
            approved: true,
        });
    }
    return rules;
}
// --- Match rules to domain / keywords ---
export function matchRules(rules, domain, keywords) {
    if (rules.length === 0)
        return [];
    return rules.filter((rule) => {
        // Domain match
        if (domain && rule.domain.toLowerCase() === domain.toLowerCase())
            return true;
        // Keyword match (at least one keyword appears in rule or pattern)
        if (keywords && keywords.length > 0) {
            const ruleText = `${rule.rule} ${rule.pattern} ${rule.domain}`.toLowerCase();
            return keywords.some((kw) => ruleText.includes(kw.toLowerCase()));
        }
        return false;
    });
}
// --- Get relevant suggestions for a new session ---
export function getRelevantSuggestions(projectPath, domain, keywords) {
    const projectContent = readProjectPatterns(projectPath);
    const globalContent = readGlobalPatterns();
    if (!projectContent && !globalContent)
        return [];
    // Parse approved rules from both sources
    const allRules = [];
    if (projectContent)
        allRules.push(...parseApprovedRules(projectContent));
    if (globalContent)
        allRules.push(...parseApprovedRules(globalContent));
    // Deduplicate by rule text
    const seen = new Set();
    const unique = allRules.filter((r) => {
        if (seen.has(r.rule))
            return false;
        seen.add(r.rule);
        return true;
    });
    // Match against domain/keywords
    const matched = matchRules(unique, domain, keywords);
    return matched.map((r) => r.rule);
}
//# sourceMappingURL=suggestions.js.map