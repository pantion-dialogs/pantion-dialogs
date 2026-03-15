// === Protocol: Stamp Parsing ===
export { extractConvergenceStamp, extractProgressStamp, extractHumanStamp, formatHumanStamp, createPendingHumanStamp, createAutoApprovedHumanStamp, replaceHumanStamp, formatCanonMetadata, extractCanonMetadata, extractOpenQuestionIds, } from './protocol/stamp-parser.js';
// === Protocol: Convergence Detection ===
export { detectConvergence, detectStopSignal, } from './protocol/convergence.js';
// === Protocol: System Prompt Assembly ===
export { assembleSystemPrompt, assembleDeferredPrompt, } from './protocol/system-prompt.js';
// === Protocol: Loader ===
export { loadProtocolCore, loadProtocolCommand, loadProtocolCoreSection, loadProtocolCommandPhase, getProtocolDirectory, } from './protocol/loader.js';
// === Session Management ===
export { createSession, saveSession, loadSession, listSessions, getLastSession, findSessionByName, addMessage, updateStatus, } from './session/manager.js';
// === Canon Writer ===
export { writeDialogFile, writeSummaryFile, appendAmendment, appendRealityConvergence, updateCanonIndex, } from './session/canon-writer.js';
// === Canon Format (shared formatting utilities) ===
export { normalizeLiteralNewlines, formatCanonContent, formatSummaryContent, } from './canon/format.js';
// === Canon Validator ===
export { validateConvergence, validateCanonFile, } from './canon/validator.js';
// === Implementation Manifest ===
export { generateManifest, } from './canon/manifest.js';
// === Canon Index ===
export { readCanonIndex, addCanonToIndex, updateCanonInIndex, regenerateIndex, } from './canon/index-manager.js';
// === Dialog Registry ===
export { listDialogs, getDialog, } from './dialog/registry.js';
// === Dialog Canon Writer ===
export { writeDialogCanonFile, writeDialogSummaryFile, dialogHasCanon, readDialogCanon, dialogCanonDir, } from './dialog/canon-writer.js';
// === Soul Registry ===
export { listSouls, getSoul, } from './soul/registry.js';
// === Dialog Selector ===
export { autoSelectDialog, } from './dialog/selector.js';
export { feedbackFilePath, projectFeedbackDir, projectPatternsPath, globalFeedbackDir, globalPatternsPath, feedbackConfigPath, readFeedbackConfig, formatFeedbackEntry, appendFeedbackEntry, readFeedbackForCanon, readAllFeedback, readProjectPatterns, readGlobalPatterns, writeProjectPatterns, writeGlobalPatterns, } from './feedback/store.js';
export { parseFeedbackEntries, detectPatterns, formatPatternsFile, signalPatterns, aggregateFeedback, } from './feedback/aggregator.js';
export { parseApprovedRules, matchRules, getRelevantSuggestions, } from './feedback/suggestions.js';
export { classifyIntent, KEYWORD_REGISTER, HIGH_RISK_ACTIONS, ACTION_TO_TOOL } from './router/classifier.js';
export { collectContext } from './router/context.js';
export { buildMenu, buildContextSummary } from './router/menu.js';
export { buildNextActions, STATIC_SUCCESSORS, TOOL_FALLBACKS } from './router/next-actions.js';
// === Utils ===
export { stampDateTime, stampDate, } from './utils/datetime.js';
export { assertPathWithin, assertSafeName, canonDir, ensureDir, writeFile, readFileSafe, } from './utils/fs.js';
export { canonNameDir, canonIndexPath, canonDialogPath, canonSummaryPath, canonTraceabilityPath, canonImplementationsDir, canonSpecDir, canonPromptPath, canonBriefPath, canonFeedbackPath, dialogCanonDialogPath, dialogCanonSummaryPath, } from './utils/canon-paths.js';
// NOTE: dialogCanonDir is re-exported from ./dialog/canon-writer.js above (uses canon-paths internally)
export { detectProjectContext, } from './utils/project-detect.js';
//# sourceMappingURL=index.js.map