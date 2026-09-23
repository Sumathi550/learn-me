/**
 * Learn Me - Certificate Service
 * Enforces strict 100% course completion verification and ownership download validation.
 */
const { Certificate, Course, Progress, Activity } = require('../models');
const { getCourseMetrics } = require('../utils/courseProgressHelper');

async function generateCertificate(user, courseId, ipAddress = '127.0.0.1') {
    const normalizedCourseId = (courseId || '').toLowerCase().trim();
    const course = await Course.findOne({ courseId: normalizedCourseId });
    if (!course) {
        const error = new Error('Course not found.');
        error.statusCode = 404;
        throw error;
    }

    const progress = await Progress.findOne({ userId: user._id, courseId: normalizedCourseId });
    if (!progress) {
        const error = new Error('Certificate unavailable. Please complete the entire course before claiming your certificate.');
        error.statusCode = 403;
        error.reasons = ['No course progress recorded. You must complete all required lessons, modules, and quizzes.'];
        throw error;
    }

    const metrics = getCourseMetrics(course, progress);

    if (!metrics.isFullyCompleted) {
        const reasons = [];
        if (metrics.completedModulesCount < metrics.totalModules) {
            reasons.push(`Completed ${metrics.completedModulesCount} of ${metrics.totalModules} required modules.`);
        }
        if (metrics.quizzesCompleted < metrics.totalQuizzes) {
            reasons.push(`Passed ${metrics.quizzesCompleted} of ${metrics.totalQuizzes} required quizzes (score >= 70%).`);
        }

        const error = new Error('Certificate unavailable. You must complete 100% of all required lessons, modules, and pass all required quizzes (score >= 70%) before claiming your certificate.');
        error.statusCode = 403;
        error.reasons = reasons;
        error.metrics = {
            courseProgress: metrics.overallPercentage,
            modulesCompleted: metrics.completedModulesCount,
            totalModules: metrics.totalModules,
            quizzesCompleted: metrics.quizzesCompleted,
            totalQuizzes: metrics.totalQuizzes,
            quizPassed: metrics.quizPassed,
            isFullyCompleted: metrics.isFullyCompleted
        };
        throw error;
    }

    let cert = await Certificate.findOne({ userId: user._id, courseId: normalizedCourseId });
    if (!cert) {
        const randomId = Math.random().toString(36).substring(2, 8).toUpperCase();
        const certCode = `LM-${normalizedCourseId.toUpperCase()}-${new Date().getFullYear()}-${randomId}`;

        cert = await Certificate.create({
            certificateId: certCode,
            userId: user._id,
            userName: user.name,
            courseId: normalizedCourseId,
            courseName: course.title || normalizedCourseId,
            score: progress.quizScore || 85,
            percentage: 100,
            completionDate: new Date(),
            verificationCode: certCode,
            status: 'valid',
            paymentStatus: 'paid'
        });

        await Activity.create({
            userId: user._id,
            action: 'CERTIFICATE_GENERATED',
            details: `Generated official certificate ${certCode} for completing ${course.title} (100% Course Completion)`,
            ipAddress
        });
    }

    return cert;
}

async function getMyCertificates(userId) {
    return Certificate.find({ userId }).sort({ issuedAt: -1 });
}

async function downloadCertificate(user, certificateId, ipAddress = '127.0.0.1') {
    const cert = await Certificate.findOne({
        certificateId: (certificateId || '').toUpperCase().trim()
    });

    if (!cert) {
        const error = new Error('Certificate not found in registry.');
        error.statusCode = 404;
        throw error;
    }

    if (String(cert.userId) !== String(user._id) && user.role !== 'admin') {
        const error = new Error('Forbidden: You do not have permission to download another student\'s certificate.');
        error.statusCode = 403;
        throw error;
    }

    if (cert.status === 'revoked') {
        const error = new Error('This certificate has been revoked and cannot be downloaded.');
        error.statusCode = 403;
        throw error;
    }

    cert.downloadCount = (cert.downloadCount || 0) + 1;
    await cert.save();

    await Activity.create({
        userId: user._id,
        action: 'CERTIFICATE_DOWNLOADED',
        details: `Downloaded certificate ${cert.certificateId} for ${cert.courseName}`,
        ipAddress
    });

    return {
        authorized: true,
        certificate: {
            certificateId: cert.certificateId,
            userName: cert.userName,
            courseId: cert.courseId,
            courseName: cert.courseName,
            score: cert.score,
            percentage: cert.percentage,
            completionDate: cert.completionDate,
            verificationUrl: `/verify.html?certificate=${cert.certificateId}`
        }
    };
}

async function verifyCertificate(certificateId) {
    const cert = await Certificate.findOne({
        certificateId: (certificateId || '').toUpperCase().trim()
    });

    if (!cert) {
        const error = new Error('Certificate ID not found in Learn Me registry.');
        error.statusCode = 404;
        error.valid = false;
        error.isValid = false;
        error.status = 'invalid';
        throw error;
    }

    const payload = {
        valid: cert.status === 'valid',
        isValid: cert.status === 'valid',
        status: cert.status,
        certificateId: cert.certificateId,
        courseName: cert.courseName,
        studentName: cert.userName,
        userName: cert.userName,
        score: cert.score,
        percentage: cert.percentage,
        completionDate: cert.completionDate,
        issuedBy: 'Learn Me Learning Platform',
        message: cert.status === 'revoked'
            ? 'This certificate has been REVOKED by Learn Me administration and is no longer valid.'
            : 'Official valid certificate verified by Learn Me.'
    };

    return {
        ...payload,
        certificate: payload
    };
}

module.exports = {
    generateCertificate,
    getMyCertificates,
    downloadCertificate,
    verifyCertificate
};
