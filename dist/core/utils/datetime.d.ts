/**
 * Generate a UTC datetime string for use in Pantion stamps.
 * Format: YYYY-MM-DDTHH:mmZ (ISO 8601, minute precision, UTC).
 *
 * Examples: "2026-03-02T14:30Z", "2026-12-25T00:00Z"
 */
export declare function stampDateTime(): string;
/**
 * Generate a date-only string (YYYY-MM-DD) for non-stamp contexts
 * like file naming where colons are not allowed.
 */
export declare function stampDate(): string;
//# sourceMappingURL=datetime.d.ts.map