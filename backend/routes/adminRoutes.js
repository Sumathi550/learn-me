const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { Course } = require('../models');
const { Category } = require('../models');
const { Progress } = require('../models');
const { QuizAttempt } = require('../models');
const { Certificate } = require('../models');
const { CertificatePayment } = require('../models');
const { Activity } = require('../models');
const { AdminAuditLog } = require('../models');
const { AdminSettings } = require('../models');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');
const { logAdminAuditAction } = require('../middleware/adminAuditMiddleware');

// Enforce strict Auth + Owner Admin Verification on ALL Admin Routes
router.use(requireAuth);
router.use(requireAdmin);

// ===============================
// DASHBOARD METRICS & STATS
// ===============================
router.get('/dashboard', async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({ role: 'user' });
        const activeStudents = await User.countDocuments({ role: 'user', isActive: true });
        const totalCourses = await Course.countDocuments();
        const publishedCourses = await Course.countDocuments({ status: 'published' });
        const draftCourses = await Course.countDocuments({ status: 'draft' });
        const totalEnrollments = await Progress.countDocuments();
        const completedCourses = await Progress.countDocuments({ status: 'Completed' });
        const totalCertificates = await Certificate.countDocuments();

        const downloadedAggregate = await Certificate.aggregate([
            { $group: { _id: null, totalDownloads: { $sum: '$downloadCount' } } }
        ]);
        const certificatesDownloaded = downloadedAggregate[0]?.totalDownloads || 0;

        const totalPaymentsCount = await CertificatePayment.countDocuments();
        const successfulPaymentsCount = await CertificatePayment.countDocuments({ paymentStatus: 'Successful' });

        const revenueAggregate = await CertificatePayment.aggregate([
            { $match: { paymentStatus: 'Successful' } },
            { $group: { _id: null, totalRevenue: { $sum: '$amount' } } }
        ]);
        const totalRevenue = revenueAggregate[0]?.totalRevenue || 0;

        const recentActivity = await Activity.find()
            .populate('userId', 'name email')
            .sort({ createdAt: -1 })
            .limit(10);

        const recentAuditLogs = await AdminAuditLog.find()
            .sort({ createdAt: -1 })
            .limit(10);

        res.json({
            stats: {
                totalStudents,
                activeStudents,
                totalCourses,
                publishedCourses,
                draftCourses,
                totalEnrollments,
                completedCourses,
                totalCertificates,
                certificatesDownloaded,
                totalPaymentsCount,
                successfulPaymentsCount,
                totalRevenue
            },
            recentActivity,
            recentAuditLogs
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch dashboard metrics.', error: error.message });
    }
});

// ===============================
// COURSE MANAGEMENT
// ===============================

// List all courses (includes draft & complete quiz answer key for admin)
router.get('/courses', logAdminAuditAction('ADMIN_PROFILE_VIEWED', () => ({ details: 'Admin listed all courses' })), async (req, res) => {
    try {
        const courses = await Course.find().sort({ order: 1, createdAt: -1 });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch courses.', error: error.message });
    }
});

// Get single course by ID with full details & answer keys for admin
router.get('/courses/:courseId', async (req, res) => {
    try {
        const course = await Course.findOne({ courseId: req.params.courseId.toLowerCase() });
        if (!course) {
            return res.status(404).json({ message: 'Course not found.' });
        }
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch course.', error: error.message });
    }
});

// Create new course
router.post('/courses', logAdminAuditAction('COURSE_CREATED', (req, resBody) => ({
    resourceType: 'COURSE',
    resourceId: resBody?.courseId || req.body?.courseId,
    resourceName: req.body?.title,
    details: `Created course "${req.body?.title}" (${req.body?.courseId})`
})), async (req, res) => {
    try {
        const {
            courseId, title, subtitle, icon, iconType, duration, difficulty,
            category, instructor, modules, lessons, questions, passingScore,
            certificatePrice, status
        } = req.body;

        if (!courseId || !title || !subtitle || !duration || !difficulty) {
            return res.status(400).json({ message: 'courseId, title, subtitle, duration, and difficulty are required.' });
        }

        const normalizedCourseId = courseId.toLowerCase().trim();
        const existing = await Course.findOne({ courseId: normalizedCourseId });
        if (existing) {
            return res.status(400).json({ message: 'A course with this courseId already exists.' });
        }

        const price = certificatePrice ?? (category === 'Aptitude' || normalizedCourseId.includes('aptitude') ? 100 : 10);

        const newCourse = await Course.create({
            courseId: normalizedCourseId,
            title: title.trim(),
            subtitle: subtitle.trim(),
            icon: icon || 'fa-book',
            iconType: iconType || 'fas',
            duration: duration.trim(),
            difficulty,
            category: category || 'Programming',
            instructor: instructor || 'Learn Me Team',
            modules: Array.isArray(modules) ? modules : [],
            lessons: Array.isArray(lessons) ? lessons : [],
            questions: Array.isArray(questions) ? questions : [],
            passingScore: passingScore || 70,
            certificatePrice: price,
            status: status || 'published'
        });

        res.status(201).json(newCourse);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create course.', error: error.message });
    }
});

// Edit course
router.put('/courses/:courseId', logAdminAuditAction('COURSE_UPDATED', (req) => ({
    resourceType: 'COURSE',
    resourceId: req.params.courseId,
    resourceName: req.body?.title,
    details: `Updated course "${req.body?.title || req.params.courseId}"`
})), async (req, res) => {
    try {
        const course = await Course.findOne({ courseId: req.params.courseId.toLowerCase() });
        if (!course) return res.status(404).json({ message: 'Course not found.' });

        const fields = [
            'title', 'subtitle', 'icon', 'iconType', 'duration', 'difficulty',
            'category', 'instructor', 'modules', 'lessons', 'questions',
            'passingScore', 'certificatePrice', 'status', 'order'
        ];

        fields.forEach(field => {
            if (req.body[field] !== undefined) course[field] = req.body[field];
        });

        await course.save();
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update course.', error: error.message });
    }
});

// Toggle Course Status (Draft <-> Published)
router.patch('/courses/:courseId/status', logAdminAuditAction('COURSE_UPDATED', (req) => ({
    resourceType: 'COURSE',
    resourceId: req.params.courseId,
    details: `Changed course status to ${req.body?.status}`
})), async (req, res) => {
    try {
        const { status } = req.body;
        if (!['draft', 'published'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status. Must be draft or published.' });
        }

        const course = await Course.findOneAndUpdate(
            { courseId: req.params.courseId.toLowerCase() },
            { status },
            { new: true }
        );

        if (!course) return res.status(404).json({ message: 'Course not found.' });
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update status.', error: error.message });
    }
});

// Delete Course
router.delete('/courses/:courseId', logAdminAuditAction('COURSE_DELETED', (req) => ({
    resourceType: 'COURSE',
    resourceId: req.params.courseId,
    details: `Deleted course ${req.params.courseId}`
})), async (req, res) => {
    try {
        const result = await Course.findOneAndDelete({ courseId: req.params.courseId.toLowerCase() });
        if (!result) return res.status(404).json({ message: 'Course not found.' });
        res.json({ message: 'Course deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete course.', error: error.message });
    }
});

// ===============================
// COURSE QUESTIONS MANAGEMENT
// ===============================

// Get all questions for a course
router.get('/courses/:courseId/questions', async (req, res) => {
    try {
        const course = await Course.findOne({ courseId: req.params.courseId.toLowerCase() });
        if (!course) return res.status(404).json({ message: 'Course not found.' });
        res.json({
            courseId: course.courseId,
            title: course.title,
            questions: course.questions || []
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch course questions.', error: error.message });
    }
});

// Add a new question to a course
router.post('/courses/:courseId/questions', logAdminAuditAction('COURSE_QUESTION_ADDED', (req) => ({
    resourceType: 'COURSE',
    resourceId: req.params.courseId,
    details: `Added new question to course ${req.params.courseId}`
})), async (req, res) => {
    try {
        const { q, question, options, answer, correctAnswer, explanation } = req.body;
        const qText = (q || question || '').trim();
        if (!qText) return res.status(400).json({ message: 'Question text is required.' });

        if (!Array.isArray(options) || options.length < 2) {
            return res.status(400).json({ message: 'At least 2 options are required.' });
        }

        let answerIdx = 0;
        if (typeof answer === 'number') {
            answerIdx = answer;
        } else if (typeof correctAnswer === 'number') {
            answerIdx = correctAnswer;
        } else if (typeof answer === 'string') {
            const found = options.findIndex(o => o.trim().toLowerCase() === answer.trim().toLowerCase());
            answerIdx = found !== -1 ? found : 0;
        }

        const course = await Course.findOne({ courseId: req.params.courseId.toLowerCase() });
        if (!course) return res.status(404).json({ message: 'Course not found.' });

        const newQuestion = {
            id: (course.questions || []).length,
            q: qText,
            question: qText,
            options: options.map(o => String(o).trim()),
            answer: answerIdx,
            correctAnswer: answerIdx,
            explanation: (explanation || '').trim() || `The correct answer is "${options[answerIdx]}".`
        };

        const currentQuestions = Array.isArray(course.questions) ? [...course.questions] : [];
        currentQuestions.push(newQuestion);
        course.questions = currentQuestions;
        await course.save();

        res.status(201).json({
            message: 'Question added successfully!',
            question: newQuestion,
            totalQuestions: currentQuestions.length
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add question.', error: error.message });
    }
});

// Update a question in a course
router.put('/courses/:courseId/questions/:index', logAdminAuditAction('COURSE_QUESTION_UPDATED', (req) => ({
    resourceType: 'COURSE',
    resourceId: req.params.courseId,
    details: `Updated question #${req.params.index} in course ${req.params.courseId}`
})), async (req, res) => {
    try {
        const index = parseInt(req.params.index, 10);
        const { q, question, options, answer, correctAnswer, explanation } = req.body;

        const course = await Course.findOne({ courseId: req.params.courseId.toLowerCase() });
        if (!course) return res.status(404).json({ message: 'Course not found.' });

        const currentQuestions = Array.isArray(course.questions) ? [...course.questions] : [];
        if (isNaN(index) || index < 0 || index >= currentQuestions.length) {
            return res.status(400).json({ message: 'Invalid question index.' });
        }

        const qText = (q || question || currentQuestions[index].q || currentQuestions[index].question || '').trim();
        const updatedOptions = Array.isArray(options) && options.length >= 2 ? options.map(o => String(o).trim()) : currentQuestions[index].options;

        let answerIdx = currentQuestions[index].answer ?? 0;
        if (typeof answer === 'number') answerIdx = answer;
        else if (typeof correctAnswer === 'number') answerIdx = correctAnswer;

        const updatedQ = {
            ...currentQuestions[index],
            q: qText,
            question: qText,
            options: updatedOptions,
            answer: answerIdx,
            correctAnswer: answerIdx,
            explanation: (explanation !== undefined ? String(explanation).trim() : currentQuestions[index].explanation)
        };

        currentQuestions[index] = updatedQ;
        course.questions = currentQuestions;
        await course.save();

        res.json({
            message: 'Question updated successfully!',
            question: updatedQ,
            totalQuestions: currentQuestions.length
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update question.', error: error.message });
    }
});

// Delete a question from a course
router.delete('/courses/:courseId/questions/:index', logAdminAuditAction('COURSE_QUESTION_DELETED', (req) => ({
    resourceType: 'COURSE',
    resourceId: req.params.courseId,
    details: `Deleted question #${req.params.index} from course ${req.params.courseId}`
})), async (req, res) => {
    try {
        const index = parseInt(req.params.index, 10);
        const course = await Course.findOne({ courseId: req.params.courseId.toLowerCase() });
        if (!course) return res.status(404).json({ message: 'Course not found.' });

        const currentQuestions = Array.isArray(course.questions) ? [...course.questions] : [];
        if (isNaN(index) || index < 0 || index >= currentQuestions.length) {
            return res.status(400).json({ message: 'Invalid question index.' });
        }

        currentQuestions.splice(index, 1);
        course.questions = currentQuestions;
        await course.save();

        res.json({
            message: 'Question deleted successfully!',
            totalQuestions: currentQuestions.length
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete question.', error: error.message });
    }
});

// ===============================
// CATEGORY MANAGEMENT
// ===============================

router.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find().sort({ order: 1, name: 1 });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch categories.', error: error.message });
    }
});

router.post('/categories', logAdminAuditAction('CATEGORY_CREATED', (req) => ({
    resourceType: 'CATEGORY',
    resourceName: req.body?.name,
    details: `Created category ${req.body?.name}`
})), async (req, res) => {
    try {
        const { categoryId, name, description, icon } = req.body;
        if (!name) return res.status(400).json({ message: 'Category name is required.' });

        const slug = (categoryId || name).toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const newCat = await Category.create({
            categoryId: slug,
            name: name.trim(),
            description: description?.trim() || '',
            icon: icon || 'fa-folder'
        });

        res.status(201).json(newCat);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create category.', error: error.message });
    }
});

// Update Category
router.put('/categories/:categoryId', logAdminAuditAction('CATEGORY_UPDATED', (req) => ({
    resourceType: 'CATEGORY',
    resourceId: req.params.categoryId,
    details: `Updated category ${req.params.categoryId}`
})), async (req, res) => {
    try {
        const { name, description, icon } = req.body;
        const cat = await Category.findOne({ categoryId: req.params.categoryId });
        if (!cat) return res.status(404).json({ message: 'Category not found.' });
        if (name) cat.name = name.trim();
        if (description !== undefined) cat.description = description.trim();
        if (icon) cat.icon = icon.trim();
        await cat.save();
        res.json(cat);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update category.', error: error.message });
    }
});

// Delete Category
router.delete('/categories/:categoryId', logAdminAuditAction('CATEGORY_DELETED', (req) => ({
    resourceType: 'CATEGORY',
    resourceId: req.params.categoryId,
    details: `Deleted category ${req.params.categoryId}`
})), async (req, res) => {
    try {
        const cat = await Category.findOneAndDelete({ categoryId: req.params.categoryId });
        if (!cat) return res.status(404).json({ message: 'Category not found.' });
        res.json({ message: 'Category deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete category.', error: error.message });
    }
});

// ===============================
// USER MANAGEMENT
// ===============================

router.get('/users', async (req, res) => {
    try {
        const users = await User.find({ role: 'user' }).sort({ createdAt: -1 });

        const enhancedUsers = await Promise.all(users.map(async u => {
            const enrollments = await Progress.countDocuments({ userId: u._id });
            const completed = await Progress.countDocuments({ userId: u._id, status: 'Completed' });
            const certificates = await Certificate.countDocuments({ userId: u._id });
            const payments = await CertificatePayment.countDocuments({ userId: u._id, paymentStatus: 'Successful' });

            return {
                id: u._id,
                _id: u._id,
                name: u.name,
                email: u.email,
                role: u.role,
                isActive: u.isActive,
                createdAt: u.createdAt,
                lastLogin: u.lastLogin,
                stats: { enrollments, completed, certificates, payments }
            };
        }));

        res.json(enhancedUsers);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users.', error: error.message });
    }
});

router.get('/users/:userId', logAdminAuditAction('USER_VIEWED', (req) => ({
    resourceType: 'USER',
    resourceId: req.params.userId,
    details: `Viewed details for user ${req.params.userId}`
})), async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: 'User not found.' });

        const progress = await Progress.find({ userId: user._id });
        const quizAttempts = await QuizAttempt.find({ userId: user._id }).sort({ createdAt: -1 });
        const certificates = await Certificate.find({ userId: user._id });
        const payments = await CertificatePayment.find({ userId: user._id });
        const activities = await Activity.find({ userId: user._id }).sort({ createdAt: -1 }).limit(20);

        res.json({
            user: { id: user._id, name: user.name, email: user.email, role: user.role, isActive: user.isActive, createdAt: user.createdAt, lastLogin: user.lastLogin },
            progress,
            quizAttempts,
            certificates,
            payments,
            activities
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch user details.', error: error.message });
    }
});

// Toggle User Active Status
router.patch('/users/:userId/status', logAdminAuditAction('USER_DEACTIVATED', (req) => ({
    resourceType: 'USER',
    resourceId: req.params.userId,
    details: `Updated active status to ${req.body?.isActive}`
})), async (req, res) => {
    try {
        const { isActive } = req.body;
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: 'User not found.' });

        if (user.role === 'admin') {
            return res.status(403).json({ message: 'Cannot deactivate admin accounts.' });
        }

        user.isActive = Boolean(isActive);
        await user.save();

        res.json({ message: `User account ${user.isActive ? 'activated' : 'deactivated'} successfully.`, isActive: user.isActive });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update user status.', error: error.message });
    }
});

// Delete User
router.delete('/users/:userId', logAdminAuditAction('USER_DELETED', (req) => ({
    resourceType: 'USER',
    resourceId: req.params.userId,
    details: `Deleted user ${req.params.userId}`
})), async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: 'User not found.' });

        if (user.role === 'admin') {
            return res.status(403).json({ message: 'Cannot delete admin accounts.' });
        }

        await User.findByIdAndDelete(user._id);
        await Progress.deleteMany({ userId: user._id });
        await Certificate.deleteMany({ userId: user._id });
        await CertificatePayment.deleteMany({ userId: user._id });
        await Activity.deleteMany({ userId: user._id });

        res.json({ message: 'User and associated data deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete user.', error: error.message });
    }
});

// ===============================
// CERTIFICATE MANAGEMENT
// ===============================

router.get('/certificates', async (req, res) => {
    try {
        const certificates = await Certificate.find().populate('userId', 'name email').sort({ createdAt: -1 });
        res.json(certificates);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch certificates.', error: error.message });
    }
});

router.patch('/certificates/:certificateId/revoke', logAdminAuditAction('CERTIFICATE_REVOKED', (req) => ({
    resourceType: 'CERTIFICATE',
    resourceId: req.params.certificateId,
    details: `Revoked certificate ${req.params.certificateId}`
})), async (req, res) => {
    try {
        const cert = await Certificate.findOneAndUpdate(
            { certificateId: req.params.certificateId.toUpperCase() },
            { status: 'revoked' },
            { new: true }
        );

        if (!cert) return res.status(404).json({ message: 'Certificate not found.' });
        res.json({ message: 'Certificate revoked successfully.', certificate: cert });
    } catch (error) {
        res.status(500).json({ message: 'Failed to revoke certificate.', error: error.message });
    }
});

router.patch('/certificates/:certificateId/restore', logAdminAuditAction('CERTIFICATE_RESTORED', (req) => ({
    resourceType: 'CERTIFICATE',
    resourceId: req.params.certificateId,
    details: `Restored certificate ${req.params.certificateId}`
})), async (req, res) => {
    try {
        const cert = await Certificate.findOneAndUpdate(
            { certificateId: req.params.certificateId.toUpperCase() },
            { status: 'valid' },
            { new: true }
        );

        if (!cert) return res.status(404).json({ message: 'Certificate not found.' });
        res.json({ message: 'Certificate restored to valid status.', certificate: cert });
    } catch (error) {
        res.status(500).json({ message: 'Failed to restore certificate.', error: error.message });
    }
});

// ===============================
// PAYMENT MANAGEMENT
// ===============================

router.get('/payments', async (req, res) => {
    try {
        const payments = await CertificatePayment.find().sort({ createdAt: -1 });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch payments.', error: error.message });
    }
});

// Manual interventions are disabled as per system requirements.


// ===============================
// ACTIVITY & AUDIT LOGS
// ===============================

router.get('/activity', async (req, res) => {
    try {
        const activities = await Activity.find()
            .populate('userId', 'name email')
            .sort({ createdAt: -1 })
            .limit(100);
        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch activity logs.', error: error.message });
    }
});

router.get('/audit-log', async (req, res) => {
    try {
        const auditLogs = await AdminAuditLog.find().sort({ createdAt: -1 }).limit(100);
        res.json(auditLogs);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch admin audit logs.', error: error.message });
    }
});

// ===============================
// PLATFORM SETTINGS
// ===============================

router.get('/settings', async (req, res) => {
    try {
        let settings = await AdminSettings.findOne();
        if (!settings) {
            settings = await AdminSettings.create({
                siteName: 'Learn Me Platform',
                normalCertificatePrice: 10,
                aptitudeCertificatePrice: 100,
                upiId: 'sumathiaz550@upi'
            });
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch settings.', error: error.message });
    }
});

router.put('/settings', logAdminAuditAction('SETTINGS_UPDATED', (req) => ({
    resourceType: 'SETTINGS',
    details: `Updated platform settings (Normal price: ₹${req.body?.normalCertificatePrice}, Aptitude price: ₹${req.body?.aptitudeCertificatePrice})`
})), async (req, res) => {
    try {
        let settings = await AdminSettings.findOne();
        if (!settings) {
            settings = new AdminSettings();
        }

        const fields = ['siteName', 'normalCertificatePrice', 'aptitudeCertificatePrice', 'upiId', 'qrImageUrl', 'paymentInstructions', 'contactEmail'];
        fields.forEach(field => {
            if (req.body[field] !== undefined) settings[field] = req.body[field];
        });

        await settings.save();
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update settings.', error: error.message });
    }
});

// ===============================
// SYSTEM MONITORING & HEALTH
// ===============================
router.get('/system-health', async (req, res) => {
    try {
        const mem = process.memoryUsage();
        const uptimeSeconds = Math.floor(process.uptime());

        const [
            totalUsers,
            activeUsers,
            totalCourses,
            totalAuditLogs,
            totalQuizAttempts,
            totalCertificates
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ isActive: true }),
            Course.countDocuments(),
            AdminAuditLog.countDocuments(),
            QuizAttempt.countDocuments(),
            Certificate.countDocuments()
        ]);

        const fs = require('fs');
        const path = require('path');
        const sqlitePath = path.join(__dirname, '..', 'data', 'learnme.sqlite');
        let dbSizeBytes = 0;
        if (fs.existsSync(sqlitePath)) {
            dbSizeBytes = fs.statSync(sqlitePath).size;
        }

        res.json({
            status: 'HEALTHY',
            timestamp: new Date().toISOString(),
            service: 'Learn Me Production API',
            uptime: {
                seconds: uptimeSeconds,
                formatted: `${Math.floor(uptimeSeconds / 3600)}h ${Math.floor((uptimeSeconds % 3600) / 60)}m ${uptimeSeconds % 60}s`
            },
            memory: {
                rss: `${(mem.rss / 1024 / 1024).toFixed(2)} MB`,
                heapUsed: `${(mem.heapUsed / 1024 / 1024).toFixed(2)} MB`,
                heapTotal: `${(mem.heapTotal / 1024 / 1024).toFixed(2)} MB`
            },
            database: {
                engine: process.env.DB_DIALECT || 'sqlite',
                status: 'CONNECTED',
                sizeFormatted: dbSizeBytes > 0 ? `${(dbSizeBytes / 1024).toFixed(2)} KB` : 'In-Memory/External'
            },
            metrics: {
                totalUsers,
                activeUsers,
                totalCourses,
                totalAuditLogs,
                totalQuizAttempts,
                totalCertificates
            },
            environment: {
                nodeVersion: process.version,
                platform: process.platform,
                environment: process.env.NODE_ENV || 'production'
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve system health metrics.', error: error.message });
    }
});

module.exports = router;
