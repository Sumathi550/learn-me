const express = require('express');
const router = express.Router();
const { Certificate } = require('../models');
const { Course } = require('../models');
const { Progress } = require('../models');
const { CertificatePayment } = require('../models');
const { Activity } = require('../models');
const { requireAuth } = require('../middleware/authMiddleware');

// Student Certificate Generation Request
router.post('/generate', requireAuth, async (req, res) => {
    try {
        const { courseId } = req.body;
        if (!courseId) return res.status(400).json({ message: 'courseId is required.' });

        const normalizedCourseId = courseId.toLowerCase().trim();
        const course = await Course.findOne({ courseId: normalizedCourseId });
        const progress = await Progress.findOne({ userId: req.user._id, courseId: normalizedCourseId });

        if (!progress || (!progress.eligibleForCertificate && !progress.quizPassed)) {
            return res.status(403).json({ message: 'A passing score of 70% or higher is required to generate a certificate.' });
        }

        let cert = await Certificate.findOne({ userId: req.user._id, courseId: normalizedCourseId });
        if (!cert) {
            const randomId = Math.random().toString(36).substring(2, 8).toUpperCase();
            const certCode = `LM-${normalizedCourseId.toUpperCase()}-${new Date().getFullYear()}-${randomId}`;

            cert = await Certificate.create({
                certificateId: certCode,
                userId: req.user._id,
                userName: req.user.name,
                courseId: normalizedCourseId,
                courseName: course ? course.title : normalizedCourseId,
                score: progress.quizScore || 85,
                percentage: progress.quizScore || 85,
                verificationCode: certCode,
                status: 'valid',
                paymentStatus: 'paid'
            });
        }

        res.json(cert);
    } catch (error) {
        res.status(500).json({ message: 'Failed to generate certificate.', error: error.message });
    }
});

// Student Certificates List
router.get('/my-certificates', requireAuth, async (req, res) => {
    try {
        const certificates = await Certificate.find({ userId: req.user._id }).sort({ issuedAt: -1 });
        res.json(certificates);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch certificates.', error: error.message });
    }
});

// Secure Download Endpoint (Verifies Ownership Server-Side)
router.get('/download/:certificateId', requireAuth, async (req, res) => {
    try {
        const cert = await Certificate.findOne({
            certificateId: req.params.certificateId.toUpperCase(),
            userId: req.user._id
        });

        if (!cert) {
            return res.status(404).json({ message: 'Certificate not found or does not belong to your account.' });
        }

        if (cert.status === 'revoked') {
            return res.status(403).json({ message: 'This certificate has been revoked and cannot be downloaded.' });
        }

        cert.downloadCount = (cert.downloadCount || 0) + 1;
        await cert.save();

        await Activity.create({
            userId: req.user._id,
            action: 'CERTIFICATE_DOWNLOADED',
            details: `Downloaded certificate ${cert.certificateId} for ${cert.courseName}`,
            ipAddress: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1'
        });

        res.json({
            authorized: true,
            certificate: {
                certificateId: cert.certificateId,
                userName: cert.userName,
                courseId: cert.courseId,
                courseName: cert.courseName,
                score: cert.score,
                percentage: cert.percentage,
                completionDate: cert.completionDate,
                verificationUrl: `/verify-certificate/${cert.certificateId}`
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error processing download authorization.', error: error.message });
    }
});

// PUBLIC Verification Endpoint (NO Auth Required)
router.get('/verify/:certificateId', async (req, res) => {
    try {
        const cert = await Certificate.findOne({
            certificateId: req.params.certificateId.toUpperCase()
        });

        if (!cert) {
            return res.status(404).json({
                valid: false,
                status: 'invalid',
                message: 'Certificate ID not found in Learn Me registry.'
            });
        }

        const certPayload = {
            valid: cert.status === 'valid',
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

        res.json({
            ...certPayload,
            certificate: certPayload
        });
    } catch (error) {
        res.status(500).json({ message: 'Error verifying certificate.', error: error.message });
    }
});

module.exports = router;
