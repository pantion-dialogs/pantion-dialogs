import type { LearnedRule } from './types.js';
export declare function parseApprovedRules(content: string): LearnedRule[];
export declare function matchRules(rules: LearnedRule[], domain?: string, keywords?: string[]): LearnedRule[];
export declare function getRelevantSuggestions(projectPath: string, domain?: string, keywords?: string[]): string[];
//# sourceMappingURL=suggestions.d.ts.map