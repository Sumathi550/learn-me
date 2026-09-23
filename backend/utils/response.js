/**
 * Learn Me - Standard API Response Formatter
 * 
 * Standard Envelope:
 * Success: { success: true, data: { ... }, message: "..." }
 * Error:   { success: false, message: "...", errors: [...] }
 * 
 * Includes backward-compatible field merging for legacy test suites.
 */

function sendSuccess(res, data = {}, message = 'Success', statusCode = 200, legacyFields = {}) {
    // If data is already an array or primitive, wrap it
    const responsePayload = {
        success: true,
        message,
        data,
        ...legacyFields
    };

    // If data is an object and not an array, surface top-level keys for backward-compatible test assertions
    if (data && typeof data === 'object' && !Array.isArray(data)) {
        Object.keys(data).forEach(key => {
            if (!(key in responsePayload)) {
                responsePayload[key] = data[key];
            }
        });
    }

    return res.status(statusCode).json(responsePayload);
}

function sendError(res, message = 'Internal Server Error', statusCode = 500, extra = {}) {
    return res.status(statusCode).json({
        success: false,
        message,
        ...extra
    });
}

module.exports = {
    sendSuccess,
    sendError
};
