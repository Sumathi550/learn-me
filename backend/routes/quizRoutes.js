const express = require('express');
const router = express.Router();
const { Course } = require('../models');
const { QuizAttempt } = require('../models');
const { Progress } = require('../models');
const { Activity } = require('../models');
const { Certificate } = require('../models');
const { requireAuth } = require('../middleware/authMiddleware');

// Helper to shuffle array
function shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

// Get sanitized quiz questions for a course (shuffled, 5 questions per request)
router.get('/questions/:courseId', async (req, res) => {
    try {
        const courseId = req.params.courseId.toLowerCase();
        const course = await Course.findOne({ courseId });
        if (!course) {
            return res.status(404).json({ message: 'Course not found.' });
        }

        const allQuestions = (course.questions || []).map((q, idx) => ({
            id: idx,
            qId: idx,
            q: q.q || q.question,
            options: q.options || [],
            explanation: q.explanation || 'Consult the course material for details.'
        }));

        // Default to 50 shuffled questions per request
        const limit = req.query.limit ? Number(req.query.limit) : 50;
        const shuffled = shuffleArray(allQuestions).slice(0, limit);

        res.json({
            courseId: course.courseId,
            title: course.title,
            passingScore: course.passingScore || 70,
            totalAvailableInBank: allQuestions.length,
            questionsCount: shuffled.length,
            questions: shuffled.map((q, clientIndex) => ({
                id: clientIndex,
                qId: q.qId,
                q: q.q,
                options: q.options
            }))
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to load questions.', error: error.message });
    }
});

// Secure Server-Side Quiz Answer Evaluation
router.post('/submit', requireAuth, async (req, res) => {
    try {
        let { courseId, answers, timeTakenSeconds, questionIds } = req.body;
        
        let answersArray = [];
        if (Array.isArray(answers)) {
            answersArray = answers;
        } else if (answers && typeof answers === 'object') {
            const keys = Object.keys(answers).sort((a, b) => Number(a) - Number(b));
            answersArray = keys.map(k => answers[k]);
        }

        if (!courseId || answersArray.length === 0) {
            return res.status(400).json({ message: 'courseId and answers are required.' });
        }

        const course = await Course.findOne({ courseId: courseId.toLowerCase() });
        if (!course) {
            return res.status(404).json({ message: 'Course not found.' });
        }

        const dbQuestions = course.questions || [];
        if (dbQuestions.length === 0) {
            return res.status(400).json({ message: 'No questions configured for this course.' });
        }

        // Determine which questions were in this assessment request
        let activeQuestions = [];
        let normalizedAnswers = [];

        if (Array.isArray(questionIds) && questionIds.length === answersArray.length) {
            questionIds.forEach((qId, i) => {
                if (dbQuestions[qId]) {
                    activeQuestions.push(dbQuestions[qId]);
                    normalizedAnswers.push(typeof answersArray[i] === 'number' ? answersArray[i] : (answersArray[i]?.selectedOption ?? answersArray[i]?.answer));
                }
            });
        } else if (answersArray.length > 0 && typeof answersArray[0] === 'object' && answersArray[0] !== null && ('qId' in answersArray[0] || 'qIndex' in answersArray[0])) {
            answersArray.forEach(item => {
                const idx = typeof item.qId === 'number' ? item.qId : (typeof item.qIndex === 'number' ? item.qIndex : 0);
                if (dbQuestions[idx]) {
                    activeQuestions.push(dbQuestions[idx]);
                    normalizedAnswers.push(typeof item.selectedOption === 'number' ? item.selectedOption : item.answer);
                }
            });
        } else if (answersArray.length <= 10 && answersArray.length < dbQuestions.length) {
            activeQuestions = dbQuestions.slice(0, answersArray.length);
            normalizedAnswers = answersArray.map(a => typeof a === 'number' ? a : (a?.selectedOption ?? a?.answer));
        } else {
            activeQuestions = dbQuestions.slice(0, answersArray.length);
            normalizedAnswers = answersArray.map(a => typeof a === 'number' ? a : (a?.selectedOption ?? a?.answer));
        }

        let correctCount = 0;
        const reviewData = activeQuestions.map((q, idx) => {
            const raw = normalizedAnswers[idx];
            const userAnswer = (typeof raw === 'object' && raw !== null)
                ? (typeof raw.selectedOption === 'number' ? raw.selectedOption : raw.answer)
                : (typeof raw === 'number' ? raw : (raw !== undefined && raw !== null ? Number(raw) : undefined));
            const isCorrect = typeof userAnswer === 'number' && !isNaN(userAnswer) && userAnswer === q.answer;
            if (isCorrect) correctCount++;

            return {
                q: q.q,
                options: q.options,
                answer: q.answer,
                userAnswer: typeof userAnswer === 'number' && !isNaN(userAnswer) ? userAnswer : undefined,
                isCorrect,
                explanation: q.explanation || `The correct option is "${q.options[q.answer]}".`
            };
        });

        const totalQuestions = activeQuestions.length;
        const percentage = Math.round((correctCount / totalQuestions) * 100);
        const passingScore = course.passingScore || 70;
        const passed = percentage >= passingScore;

        // Count previous attempts
        const previousAttempts = await QuizAttempt.countDocuments({
            userId: req.user._id,
            courseId: course.courseId
        });

        // Record attempt in DB
        const quizAttempt = await QuizAttempt.create({
            userId: req.user._id,
            courseId: course.courseId,
            attemptNumber: previousAttempts + 1,
            answers,
            score: correctCount,
            totalQuestions,
            percentage,
            passed,
            timeTakenSeconds: timeTakenSeconds || 0,
            startedAt: new Date(Date.now() - ((timeTakenSeconds || 30) * 1000)),
            completedAt: new Date()
        });

        // Update student progress
        let progress = await Progress.findOne({ userId: req.user._id, courseId: course.courseId });
        if (!progress) {
            progress = new Progress({
                userId: req.user._id,
                courseId: course.courseId,
                totalLessons: (course.lessons || []).length || 1
            });
        }

        // Keep highest score
        if (percentage >= (progress.quizScore || 0)) {
            progress.quizScore = percentage;
        }
        if (passed) {
            progress.quizPassed = true;
            progress.eligibleForCertificate = true;
            progress.percentage = 100;
            progress.status = 'Completed';
        }
        progress.lastAccessed = new Date();
        await progress.save();

        // Create Activity log
        await Activity.create({
            userId: req.user._id,
            action: 'QUIZ_SUBMITTED',
            details: `Submitted quiz for ${course.title} - Score: ${percentage}% (${correctCount}/${totalQuestions})`,
            ipAddress: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1'
        });

        if (passed) {
            await Activity.create({
                userId: req.user._id,
                action: 'QUIZ_PASSED',
                details: `Passed ${course.title} assessment with ${percentage}%`,
                ipAddress: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1'
            });

            await Activity.create({
                userId: req.user._id,
                action: 'CERTIFICATE_ELIGIBLE',
                details: `Earned eligibility for ${course.title} certificate`,
                ipAddress: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1'
            });

            // Check if certificate already exists or create pending certificate
            let cert = await Certificate.findOne({ userId: req.user._id, courseId: course.courseId });
            if (!cert) {
                const randomId = Math.random().toString(36).substring(2, 8).toUpperCase();
                const certCode = `LM-${course.courseId.toUpperCase()}-${new Date().getFullYear()}-${randomId}`;
                cert = await Certificate.create({
                    certificateId: certCode,
                    userId: req.user._id,
                    userName: req.user.name,
                    courseId: course.courseId,
                    courseName: course.title,
                    score: percentage,
                    percentage,
                    verificationCode: certCode,
                    status: 'valid',
                    paymentStatus: 'pending'
                });
            }
        } else {
            await Activity.create({
                userId: req.user._id,
                action: 'QUIZ_FAILED',
                details: `Failed ${course.title} assessment (${percentage}%, required ${passingScore}%)`,
                ipAddress: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1'
            });
        }

        res.json({
            score: percentage,
            rawScore: correctCount,
            total: totalQuestions,
            passed,
            passingScore,
            reviewData,
            certificatePrice: course.certificatePrice || (course.category === 'Aptitude' || course.courseId.includes('aptitude') ? 100 : 10),
            eligibleForCertificate: progress.eligibleForCertificate
        });
    } catch (error) {
        res.status(500).json({ message: 'Error evaluating quiz.', error: error.message });
    }
});

module.exports = router;
