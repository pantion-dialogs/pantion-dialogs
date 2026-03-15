export function success(data, warnings) {
    return {
        content: [{
                type: 'text',
                text: JSON.stringify({ success: true, data, ...(warnings?.length ? { warnings } : {}) }, null, 2),
            }],
    };
}
export function error(message) {
    return {
        content: [{
                type: 'text',
                text: JSON.stringify({ success: false, error: message }, null, 2),
            }],
        isError: true,
    };
}
//# sourceMappingURL=response.js.map