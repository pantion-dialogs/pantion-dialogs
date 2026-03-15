import type { FeedbackEntry, FeedbackConfig } from './types.js';
export { canonFeedbackPath as feedbackFilePath } from '../utils/canon-paths.js';
export declare function projectFeedbackDir(projectPath: string): string;
export declare function projectPatternsPath(projectPath: string): string;
export declare function globalFeedbackDir(): string;
export declare function globalPatternsPath(): string;
export declare function feedbackConfigPath(projectPath: string): string;
export declare function readFeedbackConfig(projectPath: string): FeedbackConfig;
export declare function formatFeedbackEntry(entry: FeedbackEntry): string;
export declare function appendFeedbackEntry(projectPath: string, canonName: string, entry: FeedbackEntry): string;
export declare function readFeedbackForCanon(projectPath: string, canonName: string): string | null;
export declare function readAllFeedback(projectPath: string): Array<{
    canonName: string;
    content: string;
}>;
export declare function readProjectPatterns(projectPath: string): string | null;
export declare function readGlobalPatterns(): string | null;
export declare function writeProjectPatterns(projectPath: string, content: string): void;
export declare function writeGlobalPatterns(content: string): void;
//# sourceMappingURL=store.d.ts.map