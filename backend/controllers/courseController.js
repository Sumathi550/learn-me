/**
 * Learn Me - Course Controller
 * Serves course listings, sanitized question sets, and details for students.
 */
const { Course, Category } = require('../models');
const { sendSuccess, sendError } = require('../utils/response');

function sanitizeCourseQuestions(questions) {
    if (!Array.isArray(questions)) return [];
    return questions.map((q, idx) => ({
        id: idx,
        qId: idx,
        q: q.q || q.question,
        options: q.options || [],
        explanation: q.explanation || 'Consult the lesson material for more details.'
    }));
}

async function getAllCourses(req, res) {
    try {
        const courses = await Course.find({ status: 'published' }).sort({ order: 1, createdAt: -1 });
        const sanitized = courses.map(c => {
            const doc = typeof c.toObject === 'function' ? c.toObject() : (c.dataValues || c);
            doc.questions = sanitizeCourseQuestions(doc.questions);
            return doc;
        });

        return sendSuccess(res, sanitized, 'Published courses retrieved');
    } catch (err) {
        return sendError(res, 'Failed to fetch courses.', 500, { error: err.message });
    }
}

async function searchCourses(req, res) {
    try {
        const { q } = req.query;
        if (!q || typeof q !== 'string') {
            return sendSuccess(res, [], 'Empty query');
        }

        const safeQuery = q.trim().substring(0, 100).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(safeQuery, 'i');
        const courses = await Course.find({
            status: 'published',
            $or: [
                { title: regex },
                { subtitle: regex },
                { difficulty: regex },
                { category: regex },
                { courseId: regex },
                { modules: regex }
            ]
        }).sort({ order: 1, createdAt: -1 });

        const sanitized = courses.map(c => {
            const doc = typeof c.toObject === 'function' ? c.toObject() : (c.dataValues || c);
            doc.questions = sanitizeCourseQuestions(doc.questions);
            return doc;
        });

        return sendSuccess(res, sanitized, 'Search results');
    } catch (err) {
        return sendError(res, 'Failed to search courses.', 500, { error: err.message });
    }
}

async function getCourseById(req, res) {
    try {
        const course = await Course.findOne({
            courseId: (req.params.courseId || '').toLowerCase(),
            status: 'published'
        });

        if (!course) {
            return sendError(res, 'Course not found or not published.', 404);
        }

        const doc = typeof course.toObject === 'function' ? course.toObject() : (course.dataValues || course);
        doc.questions = sanitizeCourseQuestions(doc.questions);

        return sendSuccess(res, doc, 'Course details retrieved');
    } catch (err) {
        return sendError(res, 'Failed to fetch course details.', 500, { error: err.message });
    }
}

async function getCourseQuiz(req, res) {
    try {
        const course = await Course.findOne({
            courseId: (req.params.courseId || '').toLowerCase(),
            status: 'published'
        });

        if (!course) {
            return sendError(res, 'Course not found.', 404);
        }

        const sanitized = sanitizeCourseQuestions(course.questions);
        const limit = req.query.limit ? Number(req.query.limit) : 50;
        const shuffled = [...sanitized].sort(() => 0.5 - Math.random()).slice(0, limit);

        return sendSuccess(res, {
            courseId: course.courseId,
            title: course.title,
            passingScore: course.passingScore || 70,
            totalBankCount: sanitized.length,
            questionsCount: shuffled.length,
            questions: shuffled
        }, 'Quiz questions retrieved');
    } catch (err) {
        return sendError(res, 'Failed to fetch quiz questions.', 500, { error: err.message });
    }
}

module.exports = {
    getAllCourses,
    searchCourses,
    getCourseById,
    getCourseQuiz
};
