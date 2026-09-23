/**
 * Learn Me - Progress Controller
 */
const progressService = require('../services/progressService');
const { sendSuccess, sendError } = require('../utils/response');

async function getAllProgress(req, res) {
    try {
        const list = await progressService.getStudentAllProgress(req.user._id);
        return sendSuccess(res, list, 'All course progress retrieved');
    } catch (err) {
        return sendError(res, 'Failed to fetch progress.', 500, { error: err.message });
    }
}

async function getCourseProgress(req, res) {
    try {
        const data = await progressService.getStudentCourseProgress(req.user._id, req.params.courseId);
        return sendSuccess(res, data, 'Course progress retrieved');
    } catch (err) {
        return sendError(res, err.message, err.statusCode || 500);
    }
}

async function updateLesson(req, res) {
    try {
        const { lessonId, completed = true } = req.body;
        if (!lessonId) {
            return sendError(res, 'lessonId is required.', 400);
        }

        const data = await progressService.updateLesson(
            req.user,
            req.params.courseId,
            lessonId,
            completed,
            req.ip || req.headers['x-forwarded-for'] || '127.0.0.1'
        );

        return sendSuccess(res, data, 'Lesson progress updated');
    } catch (err) {
        return sendError(res, err.message, err.statusCode || 500);
    }
}

module.exports = {
    getAllProgress,
    getCourseProgress,
    updateLesson
};
