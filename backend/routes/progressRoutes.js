const express = require('express');
const router = express.Router();
const { Progress } = require('../models');
const { Course } = require('../models');
const { Activity } = require('../models');
const { requireAuth } = require('../middleware/authMiddleware');

// Get progress for current student
router.get('/', requireAuth, async (req, res) => {
    try {
        const progressList = await Progress.find({ userId: req.user._id });
        res.json(progressList);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch progress.', error: error.message });
    }
});

// Update lesson progress for a course
router.put('/:courseId/lesson', requireAuth, async (req, res) => {
    try {
        const { courseId } = req.params;
        const { completedLessons, totalLessons } = req.body;

        const course = await Course.findOne({ courseId: courseId.toLowerCase() });
        const calcTotal = totalLessons || (course?.lessons || []).length || 1;
        const calcCompleted = Math.min(completedLessons || 0, calcTotal);
        const percentage = Math.round((calcCompleted / calcTotal) * 100);

        let progress = await Progress.findOne({ userId: req.user._id, courseId: courseId.toLowerCase() });
        if (!progress) {
            progress = new Progress({
                userId: req.user._id,
                courseId: courseId.toLowerCase(),
                completedLessons: calcCompleted,
                totalLessons: calcTotal,
                percentage,
                status: calcCompleted > 0 ? (calcCompleted >= calcTotal ? 'Completed' : 'In Progress') : 'Not Started'
            });
        } else {
            progress.completedLessons = Math.max(progress.completedLessons || 0, calcCompleted);
            progress.totalLessons = calcTotal;
            progress.percentage = Math.max(progress.percentage || 0, percentage);
            if (calcCompleted >= calcTotal && progress.status !== 'Completed') {
                progress.status = 'Completed';
            } else if (calcCompleted > 0 && progress.status === 'Not Started') {
                progress.status = 'In Progress';
            }
        }

        progress.lastAccessed = new Date();
        await progress.save();

        await Activity.create({
            userId: req.user._id,
            action: 'LESSON_COMPLETED',
            details: `Updated progress for ${course ? course.title : courseId} (${progress.completedLessons}/${progress.totalLessons})`,
            ipAddress: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1'
        });

        res.json(progress);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update progress.', error: error.message });
    }
});

// Update assessment progress for a course
router.put('/:courseId/assessment', requireAuth, async (req, res) => {
    try {
        const { courseId } = req.params;
        const { score, passed, correct, total, title } = req.body;

        let progress = await Progress.findOne({ userId: req.user._id, courseId: courseId.toLowerCase() });
        if (!progress) {
            progress = new Progress({
                userId: req.user._id,
                courseId: courseId.toLowerCase(),
                quizScore: score,
                quizPassed: passed,
                percentage: score,
                eligibleForCertificate: passed,
                status: passed ? 'Completed' : 'In Progress'
            });
        } else {
            // Keep the best score
            if (score > (progress.quizScore || 0)) {
                progress.quizScore = score;
                progress.quizPassed = passed;
                progress.percentage = score;
                progress.eligibleForCertificate = passed;
                if(passed) progress.status = 'Completed';
            }
        }

        progress.lastAccessed = new Date();
        await progress.save();

        if (passed) {
            const { Certificate } = require('../models');
            await Certificate.findOneAndUpdate(
                { userId: req.user._id, courseId: courseId.toLowerCase() },
                { $set: { score, percentage: score, completionDate: new Date() } }
            );
        }

        await Activity.create({
            userId: req.user._id,
            action: 'ASSESSMENT_COMPLETED',
            details: `Completed assessment for ${title || courseId} with score ${score}%`,
            ipAddress: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1'
        });

        res.json(progress);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update assessment.', error: error.message });
    }
});

module.exports = router;
