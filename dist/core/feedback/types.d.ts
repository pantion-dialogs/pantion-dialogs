export type FeedbackType = 'missed-question' | 'insufficient-answer' | 'unexpected-edge-case' | 'wrong-assumption';
export type FeedbackSeverity = 'high' | 'medium' | 'low';
export type FeedbackSource = 'reflect' | 'manual' | 'amend';
export interface FeedbackEntry {
    type: FeedbackType;
    domain: string;
    severity: FeedbackSeverity;
    description: string;
    suggestion: string;
    source: FeedbackSource;
    canonName: string;
    date: string;
}
export interface LearnedRule {
    date: string;
    sources: string[];
    pattern: string;
    rule: string;
    domain: string;
    approved: boolean;
}
export type FeedbackScope = 'project-and-global' | 'project-only';
export interface FeedbackConfig {
    scope: FeedbackScope;
}
//# sourceMappingURL=types.d.ts.map