import { listDialogs } from './registry.js';
/**
 * Auto-select a dialog based on the user's first message.
 * Matches against dialog keywords. Returns the dialog and which keywords matched.
 */
export function autoSelectDialog(userMessage, projectPath, dialogsDir) {
    const allDialogs = listDialogs(projectPath, dialogsDir);
    if (allDialogs.length === 0)
        return null;
    const lower = userMessage.toLowerCase();
    let bestMatch = null;
    let bestScore = 0;
    let bestKeywords = [];
    for (const dlg of allDialogs) {
        const matched = [];
        for (const keyword of dlg.manifest.keywords) {
            if (lower.includes(keyword.toLowerCase())) {
                matched.push(keyword);
            }
        }
        if (matched.length > bestScore ||
            (matched.length === bestScore && bestMatch && dlg.manifest.name < bestMatch.manifest.name)) {
            bestScore = matched.length;
            bestMatch = dlg;
            bestKeywords = matched;
        }
    }
    if (!bestMatch)
        return null;
    return { dialog: bestMatch, matchedKeywords: bestKeywords };
}
//# sourceMappingURL=selector.js.map