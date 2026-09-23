const express = require('express');
const router = express.Router();
const { Progress, Course, Activity, QuizAttempt } = require('../models');
const { requireAuth } = require('../middleware/authMiddleware');
const { 
    getCourseMetrics, 
    getCourseModuleLessons, 
    getCourseRequiredModules,
    getCourseRequiredQuizzes 
} = require('../utils/courseProgressHelper');

// Helper to safely parse array from JSON or string
function parseArray(val) {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') {
        try {
            const parsed = JSON.parse(val);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            return [];
        }
    }
    return [];
}

// Get progress for all courses for current student
router.get('/', requireAuth, async (req, res) => {
    try {
        const progressList = await Progress.find({ userId: req.user._id });
        const courses = await Course.findAll({ raw: true });
        const courseMap = {};
        courses.forEach(c => { courseMap[c.courseId.toLowerCase()] = c; });

        const enriched = progressList.map(p => {
            const pObj = typeof p.toObject === 'function' ? p.toObject() : (p.dataValues || p);
            const course = courseMap[(pObj.courseId || '').toLowerCase()];
            const metrics = getCourseMetrics(course, pObj);
            return {
                ...pObj,
                ...metrics
            };
        });

        res.json(enriched);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch progress.', error: error.message });
    }
});

// Get progress for a specific course
router.get('/:courseId', requireAuth, async (req, res) => {
    try {
        const courseId = (req.params.courseId || '').toLowerCase().trim();
        const course = await Course.findOne({ courseId });
        if (!course) {
            return res.status(404).json({ message: 'Course not found.' });
        }

        let progress = await Progress.findOne({ userId: req.user._id, courseId });
        const metrics = getCourseMetrics(course, progress);

        res.json({
            courseId,
            courseTitle: course.title,
            progress: progress ? (typeof progress.toObject === 'function' ? progress.toObject() : progress) : null,
            ...metrics
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch course progress.', error: error.message });
    }
});

// Update lesson progress for a course (Individual lesson completion tracking)
router.put('/:courseId/lesson', requireAuth, async (req, res) => {
    try {
        const courseId = (req.params.courseId || '').toLowerCase().trim();
        const { lessonId, completed = true } = req.body;

        if (!lessonId) {
            return res.status(400).json({ message: 'lessonId is required to update lesson progress.' });
        }

        const course = await Course.findOne({ courseId });
        if (!course) return res.status(404).json({ message: 'Course not found.' });

        let progress = await Progress.findOne({ userId: req.user._id, courseId });
        if (!progress) {
            progress = new Progress({
                userId: req.user._id,
                courseId,
                completedLessonIds: [],
                completedModules: [],
                completedLessons: 0,
                completedQuizzes: []
            });
        }

        let completedLessonIds = parseArray(progress.completedLessonIds);
        const cleanLessonId = String(lessonId).trim();

        if (completed) {
            if (!completedLessonIds.includes(cleanLessonId)) {
                completedLessonIds.push(cleanLessonId);
            }
        } else {
            completedLessonIds = completedLessonIds.filter(id => id !== cleanLessonId);
        }

        progress.completedLessonIds = completedLessonIds;
        progress.completedLessons = completedLessonIds.length;

        // Recalculate full course metrics server-side
        const metrics = getCourseMetrics(course, progress);
        progress.completedModules = metrics.completedModules;
        progress.totalModules = metrics.totalModules;
        progress.totalLessons = metrics.totalLessons;
        progress.quizzesCompleted = metrics.quizzesCompleted;
        progress.totalQuizzes = metrics.totalQuizzes;
        progress.percentage = metrics.overallPercentage;
        progress.eligibleForCertificate = metrics.eligibleForCertificate;
        progress.status = metrics.status;
        progress.lastAccessed = new Date();

        await progress.save();

        await Activity.create({
            userId: req.user._id,
            action: completed ? 'LESSON_COMPLETED' : 'LESSON_RESET',
            details: `${completed ? 'Completed' : 'Reset'} lesson "${cleanLessonId}" in ${course.title} (Progress: ${metrics.overallPercentage}%)`,
            ipAddress: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1'
        });

        res.json({
            success: true,
            progress: typeof progress.toObject === 'function' ? progress.toObject() : progress,
            ...metrics
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update lesson progress.', error: error.message });
    }
});

// Update module progress - STRICT: Completing all lessons is required before a module can be marked completed
router.put('/:courseId/module', requireAuth, async (req, res) => {
    try {
        const courseId = (req.params.courseId || '').toLowerCase().trim();
        const { moduleName, completed = true } = req.body;

        if (!moduleName) {
            return res.status(400).json({ message: 'moduleName is required.' });
        }

        const course = await Course.findOne({ courseId });
        if (!course) {
            return res.status(404).json({ message: 'Course not found.' });
        }

        const cleanModuleName = String(moduleName).trim();
        const moduleLessons = getCourseModuleLessons(course, cleanModuleName);
        const requiredLessonIds = moduleLessons.map(l => l.lessonId);

        let progress = await Progress.findOne({ userId: req.user._id, courseId });
        if (!progress) {
            progress = new Progress({
                userId: req.user._id,
                courseId,
                completedLessonIds: [],
                completedModules: [],
                completedLessons: 0,
                completedQuizzes: []
            });
        }

        let completedLessonIds = parseArray(progress.completedLessonIds);

        if (completed) {
            // Check if all lessons are already completed
            const incompleteLessons = moduleLessons.filter(l => !completedLessonIds.includes(l.lessonId));
            if (incompleteLessons.length > 0) {
                // If user requests to complete module, complete all its required lessons
                requiredLessonIds.forEach(id => {
                    if (!completedLessonIds.includes(id)) {
                        completedLessonIds.push(id);
                    }
                });
            }
        } else {
            // Unmark all lessons in this module
            completedLessonIds = completedLessonIds.filter(id => !requiredLessonIds.includes(id));
        }

        progress.completedLessonIds = completedLessonIds;
        progress.completedLessons = completedLessonIds.length;

        // Recalculate full course metrics
        const metrics = getCourseMetrics(course, progress);
        progress.completedModules = metrics.completedModules;
        progress.totalModules = metrics.totalModules;
        progress.totalLessons = metrics.totalLessons;
        progress.quizzesCompleted = metrics.quizzesCompleted;
        progress.totalQuizzes = metrics.totalQuizzes;
        progress.percentage = metrics.overallPercentage;
        progress.eligibleForCertificate = metrics.eligibleForCertificate;
        progress.status = metrics.status;
        progress.lastAccessed = new Date();

        await progress.save();

        await Activity.create({
            userId: req.user._id,
            action: completed ? 'MODULE_COMPLETED' : 'MODULE_UPDATED',
            details: `${completed ? 'Completed all lessons for' : 'Updated'} module "${cleanModuleName}" in ${course.title} (Progress: ${metrics.overallPercentage}%)`,
            ipAddress: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1'
        });

        res.json({
            success: true,
            progress: typeof progress.toObject === 'function' ? progress.toObject() : progress,
            ...metrics
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update module progress.', error: error.message });
    }
});

// Update assessment progress for a course (Requires score >= 70% to count as passed)
router.put('/:courseId/assessment', requireAuth, async (req, res) => {
    try {
        const courseId = (req.params.courseId || '').toLowerCase().trim();
        const { score, passed, quizId = 'final', title } = req.body;

        const course = await Course.findOne({ courseId });
        if (!course) return res.status(404).json({ message: 'Course not found.' });

        let progress = await Progress.findOne({ userId: req.user._id, courseId });
        if (!progress) {
            progress = new Progress({
                userId: req.user._id,
                courseId,
                completedLessonIds: [],
                completedModules: [],
                completedLessons: 0,
                completedQuizzes: []
            });
        }

        const numericScore = Number(score) || 0;
        // RULE: A quiz is counted toward completion ONLY when it is passed with a score of at least 70%
        const isPassed = Boolean(passed && numericScore >= 70);

        // Keep best quiz score
        if (numericScore >= (progress.quizScore || 0)) {
            progress.quizScore = numericScore;
            progress.quizPassed = isPassed;
        } else if (progress.quizPassed) {
            // Keep passed if already passed previously
        } else {
            progress.quizPassed = isPassed;
        }

        let completedQuizzes = parseArray(progress.completedQuizzes);
        const cleanQuizId = String(quizId).trim();
        if (isPassed && !completedQuizzes.includes(cleanQuizId)) {
            completedQuizzes.push(cleanQuizId);
        } else if (!isPassed && numericScore > 0 && !progress.quizPassed) {
            completedQuizzes = completedQuizzes.filter(q => q !== cleanQuizId);
        }
        progress.completedQuizzes = completedQuizzes;

        // Recalculate full course metrics
        const metrics = getCourseMetrics(course, progress);
        progress.completedModules = metrics.completedModules;
        progress.totalModules = metrics.totalModules;
        progress.quizzesCompleted = metrics.quizzesCompleted;
        progress.totalQuizzes = metrics.totalQuizzes;
        progress.percentage = metrics.overallPercentage;
        progress.eligibleForCertificate = metrics.eligibleForCertificate;
        progress.status = metrics.status;
        progress.lastAccessed = new Date();

        await progress.save();

        await Activity.create({
            userId: req.user._id,
            action: isPassed ? 'ASSESSMENT_PASSED' : 'ASSESSMENT_COMPLETED',
            details: `Completed assessment "${cleanQuizId}" for ${title || course.title} with score ${numericScore}% (${isPassed ? 'PASSED >= 70%' : 'FAILED < 70%'}, Progress: ${metrics.overallPercentage}%)`,
            ipAddress: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1'
        });

        res.json({
            success: true,
            progress: typeof progress.toObject === 'function' ? progress.toObject() : progress,
            ...metrics
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update assessment progress.', error: error.message });
    }
});

module.exports = router;
