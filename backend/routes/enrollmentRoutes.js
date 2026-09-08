const express = require('express');
const router = express.Router();
const { Enrollment } = require('../models');
const { Course } = require('../models');
const { Progress } = require('../models');
const { Activity } = require('../models');
const { requireAuth } = require('../middleware/authMiddleware');

// Get all enrollments for current user
router.get('/', requireAuth, async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ userId: req.user._id })
            .populate('userId', 'name email')
            .sort({ enrolledAt: -1 });

        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch enrollments.', error: error.message });
    }
});

// Check if user is enrolled in a course
router.get('/:courseId', requireAuth, async (req, res) => {
    try {
        const enrollment = await Enrollment.findOne({
            userId: req.user._id,
            courseId: req.params.courseId.toLowerCase()
        });

        res.json({ 
            enrolled: !!enrollment,
            enrollment: enrollment || null
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to check enrollment.', error: error.message });
    }
});

// Enroll in a course
router.post('/:courseId', requireAuth, async (req, res) => {
    try {
        const courseId = req.params.courseId.toLowerCase();
        
        // Verify course exists
        const course = await Course.findOne({ courseId });
        if (!course) {
            return res.status(404).json({ message: 'Course not found.' });
        }

        // Check if already enrolled
        const existing = await Enrollment.findOne({
            userId: req.user._id,
            courseId
        });

        if (existing) {
            return res.status(400).json({ message: 'Already enrolled in this course.' });
        }

        // Create enrollment
        const enrollment = await Enrollment.create({
            userId: req.user._id,
            courseId,
            status: 'active'
        });

        // Create initial progress record
        await Progress.create({
            userId: req.user._id,
            courseId,
            totalLessons: (course.lessons || []).length || 1,
            status: 'Not Started'
        });

        // Log activity
        await Activity.create({
            userId: req.user._id,
            action: 'COURSE_ENROLLED',
            details: `Enrolled in ${course.title} (${courseId})`,
            ipAddress: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1'
        });

        res.status(201).json({
            message: 'Successfully enrolled in course.',
            enrollment
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to enroll in course.', error: error.message });
    }
});

// Mark course as completed
router.put('/:courseId/complete', requireAuth, async (req, res) => {
    try {
        const courseId = req.params.courseId.toLowerCase();

        const enrollment = await Enrollment.findOneAndUpdate(
            { userId: req.user._id, courseId },
            { status: 'completed', completedAt: new Date() },
            { new: true }
        );

        if (!enrollment) {
            return res.status(404).json({ message: 'Enrollment not found.' });
        }

        // Update progress
        await Progress.findOneAndUpdate(
            { userId: req.user._id, courseId },
            { status: 'Completed', percentage: 100 }
        );

        // Log activity
        const course = await Course.findOne({ courseId });
        await Activity.create({
            userId: req.user._id,
            action: 'COURSE_COMPLETED',
            details: `Completed ${course ? course.title : courseId}`,
            ipAddress: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1'
        });

        res.json({
            message: 'Course marked as completed.',
            enrollment
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update enrollment.', error: error.message });
    }
});

module.exports = router;
