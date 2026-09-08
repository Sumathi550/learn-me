const express = require('express');
const router = express.Router();
const { CertificatePayment } = require('../models');
const { Certificate } = require('../models');
const { Course } = require('../models');
const { AdminSettings } = require('../models');
const { Activity } = require('../models');
const { Progress } = require('../models');
const { requireAuth } = require('../middleware/authMiddleware');

// Calculate Server-Side Price & Create Payment Intent based on Course Type
router.post('/create-intent', requireAuth, async (req, res) => {
    try {
        const { courseId } = req.body;
        if (!courseId) return res.status(400).json({ message: 'courseId is required.' });

        const normalizedCourseId = courseId.toLowerCase().trim();
        const course = await Course.findOne({ courseId: normalizedCourseId });
        const settings = (await AdminSettings.findOne()) || {
            normalCertificatePrice: 10,
            aptitudeCertificatePrice: 100,
            upiId: 'sumathiaz550@upi'
        };

        const isAptitude = (course?.category === 'Aptitude') || normalizedCourseId.includes('aptitude');
        let purpose = isAptitude ? 'COURSE_ACCESS' : 'CERTIFICATE';
        let amount = isAptitude ? (settings.aptitudeCertificatePrice || 100) : (settings.normalCertificatePrice || 10);
        if (course && course.certificatePrice) amount = course.certificatePrice;

        // Check if user already paid for this course purpose
        const existingPayment = await CertificatePayment.findOne({ 
            userId: req.user._id, 
            courseId: normalizedCourseId,
            paymentStatus: 'PAID',
            purpose: purpose 
        });

        if (existingPayment) {
            return res.json({
                alreadyPaid: true,
                message: isAptitude ? 'Course access already paid.' : 'Certificate payment already completed.',
                purpose: purpose,
                certificateId: existingPayment.certificateId
            });
        }

        // If it's a normal course, verify eligibility (must pass quiz first)
        let progress = await Progress.findOne({ userId: req.user._id, courseId: normalizedCourseId });
        if (!isAptitude) {
            if (!progress || (!progress.eligibleForCertificate && !progress.quizPassed)) {
                return res.status(403).json({
                    message: 'You are not yet eligible. Complete the course assessment with >= 70% first before paying for the certificate.'
                });
            }
        }

        // Prepare or fetch Certificate record to attach a certificateId for the future
        let cert = await Certificate.findOne({ userId: req.user._id, courseId: normalizedCourseId });
        let certCode = cert ? cert.certificateId : `LM-${normalizedCourseId.toUpperCase()}-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

        if (!cert) {
            cert = await Certificate.create({
                certificateId: certCode,
                userId: req.user._id,
                userName: req.user.name,
                courseId: normalizedCourseId,
                courseName: course ? course.title : normalizedCourseId,
                score: progress?.quizScore || 0,
                percentage: progress?.quizScore || 0,
                verificationCode: certCode,
                status: 'valid',
                paymentStatus: 'pending' // will flip to 'paid' when the quiz is passed OR when payment completes based on logic
            });
        }

        const transactionId = `TXN-LM-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

        const payment = await CertificatePayment.create({
            transactionId,
            userId: req.user._id,
            userName: req.user.name,
            userEmail: req.user.email,
            certificateId: certCode,
            courseId: normalizedCourseId,
            courseTitle: course ? course.title : normalizedCourseId,
            amount,
            category: course ? course.category : (isAptitude ? 'Aptitude' : 'General'),
            paymentMethod: 'UPI_GATEWAY',
            paymentStatus: 'PENDING',
            purpose: purpose
        });

        await Activity.create({
            userId: req.user._id,
            action: 'PAYMENT_INITIATED',
            details: `Initiated ₹${amount} payment for ${purpose} (${normalizedCourseId})`,
            ipAddress: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1'
        });

        res.json({
            transactionId: payment.transactionId,
            amount: payment.amount,
            currency: 'INR',
            purpose: purpose,
            courseTitle: payment.courseTitle,
            courseId: payment.courseId,
            certificateId: payment.certificateId,
            upiId: settings.upiId || 'sumathiaz550@upi',
            qrImageUrl: settings.qrImageUrl || '',
            instructions: settings.paymentInstructions || 'Scan QR or enter UPI ID to complete payment.'
        });
    } catch (error) {
        console.error('Intent Error:', error);
        res.status(500).json({ message: 'Error initiating payment.', error: error.message });
    }
});

// Verify Payment & Process Entitlements Server-Side
router.post('/verify', requireAuth, async (req, res) => {
    try {
        const { transactionId } = req.body;
        if (!transactionId) return res.status(400).json({ message: 'transactionId is required.' });

        const payment = await CertificatePayment.findOne({
            transactionId: transactionId.toUpperCase(),
            userId: req.user._id
        });

        if (!payment) return res.status(404).json({ message: 'Payment record not found.' });
        if (payment.paymentStatus === 'PAID') return res.json({ status: 'PAID', message: 'Payment already verified.' });

        // Automatic simulated payment approval via secure gateway response
        payment.paymentStatus = 'PAID';
        payment.verifiedByAdmin = true;
        payment.verifiedAt = new Date();
        await payment.save();

        if (payment.purpose === 'COURSE_ACCESS') {
            await Progress.findOneAndUpdate(
                { userId: req.user._id, courseId: payment.courseId },
                { $set: { courseUnlocked: true } },
                { upsert: true, new: true }
            );
        }

        // Unlock Certificate (Applies to both COURSE_ACCESS and CERTIFICATE because Aptitude fee covers cert)
        if (payment.certificateId) {
            await Certificate.findOneAndUpdate(
                { certificateId: payment.certificateId },
                { paymentStatus: 'paid' },
                { upsert: true }
            );
        }

        await Activity.create({
            userId: req.user._id,
            action: 'PAYMENT_SUCCESSFUL',
            details: `Successfully paid ₹${payment.amount} for ${payment.purpose} (${payment.courseId})`,
            ipAddress: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1'
        });

        res.json({
            status: 'PAID',
            message: 'Payment verified successfully! Entitlement activated.',
            certificateId: payment.certificateId,
            transactionId: payment.transactionId,
            purpose: payment.purpose
        });
    } catch (error) {
        console.error('Verify error:', error);
        res.status(500).json({ message: 'Error verifying payment.', error: error.message });
    }
});

// Student Payment History
router.get('/my-payments', requireAuth, async (req, res) => {
    try {
        const payments = await CertificatePayment.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch payments.', error: error.message });
    }
});

module.exports = router;
