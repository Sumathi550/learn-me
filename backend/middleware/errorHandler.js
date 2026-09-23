/**
 * Learn Me - Centralized Backend Error Handler
 * Sanitizes errors and returns safe, standardized JSON responses.
 */

function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }

    const statusCode = err.status || err.statusCode || 500;
    const isProd = process.env.NODE_ENV === 'production';

    // Log detailed server-side error
    console.error(`[API Error] ${req.method} ${req.originalUrl} - Status: ${statusCode}`);
    console.error(err.stack || err.message || err);

    let clientMessage = err.message || 'An unexpected error occurred. Please try again.';

    // Hide internal database or syntax errors from clients in production
    if (isProd && statusCode === 500) {
        clientMessage = 'An internal server error occurred. Our team has been notified.';
    }

    res.status(statusCode).json({
        success: false,
        message: clientMessage,
        ...(isProd ? {} : { stack: err.stack, errorDetails: err.errors || undefined })
    });
}

module.exports = { errorHandler };
