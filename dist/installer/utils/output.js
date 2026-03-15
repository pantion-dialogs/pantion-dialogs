export function heading(text) {
    console.log(`\n${text}`);
    console.log('─'.repeat(text.length));
}
export function ok(text) {
    console.log(`  ✓ ${text}`);
}
export function warn(text) {
    console.log(`  ⚠ ${text}`);
}
export function fail(text) {
    console.log(`  ✗ ${text}`);
}
export function info(text) {
    console.log(`  ${text}`);
}
export function blank() {
    console.log();
}
//# sourceMappingURL=output.js.map