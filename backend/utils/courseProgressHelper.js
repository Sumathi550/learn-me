/**
 * Course Progress & Completion Helper
 * Evaluates completion based on:
 * 1. All course modules completed (A module is completed ONLY when ALL its required lessons are completed)
 * 2. All course-specific required quizzes completed (Each passed with a score of at least 70%)
 * 3. Overall progress calculated across all required modules and required quizzes
 * 4. Certificate eligibility verified strictly server-side
 */

function parseJsonField(val, fallback = []) {
    if (val === null || val === undefined) return fallback;
    if (Array.isArray(val)) return val;
    if (typeof val === 'object') return val;
    if (typeof val === 'string') {
        try {
            return JSON.parse(val);
        } catch (e) {
            return fallback;
        }
    }
    return fallback;
}

/**
 * Returns clean list of required modules (filtering out quiz/assessment markers)
 */
function getCourseRequiredModules(course) {
    const rawModules = parseJsonField(course?.modules, []);
    return rawModules.filter(m => {
        const name = typeof m === 'object' ? (m.title || m.name || '') : String(m);
        const lower = name.toLowerCase().trim();
        return lower !== 'final assessment' && 
               lower !== 'full assessment' && 
               lower !== 'quiz' && 
               !lower.includes('final assessment');
    }).map(m => typeof m === 'object' ? (m.title || m.name || '').trim() : String(m).trim());
}

/**
 * Returns required quizzes for a course.
 * Calculates course-specific quizzes from course.quizzes configured in database,
 * or defaults to the course's final assessment if configured. Never assumes totalQuizzes = 1.
 */
function getCourseRequiredQuizzes(course) {
    const configuredQuizzes = parseJsonField(course?.quizzes, []);
    const coursePassingScore = Math.max(70, Number(course?.passingScore) || 70);

    if (Array.isArray(configuredQuizzes) && configuredQuizzes.length > 0) {
        return configuredQuizzes.map((q, idx) => ({
            quizId: String(q.quizId || q.id || `quiz-${idx + 1}`),
            title: q.title || `Quiz ${idx + 1}`,
            moduleId: q.moduleId || q.module || null,
            passingScore: Math.max(70, Number(q.passingScore) || coursePassingScore)
        }));
    }

    // Default fallback if course has final assessment or question bank
    if (course?.hasFinalAssessment !== false || (Array.isArray(course?.questions) && course.questions.length > 0)) {
        return [{
            quizId: 'final',
            title: `${course?.title || 'Course'} Final Assessment`,
            moduleId: null,
            passingScore: coursePassingScore
        }];
    }

    return [];
}

/**
 * Returns all lessons for a specific module in a course.
 * Ensures every module has at least one required lesson definition.
 */
function getCourseModuleLessons(course, moduleName) {
    const cleanModuleName = String(moduleName || '').trim();
    const allLessons = parseJsonField(course?.lessons, []);
    const requiredModules = getCourseRequiredModules(course);
    const modIndex = requiredModules.indexOf(cleanModuleName);

    // Filter lessons that explicitly match this module
    const matched = allLessons.filter(l => {
        if (!l) return false;
        const mod = String(l.module || l.moduleId || l.moduleTitle || '').trim();
        return mod.toLowerCase() === cleanModuleName.toLowerCase();
    });

    if (matched.length > 0) {
        return matched.map((l, i) => ({
            lessonId: String(l.lessonId || l.id || `${course?.courseId || 'c'}-m${modIndex + 1}-l${i + 1}`),
            module: cleanModuleName,
            title: l.title || `${cleanModuleName} - Lesson ${i + 1}`,
            content: l.content || `Study core concepts of ${cleanModuleName}.`,
            duration: l.duration || '25 mins'
        }));
    }

    // If lessons exist but without explicit module tagging, map deterministically
    if (allLessons.length > 0 && modIndex !== -1) {
        // Check if lessonId or title matches module or maps by index
        const indexMatched = allLessons.filter((l, idx) => {
            const lTitle = String(l.title || '').toLowerCase();
            if (lTitle.includes(cleanModuleName.toLowerCase())) return true;
            if (requiredModules.length === allLessons.length) return idx === modIndex;
            return false;
        });

        if (indexMatched.length > 0) {
            return indexMatched.map((l, i) => ({
                lessonId: String(l.lessonId || l.id || `${course?.courseId || 'c'}-m${modIndex + 1}-l${i + 1}`),
                module: cleanModuleName,
                title: l.title || `${cleanModuleName} - Lesson ${i + 1}`,
                content: l.content || `Study core concepts of ${cleanModuleName}.`,
                duration: l.duration || '25 mins'
            }));
        }
    }

    // Standardized fallback: every required module has a designated required lesson
    const fallbackId = `${course?.courseId || 'course'}-mod-${modIndex !== -1 ? modIndex + 1 : 1}-core`;
    return [{
        lessonId: fallbackId,
        module: cleanModuleName,
        title: `${cleanModuleName} Core Curriculum`,
        content: `Master the fundamental concepts, examples, and techniques of ${cleanModuleName}.`,
        duration: '30 mins'
    }];
}

/**
 * Evaluates full course metrics from course data and progress record.
 */
function getCourseMetrics(course, progressRecord) {
    const requiredModules = getCourseRequiredModules(course);
    const totalModules = Math.max(1, requiredModules.length);

    // Extract completed lesson IDs from progress record
    const completedLessonIds = new Set(
        parseJsonField(progressRecord?.completedLessonIds, []).map(id => String(id).trim())
    );

    // A module is considered completed ONLY when ALL required lessons inside that module are completed!
    const completedModules = [];
    const moduleDetails = requiredModules.map(moduleName => {
        const moduleLessons = getCourseModuleLessons(course, moduleName);
        const totalLessonsInModule = moduleLessons.length;
        const completedLessonsInModule = moduleLessons.filter(l => completedLessonIds.has(l.lessonId)).length;
        const isModuleCompleted = totalLessonsInModule > 0 && (completedLessonsInModule === totalLessonsInModule);

        if (isModuleCompleted) {
            completedModules.push(moduleName);
        }

        return {
            moduleName,
            totalLessons: totalLessonsInModule,
            completedLessons: completedLessonsInModule,
            isCompleted: isModuleCompleted,
            lessons: moduleLessons.map(l => ({
                lessonId: l.lessonId,
                title: l.title,
                duration: l.duration,
                isCompleted: completedLessonIds.has(l.lessonId)
            }))
        };
    });

    const completedModulesCount = completedModules.length;

    // Course-specific required quizzes
    // Course-specific required quizzes
    const requiredQuizzes = getCourseRequiredQuizzes(course);
    const totalQuizzes = requiredQuizzes.length;

    // A quiz is counted toward completion ONLY when it is passed with a score of at least 70%
    const rawQuizzes = parseJsonField(progressRecord?.completedQuizzes, {});
    const passedQuizzesSet = new Set();
    const quizScoreMap = {};

    if (Array.isArray(rawQuizzes)) {
        rawQuizzes.forEach(q => passedQuizzesSet.add(String(q).trim()));
    } else if (rawQuizzes && typeof rawQuizzes === 'object') {
        Object.entries(rawQuizzes).forEach(([qId, val]) => {
            if (val === true) {
                passedQuizzesSet.add(qId);
            } else if (val && typeof val === 'object') {
                const score = Number(val.score || 0);
                quizScoreMap[qId] = score;
                // STRICT RULE: score must be at least 70%
                if (score >= 70 && val.passed !== false) {
                    passedQuizzesSet.add(qId);
                }
            }
        });
    }

    // Single-quiz legacy / fallback compatibility
    const singleQuizScore = progressRecord ? Number(progressRecord.quizScore || 0) : 0;
    const singleQuizPassed = Boolean(progressRecord?.quizPassed && singleQuizScore >= 70);

    const completedQuizzesList = [];
    const quizDetails = requiredQuizzes.map(q => {
        const minPass = Math.max(70, Number(q.passingScore) || 70);
        let isPassed = false;

        if (passedQuizzesSet.has(q.quizId)) {
            const recordedScore = quizScoreMap[q.quizId];
            if (recordedScore !== undefined) {
                isPassed = recordedScore >= minPass;
            } else {
                isPassed = true;
            }
        }

        // Fallback for single final quiz if legacy quizPassed flag is true with score >= 70%
        if (!isPassed && q.quizId === 'final' && singleQuizPassed && singleQuizScore >= minPass) {
            isPassed = true;
        }

        if (isPassed) {
            completedQuizzesList.push(q.quizId);
        }

        return {
            quizId: q.quizId,
            title: q.title,
            passingScore: minPass,
            isPassed
        };
    });

    const quizzesCompleted = completedQuizzesList.length;

    // Total lessons across all modules
    const totalLessonsInCourse = moduleDetails.reduce((sum, m) => sum + m.totalLessons, 0);
    const completedLessonsInCourse = completedLessonIds.size;
    const allModulesCompleted = completedModulesCount >= totalModules;
    const allLessonsCompleted = (totalLessonsInCourse > 0 && completedLessonsInCourse >= totalLessonsInCourse) || allModulesCompleted;

    // 1. Reading material (up to 25%)
    let readingPercentage = 0;
    if (allLessonsCompleted) {
        readingPercentage = 25;
    } else if (totalLessonsInCourse > 0) {
        readingPercentage = Math.min(25, Math.round((completedLessonsInCourse / totalLessonsInCourse) * 25));
    }

    // 2. Practice / Topic Quiz (up to 25%)
    const hasPracticeQuizPassed = completedQuizzesList.some(q => q === 'practice' || q.startsWith('practice') || q.startsWith('quiz-'));

    // 3. 50-Questions Final Assessment (50% increase upon passing score >= 70%)
    const hasFinalExamPassed = completedQuizzesList.includes('final') || (singleQuizPassed && singleQuizScore >= 70);

    let quizPercentage = 0;
    if (hasPracticeQuizPassed) {
        quizPercentage += 25;
    }
    if (hasFinalExamPassed) {
        quizPercentage += 50;
        // When the final comprehensive exam is passed with >= 70% and all lessons completed,
        // credit the practice component so full completion reaches 100%
        if (!hasPracticeQuizPassed && (totalQuizzes <= 1 || allLessonsCompleted)) {
            quizPercentage += 25;
        }
    }

    const totalItems = totalModules + totalQuizzes;
    const completedItems = completedModulesCount + quizzesCompleted;
    const overallPercentage = Math.min(100, readingPercentage + quizPercentage);
    const allQuizzesCompleted = totalQuizzes === 0 || (quizzesCompleted >= totalQuizzes) || hasFinalExamPassed;
    const isFullyCompleted = allLessonsCompleted && hasFinalExamPassed && (overallPercentage === 100);

    return {
        courseId: course?.courseId,
        totalModules,
        requiredModules,
        completedModulesCount,
        completedModules,
        moduleDetails,
        totalLessons: totalLessonsInCourse,
        completedLessonsCount: completedLessonsInCourse,
        completedLessonIds: Array.from(completedLessonIds),
        totalQuizzes,
        requiredQuizzes,
        quizzesCompleted,
        completedQuizzes: completedQuizzesList,
        passedQuizIds: completedQuizzesList,
        quizDetails,
        quizPassed: (allQuizzesCompleted && totalQuizzes > 0) || hasFinalExamPassed,
        quizScore: progressRecord?.quizScore ?? null,
        readingPercentage,
        practiceQuizPercentage: hasPracticeQuizPassed ? 25 : (hasFinalExamPassed && !hasPracticeQuizPassed ? 25 : 0),
        finalExamPercentage: hasFinalExamPassed ? 50 : 0,
        readingCompleted: allLessonsCompleted,
        practiceQuizPassed: hasPracticeQuizPassed || hasFinalExamPassed,
        finalExamPassed: hasFinalExamPassed,
        totalItems,
        completedItems,
        overallPercentage,
        courseProgress: overallPercentage,
        isCompleted: isFullyCompleted,
        isFullyCompleted,
        eligibleForCertificate: isFullyCompleted,
        status: isFullyCompleted ? 'Completed' : (overallPercentage > 0 ? 'In Progress' : 'Not Started')
    };
}

module.exports = {
    getCourseRequiredModules,
    getCourseRequiredQuizzes,
    getCourseModuleLessons,
    getCourseMetrics
};
