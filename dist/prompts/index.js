import { registerConvergencePrompts } from './convergence-prompts.js';
import { registerWorkflowPrompts } from './workflow-prompts.js';
export function registerPrompts(server, context) {
    registerConvergencePrompts(server, context);
    registerWorkflowPrompts(server, context);
}
//# sourceMappingURL=index.js.map