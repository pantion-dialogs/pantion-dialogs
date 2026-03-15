/**
 * Router types — response schema and action types for pantion_router.
 *
 * The router is a pure decision function: read-only, stateless, no side-effects.
 * It returns instructions that the coding agent executes.
 */
export type RouterResponseType = 'route' | 'menu' | 'clarify';
export type RouterAction = 'start' | 'resume' | 'amend' | 'check' | 'approve' | 'translate' | 'reflect' | 'feedback' | 'learn' | 'list';
export interface RouterMenuItem {
    label: string;
    action: RouterAction;
    args?: Record<string, string>;
    reason?: string;
    priority?: number;
}
export interface MenuSection {
    id: string;
    title: string;
    items: RouterMenuItem[];
}
export type DecisionPath = 'rules_only' | 'rules+context' | 'llm_fallback' | 'clarified' | 'degraded_no_context' | 'degraded_unclassified' | 'degraded_tool_unavailable' | 'degraded_error';
export interface RouterResponse {
    response_type: RouterResponseType;
    schema_version: string;
    router_version: string;
    request_id: string;
    timestamp_utc: string;
    tool_to_call?: string;
    args?: Record<string, string>;
    why?: string;
    needs_confirmation?: boolean;
    menu?: {
        sections: MenuSection[];
    };
    question?: string;
    options?: Array<{
        label: string;
        action: RouterAction;
        args?: Record<string, string>;
    }>;
    confidence: number;
    confidence_reason: string;
    decision_path: DecisionPath;
    context_summary: string;
    warnings: string[];
    degraded: boolean;
    next_actions?: RouterMenuItem[];
}
//# sourceMappingURL=types.d.ts.map