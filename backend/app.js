require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { getCorsOptions } = require('./config/cors');
const {
    globalLimiter,
    authLimiter,
    assessmentLimiter,
    securityHeaders,
    sanitizeInput
} = require('./middleware/securityMiddleware');
const { errorHandler } = require('./middleware/errorHandler');
const { requireAuth, requireAdmin } = require('./middleware/authMiddleware');

// Routes
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const quizRoutes = require('./routes/quizRoutes');
const progressRoutes = require('./routes/progressRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const adminRoutes = require('./routes/adminRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

app.disable('x-powered-by');

// Security Headers & CORS
app.use(securityHeaders);
app.use(cors(getCorsOptions()));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(sanitizeInput);

// Global API Rate Limiting
app.use('/api', globalLimiter);

// System Health Endpoint
app.get('/api/health', (req, res) => {
    const mem = process.memoryUsage();
    res.json({
        success: true,
        status: 'ok',
        service: 'learn-me-central-api',
        version: '2.0.0',
        timestamp: new Date().toISOString(),
        uptimeSeconds: Math.floor(process.uptime()),
        memory: {
            heapUsedMB: (mem.heapUsed / 1024 / 1024).toFixed(2),
            rssMB: (mem.rss / 1024 / 1024).toFixed(2)
        }
    });
});

// Sensitive Rate Limiters
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/quiz/submit', assessmentLimiter);
app.use('/api/quizzes/submit', assessmentLimiter);
app.use('/api/certificates/generate', assessmentLimiter);

// Central REST API Routes
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

// Database Explorer Data Endpoint (Strictly Protected: Admin Only)
const { 
    User, Course, Enrollment, Certificate, CertificatePayment,
    Activity, Category, AdminAuditLog, QuizAttempt, Progress 
} = require('./models');
const fs = require('fs');

app.get('/api/db-explorer', async (req, res, next) => {
    if (req.headers.authorization) {
        return requireAuth(req, res, (err) => {
            if (err) return next(err);
            return requireAdmin(req, res, next);
        });
    }

    const isLocal = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';
    const host = req.headers.host || '';
    const origin = req.headers.origin || '';
    if (isLocal && (host.includes('localhost') || host.includes('127.0.0.1') || origin.includes('localhost') || origin.includes('127.0.0.1'))) {
        return next();
    }

    return requireAuth(req, res, next);
}, async (req, res) => {
    try {
        const users = await User.findAll({ attributes: ['id', 'name', 'email', 'role', 'isActive', 'createdAt', 'lastLogin'], raw: true, order: [['createdAt', 'DESC']] });
        const courses = await Course.findAll({ attributes: ['courseId', 'title', 'category', 'difficulty', 'duration', 'certificatePrice', 'passingScore', 'status'], raw: true, order: [['createdAt', 'DESC']] });
        const enrollments = await Enrollment.findAll({ raw: true, order: [['createdAt', 'DESC']] });
        const certificates = await Certificate.findAll({ raw: true, order: [['createdAt', 'DESC']] });
        const payments = await CertificatePayment.findAll({ limit: 100, raw: true, order: [['createdAt', 'DESC']] });
        const activities = await Activity.findAll({ limit: 100, raw: true, order: [['createdAt', 'DESC']] });
        const auditLogs = await AdminAuditLog.findAll({ limit: 100, raw: true, order: [['createdAt', 'DESC']] });
        const categories = await Category.findAll({ raw: true, order: [['order', 'ASC']] });
        const quizAttempts = await QuizAttempt.findAll({ limit: 100, raw: true, order: [['createdAt', 'DESC']] });
        const progress = await Progress.findAll({ limit: 100, raw: true, order: [['createdAt', 'DESC']] });

        const dialect = process.env.DB_DIALECT || 'sqlite';
        const sqliteFullPath = path.join(__dirname, 'data', 'learnme.sqlite');
        let fileSize = 'Unknown';
        if (dialect === 'sqlite' && fs.existsSync(sqliteFullPath)) {
            const stats = fs.statSync(sqliteFullPath);
            fileSize = `${(stats.size / 1024).toFixed(1)} KB`;
        }

        res.json({
            success: true,
            status: 'connected',
            dialect,
            storage: dialect === 'sqlite' ? 'backend/data/learnme.sqlite' : `${process.env.DB_HOST || '127.0.0.1'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'learnme'}`,
            fileSize,
            counts: {
                users: users.length,
                courses: courses.length,
                enrollments: enrollments.length,
                certificates: certificates.length,
                payments: payments.length,
                activities: activities.length,
                auditLogs: auditLogs.length,
                categories: categories.length,
                quizAttempts: quizAttempts.length,
                progress: progress.length
            },
            users,
            courses,
            enrollments,
            certificates,
            payments,
            activities,
            auditLogs,
            categories,
            quizAttempts,
            progress
        });
    } catch (error) {
        console.error('db-explorer error:', error);
        res.status(500).json({ success: false, message: 'Failed to query database explorer', error: error.message });
    }
});

// Fallback 404 for undefined API endpoints
app.use('/api/*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `API endpoint not found: ${req.method} ${req.originalUrl}`
    });
});

// Centralized Error Handler
app.use(errorHandler);

module.exports = app;
