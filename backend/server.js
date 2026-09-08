require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/database');
require('./models');
const seedDatabase = require('./utils/seedData');

const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const quizRoutes = require('./routes/quizRoutes');
const progressRoutes = require('./routes/progressRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const port = Number(process.env.PORT) || 5000;

app.disable('x-powered-by');
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '5mb' }));

// Serve frontend static files from root directory
const rootPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(rootPath));

// API Routes
app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'learn-me-backend', timestamp: new Date() }));
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/admin', adminRoutes);

const fs = require('fs');
const { 
    User, Course, Enrollment, Certificate, Activity,
    Category, AdminAuditLog, QuizAttempt, Progress, AdminSettings 
} = require('./models');

// Live Database Explorer Data API
app.get('/api/db-explorer', async (req, res) => {
    try {
        const users = await User.findAll({ attributes: ['id', 'name', 'email', 'role', 'isActive', 'createdAt', 'lastLogin'], raw: true, order: [['createdAt', 'DESC']] });
        const courses = await Course.findAll({ attributes: ['courseId', 'title', 'category', 'difficulty', 'duration', 'certificatePrice', 'passingScore', 'status'], raw: true, order: [['createdAt', 'DESC']] });
        const enrollments = await Enrollment.findAll({ raw: true, order: [['createdAt', 'DESC']] });
        const certificates = await Certificate.findAll({ raw: true, order: [['createdAt', 'DESC']] });
        const payments = [];
        const activities = await Activity.findAll({ limit: 100, raw: true, order: [['createdAt', 'DESC']] });
        const auditLogs = await AdminAuditLog.findAll({ limit: 100, raw: true, order: [['createdAt', 'DESC']] });
        const categories = await Category.findAll({ raw: true, order: [['order', 'ASC']] });
        const quizAttempts = await QuizAttempt.findAll({ limit: 100, raw: true, order: [['createdAt', 'DESC']] });
        const progress = await Progress.findAll({ limit: 100, raw: true, order: [['createdAt', 'DESC']] });

        const dialect = process.env.DB_DIALECT || 'sqlite';
        const sqliteRelPath = 'backend/data/learnme.sqlite';
        const sqliteFullPath = path.join(__dirname, 'data', 'learnme.sqlite');
        let fileSize = 'Unknown';
        if (dialect === 'sqlite' && fs.existsSync(sqliteFullPath)) {
            const stats = fs.statSync(sqliteFullPath);
            fileSize = `${(stats.size / 1024).toFixed(1)} KB`;
        }

        res.json({
            status: 'connected',
            dialect,
            storage: dialect === 'sqlite' ? sqliteRelPath : `${process.env.DB_HOST || '127.0.0.1'}:${process.env.DB_PORT || 3306}/${process.env.DB_NAME || 'learnme'}`,
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
        res.status(500).json({ message: 'Failed to query database', error: error.message });
    }
});

// Specialized Route Redirects & Page Handlers
app.get(['/database', '/database.html', '/db'], (req, res) => {
    res.sendFile(path.join(rootPath, 'database.html'));
});

app.get('/admin*', (req, res) => {
    res.sendFile(path.join(rootPath, 'admin.html'));
});

app.get('/quiz*', (req, res) => {
    res.sendFile(path.join(rootPath, 'quize.html'));
});

app.get('/quize*', (req, res) => {
    res.sendFile(path.join(rootPath, 'quize.html'));
});

app.get('/verify-certificate/:certificateId', (req, res) => {
    res.redirect(`/verify.html?certificate=${encodeURIComponent(req.params.certificateId)}`);
});

// Global Error Handler
app.use((error, req, res, next) => {
    console.error('API Error:', error);
    if (res.headersSent) return next(error);
    res.status(error.status || 500).json({ message: error.message || 'Internal server error' });
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection encountered:', reason && reason.message ? reason.message : reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception encountered:', error.message);
});

if (require.main === module) {
    // Serve the frontend even when the database is temporarily unavailable.
    // Database-backed API requests will surface the connection error normally.
    app.listen(port, () => {
        console.log(`🚀 Learn Me platform running on http://localhost:${port}`);
    });

    connectDB()
        .then(databaseReady => databaseReady ? seedDatabase() : undefined)
        .catch(error => {
            console.error('Database initialization failed; frontend remains available:', error.message);
        });
}

module.exports = app;
