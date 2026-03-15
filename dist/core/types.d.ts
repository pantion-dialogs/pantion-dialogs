/**
 * Core types shared across the Pantion system.
 * These are independent of any LLM provider.
 */
export interface Message {
    role: 'user' | 'assistant';
    content: string;
}
export type SessionStatus = 'active' | 'draft' | 'converged' | 'converged-quick' | 'converged-dialog' | 'converged-synthetic' | 'amended';
export interface Session {
    id: string;
    name: string;
    status: SessionStatus;
    dialog?: string;
    soul?: string;
    messages: Message[];
    systemPrompt: string;
    createdAt: string;
    updatedAt: string;
    canonName?: string;
    stampRaw?: string;
    canonType?: 'project' | 'dialog';
    targetDialogName?: string;
    /** The protocol command name used (e.g. 'start' or 'dialog') — used for deferred prompt loading */
    promptMode?: string;
}
export interface SessionMeta {
    id: string;
    name: string;
    status: SessionStatus;
    dialog?: string;
    soul?: string;
    updatedAt: string;
    canonName?: string;
    messageCount: number;
    canonType?: 'project' | 'dialog';
    targetDialogName?: string;
}
export interface DialogManifest {
    name: string;
    displayName: string;
    description: string;
    version: string;
    keywords: string[];
}
export interface Dialog {
    manifest: DialogManifest;
    convergenceRules: string;
    translatePrompt: string;
    prompts: Record<string, string>;
    path: string;
    source: 'bundled' | 'user' | 'project' | 'dynamic';
    hasCanon?: boolean;
}
export interface SoulManifest {
    name: string;
    displayName: string;
    description: string;
    version: string;
}
export interface Soul {
    manifest: SoulManifest;
    rules: string;
    path: string;
    source: 'bundled' | 'user' | 'project';
}
export interface OpenQuestion {
    id: string;
    text: string;
    resolvedAt?: string;
}
export interface ConvergenceStamp {
    type: 'converged' | 'converged-quick' | 'converged-dialog' | 'converged-synthetic' | 'draft';
    date: string;
    model?: string;
    canonType: string;
    parent: string;
    openQuestions: string[];
    resolvedQuestions?: OpenQuestion[];
    inferencePolicy: string;
    stabilityZones: string[];
    flexZones: string[];
    raw: string;
}
export type HumanStampStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'AUTO-APPROVED';
export interface HumanStamp {
    status: HumanStampStatus;
    date: string;
    role: string;
    note: string;
    raw: string;
}
export interface ProgressStamp {
    type: 'draft';
    date: string;
    session: number;
    canonType: string;
    resolved: string[];
    openQuestions: string[];
    nextFocus: string;
    raw: string;
}
export type ConvergenceEvent = {
    type: 'converged';
    stamp: ConvergenceStamp;
} | {
    type: 'draft';
    stamp: ProgressStamp;
} | {
    type: 'none';
};
export interface ValidationIssue {
    severity: 'error' | 'warning' | 'info';
    message: string;
}
export type ChecklistStatus = 'pass' | 'fail' | 'warning' | 'na';
export interface ChecklistCategory {
    name: string;
    status: ChecklistStatus;
    detail?: string;
}
export type TotalOutcome = 'PASS' | 'WARN' | 'FAIL';
export interface ValidationResult {
    valid: boolean;
    status: 'converged' | 'open';
    issues: ValidationIssue[];
    openQuestions: string[];
    stamp?: ConvergenceStamp;
    categories?: ChecklistCategory[];
    score?: number;
    totalOutcome?: TotalOutcome;
}
export interface CanonMetadata {
    dialog?: string;
    soul?: string;
    mode?: 'dialog' | 'full' | 'synthetic' | 'deep';
    checkResult?: string;
}
export interface CanonEntry {
    name: string;
    type: string;
    status: string;
    date: string;
    hasSummary: boolean;
    openQuestions: string[];
    humanStampStatus?: HumanStampStatus;
}
export interface ProjectContext {
    hasCanonDir: boolean;
    hasCanons: boolean;
    hasDrafts: boolean;
    hasSessions: boolean;
    canonCount: number;
    draftCount: number;
}
//# sourceMappingURL=types.d.ts.map