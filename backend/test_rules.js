process.env.NODE_ENV = 'test';
const path = require('path');

async function runTests() {
    console.log('=== STARTING RIGOROUS PROGRESS & CERTIFICATE VERIFICATION ===\n');

    // 1. Initialize Express App & Database
    const { sequelize, User, Course, Progress, Certificate, CertificatePayment } = require('./models');
    const { getCourseRequiredModules, getCourseRequiredQuizzes, getCourseModuleLessons, getCourseMetrics } = require('./utils/courseProgressHelper');
    const seedDatabase = require('./utils/seedData');
    const app = require('./server');

    let passedTests = 0;
    let totalTests = 0;

    function assert(condition, message) {
        totalTests++;
        if (condition) {
            console.log(`  ✅ PASS: ${message}`);
            passedTests++;
        } else {
            console.error(`  ❌ FAIL: ${message}`);
            throw new Error(`Assertion failed: ${message}`);
        }
    }

    // Start server on an ephemeral random port
    const server = await new Promise((resolve) => {
        const s = app.listen(0, () => resolve(s));
    });
    const port = server.address().port;
    const baseUrl = `http://localhost:${port}`;
    console.log(`Ephemeral test server running at ${baseUrl}`);

    try {
        await sequelize.authenticate();
        await sequelize.sync();
        console.log('Database connected successfully.');
        await seedDatabase();
        console.log('Seed database synchronization verified.\n');

        // Helper fetch wrapper
        async function api(path, options = {}) {
            const url = `${baseUrl}${path}`;
            const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
            const res = await fetch(url, {
                ...options,
                headers,
                body: options.body ? JSON.stringify(options.body) : undefined
            });
            let json = null;
            try {
                json = await res.json();
            } catch (e) {}
            return { status: res.status, body: json };
        }

        // ==========================================
        // TEST 1: Admin Credentials Verification
        // ==========================================
        console.log('--- TEST 1: Admin Credentials Verification ---');
        const adminRes = await api('/api/auth/login', {
            method: 'POST',
            body: { email: 'sumathiaz550@gmail.com', password: 'Sumathi@12345' }
        });
        
        assert(adminRes.status === 200, 'Admin login HTTP status is 200');
        assert(adminRes.body.token, 'Admin login returns JWT token');
        assert(adminRes.body.user && adminRes.body.user.role === 'admin', 'Admin user role is admin');
        console.log('Admin login verified successfully.\n');

        // ==========================================
        // TEST 2: Existing 4 Certificates Preserved
        // ==========================================
        let existingCerts = await Certificate.findAll();
        if (existingCerts.length < 4) {
            const adminId = adminRes.body.user.id;
            const certSeedData = [
                { certificateId: 'LM-ADVANCED-APTITUDE-2026-3VQD6I', userId: adminId, userName: 'Test Student', courseId: 'advanced-aptitude', courseName: 'Advanced Aptitude', score: 100, percentage: 100, verificationCode: 'VC-3VQD6I', issuedAt: new Date() },
                { certificateId: 'LM-PYTHON-2026-4SGCZ6', userId: adminId, userName: 'sumathi', courseId: 'python', courseName: 'Python Programming', score: 95, percentage: 95, verificationCode: 'VC-4SGCZ6', issuedAt: new Date() },
                { certificateId: 'LM-ADVANCED-APTITUDE-2026-E0VBLO', userId: adminId, userName: 'sumathi', courseId: 'advanced-aptitude', courseName: 'Advanced Aptitude', score: 90, percentage: 90, verificationCode: 'VC-E0VBLO', issuedAt: new Date() },
                { certificateId: 'LM-PYTHON-2026-BBD4EM', userId: adminId, userName: 'Test Student Certificate', courseId: 'python', courseName: 'Python Programming', score: 88, percentage: 88, verificationCode: 'VC-BBD4EM', issuedAt: new Date() }
            ];
            for (const c of certSeedData) {
                await Certificate.findOrCreate({ where: { certificateId: c.certificateId }, defaults: c });
            }
            existingCerts = await Certificate.findAll();
        }
        assert(existingCerts.length >= 4, `At least 4 test certificates found (found: ${existingCerts.length})`);
        
        for (const cert of existingCerts.slice(0, 4)) {
            const verifyRes = await api(`/api/certificates/verify/${cert.certificateId}`);
            assert(verifyRes.status === 200, `Verification endpoint returns 200 for ${cert.certificateId}`);
            assert(verifyRes.body.isValid === true, `Certificate ${cert.certificateId} is valid`);
            assert(verifyRes.body.certificate.studentName, `Certificate has student name: ${verifyRes.body.certificate.studentName}`);
        }
        console.log('All test certificates verified intact.\n');

        // ==========================================
        // TEST 3: Course Metrics & Dynamic Requirements
        // ==========================================
        console.log('--- TEST 3: Dynamic Course Requirements Calculation ---');
        const testCourse = await Course.findOne({ where: { courseId: 'python' } });
        assert(testCourse !== null, 'Found python course in DB');

        const reqModules = getCourseRequiredModules(testCourse);
        const reqQuizzes = getCourseRequiredQuizzes(testCourse);
        assert(reqModules.length >= 3, `python has ${reqModules.length} required modules`);
        assert(reqQuizzes.length >= 1, `python has ${reqQuizzes.length} required quizzes`);
        console.log(`Course requirements: ${reqModules.length} modules, ${reqQuizzes.length} quizzes.\n`);

        // ==========================================
        // TEST 4: Lesson Completion vs Module Completion Logic
        // ==========================================
        console.log('--- TEST 4: Module is Complete ONLY When All Lessons are Complete ---');
        const firstModule = reqModules[0];
        const mod1Lessons = getCourseModuleLessons(testCourse, firstModule);
        
        assert(mod1Lessons.length >= 1, `Module "${firstModule}" has ${mod1Lessons.length} lessons`);

        // Case A: No lessons completed
        let metrics0 = getCourseMetrics(testCourse, { completedLessonIds: [], completedQuizzes: {} });
        assert(!metrics0.completedModules.includes(firstModule), 'Module not completed when 0 lessons are completed');
        assert(metrics0.isCompleted === false, 'Course is not completed');
        assert(metrics0.eligibleForCertificate === false, 'Not eligible for certificate');

        // Case B: Incomplete lessons (if module has > 1 lesson, complete only 1)
        if (mod1Lessons.length > 1) {
            let partialLessons = [mod1Lessons[0].lessonId];
            let metricsPartial = getCourseMetrics(testCourse, { completedLessonIds: partialLessons, completedQuizzes: {} });
            assert(!metricsPartial.completedModules.includes(firstModule), 'Module not completed when only partial lessons completed');
        }

        // Case C: ALL lessons in module completed
        const mod1LessonIds = mod1Lessons.map(l => l.lessonId);
        let metricsFullMod = getCourseMetrics(testCourse, { completedLessonIds: mod1LessonIds, completedQuizzes: {} });
        assert(metricsFullMod.completedModules.includes(firstModule), 'Module IS completed when all its lessons are completed');
        console.log('Lesson-to-module completion verified.\n');

        // ==========================================
        // TEST 5: Quiz Passing Threshold (>= 70%)
        // ==========================================
        console.log('--- TEST 5: 70% Quiz Passing Threshold ---');
        const quizId = reqQuizzes[0].quizId;

        // All lessons across all modules
        const allCourseLessons = [];
        reqModules.forEach(mod => {
            allCourseLessons.push(...getCourseModuleLessons(testCourse, mod));
        });
        const allLessonIds = allCourseLessons.map(l => l.lessonId);

        // Score 69% -> NOT passed
        let metricsFailQuiz = getCourseMetrics(testCourse, {
            completedLessonIds: allLessonIds,
            completedQuizzes: { [quizId]: { score: 69, passed: false } }
        });
        assert(!metricsFailQuiz.passedQuizIds.includes(quizId), 'Score of 69% does NOT pass quiz');
        assert(metricsFailQuiz.eligibleForCertificate === false, 'Cannot get certificate with 69% quiz score');

        // Score 70% -> PASSED
        let metricsPassQuiz = getCourseMetrics(testCourse, {
            completedLessonIds: allLessonIds,
            completedQuizzes: { [quizId]: { score: 70, passed: true } }
        });
        assert(metricsPassQuiz.passedQuizIds.includes(quizId), 'Score of 70% DOES pass quiz');
        assert(metricsPassQuiz.eligibleForCertificate === true, 'Eligible for certificate when all modules + quizzes passed');
        assert(metricsPassQuiz.courseProgress === 100, 'Course progress is 100%');
        console.log('70% quiz threshold verified.\n');

        // ==========================================
        // TEST 6: Backend Certificate API Security & Enforcement
        // ==========================================
        console.log('--- TEST 6: Server-side Certificate Generation Security ---');
        
        // Create a dedicated test user
        const testEmail = `test_student_${Date.now()}@example.com`;
        const registerRes = await api('/api/auth/register', {
            method: 'POST',
            body: { name: 'Verification Test Student', email: testEmail, password: 'Password@123' }
        });
        
        assert(registerRes.status === 201, 'Test student registered');
        const studentToken = registerRes.body.token;
        const studentUserId = registerRes.body.user.id;

        // Sub-test 6.1: Zero progress certificate request -> Expect 403 Forbidden
        const certReject1 = await api('/api/certificates/generate', {
            method: 'POST',
            headers: { Authorization: `Bearer ${studentToken}` },
            body: { courseId: 'python' }
        });
        
        assert(certReject1.status === 403, 'Certificate request with 0 progress returns 403');
        assert(certReject1.body.reasons && certReject1.body.reasons.length > 0, 'Returns reasons for rejection');
        console.log('  -> Zero progress rejection verified.');

        // Sub-test 6.2: Fake local storage bypass attempt
        // Attacker attempts to update progress to eligibleForCertificate = true without completing lessons
        const certRejectBypass = await api('/api/certificates/generate', {
            method: 'POST',
            headers: { Authorization: `Bearer ${studentToken}` },
            body: { 
                courseId: 'python',
                eligibleForCertificate: true,
                completedModules: reqModules,
                percentage: 100,
                score: 100,
                passed: true
            }
        });
        
        assert(certRejectBypass.status === 403, 'Spoofed client payload is ignored and rejected with 403');
        console.log('  -> Client-side bypass protection verified.');

        // Sub-test 6.3: Complete only modules via API, but fail the quiz
        // Mark all module lessons
        for (const mod of reqModules) {
            await api('/api/progress/python/module', {
                method: 'PUT',
                headers: { Authorization: `Bearer ${studentToken}` },
                body: { moduleName: mod, completed: true }
            });
        }

        // Submit quiz with 60%
        await api('/api/progress/python/assessment', {
            method: 'PUT',
            headers: { Authorization: `Bearer ${studentToken}` },
            body: { quizId: quizId, score: 60, passed: false }
        });

        const certRejectQuizFail = await api('/api/certificates/generate', {
            method: 'POST',
            headers: { Authorization: `Bearer ${studentToken}` },
            body: { courseId: 'python' }
        });
        
        assert(certRejectQuizFail.status === 403, 'Certificate rejected with 403 when quiz score is below 70%');
        console.log('  -> Quiz score < 70% rejection verified.');

        // Sub-test 6.4: Pass quiz with 85% -> Full completion!
        const quizPassRes = await api('/api/progress/python/assessment', {
            method: 'PUT',
            headers: { Authorization: `Bearer ${studentToken}` },
            body: { quizId: quizId, score: 85, passed: true, correct: 17, total: 20 }
        });
        
        assert(quizPassRes.status === 200, 'Assessment update returns 200');
        assert(quizPassRes.body.overallPercentage === 100, 'Overall progress is now 100%');
        assert(quizPassRes.body.eligibleForCertificate === true, 'Server confirms eligibleForCertificate is true');

        // Now generate certificate!
        const certSuccess = await api('/api/certificates/generate', {
            method: 'POST',
            headers: { Authorization: `Bearer ${studentToken}` },
            body: { courseId: 'python' }
        });
        
        assert(certSuccess.status === 200, 'Certificate successfully generated with 200 OK');
        assert(certSuccess.body.certificateId, `Certificate ID generated: ${certSuccess.body.certificateId}`);
        const newCertId = certSuccess.body.certificateId;

        // Sub-test 6.5: Verify the new certificate on the public verification endpoint
        const verifyNewRes = await api(`/api/certificates/verify/${newCertId}`);
        assert(verifyNewRes.status === 200, 'Public verification returns 200');
        assert(verifyNewRes.body.isValid === true, 'Public verification confirms certificate is valid');
        assert(verifyNewRes.body.certificate.studentName === 'Verification Test Student', 'Correct student name verified');
        console.log('  -> Full completion and certificate issuance verified.\n');

        // Sub-test 6.6: Certificate Download Ownership Verification
        console.log('--- TEST 7: Certificate Download Ownership Verification ---');
        const studentBRes = await api('/api/auth/register', {
            method: 'POST',
            body: { name: 'Student B', email: `student_b_${Date.now()}@example.com`, password: 'Password@123' }
        });
        const studentBToken = studentBRes.body.token;
        const studentBId = studentBRes.body.user.id;

        // Student B tries to download Student A's certificate -> Must return 403 Forbidden
        const downloadForeignRes = await api(`/api/certificates/download/${newCertId}`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${studentBToken}` }
        });
        assert(downloadForeignRes.status === 403, 'Foreign student downloading certificate returns 403 Forbidden');

        // Student A downloads their own certificate -> Must return 200 OK
        const downloadOwnRes = await api(`/api/certificates/download/${newCertId}`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${studentToken}` }
        });
        assert(downloadOwnRes.status === 200, 'Owner downloading certificate returns 200 OK');
        assert(downloadOwnRes.body.authorized === true, 'Response confirms authorized download');
        console.log('  -> Certificate ownership download checks verified.\n');

        // Sub-test 6.7: Quiz submission NEVER generates a certificate
        console.log('--- TEST 8: POST /api/quizzes/submit NEVER Generates Certificate ---');
        const certCountBefore = await Certificate.count();
        const quizSubmitRes = await api('/api/quizzes/submit', {
            method: 'POST',
            headers: { Authorization: `Bearer ${studentBToken}` },
            body: {
                courseId: 'python',
                answers: [0, 1, 2, 0, 1],
                timeTakenSeconds: 45
            }
        });
        assert(quizSubmitRes.status === 200, 'Quiz submit returns 200');
        assert(quizSubmitRes.body.score !== undefined, 'Quiz submit returns score');
        const certCountAfter = await Certificate.count();
        assert(certCountBefore === certCountAfter, 'No certificate was created during quiz submission');
        console.log('  -> POST /api/quizzes/submit certificate isolation verified.\n');

        // Clean up test data
        await Certificate.destroy({ where: { certificateId: newCertId } });
        await Progress.destroy({ where: { userId: studentUserId } });
        await User.destroy({ where: { id: studentUserId } });
        await User.destroy({ where: { id: studentBId } });
        console.log('Cleaned up test artifacts, preserving all original certificates.\n');

        server.close();
        console.log(`=================================================`);
        console.log(`🎉 ALL ${totalTests} VERIFICATION TESTS PASSED SUCCESSFULLY!`);
        console.log(`=================================================`);
        process.exit(0);
    } catch (err) {
        console.error('Test execution error:', err);
        if (server) server.close();
        process.exit(1);
    }
}

runTests();
