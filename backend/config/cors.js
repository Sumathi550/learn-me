/**
 * Learn Me - CORS Configuration
 * Allows only authorized Student Web, Admin Web, and configured production origins.
 */
require('dotenv').config();

const DEFAULT_ORIGINS = [
    'http://localhost:3000', // Student Local Portal
    'http://localhost:3001', // Admin Local Dashboard
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://localhost:5000', // Backend local host (for direct exploration)
    'http://127.0.0.1:5000'
];

function getCorsOptions() {
    const configuredOrigins = [];

    if (process.env.CLIENT_ORIGIN) configuredOrigins.push(process.env.CLIENT_ORIGIN.replace(/\/$/, ''));
    if (process.env.STUDENT_WEB_URL) configuredOrigins.push(process.env.STUDENT_WEB_URL.replace(/\/$/, ''));
    if (process.env.ADMIN_WEB_URL) configuredOrigins.push(process.env.ADMIN_WEB_URL.replace(/\/$/, ''));

    if (process.env.CORS_ORIGINS) {
        process.env.CORS_ORIGINS.split(',').map(s => s.trim().replace(/\/$/, '')).forEach(origin => {
            if (origin && !configuredOrigins.includes(origin)) configuredOrigins.push(origin);
        });
    }

    const allowedOrigins = [...new Set([...DEFAULT_ORIGINS, ...configuredOrigins])];

    return {
        origin: function (origin, callback) {
            // Allow server-to-server or curl/mobile requests without origin header, or file: requests
            if (!origin || origin === 'null') {
                return callback(null, true);
            }

            const normalizedOrigin = origin.replace(/\/$/, '');
            const isLocalhostOrigin = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(normalizedOrigin);

            if (
                allowedOrigins.includes(normalizedOrigin) || 
                isLocalhostOrigin || 
                process.env.NODE_ENV !== 'production' || 
                process.env.NODE_ENV === 'test'
            ) {
                return callback(null, true);
            }

            console.warn(`[CORS] Blocked request from unauthorized origin: ${origin}`);
            return callback(new Error(`CORS policy violation: Origin ${origin} not permitted.`));
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
        exposedHeaders: ['Content-Disposition']
    };
}

module.exports = { getCorsOptions, DEFAULT_ORIGINS };
