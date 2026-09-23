/**
 * Learn Me - Progress Service
 * Core business logic for student progress, lesson completion, and module evaluation.
 */
const { Progress, Course, Activity } = require('../models');
const {
    getCourseMetrics,
    getCourseModuleLessons,
    getCourseRequiredModules,
    getCourseRequiredQuizzes
} = require('../utils/courseProgressHelper');

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

async function getStudentAllProgress(userId) {
    const progressList = await Progress.find({ userId });
    const courses = await Course.findAll({ raw: true });
    const courseMap = {};
    courses.forEach(c => { courseMap[c.courseId.toLowerCase()] = c; });

    return progressList.map(p => {
        const pObj = typeof p.toObject === 'function' ? p.toObject() : (p.dataValues || p);
        const course = courseMap[(pObj.courseId || '').toLowerCase()];
        const metrics = getCourseMetrics(course, pObj);
        return {
            ...pObj,
            ...metrics
        };
    });
}

async function getStudentCourseProgress(userId, courseId) {
    const normalizedCourseId = (courseId || '').toLowerCase().trim();
    const course = await Course.findOne({ courseId: normalizedCourseId });
    if (!course) {
        const error = new Error('Course not found.');
        error.statusCode = 404;
        throw error;
    }

    const progress = await Progress.findOne({ userId, courseId: normalizedCourseId });
    const metrics = getCourseMetrics(course, progress);

    return {
        courseId: normalizedCourseId,
        courseTitle: course.title,
        progress: progress ? (typeof progress.toObject === 'function' ? progress.toObject() : progress) : null,
        ...metrics
    };
}

async function updateLesson(user, courseId, lessonId, completed = true, ipAddress = '127.0.0.1') {
    const normalizedCourseId = (courseId || '').toLowerCase().trim();
    const course = await Course.findOne({ courseId: normalizedCourseId });
    if (!course) {
        const error = new Error('Course not found.');
        error.statusCode = 404;
        throw error;
    }

    let progress = await Progress.findOne({ userId: user._id, courseId: normalizedCourseId });
    if (!progress) {
        progress = new Progress({
            userId: user._id,
            courseId: normalizedCourseId,
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
        userId: user._id,
        action: completed ? 'LESSON_COMPLETED' : 'LESSON_RESET',
        details: `${completed ? 'Completed' : 'Reset'} lesson "${cleanLessonId}" in ${course.title} (Progress: ${metrics.overallPercentage}%)`,
        ipAddress
    });

    return {
        progress: typeof progress.toObject === 'function' ? progress.toObject() : progress,
        ...metrics
    };
}

module.exports = {
    getStudentAllProgress,
    getStudentCourseProgress,
    updateLesson
};
