import type { FeedbackEntry, LearnedRule } from './types.js';
export declare function parseFeedbackEntries(content: string): FeedbackEntry[];
export declare function detectPatterns(entries: FeedbackEntry[]): LearnedRule[];
export declare function formatPatternsFile(rules: LearnedRule[]): string;
export declare function signalPatterns(projectPath: string, canonName: string, description: string): string | undefined;
export declare function aggregateFeedback(projectPath: string): LearnedRule[];
//# sourceMappingURL=aggregator.d.ts.map