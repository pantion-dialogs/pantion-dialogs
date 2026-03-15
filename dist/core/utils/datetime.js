/**
 * Generate a UTC datetime string for use in Pantion stamps.
 * Format: YYYY-MM-DDTHH:mmZ (ISO 8601, minute precision, UTC).
 *
 * Examples: "2026-03-02T14:30Z", "2026-12-25T00:00Z"
 */
export function stampDateTime() {
    return new Date().toISOString().slice(0, 16) + 'Z';
}
/**
 * Generate a date-only string (YYYY-MM-DD) for non-stamp contexts
 * like file naming where colons are not allowed.
 */
export function stampDate() {
    return new Date().toISOString().slice(0, 10);
}
//# sourceMappingURL=datetime.js.map