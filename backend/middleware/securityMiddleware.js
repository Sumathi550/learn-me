/**
 * Learn Me - Enterprise Security, Abuse Prevention & Input Sanitization Middleware
 */

const rateLimit = require('express-rate-limit');

// ==========================================
// 1. RATE LIMITING MIDDLEWARE
// ==========================================

// Global Rate Limiter: 300 requests per 15 minutes per IP
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    skip: () => process.env.NODE_ENV === 'test',
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 429,
        message: 'Too many requests from this IP address. Please try again in 15 minutes.'
    }
});

// Sensitive Auth Rate Limiter (Login, Register, Password Reset): 30 attempts per 15 minutes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    skip: () => process.env.NODE_ENV === 'test',
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 429,
        message: 'Too many authentication attempts. For security, please wait 15 minutes before trying again.'
    }
});

// Quiz / Certificate Rate Limiter: 30 operations per 15 minutes
const assessmentLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    skip: () => process.env.NODE_ENV === 'test',
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 429,
        message: 'Assessment or certificate generation request limit reached. Please slow down.'
    }
});

// ==========================================
// 2. SECURITY HEADERS MIDDLEWARE
// ==========================================
function securityHeaders(req, res, next) {
    // Prevent MIME-type sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    // Prevent clickjacking by restricting framing to same origin
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    
    // Enable XSS filter in older browsers
    res.setHeader('X-XSS-Protection', '1; mode=block');
    
    // Referrer policy
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Permissions policy to disable unnecessary device features
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');

    // Content-Security-Policy (allows required fonts, FontAwesome CDN, and client libraries)
    const cspDirectives = [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com",
        "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com",
        "font-src 'self' data: https://cdnjs.cloudflare.com https://fonts.gstatic.com",
        "img-src 'self' data: blob: https:",
        "connect-src 'self' http://localhost:5000 ws://localhost:5000",
        "object-src 'none'",
        "base-uri 'self'"
    ];
    res.setHeader('Content-Security-Policy', cspDirectives.join('; '));

    next();
}

// ==========================================
// 3. INPUT SANITIZATION & XSS STRIPPING
// ==========================================

// Recursive cleaner for objects, arrays, and strings
function sanitizeValue(value) {
    if (typeof value === 'string') {
        return value
            // Strip script tags and content
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            // Strip iframe, object, embed tags
            .replace(/<\/?(iframe|object|embed|applet)\b[^>]*>/gi, '')
            // Neutralize inline event handlers (e.g. onerror=, onload=)
            .replace(/\bon\w+\s*=\s*(['"]).*?\1/gi, '')
            .replace(/\bon\w+\s*=\s*[^>\s]+/gi, '')
            // Neutralize javascript: pseudo-protocols
            .replace(/javascript\s*:/gi, 'blocked:');
    }

    if (Array.isArray(value)) {
        return value.map(sanitizeValue);
    }

    if (value !== null && typeof value === 'object') {
        const cleanObj = {};
        for (const [key, val] of Object.entries(value)) {
            // Strip keys starting with $ or containing . (NoSQL/SQL operator injection guard)
            if (key.startsWith('$') || key.includes('.')) {
                continue;
            }
            cleanObj[key] = sanitizeValue(val);
        }
        return cleanObj;
    }

    return value;
}

function sanitizeInput(req, res, next) {
    if (req.body && typeof req.body === 'object') {
        req.body = sanitizeValue(req.body);
    }
    if (req.query && typeof req.query === 'object') {
        req.query = sanitizeValue(req.query);
    }
    if (req.params && typeof req.params === 'object') {
        req.params = sanitizeValue(req.params);
    }
    next();
}

// ==========================================
// 4. BOT HONEYPOT VALIDATOR
// ==========================================
function botHoneypot(req, res, next) {
    if (req.body && typeof req.body === 'object') {
        // If a honeypot field is filled, it's an automated spam bot
        if (req.body.website_hp || req.body.website_url_hp) {
            console.warn(`[BOT BLOCKED] Automated submission trapped from IP ${req.ip || 'unknown'}`);
            return res.status(400).json({
                message: 'Automated submission rejected. Bot detected.'
            });
        }
    }
    next();
}

// ==========================================
// 5. IN-MEMORY BRUTE-FORCE LOCKOUT TRACKER
// ==========================================
const loginAttempts = new Map(); // key -> { count: number, lockedUntil: number }
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

function checkBruteForceLockout(req, res, next) {
    const isLocal = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';
    const isLocalIp = req.ip === '127.0.0.1' || req.ip === '::1' || req.ip === '::ffff:127.0.0.1';
    if (isLocal && isLocalIp) {
        return next();
    }

    const key = `${req.ip}_${(req.body?.email || '').toLowerCase().trim()}`;
    const record = loginAttempts.get(key);

    if (record && record.lockedUntil && Date.now() < record.lockedUntil) {
        const minutesLeft = Math.ceil((record.lockedUntil - Date.now()) / (60 * 1000));
        return res.status(429).json({
            message: `Account temporarily locked due to excessive failed attempts. Please try again in ${minutesLeft} minute(s).`
        });
    }

    next();
}

function recordLoginFailure(req) {
    const key = `${req.ip}_${(req.body?.email || '').toLowerCase().trim()}`;
    const record = loginAttempts.get(key) || { count: 0, lockedUntil: 0 };
    record.count += 1;

    if (record.count >= MAX_FAILED_ATTEMPTS) {
        record.lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
        console.warn(`[SECURITY LOCKOUT] ${key} locked for 15 minutes due to ${record.count} failed login attempts.`);
    }

    loginAttempts.set(key, record);
}

function resetLoginFailure(req) {
    const key = `${req.ip}_${(req.body?.email || '').toLowerCase().trim()}`;
    loginAttempts.delete(key);
}

module.exports = {
    globalLimiter,
    authLimiter,
    assessmentLimiter,
    securityHeaders,
    sanitizeInput,
    botHoneypot,
    checkBruteForceLockout,
    recordLoginFailure,
    resetLoginFailure
};
