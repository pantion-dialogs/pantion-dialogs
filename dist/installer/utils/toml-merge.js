const SECTION_HEADER = '[mcp_servers.pantion]';
const EXPECTED_COMMAND = 'command = "npx"';
const EXPECTED_ARGS = 'args = ["@pantion/dialogs@latest"]';
const PANTION_SECTION = `${SECTION_HEADER}
${EXPECTED_COMMAND}
${EXPECTED_ARGS}`;
function findPantionSection(toml) {
    const headerIndex = toml.indexOf(SECTION_HEADER);
    if (headerIndex === -1)
        return null;
    const afterHeader = headerIndex + SECTION_HEADER.length;
    const nextSection = toml.indexOf('\n[', afterHeader);
    const end = nextSection === -1 ? toml.length : nextSection;
    return { start: headerIndex, end };
}
export function hasPantionEntry(toml) {
    return toml.includes(SECTION_HEADER);
}
export function isPantionEntryCorrect(toml) {
    const section = findPantionSection(toml);
    if (!section)
        return false;
    const sectionText = toml.slice(section.start, section.end);
    return sectionText.includes(EXPECTED_COMMAND) && sectionText.includes(EXPECTED_ARGS);
}
export function mergePantionEntry(toml) {
    const section = findPantionSection(toml);
    if (section) {
        const before = toml.slice(0, section.start);
        const after = toml.slice(section.end);
        return (before + PANTION_SECTION + after).replace(/\n{3,}/g, '\n\n').trim() + '\n';
    }
    const trimmed = toml.trim();
    if (trimmed.length === 0) {
        return PANTION_SECTION + '\n';
    }
    return trimmed + '\n\n' + PANTION_SECTION + '\n';
}
export function removePantionEntry(toml) {
    const section = findPantionSection(toml);
    if (!section)
        return toml;
    const before = toml.slice(0, section.start);
    const after = toml.slice(section.end);
    return (before + after).replace(/\n{3,}/g, '\n\n').trim() + '\n';
}
//# sourceMappingURL=toml-merge.js.map