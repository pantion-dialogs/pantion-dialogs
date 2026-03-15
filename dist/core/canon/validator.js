import { extractConvergenceStamp, extractOpenQuestionIds } from '../protocol/stamp-parser.js';
/**
 * Evaluate the 12-category readiness checklist against dialog content and stamp.
 */
function evaluateChecklist(dialog, stamp) {
    const allContent = dialog.map((m) => m.content).join(' ');
    const lc = allContent.toLowerCase();
    const check = (name, test, detail) => {
        const status = test();
        return { name, status, detail: status !== 'pass' ? detail?.() : undefined };
    };
    return [
        // 1. Canon status
        check('Canon status', () => {
            if (!stamp)
                return 'fail';
            if (stamp.type === 'draft')
                return 'fail';
            return stamp.date ? 'pass' : 'warning';
        }, () => 'No valid convergence stamp or DRAFT status'),
        // 2. Intent clarity
        check('Intent clarity', () => {
            const hasIntent = /\b(intent|purpose|goal|doel|wat .+ doet|wil .+ bouwen|want to build)\b/i.test(lc);
            return hasIntent ? 'pass' : 'warning';
        }, () => 'No clear intent/purpose detected in dialog'),
        // 3. Observable success
        check('Observable success', () => {
            const hasSuccess = /\b(success|criteria|done|klaar|geslaagd|verificat|zichtbaar|observable|verifiable)\b/i.test(lc);
            return hasSuccess ? 'pass' : 'warning';
        }, () => 'No success criteria detected in dialog'),
        // 4. Inputs complete
        check('Inputs complete', () => {
            const hasInputs = /\b(input|invoer|receives|ontvangt|trigger|click|klik|message|bericht)\b/i.test(lc);
            return hasInputs ? 'pass' : 'warning';
        }, () => 'No explicit inputs detected in dialog'),
        // 5. Outputs unambiguous
        check('Outputs unambiguous', () => {
            const hasOutputs = /\b(output|uitvoer|shows|toont|displays|returns|sends|stuurt|produces|geeft)\b/i.test(lc);
            return hasOutputs ? 'pass' : 'warning';
        }, () => 'No explicit outputs detected in dialog'),
        // 6. Failure specified
        check('Failure specified', () => {
            const hasFailure = /\b(fail|error|fout|mislukt|falen|probleem|oeps|fallback|graceful|retry)\b/i.test(lc);
            return hasFailure ? 'pass' : 'warning';
        }, () => 'No failure behavior detected in dialog'),
        // 7. Constraints absolute
        check('Constraints absolute', () => {
            const hasConstraints = stamp.stabilityZones.length > 0 ||
                /\b(constraint|must|never|always|nooit|altijd|verplicht|forbidden|verboden)\b/i.test(lc);
            return hasConstraints ? 'pass' : 'warning';
        }, () => 'No absolute constraints detected'),
        // 8. Non-goals documented
        check('Non-goals documented', () => {
            const hasNonGoals = /\b(non-goal|not do|does not|niet doen|geen scope|out of scope|niet-doel|geen .+ functie)\b/i.test(lc);
            return hasNonGoals ? 'pass' : 'warning';
        }, () => 'No explicit non-goals detected in dialog'),
        // 9. Ambiguity handled (with OQ-ID consistency when present)
        check('Ambiguity handled', () => {
            // Extract OQ-IDs from dialog content
            const dialogOQs = extractOpenQuestionIds(allContent);
            if (dialogOQs.length === 0) {
                // No OQ-IDs in dialog — fall back to plain stamp check
                if (stamp.openQuestions.length > 0)
                    return 'fail';
                return 'pass';
            }
            // OQ-IDs are present — validate consistency
            const dialogOQIds = new Set(dialogOQs.map(q => q.id));
            const resolvedIds = new Set((stamp.resolvedQuestions ?? []).map(q => q.id));
            // Check for duplicate IDs (already deduplicated by extractOpenQuestionIds,
            // but check raw text for actual duplicates)
            const rawPattern = /OPEN QUESTION \[OQ-(\d+)\]/gi;
            const rawIds = [];
            let rawMatch;
            while ((rawMatch = rawPattern.exec(allContent)) !== null) {
                rawIds.push(`OQ-${rawMatch[1]}`);
            }
            const duplicates = rawIds.filter((id, idx) => rawIds.indexOf(id) !== idx);
            if (duplicates.length > 0)
                return 'warning';
            // Check: all dialog OQ-IDs should be either open in stamp or resolved
            const stampOpenTexts = stamp.openQuestions.map(q => q.toLowerCase());
            for (const oqId of dialogOQIds) {
                const isResolved = resolvedIds.has(oqId);
                const isInStampOpen = stampOpenTexts.some(t => t.includes(oqId.toLowerCase()));
                if (!isResolved && !isInStampOpen) {
                    // OQ-ID found in dialog but not accounted for in stamp
                    if (stamp.type !== 'draft')
                        return 'warning';
                }
            }
            // If converged and there are unresolved OQ-IDs (in stamp.openQuestions)
            if (stamp.type !== 'draft' && stamp.openQuestions.length > 0)
                return 'fail';
            return 'pass';
        }, () => {
            const dialogOQs = extractOpenQuestionIds(allContent);
            if (dialogOQs.length === 0) {
                return `Open questions remain: ${stamp.openQuestions.join(', ')}`;
            }
            // Check for duplicates
            const rawPattern = /OPEN QUESTION \[OQ-(\d+)\]/gi;
            const rawIds = [];
            let rawMatch;
            while ((rawMatch = rawPattern.exec(allContent)) !== null) {
                rawIds.push(`OQ-${rawMatch[1]}`);
            }
            const duplicates = [...new Set(rawIds.filter((id, idx) => rawIds.indexOf(id) !== idx))];
            if (duplicates.length > 0) {
                return `Duplicate OQ-IDs: ${duplicates.join(', ')}`;
            }
            const resolvedCount = (stamp.resolvedQuestions ?? []).length;
            if (stamp.openQuestions.length > 0) {
                return `Open questions remain: ${stamp.openQuestions.join(', ')}`;
            }
            return `${dialogOQs.length} questions tracked, ${resolvedCount} resolved`;
        }),
        // 10. Authority Budget
        check('Authority Budget', () => {
            const raw = stamp.raw.toLowerCase();
            const hasRights = /authority budget rights:\s*(complete|partial)/i.test(raw);
            const hasConsumption = /authority budget consumption:\s*(complete|partial|n\/a)/i.test(raw);
            if (hasRights && hasConsumption)
                return 'pass';
            if (hasRights || hasConsumption)
                return 'warning';
            // Also check dialog content for authority-related terms
            const inContent = /\b(authority|budget|allowed|forbidden|data.?access|data.?retention|audit)\b/i.test(lc);
            return inContent ? 'warning' : 'fail';
        }, () => 'Authority Budget not fully specified in stamp'),
        // 11. Inference Policy
        check('Inference Policy', () => {
            return stamp.inferencePolicy ? 'pass' : 'warning';
        }, () => 'Inference policy not specified'),
        // 12. Dialog stability
        check('Dialog stability', () => {
            // If converged and no open questions, we consider it stable
            if (stamp.type !== 'draft' && stamp.openQuestions.length === 0)
                return 'pass';
            return 'warning';
        }, () => 'Dialog may not be fully stable'),
        // 13. Lineage trace
        check('Lineage trace', () => {
            const rawStatus = stamp.raw.match(/STATUS:\s*(.+)/i)?.[1]?.trim().toUpperCase() ?? '';
            // Content without stamp block to avoid self-matching
            const contentWithoutStamp = allContent.replace(stamp.raw, '');
            if (rawStatus.includes('AMENDED')) {
                // Amended canon must have an Amendment section in the dialog
                const hasAmendment = /# ?Amendment/i.test(contentWithoutStamp);
                return hasAmendment ? 'pass' : 'fail';
            }
            if (rawStatus.includes('RECONVERGED')) {
                // Reconverged canon should have reconvergence context
                const hasReconvergence = /reconverg|gap.?analysis|supplementary/i.test(contentWithoutStamp);
                return hasReconvergence ? 'pass' : 'warning';
            }
            // Not amended or reconverged — lineage is n/a
            return 'pass';
        }, () => {
            const rawStatus = stamp.raw.match(/STATUS:\s*(.+)/i)?.[1]?.trim().toUpperCase() ?? '';
            if (rawStatus.includes('AMENDED'))
                return 'Stamp is AMENDED but no Amendment section found in dialog';
            if (rawStatus.includes('RECONVERGED'))
                return 'Stamp is RECONVERGED but no reconvergence context found in dialog';
            return 'Lineage trace incomplete';
        }),
    ];
}
/**
 * Compute the total outcome from categories and issues.
 * PASS: all categories pass (or na), no error issues
 * WARN: no fail categories, but warnings exist
 * FAIL: at least 1 fail category or error issue
 */
function computeTotalOutcome(categories, issues) {
    const hasFail = categories.some((c) => c.status === 'fail');
    const hasError = issues.some((i) => i.severity === 'error');
    if (hasFail || hasError)
        return 'FAIL';
    const hasWarning = categories.some((c) => c.status === 'warning');
    if (hasWarning)
        return 'WARN';
    return 'PASS';
}
/**
 * Structural convergence validation (Level 2).
 * Checks the dialog for required convergence elements with 12-category scoring.
 */
export function validateConvergence(dialog) {
    const issues = [];
    let stamp;
    if (dialog.length === 0) {
        return {
            valid: false,
            status: 'open',
            issues: [{ severity: 'error', message: 'Dialog is empty' }],
            openQuestions: [],
        };
    }
    // Find the last assistant message with a stamp
    const assistantMessages = dialog.filter((m) => m.role === 'assistant');
    const lastAssistant = assistantMessages[assistantMessages.length - 1];
    if (!lastAssistant) {
        issues.push({ severity: 'error', message: 'No assistant messages found' });
        return { valid: false, status: 'open', issues, openQuestions: [] };
    }
    // Check for convergence stamp in the last assistant message
    stamp = extractConvergenceStamp(lastAssistant.content) ?? undefined;
    if (!stamp) {
        // Also check all assistant messages (stamp might not be in the very last one)
        for (const msg of [...assistantMessages].reverse()) {
            const found = extractConvergenceStamp(msg.content);
            if (found) {
                stamp = found ?? undefined;
                break;
            }
        }
    }
    if (!stamp) {
        issues.push({ severity: 'error', message: 'No DIALOGSPEC STAMP found in dialog' });
        return { valid: false, status: 'open', issues, openQuestions: [] };
    }
    if (stamp.type === 'draft') {
        issues.push({ severity: 'info', message: 'Stamp indicates DRAFT status' });
        return {
            valid: false,
            status: 'open',
            issues,
            openQuestions: stamp.openQuestions,
            stamp,
        };
    }
    // Check required stamp fields
    if (!stamp.date) {
        issues.push({ severity: 'error', message: 'Stamp missing DATE field' });
    }
    if (!stamp.canonType) {
        issues.push({ severity: 'warning', message: 'Stamp missing CANON TYPE field' });
    }
    if (!stamp.inferencePolicy) {
        issues.push({ severity: 'warning', message: 'Stamp missing INFERENCE POLICY field' });
    }
    // Open questions must be none
    if (stamp.openQuestions.length > 0) {
        issues.push({
            severity: 'error',
            message: `OPEN QUESTIONS is not empty: ${stamp.openQuestions.join(', ')}`,
        });
    }
    // Check for stability zones (HARD constraints)
    if (stamp.stabilityZones.length === 0) {
        issues.push({ severity: 'warning', message: 'No stability zones (HARD constraints) listed in stamp' });
    }
    // Check for Convergence Verification Table (recommended before stamp)
    const allAssistantContent = assistantMessages.map((m) => m.content).join('\n');
    if (!/convergence verification/i.test(allAssistantContent)) {
        issues.push({ severity: 'info', message: 'No Convergence Verification Table found. Consider adding one before the stamp to confirm all criteria are met.' });
    }
    // Run the 12-category readiness checklist
    const categories = evaluateChecklist(dialog, stamp);
    // Add issues from category evaluation
    for (const cat of categories) {
        if (cat.status === 'fail') {
            issues.push({ severity: 'error', message: `Checklist FAIL: ${cat.name} — ${cat.detail ?? 'not satisfied'}` });
        }
        else if (cat.status === 'warning' && cat.detail) {
            issues.push({ severity: 'warning', message: `Checklist WARNING: ${cat.name} — ${cat.detail}` });
        }
    }
    const score = categories.filter((c) => c.status === 'pass').length;
    const hasErrors = issues.some((i) => i.severity === 'error');
    const totalOutcome = computeTotalOutcome(categories, issues);
    return {
        valid: !hasErrors,
        status: hasErrors ? 'open' : 'converged',
        issues,
        openQuestions: stamp.openQuestions,
        stamp,
        categories,
        score,
        totalOutcome,
    };
}
/**
 * Validate an existing canon file on disk (used by pantion_check).
 * Parses the dialog from the file content and validates.
 */
export function validateCanonFile(dialogContent) {
    const messages = parseDialogFile(dialogContent);
    return validateConvergence(messages);
}
/**
 * Parse a dialog .md file back into messages.
 */
function parseDialogFile(content) {
    const messages = [];
    const lines = content.split('\n');
    let current = null;
    for (const line of lines) {
        const humanMatch = line.match(/^HUMAN:\s*(.*)/);
        const assistantMatch = line.match(/^ASSISTANT:\s*(.*)/);
        if (humanMatch) {
            if (current)
                messages.push(current);
            current = { role: 'user', content: humanMatch[1] };
        }
        else if (assistantMatch) {
            if (current)
                messages.push(current);
            current = { role: 'assistant', content: assistantMatch[1] };
        }
        else if (current) {
            current.content += '\n' + line;
        }
    }
    if (current)
        messages.push(current);
    return messages;
}
//# sourceMappingURL=validator.js.map