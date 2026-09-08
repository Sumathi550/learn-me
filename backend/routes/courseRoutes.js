const express = require('express');
const router = express.Router();
const { Course } = require('../models');
const { Category } = require('../models');

// Helper pattern for questions
function sanitizeCourseQuestions(questions) {
    if (!Array.isArray(questions)) return [];
    return questions.map(q => ({
        q: q.q,
        options: q.options || [],
        explanation: q.explanation || 'No explanation provided for this question, but consult the lesson material for more context.'
    }));
}

// Get all published courses for student view (Answer keys excluded!)
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find({ status: 'published' }).sort({ order: 1, createdAt: -1 });

        const sanitized = courses.map(c => {
            const doc = c.toObject();
            doc.questions = sanitizeCourseQuestions(doc.questions);
            return doc;
        });

        res.json(sanitized);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch courses.', error: error.message });
    }
});

// Search courses
router.get('/search', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.json([]);
        }
        const regex = new RegExp(q, 'i');
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
            const doc = c.toObject();
            doc.questions = sanitizeCourseQuestions(doc.questions);
            return doc;
        });

        res.json(sanitized);
    } catch (error) {
        res.status(500).json({ message: 'Failed to search courses.', error: error.message });
    }
});

// Get categories
router.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find().sort({ order: 1, name: 1 });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch categories.', error: error.message });
    }
});

// Get single course details (Answer key stripped!)
router.get('/:courseId', async (req, res) => {
    try {
        const course = await Course.findOne({
            courseId: req.params.courseId.toLowerCase(),
            status: 'published'
        });

        if (!course) {
            return res.status(404).json({ message: 'Course not found or not published.' });
        }

        const doc = course.toObject();
        doc.questions = sanitizeCourseQuestions(doc.questions);
        res.json(doc);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch course details.', error: error.message });
    }
});

// Get quiz questions for a course (5 questions at a time from 50 question bank)
router.get('/:courseId/quiz', async (req, res) => {
    try {
        const course = await Course.findOne({
            courseId: req.params.courseId.toLowerCase(),
            status: 'published'
        });

        if (!course) {
            return res.status(404).json({ message: 'Course not found.' });
        }

        const sanitized = sanitizeCourseQuestions(course.questions);
        const limit = req.query.limit ? Number(req.query.limit) : 50;
        const shuffled = [...sanitized].sort(() => 0.5 - Math.random()).slice(0, limit);

        res.json({
            courseId: course.courseId,
            title: course.title,
            passingScore: course.passingScore || 70,
            totalBankCount: sanitized.length,
            questionsCount: shuffled.length,
            questions: shuffled
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch quiz questions.', error: error.message });
    }
});

module.exports = router;
