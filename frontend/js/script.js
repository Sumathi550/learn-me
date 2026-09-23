// ===============================
// DATA & STATE MANAGEMENT
// ===============================

const coursesData = [
    { id: "python",     title: "Python Programming",      subtitle: "Master Python fundamentals, data structures, and automation.",                          icon: "fa-python",        iconType: "fab", duration: "10 hrs", difficulty: "Beginner",      questionsUrl: "data/python.json",     modules: ["Python Basics", "Functions & Control Flow", "OOP & Data Structures", "Final Assessment"] },
    { id: "numpy",      title: "NumPy",                   subtitle: "Numerical computing with powerful N-dimensional arrays.",                              icon: "fa-table",         iconType: "fas", duration: "5 hrs",  difficulty: "Intermediate",  questionsUrl: "data/numpy.json",      modules: ["Array Fundamentals", "Indexing & Slicing", "Math Operations", "Final Assessment"] },
    { id: "pandas",     title: "Pandas",                  subtitle: "Data analysis and manipulation made easy.",                                            icon: "fa-database",      iconType: "fas", duration: "7 hrs",  difficulty: "Intermediate",  questionsUrl: "data/pandas.json",     modules: ["Series & DataFrames", "Filtering & Grouping", "Cleaning & Analysis", "Final Assessment"] },
    { id: "statistics", title: "Statistics for ML",       subtitle: "Core statistical concepts necessary for Data Science and Machine Learning.",           icon: "fa-chart-bar",     iconType: "fas", duration: "8 hrs",  difficulty: "Beginner",      questionsUrl: "data/statistics.json", modules: ["Descriptive Stats", "Probability", "Hypothesis Testing", "Final Assessment"] },
    { id: "ml",         title: "Machine Learning (ML)",   subtitle: "Train supervised and unsupervised learning models using Scikit-Learn.",                icon: "fa-brain",         iconType: "fas", duration: "12 hrs", difficulty: "Intermediate",  questionsUrl: "data/ml.json",         modules: ["Data Preparation", "Supervised Learning", "Model Evaluation", "Final Assessment"] },
    { id: "dl",         title: "Deep Learning (DL)",      subtitle: "Build neural networks and understand deep architectures.",                             icon: "fa-network-wired", iconType: "fas", duration: "15 hrs", difficulty: "Advanced",      questionsUrl: "data/dl.json",         modules: ["Neural Networks", "CNN & RNN", "Optimization & Training", "Final Assessment"] },
    { id: "cv",         title: "Computer Vision (CV)",    subtitle: "Image processing and computer vision techniques with AI.",                             icon: "fa-eye",           iconType: "fas", duration: "14 hrs", difficulty: "Advanced",      questionsUrl: "data/cv.json",         modules: ["Image Basics", "Filtering & Thresholding", "Object Detection", "Final Assessment"] },
    { id: "c",          title: "C Programming",           subtitle: "Build a strong foundation in procedural programming with C.",                         icon: "fa-code",          iconType: "fas", duration: "8 hrs", difficulty: "Beginner", questionsUrl: "data/c.json", modules: ["C Fundamentals", "Functions & Pointers", "Arrays & Structures", "Final Assessment"] },
    { id: "cpp",        title: "C++ Programming",         subtitle: "Learn modern C++ syntax, object-oriented programming, and STL.",                     icon: "fa-code",          iconType: "fas", duration: "10 hrs", difficulty: "Intermediate", questionsUrl: "data/c++.json", modules: ["C++ Fundamentals", "OOP in C++", "STL & Modern C++", "Final Assessment"] },
    { id: "csharp",     title: "C# and .NET",             subtitle: "Create robust applications with C# and the .NET platform.",                         icon: "fa-laptop-code",   iconType: "fas", duration: "10 hrs", difficulty: "Intermediate", questionsUrl: "data/c#.json", modules: ["C# Fundamentals", "Object-Oriented C#", ".NET Application Basics", "Final Assessment"] },
    { id: "dotnet",     title: ".NET Development",        subtitle: "Understand the tools and platform behind modern .NET applications.",                  icon: "fa-window-maximize", iconType: "fas", duration: "8 hrs", difficulty: "Intermediate", questionsUrl: "data/dot_net.json", modules: [".NET Fundamentals", "Runtime & Libraries", "Application Development", "Final Assessment"] },
    { id: "java",       title: "Java Programming",         subtitle: "Learn Java fundamentals, OOP, collections, and platform basics.",                    icon: "fa-coffee",        iconType: "fas", duration: "10 hrs", difficulty: "Beginner", questionsUrl: "data/java.json", modules: ["Java Basics", "OOP & Inheritance", "Collections & Exceptions", "Final Assessment"] },
    { id: "javascript", title: "JavaScript",               subtitle: "Build interactive web experiences with modern JavaScript.",                          icon: "fa-js",            iconType: "fab", duration: "8 hrs", difficulty: "Beginner", questionsUrl: "data/js.json", modules: ["JavaScript Basics", "Functions & DOM", "Modern JavaScript", "Final Assessment"] },
    { id: "htmlcss",    title: "HTML and CSS",             subtitle: "Structure and style accessible, responsive web pages.",                              icon: "fa-html5",         iconType: "fab", duration: "6 hrs", difficulty: "Beginner", questionsUrl: "data/html&css.json", modules: ["HTML Structure", "CSS Styling", "Responsive Layouts", "Final Assessment"] },
    { id: "react",      title: "React",                    subtitle: "Create component-based user interfaces with React.",                                  icon: "fa-react",         iconType: "fab", duration: "8 hrs", difficulty: "Intermediate", questionsUrl: "data/react.json", modules: ["React Fundamentals", "Components & Props", "State & Application Flow", "Final Assessment"] },
    { id: "sql",        title: "SQL",                      subtitle: "Query, manage, and analyze data in relational databases.",                             icon: "fa-database",      iconType: "fas", duration: "7 hrs", difficulty: "Beginner", questionsUrl: "data/sql.json", modules: ["SQL Basics", "Filtering & Joins", "Aggregation & Database Design", "Final Assessment"] },
    { id: "dsa",        title: "Data Structures and Algorithms", subtitle: "Develop efficient problem-solving skills with core data structures and algorithms.", icon: "fa-sitemap", iconType: "fas", duration: "12 hrs", difficulty: "Intermediate", questionsUrl: "data/dsa.json", modules: ["Data Structures", "Searching & Sorting", "Complexity & Problem Solving", "Final Assessment"] },
    { id: "mongodb",    title: "MongoDB",                  subtitle: "Store and query flexible document data with MongoDB.",                                icon: "fa-leaf",          iconType: "fas", duration: "7 hrs", difficulty: "Intermediate", questionsUrl: "data/mongodb.json", modules: ["MongoDB Fundamentals", "Documents & Collections", "Queries & Indexes", "Final Assessment"] },
    { id: "github",     title: "Git and GitHub",            subtitle: "Track changes and collaborate effectively with Git and GitHub.",                     icon: "fa-github",         iconType: "fab", duration: "5 hrs", difficulty: "Beginner", questionsUrl: "data/GitHub.json", modules: ["Git Fundamentals", "Branches & Merging", "GitHub Collaboration", "Final Assessment"] },
    { id: "advanced-aptitude", title: "Advanced Aptitude", subtitle: "Build speed and accuracy across quantitative aptitude, reasoning, data interpretation, and verbal ability.", icon: "fa-bolt", iconType: "fas", duration: "Self-paced", difficulty: "Advanced", questionsUrl: "data/advanced-aptitude.json", modules: ["Quantitative Aptitude", "Logical Reasoning", "Data Interpretation", "Verbal Ability", "Final Assessment"] }
];

// Use the backend origin for both Express-served pages and Live Server.
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_ORIGIN = window.location.protocol === 'file:' || (isLocalhost && window.location.port !== '5000')
    ? 'http://localhost:5000'
    : window.location.origin;
const COURSES_API_URL = `${API_ORIGIN}/api/courses`;
const CERTIFICATES_API_URL = `${API_ORIGIN}/api/certificates`;
const AUTH_API_URL = `${API_ORIGIN}/api/auth`;
const API_BASE = `${API_ORIGIN}/api`;
const ENROLLMENTS_API_URL = `${API_BASE}/enrollments`;

// App State
let assessmentTimer = null;
let appState = {
    currentView: 'home',
    currentCourseId: null,
    currentAssessment: null,
    progress: {},        // { "python": { score: 85, passed: true, answers: {}, reviewData: [] } }
    enrollments: {},     // { "python": { status: 'active', enrolledAt: ... } }
    studentName: ''
};

window.coursesData = coursesData;
window.appState = appState;

// ===============================
// UNIFIED TOAST NOTIFICATIONS
// ===============================

function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast-item ${type}`;
    const iconClass = type === 'success' ? 'fa-check-circle' : (type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle');
    toast.innerHTML = `<i class="fas ${iconClass}"></i> <span>${message}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(40px)';
        toast.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}
window.showToast = showToast;

// ===============================
// INIT & LOCAL STORAGE
// ===============================

async function restoreSession() {
    const token = localStorage.getItem('learnMeAuthToken');
    if (!token) {
        localStorage.removeItem('learnMeCurrentUser');
        return;
    }
    try {
        const response = await fetch(`${AUTH_API_URL}/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('learnMeCurrentUser', JSON.stringify(data.user));
            updateUserUI(data.user);
        } else {
            // Invalid token / expired
            localStorage.removeItem('learnMeAuthToken');
            localStorage.removeItem('learnMeCurrentUser');
            updateUserUI(null);
        }
    } catch (e) {
        console.warn('Backend unavailable; could not verify session.');
    }
}

let searchTimeout = null;
function filterCourses() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(async () => {
        const query = document.getElementById('course-search-input').value.trim();
        if(!query) {
            renderCourses();
            return;
        }
        
        // Instant local search for seamless UX
        const lowerQ = query.toLowerCase();
        const localFiltered = coursesData.filter(c => 
            c.title.toLowerCase().includes(lowerQ) || 
            (c.subtitle && c.subtitle.toLowerCase().includes(lowerQ)) ||
            (c.difficulty && c.difficulty.toLowerCase().includes(lowerQ))
        );
        renderCourses(localFiltered);

        try {
            const res = await fetch(`${COURSES_API_URL}/search?q=${encodeURIComponent(query)}`);
            if (res.ok) {
                const results = await res.json();
                const remoteMapped = results.map(course => ({
                    id: course.courseId,
                    title: course.title,
                    subtitle: course.subtitle,
                    icon: course.icon || 'fa-book',
                    iconType: course.iconType || 'fas',
                    duration: course.duration,
                    difficulty: course.difficulty,
                    modules: course.modules || []
                }));

                // Augment local cache without destroying it
                remoteMapped.forEach(rCourse => {
                    const idx = coursesData.findIndex(c => c.id === rCourse.id);
                    if (idx === -1) coursesData.push(rCourse);
                    else coursesData[idx] = rCourse;
                });
                
                renderCourses(remoteMapped);
            }
        } catch(e) {
            // Silently fallback to the already rendered local findings
            console.warn('Backend search unavailable, using local matching', e.message);
        }
    }, 300);
}

async function initApp() {
    const isSPA = document.getElementById('view-home') !== null || document.getElementById('home-view') !== null;

    setupNavigation();
    if (isSPA) {
        renderCourses();
        
        // Hash & history popstate handlers for unified navigation
        window.addEventListener('hashchange', handleUrlRouting);
        window.addEventListener('popstate', handleUrlRouting);
        handleUrlRouting();
    }

    // Load slow remote data asynchronously so UI isn't blocked
    restoreSession().then(() => {
        return Promise.all([loadProgress(), loadEnrollments()]);
    }).then(() => {
        if (isSPA) {
            renderCourses();
            if (appState.currentView === 'dashboard') renderDashboard();
        }
        
        // Handle any query-triggered actions
        const urlParams = new URLSearchParams(window.location.search);
        const certCourse = urlParams.get('certCourse');
        if (certCourse) {
            setTimeout(() => generateCertificate(certCourse), 400);
        }
        const enrollParam = urlParams.get('enroll');
        if (enrollParam) {
            setTimeout(() => enrollInCourse(enrollParam), 400);
        }
    }).catch(() => {});

    loadRemoteCourses().then(() => {
        if (isSPA) renderCourses();
    }).catch(() => {});

    loadEmbeddedQuestionBank();
    loadExternalQuestions().then(() => {
        loadEmbeddedQuestionBank();
    }).catch(() => {});

    loadRemoteCertificates().then(() => {
        if (isSPA && appState.currentView === 'dashboard') renderDashboard();
    }).catch(() => {});
}

function handleUrlRouting() {
    const isSPA = document.getElementById('view-home') !== null || document.getElementById('home-view') !== null;
    if (!isSPA) return;

    const urlParams = new URLSearchParams(window.location.search);
    const viewParam = urlParams.get('view');
    const courseParam = urlParams.get('course');
    const hash = window.location.hash ? window.location.hash.substring(1) : '';

    const validViews = ['home', 'courses', 'dashboard', 'assessment', 'course-details', 'result', 'login', 'register'];

    if (hash && validViews.includes(hash)) {
        navigateTo(hash);
        return;
    }
    if (viewParam && validViews.includes(viewParam)) {
        navigateTo(viewParam);
        return;
    }
    if (courseParam) {
        openCourseDetails(courseParam);
        return;
    }

    let lastView = sessionStorage.getItem('learnMeLastView') || 'home';
    if (['course-details', 'assessment', 'result'].includes(lastView)) {
        lastView = 'courses';
    }
    navigateTo(lastView);
}

async function loadRemoteCourses() {
    try {
        const response = await fetch(COURSES_API_URL);
        if (!response.ok) return;
        const remoteCourses = await response.json();
        if (!Array.isArray(remoteCourses) || remoteCourses.length === 0) return;

        remoteCourses.forEach(remoteCourse => {
            const index = coursesData.findIndex(c => c.id === remoteCourse.courseId);
            const existingCourse = index !== -1 ? coursesData[index] : null;
            const formatted = {
                id: remoteCourse.courseId,
                title: remoteCourse.title,
                subtitle: remoteCourse.subtitle,
                icon: remoteCourse.icon || 'fa-book',
                iconType: remoteCourse.iconType || 'fas',
                duration: remoteCourse.duration,
                difficulty: remoteCourse.difficulty,
                questionsUrl: remoteCourse.questionsUrl || (existingCourse ? existingCourse.questionsUrl : `data/${remoteCourse.courseId}.json`),
                questions: (typeof COURSE_QUESTIONS_BANK !== 'undefined' && COURSE_QUESTIONS_BANK[remoteCourse.courseId])
                    ? COURSE_QUESTIONS_BANK[remoteCourse.courseId]
                    : ((Array.isArray(remoteCourse.questions) && remoteCourse.questions.length > 0 && typeof remoteCourse.questions[0].answer === 'number')
                        ? remoteCourse.questions
                        : (existingCourse && existingCourse.questions ? existingCourse.questions : undefined)),
                modules: remoteCourse.modules || []
            };
            
            if (index !== -1) {
                coursesData[index] = { ...coursesData[index], ...formatted };
            } else {
                coursesData.push(formatted);
            }
        });
    } catch (error) {
        console.warn('Using local course catalog:', error.message);
    }
}

async function loadProgress() {
    appState.progress = {};
    const token = localStorage.getItem('learnMeAuthToken');
    if (token) {
        try {
            const res = await fetch(`${API_BASE}/progress`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const arr = await res.json();
                arr.forEach(p => {
                    appState.progress[p.courseId] = {
                        score: p.quizScore || 0,
                        passed: p.quizPassed || false,
                        courseCompleted: p.status === 'Completed',
                        courseUnlocked: p.courseUnlocked || false,
                        title: p.courseId // Keep simple, dashboard resolves title
                    };
                });
            }
        } catch(e) {
            console.warn('Failed to load remote progress', e);
        }
    }
    
    try {
        const saved = localStorage.getItem('learnMeProgress_v2');
        if (saved) {
            const local = JSON.parse(saved);
            let needsSave = false;

            for (let key in local) {
                const cur = local[key];
                if (cur && cur.score > 0) {
                    // Check if reviewData or answers shows 0 attended questions
                    let answeredCount = 0;
                    if (Array.isArray(cur.reviewData) && cur.reviewData.length > 0) {
                        answeredCount = cur.reviewData.filter(r => typeof r.userAnswer === 'number' || typeof r.selectedAnswer === 'number').length;
                    } else if (cur.answers && typeof cur.answers === 'object') {
                        answeredCount = Object.keys(cur.answers).filter(k => typeof cur.answers[k] === 'number' && cur.answers[k] >= 0).length;
                    }
                    if (answeredCount === 0) {
                        // Corrupted by legacy undefined===undefined bug: auto-correct to failed
                        cur.score = 0;
                        cur.passed = false;
                        cur.courseCompleted = false;
                        cur.correct = 0;
                        needsSave = true;
                    }
                }

                if (!appState.progress[key]) {
                    appState.progress[key] = cur;
                } else {
                    if (cur.courseUnlocked) appState.progress[key].courseUnlocked = true;
                    if (cur.score > (appState.progress[key].score || 0)) {
                        appState.progress[key] = { ...appState.progress[key], ...cur };
                    }
                }
                if (token && cur.score > 0) {
                    fetch(`${API_BASE}/progress/${key}/assessment`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                        body: JSON.stringify({
                            score: cur.score,
                            passed: cur.passed,
                            correct: cur.correct,
                            total: cur.total,
                            title: cur.title || key
                        })
                    }).catch(e => console.warn('Failed to sync merged progress', e));
                }
            }

            if (needsSave) {
                localStorage.setItem('learnMeProgress_v2', JSON.stringify(local));
            }
        }
        const name = localStorage.getItem('learnMeStudentName');
        if (name) appState.studentName = name;
    } catch (error) {}
}

async function loadEnrollments() {
    appState.enrollments = {};
    const token = localStorage.getItem('learnMeAuthToken');
    if (token) {
        try {
            const res = await fetch(ENROLLMENTS_API_URL, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const arr = await res.json();
                if (Array.isArray(arr)) {
                    arr.forEach(en => {
                        appState.enrollments[en.courseId] = en;
                    });
                }
            }
        } catch (e) {
            console.warn('Failed to load remote enrollments', e);
        }
    }

    try {
        const localSaved = localStorage.getItem('learnMeEnrollments');
        if (localSaved) {
            const localEn = JSON.parse(localSaved);
            for (let k in localEn) {
                if (!appState.enrollments[k]) {
                    appState.enrollments[k] = localEn[k];
                }
            }
        }
    } catch (e) {}
}

async function enrollInCourse(courseId, event) {
    if (event) event.stopPropagation();
    const token = localStorage.getItem('learnMeAuthToken');
    const course = coursesData.find(c => c.id === courseId);
    const courseTitle = course ? course.title : courseId;

    appState.enrollments[courseId] = {
        courseId,
        status: 'active',
        enrolledAt: new Date().toISOString()
    };
    localStorage.setItem('learnMeEnrollments', JSON.stringify(appState.enrollments));

    if (token) {
        fetch(`${ENROLLMENTS_API_URL}/${courseId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }).catch(() => {});
    }

    renderCourses();
    if (appState.currentView === 'course-details') {
        openCourseDetails(courseId);
    } else if (appState.currentView === 'dashboard') {
        renderDashboard();
    }
    showToast(`🎉 You are now enrolled in ${courseTitle}!`, 'success');
}

async function saveProgress() {
    localStorage.setItem('learnMeProgress_v2', JSON.stringify(appState.progress));
    const token = localStorage.getItem('learnMeAuthToken');
    if(token && appState.currentAssessment) {
        const asmt = appState.currentAssessment;
        const cur = appState.progress[asmt.courseId];
        if(cur) {
            try {
                await fetch(`${API_BASE}/progress/${asmt.courseId}/assessment`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify({
                        score: cur.score,
                        passed: cur.passed,
                        correct: cur.correct,
                        total: cur.total,
                        title: cur.title
                    })
                });
            } catch(e) {
                console.warn('Failed to sync progress to backend', e);
            }
        }
    }
}

function saveStudentName(name) {
    appState.studentName = name.trim();
    localStorage.setItem('learnMeStudentName', appState.studentName);
}

// ===============================

const EMBEDDED_QUESTIONS = {
    python: [
        { q: "Which keyword is used to define a function in Python?", options: ["function","define","def","func"], answer: 2 },
        { q: "Which function is used to display output in Python?", options: ["echo()","display()","print()","show()"], answer: 2 },
        { q: "Which function is used to get input from the user?", options: ["read()","scan()","input()","get()"], answer: 2 },
        { q: "Which data type is used to store whole numbers?", options: ["float","int","str","bool"], answer: 1 },
        { q: "Which is the correct file extension for Python files?", options: [".pt",".python",".py",".pyt"], answer: 2 },
        { q: "Which operator is used for exponentiation in Python?", options: ["^","**","*","%"], answer: 1 },
        { q: "Which symbol is used to write a comment in Python?", options: ["//","#","/*","--"], answer: 1 },
        { q: "Which of the following is a mutable data type?", options: ["Tuple","String","List","Integer"], answer: 2 },
        { q: "Which keyword creates a loop that repeats while a condition is true?", options: ["for","repeat","while","loop"], answer: 2 },
        { q: "Which keyword is used to import a module in Python?", options: ["include","using","import","require"], answer: 2 },
        { q: "Which operator is used for floor division in Python?", options: ["/","//","%","**"], answer: 1 },
        { q: "Which operator is used to find the remainder of a division?", options: ["/","//","%","*"], answer: 2 },
        { q: "Which comparison operator checks if two values are equal?", options: ["=","==","!=",">="], answer: 1 },
        { q: "Which logical operator returns True only if both conditions are True?", options: ["or","and","not","xor"], answer: 1 },
        { q: "Which keyword starts a conditional statement in Python?", options: ["when","if","switch","case"], answer: 1 },
        { q: "Which keyword checks another condition if the first is False?", options: ["elseif","elif","else if","otherwise"], answer: 1 },
        { q: "Which keyword executes when all previous conditions are False?", options: ["default","finally","else","break"], answer: 2 },
        { q: "Which comparison operator means 'not equal to'?", options: ["<>","!=","==","=!"], answer: 1 },
        { q: "What is the output of: print(10 > 5)?", options: ["False","10","True","Error"], answer: 2 },
        { q: "Which logical operator reverses a Boolean value?", options: ["and","or","not","is"], answer: 2 },
        { q: "Which loop is used to iterate over a sequence in Python?", options: ["while","for","loop","repeat"], answer: 1 },
        { q: "Which keyword terminates a loop immediately?", options: ["continue","stop","break","exit"], answer: 2 },
        { q: "Which keyword skips the current iteration and moves to the next?", options: ["break","pass","continue","skip"], answer: 2 },
        { q: "What is the output of range(5)?", options: ["1,2,3,4,5","0,1,2,3,4","0,1,2,3,4,5","1,2,3,4"], answer: 1 },
        { q: "Which loop executes as long as the given condition is True?", options: ["for","while","repeat","do-while"], answer: 1 },
        { q: "Which keyword is used to return a value from a function?", options: ["print","return","yield","break"], answer: 1 },
        { q: "Which function returns the length of a list or string?", options: ["count()","size()","len()","length()"], answer: 2 },
        { q: "Which keyword is used to create an anonymous function?", options: ["lambda","anonymous","func","def"], answer: 0 },
        { q: "Which method adds an element to the end of a list?", options: ["insert()","append()","add()","extend()"], answer: 1 },
        { q: "Which method removes the last element from a list?", options: ["remove()","delete()","pop()","clear()"], answer: 2 },
        { q: "Which brackets are used to create a list in Python?", options: ["()","[]","{}","<>"], answer: 1 },
        { q: "Which data structure is immutable in Python?", options: ["List","Dictionary","Tuple","Set"], answer: 2 },
        { q: "Which collection stores data as key-value pairs?", options: ["List","Tuple","Dictionary","Set"], answer: 2 },
        { q: "Which method returns all the keys in a dictionary?", options: ["values()","items()","keys()","get()"], answer: 2 },
        { q: "Which method removes all elements from a list?", options: ["delete()","remove()","clear()","pop()"], answer: 2 },
        { q: "Which Python collection automatically removes duplicate values?", options: ["List","Tuple","Set","Dictionary"], answer: 2 },
        { q: "Which method sorts a list in ascending order?", options: ["order()","arrange()","sort()","sortedlist()"], answer: 2 },
        { q: "Which brackets are used to create a dictionary?", options: ["[]","()","{}","<>"], answer: 2 },
        { q: "Which is the correct way to call a function named 'display'?", options: ["display","display[]","display()","call display()"], answer: 2 },
        { q: "Which Python set operation returns elements in both sets?", options: ["union()","intersection()","difference()","symmetric_difference()"], answer: 1 }
    ],
    numpy: [
        { q: "What is NumPy primarily used for?", options: ["Web Development","Numerical Computing","Game Development","Networking"], answer: 1 },
        { q: "Which statement is used to import NumPy?", options: ["import numpy","import numpy as np","include numpy","using numpy"], answer: 1 },
        { q: "Which function is used to create a NumPy array?", options: ["np.create()","np.array()","np.list()","np.make()"], answer: 1 },
        { q: "What is the type of a NumPy array?", options: ["list","tuple","numpy.ndarray","dict"], answer: 2 },
        { q: "Which attribute returns the shape of a NumPy array?", options: ["size","shape","length","ndim"], answer: 1 },
        { q: "Which attribute returns the number of dimensions?", options: ["shape","size","ndim","dtype"], answer: 2 },
        { q: "Which attribute returns the total number of elements?", options: ["count","shape","size","length"], answer: 2 },
        { q: "Which attribute returns the data type of array elements?", options: ["dtype","type","datatype","class"], answer: 0 },
        { q: "Why are NumPy arrays preferred over Python lists for numerical computations?", options: ["They use less memory and are faster","They support only strings","They cannot perform math operations","They are slower but easier"], answer: 0 },
        { q: "Which function converts a Python list into a NumPy array?", options: ["np.convert()","np.array()","np.tolist()","np.change()"], answer: 1 },
        { q: "Which function creates an array filled with zeros?", options: ["np.ones()","np.zeros()","np.empty()","np.full()"], answer: 1 },
        { q: "Which function creates an array filled with ones?", options: ["np.ones()","np.zeros()","np.empty()","np.identity()"], answer: 0 },
        { q: "Which function creates an identity matrix?", options: ["np.diag()","np.identity()","np.zeros()","np.full()"], answer: 1 },
        { q: "Which function creates evenly spaced values over an interval?", options: ["np.arange()","np.linspace()","np.range()","np.random()"], answer: 1 },
        { q: "Which NumPy function is similar to Python's range()?", options: ["np.arange()","np.linspace()","np.interval()","np.count()"], answer: 0 },
        { q: "Which function creates an array with random values between 0 and 1?", options: ["np.random.rand()","np.random.randint()","np.random.randomint()","np.random.choice()"], answer: 0 },
        { q: "Which function generates random integers?", options: ["np.randint()","np.random.randint()","np.random.int()","np.int()"], answer: 1 },
        { q: "Which function creates an array without initializing its values?", options: ["np.empty()","np.zeros()","np.ones()","np.full()"], answer: 0 },
        { q: "Which function creates an array filled with a specified value?", options: ["np.fill()","np.full()","np.value()","np.assign()"], answer: 1 },
        { q: "Which method changes the shape of an existing NumPy array?", options: ["resize()","reshape()","changeShape()","modify()"], answer: 1 },
        { q: "Which operator performs element-wise addition of two NumPy arrays?", options: ["+","&","*","%"], answer: 0 },
        { q: "Which function returns the sum of all elements in a NumPy array?", options: ["np.add()","np.sum()","np.total()","np.count()"], answer: 1 },
        { q: "Which function returns the average (mean) of array elements?", options: ["np.avg()","np.average()","np.mean()","np.mid()"], answer: 2 },
        { q: "Which function returns the largest value in a NumPy array?", options: ["np.high()","np.maximum()","np.max()","np.large()"], answer: 2 },
        { q: "Which function returns the smallest value in a NumPy array?", options: ["np.minimum()","np.low()","np.small()","np.min()"], answer: 3 },
        { q: "Which function calculates the square root of each element?", options: ["np.square()","np.root()","np.sqrt()","np.power()"], answer: 2 },
        { q: "Which function raises each element to a specified power?", options: ["np.exp()","np.power()","np.raise()","np.squareRoot()"], answer: 1 },
        { q: "Which function performs matrix multiplication (dot product)?", options: ["np.multiply()","np.cross()","np.dot()","np.matmulArray()"], answer: 2 },
        { q: "What is broadcasting in NumPy?", options: ["Sending arrays over a network","Expanding arrays of different shapes to perform operations","Sorting array elements","Creating multiple arrays at once"], answer: 1 },
        { q: "In NumPy, array indexing starts from?", options: ["1","0","-1","Depends on the array"], answer: 1 },
        { q: "Which index refers to the last element of a NumPy array?", options: ["0","-1","1","last"], answer: 1 },
        { q: "Which symbol is used for slicing in NumPy?", options: [":",";",",","|"], answer: 0 },
        { q: "What does arr[2:5] return?", options: ["Elements at index 2, 3, and 4","Elements at index 2 to 5 inclusive","Elements at index 3, 4, and 5","An error"], answer: 0 },
        { q: "Which attribute is used to transpose a NumPy array?", options: [".shape",".T",".dtype",".size"], answer: 1 },
        { q: "Which function joins multiple NumPy arrays into one?", options: ["np.append()","np.concatenate()","np.combine()","np.connect()"], answer: 1 },
        { q: "Which function splits a NumPy array into multiple sub-arrays?", options: ["np.divide()","np.cut()","np.split()","np.slice()"], answer: 2 },
        { q: "Which function calculates the standard deviation?", options: ["np.var()","np.std()","np.mean()","np.sum()"], answer: 1 },
        { q: "Which function calculates the variance?", options: ["np.var()","np.std()","np.mean()","np.average()"], answer: 0 },
        { q: "Which function returns only the unique elements from a NumPy array?", options: ["np.unique()","np.single()","np.remove()","np.filter()"], answer: 0 },
        { q: "Which operator is commonly used for matrix multiplication in NumPy?", options: ["*","@","%","//"], answer: 1 }
    ],
    pandas: [
        { q: "What is Pandas primarily used for?", options: ["Game Development","Data Analysis and Manipulation","Web Development","Networking"], answer: 1 },
        { q: "Which statement is used to import Pandas?", options: ["import pandas","import pandas as pd","include pandas","using pandas"], answer: 1 },
        { q: "Which Pandas data structure is one-dimensional?", options: ["DataFrame","Series","Array","Table"], answer: 1 },
        { q: "Which Pandas data structure is two-dimensional?", options: ["Series","List","DataFrame","Tuple"], answer: 2 },
        { q: "Which function creates a Pandas Series?", options: ["pd.DataFrame()","pd.Series()","pd.Array()","pd.List()"], answer: 1 },
        { q: "Which function creates a Pandas DataFrame?", options: ["pd.Table()","pd.Series()","pd.DataFrame()","pd.Frame()"], answer: 2 },
        { q: "Which attribute returns the dimensions of a DataFrame?", options: ["shape","size","count","length"], answer: 0 },
        { q: "Which function displays the first 5 rows of a DataFrame?", options: ["tail()","show()","head()","display()"], answer: 2 },
        { q: "Which function displays the last 5 rows of a DataFrame?", options: ["head()","last()","tail()","bottom()"], answer: 2 },
        { q: "Which function provides a summary including column names and data types?", options: ["describe()","summary()","info()","details()"], answer: 2 },
        { q: "Which function is used to read a CSV file in Pandas?", options: ["pd.open_csv()","pd.read_csv()","pd.load_csv()","pd.import_csv()"], answer: 1 },
        { q: "Which function is used to read an Excel file?", options: ["pd.read_excel()","pd.open_excel()","pd.load_excel()","pd.import_excel()"], answer: 0 },
        { q: "Which function saves a DataFrame as a CSV file?", options: ["to_csv()","save_csv()","write_csv()","export_csv()"], answer: 0 },
        { q: "Which function is used to read a JSON file in Pandas?", options: ["pd.read_json()","pd.open_json()","pd.import_json()","pd.load_json()"], answer: 0 },
        { q: "Which attribute selects rows and columns by label?", options: ["iloc[]","loc[]","select[]","index[]"], answer: 1 },
        { q: "Which attribute selects rows and columns by integer position?", options: ["loc[]","iloc[]","position[]","rows[]"], answer: 1 },
        { q: "Which syntax selects a single column from a DataFrame?", options: ["df(column)","df['column']","df.column()","df->column"], answer: 1 },
        { q: "Which function returns all unique values in a column?", options: ["distinct()","unique()","different()","values()"], answer: 1 },
        { q: "Which function returns the frequency of unique values?", options: ["count_values()","value_counts()","frequency()","unique_count()"], answer: 1 },
        { q: "Which function sorts a DataFrame by column values?", options: ["sort()","sort_values()","arrange()","order()"], answer: 1 },
        { q: "Which function removes rows or columns from a DataFrame?", options: ["remove()","delete()","drop()","clear()"], answer: 2 },
        { q: "Which function removes rows containing missing values?", options: ["dropna()","fillna()","removeNull()","clean()"], answer: 0 },
        { q: "Which function replaces missing values with a specified value?", options: ["replace()","fillna()","update()","insert()"], answer: 1 },
        { q: "Which function renames DataFrame columns?", options: ["change()","rename()","modify()","setName()"], answer: 1 },
        { q: "Which function changes the data type of a column?", options: ["convert()","astype()","dtype()","cast()"], answer: 1 },
        { q: "Which function removes duplicate rows from a DataFrame?", options: ["drop_duplicates()","remove_duplicates()","unique()","distinct()"], answer: 0 },
        { q: "Which function checks for missing values in a DataFrame?", options: ["isna()","isempty()","checknull()","findnull()"], answer: 0 },
        { q: "Which expression counts missing values in each column?", options: ["df.isna().sum()","df.count()","df.total()","df.nullcount()"], answer: 0 },
        { q: "Which function groups data by one or more columns?", options: ["group()","groupby()","cluster()","categorize()"], answer: 1 },
        { q: "Which function merges two DataFrames on a common column?", options: ["combine()","concat()","merge()","joinData()"], answer: 2 },
        { q: "Which function concatenates multiple DataFrames?", options: ["append()","merge()","concat()","join()"], answer: 2 },
        { q: "Which function generates summary statistics for numerical columns?", options: ["summary()","describe()","statistics()","info()"], answer: 1 },
        { q: "Which function calculates the average of a column?", options: ["average()","mean()","median()","mode()"], answer: 1 },
        { q: "Which function returns the middle value of a dataset?", options: ["mode()","mean()","median()","center()"], answer: 2 },
        { q: "Which function returns the most frequently occurring value?", options: ["mode()","median()","mean()","count()"], answer: 0 },
        { q: "Which function calculates the correlation between numerical columns?", options: ["cov()","corr()","relationship()","compare()"], answer: 1 },
        { q: "Which aggregation function counts the number of non-null values?", options: ["size()","count()","sum()","total()"], answer: 1 },
        { q: "Which parameter prevents the index column from being saved in a CSV?", options: ["header=False","index=False","save=False","row=False"], answer: 1 },
        { q: "What is the default separator used by read_csv()?", options: ["Semicolon (;)","Comma (,)","Tab (\\t)","Space"], answer: 1 },
        { q: "Which expression selects rows where Age > 18?", options: ["df[df['Age'] > 18]","df.select(Age>18)","df.where(Age>18)","df.filter(Age>18)"], answer: 0 }
    ],
    statistics: [
        { q: "What is Statistics primarily used for in Machine Learning?", options: ["Web Development","Data Analysis and Decision Making","Game Development","Networking"], answer: 1 },
        { q: "Which of the following is a type of statistics?", options: ["Descriptive Statistics","Inferential Statistics","Both A and B","None of the above"], answer: 2 },
        { q: "What does Descriptive Statistics mainly do?", options: ["Predict future values","Summarize and describe data","Train ML models","Store data"], answer: 1 },
        { q: "Which measure represents the average value of a dataset?", options: ["Median","Mode","Mean","Range"], answer: 2 },
        { q: "Which measure represents the middle value in an ordered dataset?", options: ["Mean","Median","Mode","Variance"], answer: 1 },
        { q: "Which measure represents the most frequently occurring value?", options: ["Mean","Median","Mode","Range"], answer: 2 },
        { q: "Which measure is calculated as Maximum Value - Minimum Value?", options: ["Variance","Range","Standard Deviation","Mean"], answer: 1 },
        { q: "Which measure indicates how spread out data is from the mean?", options: ["Mode","Variance","Median","Frequency"], answer: 1 },
        { q: "Which measure is the square root of variance?", options: ["Mean","Median","Standard Deviation","Range"], answer: 2 },
        { q: "Which type of statistics makes predictions about a population from sample data?", options: ["Descriptive","Inferential","Summary","Predictive"], answer: 1 },
        { q: "What is probability?", options: ["The measure of certainty of an event","The measure of the likelihood of an event occurring","The total number of outcomes","The average of a dataset"], answer: 1 },
        { q: "What is the probability value of an impossible event?", options: ["0","0.5","1","-1"], answer: 0 },
        { q: "What is the probability value of a certain event?", options: ["0","0.25","0.5","1"], answer: 3 },
        { q: "If a fair coin is tossed, what is the probability of getting Heads?", options: ["0","0.25","0.5","1"], answer: 2 },
        { q: "What is the probability of rolling a 6 on a fair six-sided dice?", options: ["1/2","1/3","1/6","1/12"], answer: 2 },
        { q: "Which theorem updates probabilities based on new evidence?", options: ["Pythagoras Theorem","Bayes Theorem","Euler Theorem","Fermat Theorem"], answer: 1 },
        { q: "What is the probability of selecting an even number from {1,2,3,4,5,6}?", options: ["1/2","1/3","2/3","1/6"], answer: 0 },
        { q: "Which distribution is also known as the Gaussian Distribution?", options: ["Uniform","Normal","Binomial","Poisson"], answer: 1 },
        { q: "What is the shape of a normal distribution curve?", options: ["Rectangular","Bell-shaped","Triangular","Circular"], answer: 1 },
        { q: "What does a histogram primarily represent?", options: ["Relationship between two variables","Frequency distribution of data","Average value","Data correlation"], answer: 1 },
        { q: "Which measure indicates whether a distribution is symmetric or asymmetric?", options: ["Variance","Skewness","Range","Mode"], answer: 1 },
        { q: "A positively skewed distribution has a tail extending towards which side?", options: ["Left","Right","Both sides","No tail"], answer: 1 },
        { q: "What does kurtosis measure?", options: ["Spread of data","Center of data","Peakedness of a distribution","Correlation"], answer: 2 },
        { q: "Which statistical measure is commonly used to detect outliers?", options: ["Z-Score","Mean","Median","Mode"], answer: 0 },
        { q: "What does a Z-score represent?", options: ["The maximum value","The minimum value","The number of standard deviations from the mean","The average value"], answer: 2 },
        { q: "Which measure divides a dataset into four equal parts?", options: ["Percentiles","Quartiles","Deciles","Mean"], answer: 1 },
        { q: "What does the Null Hypothesis (H₀) represent?", options: ["There is a significant effect","There is no significant effect or difference","The experiment failed","The sample is invalid"], answer: 1 },
        { q: "What does the Alternative Hypothesis (H₁) represent?", options: ["No relationship exists","There is a significant effect or difference","The sample size is small","The experiment should stop"], answer: 1 },
        { q: "What is a p-value?", options: ["The probability of obtaining the observed result assuming H₀ is true","The average of the dataset","The confidence level","The standard deviation"], answer: 0 },
        { q: "What is the commonly used significance level (α)?", options: ["0.5","0.1","0.05","1.0"], answer: 2 },
        { q: "If the p-value < α, you should:", options: ["Accept the null hypothesis","Reject the null hypothesis","Ignore the result","Increase the sample size"], answer: 1 },
        { q: "A Type I Error occurs when:", options: ["A true null hypothesis is rejected","A false null hypothesis is accepted","The sample is too small","The test statistic is zero"], answer: 0 },
        { q: "A Type II Error occurs when:", options: ["A false null hypothesis is accepted","A true null hypothesis is rejected","The p-value is zero","The sample size is very large"], answer: 0 },
        { q: "Which statistical test compares the means of two groups?", options: ["Chi-Square Test","t-Test","Correlation Test","Regression Test"], answer: 1 },
        { q: "Which test determines relationships between categorical variables?", options: ["t-Test","ANOVA","Chi-Square Test","Z-Test"], answer: 2 },
        { q: "Which test compares the means of three or more groups?", options: ["t-Test","Chi-Square Test","ANOVA","Z-Test"], answer: 2 },
        { q: "What does correlation measure?", options: ["The average of a dataset","The relationship between two variables","The spread of data","The probability of an event"], answer: 1 },
        { q: "Which correlation value indicates a perfect positive relationship?", options: ["-1","0","0.5","1"], answer: 3 },
        { q: "Which correlation value indicates no linear relationship?", options: ["0","1","-1","0.9"], answer: 0 },
        { q: "Which method calculates linear correlation between two numerical variables?", options: ["Pearson Correlation","Bayes Theorem","ANOVA","Chi-Square Test"], answer: 0 }
    ],
    ml: [
        { q: "What is Machine Learning?", options: ["A programming language","A branch of AI that enables computers to learn from data","A database system","A web framework"], answer: 1 },
        { q: "Which is NOT a type of Machine Learning?", options: ["Supervised Learning","Unsupervised Learning","Reinforcement Learning","Compiled Learning"], answer: 3 },
        { q: "Which library is commonly used for Machine Learning in Python?", options: ["NumPy","Pandas","Scikit-learn","Matplotlib"], answer: 2 },
        { q: "What is a feature in Machine Learning?", options: ["The output value","An input variable used for prediction","A graph","A model"], answer: 1 },
        { q: "What is a label in supervised learning?", options: ["The input feature","The target or output value","The dataset name","The algorithm"], answer: 1 },
        { q: "Which stage comes first in a ML project?", options: ["Model Evaluation","Data Collection","Model Deployment","Prediction"], answer: 1 },
        { q: "Which is a real-world application of ML?", options: ["Spam Email Detection","Movie Recommendation","Face Recognition","All of the above"], answer: 3 },
        { q: "What is Supervised Learning?", options: ["Learning without labeled data","Learning using labeled data","Learning using robots","Learning without training"], answer: 1 },
        { q: "Which is a Supervised Learning task?", options: ["Clustering","Dimensionality Reduction","Classification","Association Rule Mining"], answer: 2 },
        { q: "Which Supervised Learning task predicts continuous values?", options: ["Classification","Regression","Clustering","Association"], answer: 1 },
        { q: "Which algorithm predicts house prices?", options: ["K-Means","Linear Regression","Apriori","PCA"], answer: 1 },
        { q: "Which algorithm is commonly used for binary classification?", options: ["Logistic Regression","K-Means","DBSCAN","PCA"], answer: 0 },
        { q: "Which Scikit-learn function splits data into training and testing sets?", options: ["split_data()","train_test_split()","divide_dataset()","random_split()"], answer: 1 },
        { q: "What is Overfitting in ML?", options: ["Model performs well on training but poorly on new data","Model performs poorly on both","Model ignores training data","Model has fewer features"], answer: 0 },
        { q: "What is Underfitting in ML?", options: ["Model learns training data perfectly","Model is too simple to learn the underlying pattern","Model memorizes the dataset","Model performs perfectly on all datasets"], answer: 1 },
        { q: "What is Unsupervised Learning?", options: ["Learning using labeled data","Learning without labeled data","Learning using reinforcement signals","Learning only from images"], answer: 1 },
        { q: "Which is an Unsupervised Learning task?", options: ["Regression","Classification","Clustering","Prediction"], answer: 2 },
        { q: "Which algorithm is commonly used for clustering?", options: ["Linear Regression","Logistic Regression","K-Means","Decision Tree"], answer: 2 },
        { q: "What does PCA stand for?", options: ["Primary Component Analysis","Principal Component Analysis","Parallel Component Analysis","Predictive Component Algorithm"], answer: 1 },
        { q: "What is the purpose of PCA?", options: ["Increase number of features","Reduce dimensionality while preserving important information","Perform classification","Train neural networks"], answer: 1 },
        { q: "Which method determines the optimal number of clusters in K-Means?", options: ["Accuracy Score","Elbow Method","Precision","Recall"], answer: 1 },
        { q: "Which metric measures the overall correctness of a classification model?", options: ["Precision","Recall","Accuracy","F1-Score"], answer: 2 },
        { q: "Which metric combines Precision and Recall?", options: ["Accuracy","Mean Squared Error","F1-Score","ROC Curve"], answer: 2 },
        { q: "Which table summarizes the performance of a classification model?", options: ["Pivot Table","Confusion Matrix","Frequency Table","Summary Table"], answer: 1 },
        { q: "What is Cross Validation mainly used for?", options: ["Reduce dataset size","Evaluate model performance on different splits","Increase features","Remove duplicates"], answer: 1 },
        { q: "Which preprocessing technique scales values to 0–1?", options: ["Standardization","Normalization","Encoding","Sampling"], answer: 1 },
        { q: "Which preprocessing technique gives mean=0 and std=1?", options: ["Normalization","Standardization","Tokenization","Clustering"], answer: 1 },
        { q: "Which ML algorithm uses a tree structure for classification and regression?", options: ["Decision Tree","K-Means","PCA","Naive Bayes"], answer: 0 },
        { q: "Which algorithm combines multiple decision trees?", options: ["Linear Regression","Random Forest","KNN","DBSCAN"], answer: 1 },
        { q: "What does SVM stand for?", options: ["Support Vector Machine","Simple Vector Model","Statistical Variable Method","System Vector Mapping"], answer: 0 },
        { q: "Which algorithm classifies based on nearest neighbors?", options: ["K-Nearest Neighbors (KNN)","Naive Bayes","Random Forest","Linear Regression"], answer: 0 },
        { q: "Which algorithm is based on Bayes' Theorem?", options: ["Decision Tree","Naive Bayes","K-Means","Logistic Regression"], answer: 1 },
        { q: "Which boosting algorithm is widely used for high-performance ML?", options: ["Gradient Boosting","KNN","PCA","Apriori"], answer: 0 },
        { q: "Which library is known for speed and performance with boosting?", options: ["TensorFlow","XGBoost","OpenCV","Matplotlib"], answer: 1 },
        { q: "What is Ensemble Learning?", options: ["Training only one model","Combining multiple models to improve performance","Reducing the number of features","Removing duplicate data"], answer: 1 },
        { q: "Which ML application recommends movies based on user preferences?", options: ["Recommendation System","Speech Recognition","Object Detection","Image Compression"], answer: 0 },
        { q: "Which algorithm identifies clusters of arbitrary shape and detects outliers?", options: ["K-Means","Linear Regression","DBSCAN","Naive Bayes"], answer: 2 },
        { q: "What is Feature Engineering?", options: ["Creating or selecting useful features to improve model performance","Building a database","Writing Python functions","Training only DL models"], answer: 0 },
        { q: "Which metric evaluates quality of clustering?", options: ["Accuracy","F1 Score","Silhouette Score","Precision"], answer: 2 },
        { q: "Which is a real-world application of clustering?", options: ["Customer Segmentation","House Price Prediction","Spam Detection using labels","Weather Forecasting"], answer: 0 }
    ],
    dl: [
        { q: "What is Deep Learning?", options: ["A programming language","A subset of ML that uses neural networks with multiple layers","A database system","A web framework"], answer: 1 },
        { q: "Which library is widely used for Deep Learning in Python?", options: ["Pandas","TensorFlow","NumPy","Matplotlib"], answer: 1 },
        { q: "Which Facebook-developed Deep Learning framework is popular for research?", options: ["PyTorch","Flask","OpenCV","SciPy"], answer: 0 },
        { q: "Which type of data is Deep Learning especially effective for?", options: ["Images","Audio","Text","All of the above"], answer: 3 },
        { q: "Which hardware speeds up Deep Learning training?", options: ["GPU","Printer","Scanner","Keyboard"], answer: 0 },
        { q: "Which component is the foundation of Deep Learning models?", options: ["Decision Trees","Artificial Neural Networks","Databases","Operating Systems"], answer: 1 },
        { q: "Which layer receives the input data in an ANN?", options: ["Hidden Layer","Output Layer","Input Layer","Activation Layer"], answer: 2 },
        { q: "Which layer performs most computations in a neural network?", options: ["Input Layer","Hidden Layer","Output Layer","Feature Layer"], answer: 1 },
        { q: "Which layer produces the final prediction of a neural network?", options: ["Input Layer","Hidden Layer","Output Layer","Bias Layer"], answer: 2 },
        { q: "Which activation function outputs values between 0 and 1?", options: ["ReLU","Sigmoid","Tanh","Softmax"], answer: 1 },
        { q: "Which activation function is most used in hidden layers?", options: ["Sigmoid","ReLU","Linear","Step Function"], answer: 1 },
        { q: "Which algorithm updates weights during neural network training?", options: ["Backpropagation","K-Means","Decision Tree","Random Forest"], answer: 0 },
        { q: "What does CNN stand for?", options: ["Convolutional Neural Network","Computer Neural Network","Connected Neural Network","Central Neural Network"], answer: 0 },
        { q: "CNN is primarily used for which type of data?", options: ["Text Data","Image Data","Audio Data","Tabular Data"], answer: 1 },
        { q: "Which layer extracts features such as edges in a CNN?", options: ["Pooling Layer","Convolution Layer","Output Layer","Flatten Layer"], answer: 1 },
        { q: "What is the main purpose of the Pooling Layer in CNN?", options: ["Increase image size","Reduce feature map dimensions","Store model weights","Generate labels"], answer: 1 },
        { q: "Which pooling method selects the maximum value from a region?", options: ["Average Pooling","Max Pooling","Global Pooling","Random Pooling"], answer: 1 },
        { q: "What does RNN stand for?", options: ["Random Neural Network","Recursive Neural Network","Recurrent Neural Network","Repeated Neural Network"], answer: 2 },
        { q: "RNN is mainly designed to process which type of data?", options: ["Image Data","Sequential Data","Tabular Data","Database Records"], answer: 1 },
        { q: "Which RNN variant overcomes the vanishing gradient problem?", options: ["CNN","LSTM","KNN","Decision Tree"], answer: 1 },
        { q: "What does GRU stand for?", options: ["General Recurrent Unit","Gated Recurrent Unit","Grouped Recurrent Unit","Global Recurrent Unit"], answer: 1 },
        { q: "What is an epoch in Deep Learning?", options: ["A single neuron","One complete pass of training dataset through the model","A loss function","A hidden layer"], answer: 1 },
        { q: "What is batch size in Deep Learning?", options: ["The number of hidden layers","The number of samples processed before updating weights","The number of epochs","The learning rate"], answer: 1 },
        { q: "What is the learning rate?", options: ["The number of neurons","The speed at which model weights are updated during training","The size of the dataset","The number of output classes"], answer: 1 },
        { q: "What is the purpose of a loss function?", options: ["Measure how far model predictions are from actual values","Increase the dataset size","Create new features","Display graphs"], answer: 0 },
        { q: "Which optimizer is most commonly used in Deep Learning?", options: ["Adam","Bubble Sort","K-Means","Decision Tree"], answer: 0 },
        { q: "Gradient Descent is mainly used to:", options: ["Increase the loss","Optimize model weights by minimizing the loss","Reduce dataset size","Generate random predictions"], answer: 1 },
        { q: "Which technique reduces overfitting in neural networks?", options: ["Dropout","Pooling","Flattening","Clustering"], answer: 0 },
        { q: "Which technique stops training when validation performance stops improving?", options: ["Early Stopping","Late Training","Batch Normalization","Cross Validation"], answer: 0 },
        { q: "What is Transfer Learning?", options: ["Training a model from scratch every time","Using a pre-trained model for a new but related task","Transferring data between databases","Moving a model to another computer"], answer: 1 },
        { q: "Which is a popular pre-trained CNN model?", options: ["VGG16","Decision Tree","K-Means","Naive Bayes"], answer: 0 },
        { q: "What is Fine-Tuning in Deep Learning?", options: ["Deleting layers from a model","Adjusting a pre-trained model's weights for a specific task","Reducing dataset size","Changing the optimizer only"], answer: 1 },
        { q: "What is an Autoencoder mainly used for?", options: ["Data Compression and Feature Learning","Image Classification","Sorting Data","Object Detection"], answer: 0 },
        { q: "What does GAN stand for?", options: ["General Artificial Network","Generative Adversarial Network","Graph Analysis Network","Global Attention Network"], answer: 1 },
        { q: "GAN consists of which two neural networks?", options: ["Generator and Discriminator","Encoder and Decoder","Input and Output","CNN and RNN"], answer: 0 },
        { q: "Which architecture revolutionized NLP using self-attention?", options: ["CNN","Transformer","KNN","Decision Tree"], answer: 1 },
        { q: "What does BERT stand for?", options: ["Bidirectional Encoder Representations from Transformers","Binary Encoding Representation Tool","Basic Encoder Recognition Technique","Bidirectional Embedded Retrieval Transformer"], answer: 0 },
        { q: "GPT models are mainly designed for:", options: ["Image Segmentation","Text Generation and Language Understanding","Audio Compression","Database Management"], answer: 1 },
        { q: "Which is a real-world application of Deep Learning?", options: ["Medical Image Diagnosis","Autonomous Vehicles","Voice Assistants","All of the above"], answer: 3 },
        { q: "Compared to traditional ML, Deep Learning generally requires:", options: ["Less data","More data","No data","Only text data"], answer: 1 }
    ],
    cv: [
        { q: "What is Computer Vision?", options: ["A programming language","A field of AI that enables computers to understand images and videos","A database system","A web framework"], answer: 1 },
        { q: "Computer Vision is a subfield of which domain?", options: ["Networking","Artificial Intelligence","Operating Systems","Cloud Computing"], answer: 1 },
        { q: "Which library is widely used for Computer Vision in Python?", options: ["NumPy","Pandas","OpenCV","Matplotlib"], answer: 2 },
        { q: "What does OpenCV stand for?", options: ["Open Computer Vision","OpenCV Vision","Optical Computer Vision","Online Computer Vision"], answer: 0 },
        { q: "Which function reads an image in OpenCV?", options: ["cv2.load()","cv2.read()","cv2.imread()","cv2.open()"], answer: 2 },
        { q: "Which function displays an image in OpenCV?", options: ["cv2.display()","cv2.imshow()","cv2.show()","cv2.image()"], answer: 1 },
        { q: "Which function saves an image in OpenCV?", options: ["cv2.imwrite()","cv2.save()","cv2.store()","cv2.export()"], answer: 0 },
        { q: "Which color format does OpenCV use by default?", options: ["RGB","BGR","HSV","CMYK"], answer: 1 },
        { q: "What is the smallest unit of a digital image?", options: ["Frame","Pixel","Grid","Layer"], answer: 1 },
        { q: "Which is a real-world application of Computer Vision?", options: ["Face Recognition","Medical Image Analysis","Autonomous Vehicles","All of the above"], answer: 3 },
        { q: "What is the purpose of converting an image to grayscale?", options: ["Increase image size","Reduce the image to one intensity channel for easier processing","Add more colors","Improve internet speed"], answer: 1 },
        { q: "Which OpenCV function converts a color image to grayscale?", options: ["cv2.gray()","cv2.cvtColor()","cv2.convertGray()","cv2.toGray()"], answer: 1 },
        { q: "Which OpenCV function resizes an image?", options: ["cv2.scale()","cv2.resize()","cv2.crop()","cv2.expand()"], answer: 1 },
        { q: "Image cropping is mainly used to:", options: ["Increase image brightness","Extract a specific region of an image","Rotate an image","Blur an image"], answer: 1 },
        { q: "What is the purpose of Gaussian Blur?", options: ["Detect edges","Reduce image noise and smooth the image","Increase contrast","Sharpen the image"], answer: 1 },
        { q: "Thresholding is mainly used to:", options: ["Convert an image into a binary image","Resize an image","Rotate an image","Compress an image"], answer: 0 },
        { q: "Which edge detection algorithm is widely used in OpenCV?", options: ["K-Means","Canny Edge Detection","Decision Tree","Random Forest"], answer: 1 },
        { q: "Which OpenCV function performs Canny Edge Detection?", options: ["cv2.edge()","cv2.canny()","cv2.Canny()","cv2.detectEdge()"], answer: 2 },
        { q: "What is Object Detection in Computer Vision?", options: ["Identifying only the color of an image","Identifying and locating objects within an image","Compressing an image","Resizing an image"], answer: 1 },
        { q: "Which algorithm is widely used for real-time object detection?", options: ["YOLO","K-Means","Linear Regression","Naive Bayes"], answer: 0 },
        { q: "What does YOLO stand for?", options: ["You Only Learn Once","You Only Look Once","Your Object Learning Operation","Young Object Locator"], answer: 1 },
        { q: "Which OpenCV-based method is commonly used for face detection?", options: ["KNN","Haar Cascade","Decision Tree","Random Forest"], answer: 1 },
        { q: "What is Image Segmentation?", options: ["Splitting an image into meaningful regions","Reducing image size","Rotating an image","Changing image colors"], answer: 0 },
        { q: "Semantic Segmentation assigns:", options: ["A class label to every pixel","A label to the entire image","A label to only one object","A random color to each pixel"], answer: 0 },
        { q: "What does OCR stand for?", options: ["Object Character Recognition","Optical Character Recognition","Online Character Reader","Open Character Recognition"], answer: 1 },
        { q: "What is the main purpose of OCR?", options: ["Detect faces","Extract text from images","Classify objects","Resize images"], answer: 1 },
        { q: "Which deep learning architecture is primarily used for image classification?", options: ["RNN","CNN","LSTM","K-Means"], answer: 1 },
        { q: "What is Feature Extraction in Computer Vision?", options: ["Removing unwanted pixels","Identifying important patterns from an image","Changing image colors","Compressing image files"], answer: 1 },
        { q: "Which technique uses a pre-trained model for a new vision task?", options: ["Transfer Learning","Gradient Descent","Clustering","Thresholding"], answer: 0 },
        { q: "Which OpenCV function draws a rectangle on an image?", options: ["cv2.box()","cv2.rectangle()","cv2.square()","cv2.drawRect()"], answer: 1 },
        { q: "Which OpenCV function draws a circle on an image?", options: ["cv2.circle()","cv2.round()","cv2.drawCircle()","cv2.arc()"], answer: 0 },
        { q: "Which OpenCV class captures video from a webcam?", options: ["cv2.VideoCapture()","cv2.Camera()","cv2.CaptureVideo()","cv2.Webcam()"], answer: 0 },
        { q: "Which color space is commonly used for color detection in OpenCV?", options: ["RGB","HSV","CMYK","LAB"], answer: 1 },
        { q: "Which OpenCV function is used for template matching?", options: ["cv2.matchTemplate()","cv2.findTemplate()","cv2.templateMatch()","cv2.detectTemplate()"], answer: 0 },
        { q: "Which Computer Vision application identifies a person's identity?", options: ["Face Recognition","Image Filtering","Thresholding","Edge Detection"], answer: 0 },
        { q: "Which OpenCV function detects contours?", options: ["cv2.findContours()","cv2.detectContours()","cv2.contours()","cv2.shapeDetect()"], answer: 0 },
        { q: "Which Computer Vision task follows an object's movement across frames?", options: ["Image Classification","Object Tracking","Thresholding","Image Filtering"], answer: 1 },
        { q: "Pose Estimation is used to:", options: ["Estimate the position of human body keypoints","Detect image colors","Compress images","Generate random images"], answer: 0 },
        { q: "Image Captioning combines Computer Vision with which field?", options: ["Networking","Natural Language Processing","Database Management","Cyber Security"], answer: 1 },
        { q: "Which Deep Learning model generates realistic images?", options: ["GAN","Decision Tree","K-Means","Naive Bayes"], answer: 0 }
    ]
};

async function loadExternalQuestions() {
    await Promise.all(coursesData.map(async course => {
        if (!course.questionsUrl) return;
        try {
            const response = await fetch(course.questionsUrl);
            if (!response.ok) throw new Error(`Unable to load ${course.questionsUrl}`);
            const questions = await response.json();

            course.questions = questions.map((question, idx) => {
                const rawOptions = (question.options || question.answers || []).map(option =>
                    typeof option === 'object' ? option.text || option.label || String(option) : String(option)
                );
                const options = rawOptions.length > 0 ? rawOptions : ["Option A", "Option B", "Option C", "Option D"];
                let answer = 0;
                if (typeof question.answer === 'number') {
                    answer = question.answer;
                } else if (typeof question.answer === 'string') {
                    const found = options.findIndex(opt => opt.trim() === question.answer.trim());
                    answer = found !== -1 ? found : 0;
                }

                return {
                    id: idx,
                    qId: idx,
                    q: question.q || question.question,
                    question: question.q || question.question,
                    options,
                    answer,
                    explanation: question.explanation || `The correct answer is "${options[answer]}".`
                };
            });
        } catch (error) {
            if (EMBEDDED_QUESTIONS[course.id]) {
                course.questions = EMBEDDED_QUESTIONS[course.id];
            }
        }
    }));
}

function loadEmbeddedQuestionBank() {
    coursesData.forEach(course => {
        if (course.questions && course.questions.length >= 50) return;
        if (typeof COURSE_QUESTIONS_BANK !== 'undefined' && COURSE_QUESTIONS_BANK[course.id] && COURSE_QUESTIONS_BANK[course.id].length >= 50) {
            course.questions = COURSE_QUESTIONS_BANK[course.id];
        } else if (typeof EMBEDDED_QUESTIONS !== 'undefined' && EMBEDDED_QUESTIONS[course.id]) {
            course.questions = EMBEDDED_QUESTIONS[course.id];
        }
    });
}

// ===============================
// ROUTER LOGIC
// ===============================

function navigateTo(viewId) {
    if (viewId === 'quiz' || viewId === 'quize') {
        if (!window.location.pathname.endsWith('quize.html')) {
            window.location.href = 'quize.html';
        }
        return;
    }
    if (viewId === 'verify') {
        if (!window.location.pathname.endsWith('verify.html')) {
            window.location.href = 'verify.html';
        }
        return;
    }

    const isSPA = document.getElementById('view-home') !== null || document.getElementById('home-view') !== null;
    if (!isSPA) {
        window.location.href = `index.html#${viewId || 'home'}`;
        return;
    }

    document.querySelectorAll('.view').forEach(v => {
        v.classList.remove('active-view');
        v.classList.remove('active');
        v.style.display = 'none';
    });
    const target = document.getElementById(`view-${viewId}`);

    if (target) {
        target.classList.add('active-view');
        target.classList.add('active');
        target.style.display = 'block';
        appState.currentView = viewId;
        sessionStorage.setItem('learnMeLastView', viewId);

        // Update URL hash without breaking browser history
        if (window.location.hash !== `#${viewId}`) {
            if (history.pushState) {
                history.pushState(null, null, `#${viewId}`);
            } else {
                window.location.hash = viewId;
            }
        }

        if (viewId === 'dashboard') renderDashboard();
        if (viewId === 'courses') renderCourses();
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    } else {
        if (viewId !== 'home') {
            return navigateTo('home');
        }
    }
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        const onclickAttr = link.getAttribute('onclick');
        const hrefAttr = link.getAttribute('href');
        if ((onclickAttr && onclickAttr.includes(`navigateTo('${viewId}')`)) || (hrefAttr && hrefAttr.includes(`#${viewId}`))) {
            link.classList.add('active');
        }
    });

    closeMobileNav();
}

function closeMobileNav() {
    const navMenu = document.getElementById("nav-menu");
    const menuBtn = document.getElementById("menu-btn");
    const backdrop = document.getElementById("nav-backdrop");
    if (navMenu && navMenu.classList.contains("active")) {
        navMenu.classList.remove("active");
    }
    if (menuBtn) {
        menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    }
    if (backdrop) {
        backdrop.classList.remove("active");
    }
}

function setupNavigation() {
    const menuBtn = document.getElementById("menu-btn");
    const navMenu = document.getElementById("nav-menu");
    const backdrop = document.getElementById("nav-backdrop");

    if (menuBtn && navMenu && !menuBtn.dataset.bound) {
        menuBtn.dataset.bound = "true";
        menuBtn.addEventListener("click", () => {
            const isOpen = navMenu.classList.toggle("active");
            if (backdrop) backdrop.classList.toggle("active", isOpen);
            menuBtn.innerHTML = isOpen
                ? '<i class="fas fa-times"></i>'
                : '<i class="fas fa-bars"></i>';
        });
    }

    if (backdrop && !backdrop.dataset.bound) {
        backdrop.dataset.bound = "true";
        backdrop.addEventListener("click", closeMobileNav);
    }
}

// ===============================
// COURSE LISTING
// ===============================

function renderCourses(coursesToRender = coursesData) {
    const container = document.getElementById('courses-grid-container');
    if (!container) return;
    container.innerHTML = '';

    if (!coursesToRender || coursesToRender.length === 0) {
        container.innerHTML = `
            <div class="empty-state-card" style="grid-column: 1 / -1;">
                <div class="empty-state-icon">
                    <i class="fas fa-search"></i>
                </div>
                <h3>No Tracks Found</h3>
                <p>We couldn't find any learning tracks matching your search or filter. Try a different keyword or view all courses.</p>
                <button class="btn btn-secondary" onclick="const s = document.getElementById('course-search-input'); if(s) s.value=''; filterCourses();">
                    <i class="fas fa-rotate-left"></i> View All Tracks
                </button>
            </div>
        `;
        return;
    }

    coursesToRender.forEach(course => {
        const prog = appState.progress[course.id];
        const isEnrolled = Boolean((appState.enrollments && appState.enrollments[course.id]) || prog);

        // Status badge
        let statusBadge = '';
        if (prog) {
            const badgeColor = prog.passed ? 'var(--success)' : 'var(--danger)';
            const badgeLabel = prog.passed ? `✓ Passed (${prog.score}%)` : `✗ Attempted (${prog.score}%)`;
            statusBadge = `<div style="background:${badgeColor}; color:white; padding:5px 14px; border-radius:20px; font-size:12px; font-weight:700; margin-bottom:12px; display:inline-block; letter-spacing:0.02em;">${badgeLabel}</div>`;
        } else if (isEnrolled) {
            statusBadge = `<div style="background:rgba(37,99,235,0.12); color:var(--primary-accent); padding:5px 14px; border-radius:20px; font-size:12px; font-weight:700; margin-bottom:12px; display:inline-block; letter-spacing:0.02em;"><i class="fas fa-check-circle"></i> Enrolled</div>`;
        } else {
            statusBadge = `<div style="background:rgba(16,185,129,0.1); color:var(--success); padding:5px 14px; border-radius:20px; font-size:12px; font-weight:700; margin-bottom:12px; display:inline-block; letter-spacing:0.02em;"><i class="fas fa-unlock"></i> Free Enrollment</div>`;
        }

        // Difficulty color
        const diffColors = { Beginner: 'var(--primary-accent)', Intermediate: '#f59e0b', Advanced: 'var(--danger)' };
        const difficultyColor = diffColors[course.difficulty] || '#f59e0b';

        // CTA button label & action
        let actionButtons = '';
        if (!isEnrolled) {
            actionButtons = `
                <div style="display:flex; gap:8px; width:100%;">
                    <button class="btn btn-primary" onclick="enrollInCourse('${course.id}', event)" style="flex:1;">
                        <i class="fas fa-plus-circle"></i> Enroll Now
                    </button>
                    <button class="btn btn-secondary" onclick="openCourseDetails('${course.id}')" title="Details" style="padding:10px 14px;">
                        <i class="fas fa-info-circle"></i>
                    </button>
                </div>
            `;
        } else {
            let btnLabel = '<i class="fas fa-book-open"></i> Continue Learning';
            let btnClass = 'btn-primary';
            if (prog && prog.passed) {
                btnLabel = '<i class="fas fa-eye"></i> Review Course';
                btnClass = 'btn-secondary';
            }
            actionButtons = `
                <div style="display:flex; gap:8px; width:100%;">
                    <button class="btn ${btnClass}" onclick="openCourseDetails('${course.id}')" style="flex:1;">
                        ${btnLabel}
                    </button>
                    <a href="quize.html?course=${course.id}" class="btn btn-secondary" title="Live Quiz Portal" style="padding:10px 14px; text-decoration:none; display:flex; align-items:center; justify-content:center;">
                        <i class="fas fa-bolt"></i>
                    </a>
                </div>
            `;
        }

        const cardNode = document.createElement('div');
        cardNode.className = 'card';
        cardNode.innerHTML = `
            <div class="card-img-placeholder">
                <i class="${course.iconType || 'fas'} ${course.icon}"></i>
            </div>
            <div class="card-content">
                ${statusBadge}
                <div class="card-tags">
                    <span><i class="fas fa-clock"></i> ${course.duration}</span>
                    <span style="color:${difficultyColor}"><i class="fas fa-layer-group"></i> ${course.difficulty}</span>
                    <span><i class="fas fa-tasks"></i> 50 Questions</span>
                </div>
                <h3>${course.title}</h3>
                <p style="color:var(--text-muted); font-size:14px; margin-bottom:20px; flex:1;">${course.subtitle}</p>
                <div class="card-action">
                    ${actionButtons}
                </div>
            </div>
        `;
        container.appendChild(cardNode);
    });
}

// ===============================
// COURSE DETAILS
// ===============================

function shuffleArray(arr) {
    if (!Array.isArray(arr)) return [];
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function getModuleQuestions(course, moduleName) {
    const allQuestions = (course && course.questions && course.questions.length > 0)
        ? course.questions
        : (typeof COURSE_QUESTIONS_BANK !== 'undefined' && COURSE_QUESTIONS_BANK[course.id])
            ? COURSE_QUESTIONS_BANK[course.id]
            : [];

    if (!allQuestions.length) return [];
    if (!moduleName || moduleName === 'Final Assessment' || moduleName === 'Full Assessment') {
        return allQuestions;
    }

    const normTarget = moduleName.toLowerCase().trim();

    // 1. Try explicit topic / category / question text match
    const topicMatches = allQuestions.filter(q => {
        const topicStr = (q.topic || q.category || '').toLowerCase().trim();
        const textStr = (q.question || q.q || '').toLowerCase();
        return topicStr.includes(normTarget) || normTarget.includes(topicStr) || textStr.includes(normTarget);
    });

    if (topicMatches.length >= 5) {
        return topicMatches;
    }

    // 2. Index-based partitioning based on module position in course.modules
    const nonFinalModules = (course.modules || []).filter(m => m !== 'Final Assessment' && m !== 'Full Assessment');
    const modIdx = nonFinalModules.findIndex(m => m.toLowerCase().trim() === normTarget);

    if (modIdx !== -1 && nonFinalModules.length > 0) {
        const chunkSize = Math.ceil(allQuestions.length / nonFinalModules.length);
        const start = modIdx * chunkSize;
        const end = Math.min(allQuestions.length, start + chunkSize);
        const sliced = allQuestions.slice(start, end);
        if (sliced.length > 0) return sliced;
    }

    return allQuestions;
}

function getCourseModuleLessonsClient(course, moduleName) {
    const cleanModuleName = String(moduleName || '').trim();
    const allLessons = Array.isArray(course?.lessons) ? course.lessons : [];
    const rawModules = Array.isArray(course?.modules) ? course.modules : [];
    const requiredModules = rawModules.filter(m => {
        const name = typeof m === 'object' ? (m.title || m.name || '') : String(m);
        const lower = name.toLowerCase().trim();
        return lower !== 'final assessment' && lower !== 'full assessment' && lower !== 'quiz' && !lower.includes('final assessment');
    }).map(m => typeof m === 'object' ? (m.title || m.name || '').trim() : String(m).trim());
    const modIndex = requiredModules.indexOf(cleanModuleName);

    const matched = allLessons.filter(l => {
        if (!l) return false;
        const mod = String(l.module || l.moduleId || l.moduleTitle || '').trim();
        return mod.toLowerCase() === cleanModuleName.toLowerCase();
    });

    if (matched.length > 0) {
        return matched.map((l, i) => ({
            lessonId: String(l.lessonId || l.id || `${course?.id || 'c'}-m${modIndex + 1}-l${i + 1}`),
            module: cleanModuleName,
            title: l.title || `${cleanModuleName} - Lesson ${i + 1}`,
            content: l.content || `Study core concepts of ${cleanModuleName}.`,
            duration: l.duration || '25 mins'
        }));
    }

    if (allLessons.length > 0 && modIndex !== -1) {
        const indexMatched = allLessons.filter((l, idx) => {
            const lTitle = String(l.title || '').toLowerCase();
            if (lTitle.includes(cleanModuleName.toLowerCase())) return true;
            if (requiredModules.length === allLessons.length) return idx === modIndex;
            return false;
        });
        if (indexMatched.length > 0) {
            return indexMatched.map((l, i) => ({
                lessonId: String(l.lessonId || l.id || `${course?.id || 'c'}-m${modIndex + 1}-l${i + 1}`),
                module: cleanModuleName,
                title: l.title || `${cleanModuleName} - Lesson ${i + 1}`,
                content: l.content || `Study core concepts of ${cleanModuleName}.`,
                duration: l.duration || '25 mins'
            }));
        }
    }

    const fallbackId = `${course?.id || 'course'}-mod-${modIndex !== -1 ? modIndex + 1 : 1}-core`;
    return [{
        lessonId: fallbackId,
        module: cleanModuleName,
        title: `${cleanModuleName} Core Curriculum`,
        content: `Master the fundamental concepts, examples, and techniques of ${cleanModuleName}.`,
        duration: '30 mins'
    }];
}

function calculateCourseProgress(courseId) {
    const course = coursesData.find(c => c.id === courseId || (c.id && c.id.toLowerCase() === (courseId || '').toLowerCase()));
    const rawModules = Array.isArray(course?.modules) ? course.modules : ["Module 1", "Module 2", "Module 3", "Final Assessment"];
    const requiredModules = rawModules.filter(m => {
        const lower = String(typeof m === 'object' ? (m.title || m.name || '') : m).toLowerCase().trim();
        return lower !== 'final assessment' && lower !== 'full assessment' && lower !== 'quiz' && !lower.includes('final assessment');
    }).map(m => typeof m === 'object' ? (m.title || m.name || '').trim() : String(m).trim());
    const totalModules = Math.max(1, requiredModules.length);

    const prog = (appState.progress && appState.progress[courseId]) || {};
    
    // Completed lesson IDs
    let completedLessonIds = [];
    if (Array.isArray(prog.completedLessonIds)) {
        completedLessonIds = [...prog.completedLessonIds];
    } else if (typeof prog.completedLessonIds === 'string') {
        try { completedLessonIds = JSON.parse(prog.completedLessonIds) || []; } catch(e) {}
    } else if (Array.isArray(prog.completedModules)) {
        // Fallback for initial state before migration
        prog.completedModules.forEach(modName => {
            const lessons = getCourseModuleLessonsClient(course, modName);
            lessons.forEach(l => { if (!completedLessonIds.includes(l.lessonId)) completedLessonIds.push(l.lessonId); });
        });
    }

    // Module completion check: All required lessons inside that module MUST be completed!
    const completedModules = [];
    const moduleDetails = requiredModules.map(moduleName => {
        const lessons = getCourseModuleLessonsClient(course, moduleName);
        const totalLessons = lessons.length;
        const completedLessons = lessons.filter(l => completedLessonIds.includes(l.lessonId)).length;
        const isCompleted = totalLessons > 0 && completedLessons === totalLessons;
        if (isCompleted) {
            completedModules.push(moduleName);
        }
        return {
            moduleName,
            totalLessons,
            completedLessons,
            isCompleted,
            lessons: lessons.map(l => ({
                ...l,
                isCompleted: completedLessonIds.includes(l.lessonId)
            }))
        };
    });

    const completedModulesCount = completedModules.length;

    // Course-specific quizzes (never hardcoded to 1)
    let requiredQuizzes = [];
    if (Array.isArray(course?.quizzes) && course.quizzes.length > 0) {
        requiredQuizzes = course.quizzes.map((q, idx) => ({
            quizId: String(q.quizId || q.id || `quiz-${idx + 1}`),
            title: q.title || `Quiz ${idx + 1}`,
            passingScore: Math.max(70, Number(q.passingScore) || 70)
        }));
    } else if (course?.hasFinalAssessment !== false || (Array.isArray(course?.questions) && course.questions.length > 0)) {
        requiredQuizzes = [{
            quizId: 'final',
            title: `${course?.title || 'Course'} Final Assessment`,
            passingScore: Math.max(70, Number(course?.passingScore) || 70)
        }];
    }
    const totalQuizzes = requiredQuizzes.length;

    // Quizzes completed check: must be passed with >= 70%
    let completedQuizzes = [];
    if (Array.isArray(prog.completedQuizzes)) {
        completedQuizzes = [...prog.completedQuizzes];
    } else if (typeof prog.completedQuizzes === 'string') {
        try { completedQuizzes = JSON.parse(prog.completedQuizzes) || []; } catch(e) {}
    }

    const quizScore = typeof prog.quizScore === 'number' ? prog.quizScore : (typeof prog.score === 'number' ? prog.score : 0);
    const passingScore = Math.max(70, Number(course?.passingScore) || 70);
    const singleQuizPassed = Boolean((prog.quizPassed || (prog.passed && quizScore >= 70)) && quizScore >= 70);

    const passedQuizzesList = requiredQuizzes.filter(q => {
        if (completedQuizzes.includes(q.quizId)) return true;
        if (q.quizId === 'final' && singleQuizPassed && quizScore >= q.passingScore) return true;
        return false;
    }).map(q => q.quizId);

    const quizzesCompleted = passedQuizzesList.length;
    const allQuizzesCompleted = totalQuizzes === 0 || quizzesCompleted >= totalQuizzes;

    const totalItems = totalModules + totalQuizzes;
    const completedItems = completedModulesCount + quizzesCompleted;
    const overallPercentage = totalItems > 0
        ? Math.min(100, Math.round((completedItems / totalItems) * 100))
        : 100;

    // STRICT RULE: Both all modules (all lessons) completed AND all required quizzes passed >= 70%
    const isCompleted = (completedModulesCount >= totalModules) && allQuizzesCompleted && (overallPercentage === 100);

    return {
        courseId,
        course,
        courseTitle: course ? course.title : courseId,
        totalModules,
        requiredModules,
        completedModules,
        moduleDetails,
        modulesCompleted: completedModulesCount,
        completedLessonIds,
        totalQuizzes,
        requiredQuizzes,
        quizzesCompleted,
        passedQuizzesList,
        quizPassed: allQuizzesCompleted && totalQuizzes > 0,
        quizScore,
        passingScore,
        totalItems,
        completedItems,
        courseProgress: overallPercentage,
        percentage: overallPercentage,
        isCompleted,
        eligibleForCertificate: isCompleted
    };
}
window.calculateCourseProgress = calculateCourseProgress;

function renderCertificateStatusCard(courseId) {
    const stats = calculateCourseProgress(courseId);

    if (!stats.isCompleted) {
        return `
            <div class="cert-eligibility-card locked" id="cert-status-card-${courseId}">
                <div class="cert-header">
                    <div class="cert-icon-badge">
                        <i class="fas fa-lock"></i>
                    </div>
                    <div class="cert-title-group">
                        <h3>🔒 Certificate Locked</h3>
                        <p>Complete all module lessons and pass all required quizzes with at least 70%.</p>
                    </div>
                </div>

                <div class="cert-metrics-grid">
                    <div class="cert-metric-box">
                        <span class="label">Course Progress</span>
                        <span class="val" style="color:var(--primary-accent);">${stats.courseProgress}%</span>
                    </div>
                    <div class="cert-metric-box">
                        <span class="label">Modules Completed</span>
                        <span class="val">${stats.modulesCompleted} / ${stats.totalModules}</span>
                    </div>
                    <div class="cert-metric-box">
                        <span class="label">Quizzes Completed</span>
                        <span class="val">${stats.quizzesCompleted} / ${stats.totalQuizzes}</span>
                    </div>
                </div>

                <div class="cert-progress-wrapper">
                    <div class="cert-progress-bar-bg">
                        <div class="cert-progress-bar-fill" style="width:${stats.courseProgress}%; background:linear-gradient(90deg, #f59e0b, #eab308);"></div>
                    </div>
                </div>

                <div class="cert-claim-action">
                    <span style="font-size:13px; color:var(--text-muted);">
                        <i class="fas fa-shield-alt"></i> Complete all ${stats.totalModules} modules (every lesson) and pass all required quizzes (score ≥ ${stats.passingScore}%) to unlock.
                    </span>
                    <button class="cert-action-btn btn btn-secondary" disabled title="Complete the entire course to unlock your certificate.">
                        <i class="fas fa-lock"></i> Claim Certificate
                    </button>
                </div>
            </div>
        `;
    } else {
        return `
            <div class="cert-eligibility-card unlocked" id="cert-status-card-${courseId}">
                <div class="cert-header">
                    <div class="cert-icon-badge">
                        <i class="fas fa-graduation-cap"></i>
                    </div>
                    <div class="cert-title-group">
                        <h3>🎓 Certificate Unlocked</h3>
                        <p>Congratulations! You have successfully completed 100% of the entire course.</p>
                    </div>
                </div>

                <div class="cert-metrics-grid">
                    <div class="cert-metric-box">
                        <span class="label">Course Progress</span>
                        <span class="val" style="color:var(--success);">100%</span>
                    </div>
                    <div class="cert-metric-box">
                        <span class="label">Modules Completed</span>
                        <span class="val" style="color:var(--success);">${stats.totalModules} / ${stats.totalModules}</span>
                    </div>
                    <div class="cert-metric-box">
                        <span class="label">Quizzes Completed</span>
                        <span class="val" style="color:var(--success);">${stats.totalQuizzes} / ${stats.totalQuizzes}</span>
                    </div>
                </div>

                <div class="cert-progress-wrapper">
                    <div class="cert-progress-bar-bg">
                        <div class="cert-progress-bar-fill" style="width:100%; background:linear-gradient(90deg, #10b981, #059669);"></div>
                    </div>
                </div>

                <div class="cert-claim-action">
                    <span style="font-size:13.5px; color:#059669; font-weight:700;">
                        <i class="fas fa-check-circle"></i> Official accredited certificate verified and ready to claim!
                    </span>
                    <button class="cert-action-btn btn btn-success" onclick="claimCertificate('${courseId}')" style="box-shadow: 0 4px 14px rgba(16,185,129,0.35);">
                        <i class="fas fa-award"></i> Claim Certificate
                    </button>
                </div>
            </div>
        `;
    }
}
window.renderCertificateStatusCard = renderCertificateStatusCard;

let currentStudyLesson = { courseId: null, lessonId: null, moduleName: null };

function openLessonStudyModal(courseId, lessonId) {
    const course = coursesData.find(c => c.id === courseId);
    if (!course) return;

    const stats = calculateCourseProgress(courseId);
    let targetLesson = null;
    let targetModule = null;

    stats.moduleDetails.forEach(m => {
        const found = m.lessons.find(l => l.lessonId === lessonId);
        if (found) {
            targetLesson = found;
            targetModule = m.moduleName;
        }
    });

    if (!targetLesson) {
        const lessons = Array.isArray(course.lessons) ? course.lessons : [];
        targetLesson = lessons.find(l => l.lessonId === lessonId) || {
            lessonId,
            title: `Lesson ${lessonId}`,
            content: `Study core curriculum for this course.`,
            duration: '25 mins'
        };
        targetModule = targetLesson.module || 'Course Module';
    }

    currentStudyLesson = { courseId, lessonId, moduleName: targetModule };
    const modal = document.getElementById('module-study-modal');
    if (!modal) return;

    document.getElementById('module-modal-title').textContent = targetLesson.title;
    document.getElementById('module-modal-course').textContent = `${course.title} • ${targetModule}`;

    const isCompleted = stats.completedLessonIds.includes(lessonId);

    const completeBtn = document.getElementById('module-modal-complete-btn');
    if (completeBtn) {
        completeBtn.className = isCompleted ? 'btn btn-secondary' : 'btn btn-success';
        completeBtn.innerHTML = isCompleted
            ? '<i class="fas fa-undo"></i> Mark Lesson as Incomplete'
            : '<i class="fas fa-check-circle"></i> Mark Lesson as Completed';
        completeBtn.onclick = async () => {
            await toggleLessonComplete(courseId, lessonId);
            closeModuleStudyModal();
        };
    }

    const quizBtn = document.getElementById('module-modal-quiz-btn');
    if (quizBtn) {
        quizBtn.onclick = () => {
            closeModuleStudyModal();
            window.location.href = `quize.html?course=${courseId}&module=${encodeURIComponent(targetModule)}`;
        };
    }

    const bodyEl = document.getElementById('module-modal-body');
    if (bodyEl) {
        bodyEl.innerHTML = `
            <div style="margin-bottom: 14px;">
                <h4 style="margin: 0 0 6px 0; color: var(--primary-accent); font-size: 16px;">
                    <i class="fas fa-book-reader"></i> Lesson Objectives & Core Content
                </h4>
                <p style="color: var(--text-muted); margin: 0 0 10px 0; font-size: 14px; line-height: 1.6;">
                    ${targetLesson.content || `Master the principles and practices of ${targetLesson.title}.`}
                </p>
            </div>
            <div style="background: #ffffff; border: 1px solid var(--glass-border); border-radius: 10px; padding: 14px; margin-bottom: 14px;">
                <strong style="display: block; margin-bottom: 6px; font-size: 13px; color: var(--text-main); text-transform: uppercase; letter-spacing: 0.04em;">
                    <i class="fas fa-check-double"></i> What You Master in this Lesson:
                </strong>
                <ul style="margin: 0; padding-left: 20px; font-size: 13.5px; color: var(--text-muted); line-height: 1.8;">
                    <li>Core logic, syntax rules, and architectural patterns of ${targetLesson.title}.</li>
                    <li>Hands-on code execution, edge cases, and best practices.</li>
                    <li>Topics evaluated in the mandatory course assessments (≥ 70% required to pass).</li>
                </ul>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13px; color: var(--text-muted); flex-wrap: wrap; gap: 8px;">
                <span><i class="fas fa-clock"></i> Estimated Study Time: <strong>${targetLesson.duration || '25 mins'}</strong></span>
                <span><i class="fas fa-layer-group"></i> Module: <strong>${targetModule}</strong></span>
            </div>
        `;
    }

    modal.hidden = false;
    modal.style.display = 'flex';
}

function openModuleStudyModal(courseId, moduleName) {
    const course = coursesData.find(c => c.id === courseId);
    if (!course) return;

    const lessons = getCourseModuleLessonsClient(course, moduleName);
    if (lessons.length > 0) {
        return openLessonStudyModal(courseId, lessons[0].lessonId);
    }
}

function closeModuleStudyModal() {
    const modal = document.getElementById('module-study-modal');
    if (modal) {
        modal.hidden = true;
        modal.style.display = 'none';
    }
}

async function toggleCurrentModuleComplete() {
    if (!currentStudyLesson.courseId || !currentStudyLesson.lessonId) return;
    await toggleLessonComplete(currentStudyLesson.courseId, currentStudyLesson.lessonId);
    closeModuleStudyModal();
}

async function toggleLessonComplete(courseId, lessonId) {
    if (!appState.progress[courseId]) {
        appState.progress[courseId] = {
            completedLessonIds: [],
            completedModules: [],
            completedQuizzes: [],
            score: 0,
            quizPassed: false
        };
    }

    const prog = appState.progress[courseId];
    let currentLessons = Array.isArray(prog.completedLessonIds) ? [...prog.completedLessonIds] : [];
    const isCompleted = currentLessons.includes(lessonId);

    if (isCompleted) {
        currentLessons = currentLessons.filter(id => id !== lessonId);
    } else {
        currentLessons.push(lessonId);
    }
    prog.completedLessonIds = currentLessons;
    prog.completedLessons = currentLessons.length;

    // Recalculate course completion using strict rules
    const stats = calculateCourseProgress(courseId);
    prog.completedModules = stats.completedModules;
    prog.percentage = stats.courseProgress;
    prog.eligibleForCertificate = stats.isCompleted;
    prog.courseCompleted = stats.isCompleted;

    saveProgress();

    // Sync to backend if logged in
    const token = localStorage.getItem('learnMeAuthToken');
    if (token) {
        try {
            const res = await fetch(`${API_BASE}/progress/${courseId}/lesson`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ lessonId, completed: !isCompleted })
            });
            if (res.ok) {
                const data = await res.json();
                if (data.progress) {
                    prog.completedLessonIds = data.progress.completedLessonIds || currentLessons;
                    prog.completedModules = data.progress.completedModules || stats.completedModules;
                    prog.percentage = data.overallPercentage || stats.courseProgress;
                    prog.eligibleForCertificate = data.eligibleForCertificate;
                    saveProgress();
                }
            }
        } catch (e) {
            console.warn("Offline lesson sync fallback:", e);
        }
    }

    // Refresh UI
    if (appState.currentView === 'course-details' && appState.currentCourseId === courseId) {
        openCourseDetails(courseId);
    } else if (appState.currentView === 'dashboard') {
        renderDashboard();
    }
}

async function toggleModuleComplete(courseId, moduleName) {
    const course = coursesData.find(c => c.id === courseId);
    if (!course) return;

    const lessons = getCourseModuleLessonsClient(course, moduleName);
    const lessonIds = lessons.map(l => l.lessonId);

    if (!appState.progress[courseId]) {
        appState.progress[courseId] = {
            completedLessonIds: [],
            completedModules: [],
            completedQuizzes: [],
            score: 0,
            quizPassed: false
        };
    }

    const prog = appState.progress[courseId];
    let currentLessons = Array.isArray(prog.completedLessonIds) ? [...prog.completedLessonIds] : [];
    const allModuleLessonsDone = lessonIds.every(id => currentLessons.includes(id));

    if (allModuleLessonsDone) {
        // Reset lessons in this module
        currentLessons = currentLessons.filter(id => !lessonIds.includes(id));
    } else {
        // Complete all lessons in this module
        lessonIds.forEach(id => {
            if (!currentLessons.includes(id)) currentLessons.push(id);
        });
    }

    prog.completedLessonIds = currentLessons;
    prog.completedLessons = currentLessons.length;

    // Recalculate course completion
    const stats = calculateCourseProgress(courseId);
    prog.completedModules = stats.completedModules;
    prog.percentage = stats.courseProgress;
    prog.eligibleForCertificate = stats.isCompleted;
    prog.courseCompleted = stats.isCompleted;

    saveProgress();

    // Sync to backend if logged in
    const token = localStorage.getItem('learnMeAuthToken');
    if (token) {
        try {
            await fetch(`${API_BASE}/progress/${courseId}/module`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ moduleName, completed: !allModuleLessonsDone })
            });
        } catch (e) {
            console.warn("Offline module sync fallback:", e);
        }
    }

    // Refresh UI
    if (appState.currentView === 'course-details' && appState.currentCourseId === courseId) {
        openCourseDetails(courseId);
    } else if (appState.currentView === 'dashboard') {
        renderDashboard();
    }
}

function openCourseDetails(courseId) {
    appState.currentCourseId = courseId;
    const course = coursesData.find(c => c.id === courseId);
    if (!course) return navigateTo('courses');

    const stats = calculateCourseProgress(courseId);
    const isEnrolled = Boolean((appState.enrollments && appState.enrollments[courseId]) || appState.progress[courseId]);

    const container = document.getElementById('course-details-container');

    // Prominent Certificate Status Card (Locked vs Unlocked based strictly on 100% course completion)
    const certCardHTML = renderCertificateStatusCard(courseId);

    // Modules list with individual lessons
    const moduleListHTML = stats.moduleDetails.map((m, index) => {
        const isModuleDone = m.isCompleted;
        const lessonsHTML = m.lessons.map(l => {
            const isLessonDone = l.isCompleted;
            return `
                <div class="lesson-subitem" style="display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: ${isLessonDone ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.7)'}; border: 1px solid ${isLessonDone ? 'rgba(16,185,129,0.25)' : 'var(--glass-border)'}; border-radius: 8px; margin-top: 8px;">
                    <div style="display: flex; align-items: center; gap: 10px; flex: 1;">
                        <i class="fas ${isLessonDone ? 'fa-check-circle' : 'fa-play-circle'}" style="color: ${isLessonDone ? '#059669' : 'var(--primary-accent)'}; font-size: 15px;"></i>
                        <div>
                            <span style="font-size: 14px; font-weight: 600; color: var(--text-main);">${l.title}</span>
                            <small style="display: block; color: var(--text-muted); font-size: 12px;"><i class="fas fa-clock"></i> ${l.duration || '25 mins'}</small>
                        </div>
                    </div>
                    <div style="display: flex; gap: 6px; align-items: center;">
                        <button class="btn btn-sm ${isLessonDone ? 'btn-secondary' : 'btn-success'}" onclick="toggleLessonComplete('${course.id}', '${l.lessonId}')" style="padding: 5px 12px; font-size: 12px;">
                            <i class="fas ${isLessonDone ? 'fa-undo' : 'fa-check'}"></i> ${isLessonDone ? 'Mark Incomplete' : 'Complete Lesson'}
                        </button>
                        <button class="btn btn-sm btn-primary" onclick="openLessonStudyModal('${course.id}', '${l.lessonId}')" style="padding: 5px 12px; font-size: 12px;">
                            <i class="fas fa-book-open"></i> Study
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="module-item-card ${isModuleDone ? 'is-completed' : ''}" style="margin-bottom: 14px; padding: 16px; border-radius: 12px; background: var(--bg-panel); border: 1px solid ${isModuleDone ? 'rgba(16,185,129,0.4)' : 'var(--glass-border)'};">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 10px;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 36px; height: 36px; border-radius: 10px; background: ${isModuleDone ? 'rgba(16,185,129,0.14)' : 'rgba(37,99,235,0.08)'}; color: ${isModuleDone ? '#059669' : 'var(--primary-accent)'}; display: flex; align-items: center; justify-content: center; font-size: 15px;">
                            <i class="fas ${isModuleDone ? 'fa-check-circle' : 'fa-folder'}"></i>
                        </div>
                        <div>
                            <strong style="font-size: 16px; color: var(--text-main);">${m.moduleName}</strong>
                            <small style="color: var(--text-muted); display: block;">Module ${index + 1} &bull; ${m.completedLessons} of ${m.totalLessons} Lessons Completed</small>
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span class="module-status-badge ${isModuleDone ? 'completed' : 'pending'}">
                            ${isModuleDone ? '<i class="fas fa-check"></i> Module Completed' : '<i class="fas fa-circle-notch"></i> Lessons Required'}
                        </span>
                        <button class="btn btn-sm ${isModuleDone ? 'btn-secondary' : 'btn-outline'}" onclick="toggleModuleComplete('${course.id}', '${m.moduleName.replace(/'/g, "\\'")}')" style="padding: 6px 12px; font-size: 12px;">
                            ${isModuleDone ? 'Reset Module' : 'Complete All Lessons'}
                        </button>
                    </div>
                </div>

                <!-- Lessons inside this module -->
                <div class="module-lessons-container" style="padding-left: 12px; border-left: 2px solid ${isModuleDone ? 'rgba(16,185,129,0.3)' : 'rgba(37,99,235,0.2)'}; margin-top: 8px;">
                    ${lessonsHTML}
                </div>
            </div>
        `;
    }).join('');

    // Course-specific Quizzes
    const quizzesHTML = stats.requiredQuizzes.map((q, qIndex) => {
        const isPassed = stats.passedQuizzesList.includes(q.quizId);
        return `
            <div class="module-item-card ${isPassed ? 'is-completed' : ''}" style="margin-top: 10px; background: ${isPassed ? 'rgba(16,185,129,0.04)' : 'rgba(37,99,235,0.04)'}; border-color: ${isPassed ? 'rgba(16,185,129,0.4)' : 'rgba(37,99,235,0.3)'};">
                <div style="display: flex; align-items: center; gap: 14px; flex: 1; min-width: 220px;">
                    <div style="width: 38px; height: 38px; border-radius: 10px; background: ${isPassed ? 'rgba(16,185,129,0.15)' : 'rgba(37,99,235,0.12)'}; color: ${isPassed ? '#059669' : 'var(--primary-accent)'}; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0;">
                        <i class="fas ${isPassed ? 'fa-award' : 'fa-pencil-alt'}"></i>
                    </div>
                    <div>
                        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                            <strong style="font-size: 15px; color: var(--text-main);">${q.title}</strong>
                            <span class="module-status-badge ${isPassed ? 'completed' : 'pending'}">
                                ${isPassed ? `<i class="fas fa-check"></i> Passed (≥ 70%)` : `<i class="fas fa-exclamation-circle"></i> Required (≥ ${q.passingScore}% to Pass)`}
                            </span>
                        </div>
                        <small style="color: var(--text-muted); display: block; margin-top: 2px;">Mandatory assessment &bull; Score at least ${q.passingScore}% to count toward course completion</small>
                    </div>
                </div>
                <div style="display: flex; gap: 8px; align-items: center;">
                    <button class="btn btn-sm btn-primary" onclick="openAssessment('${course.id}')" style="padding: 8px 18px; font-weight: 700; font-size: 13.5px;">
                        <i class="fas ${isPassed ? 'fa-redo' : 'fa-play'}"></i> ${isPassed ? 'Retake Quiz' : 'Start Quiz'}
                    </button>
                    <a href="quize.html?course=${course.id}&quizId=${q.quizId}" class="btn btn-sm btn-secondary" style="padding: 8px 14px; font-size: 13px; text-decoration: none;">
                        <i class="fas fa-bolt"></i> Quiz Portal
                    </a>
                </div>
            </div>
        `;
    }).join('');

    let bottomActions = '';
    if (!isEnrolled) {
        bottomActions = `
            <div style="background:rgba(37,99,235,0.06); border:1px solid rgba(37,99,235,0.2); border-radius:16px; padding:26px; margin-top:28px; text-align:center;">
                <h3 style="color:var(--primary-accent); margin-bottom:8px; font-size:20px;">
                    <i class="fas fa-graduation-cap"></i> Free Student Track Enrollment
                </h3>
                <p style="color:var(--text-muted); font-size:14px; margin-bottom:20px; max-width:540px; margin-left:auto; margin-right:auto;">
                    Enroll now for free to unlock complete interactive modules, automatic progress tracking, and official certificates.
                </p>
                <div style="display:flex; justify-content:center; gap:12px; flex-wrap:wrap;">
                    <button class="btn btn-primary" onclick="enrollInCourse('${course.id}')" style="font-size:16px; padding:14px 36px;">
                        <i class="fas fa-plus-circle"></i> Enroll in Course
                    </button>
                    <a href="quize.html?course=${course.id}" class="btn btn-secondary" style="font-size:15px; padding:14px 24px; text-decoration:none;">
                        <i class="fas fa-play"></i> Try Sample Quiz
                    </a>
                </div>
            </div>
        `;
    } else {
        bottomActions = `
            <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap; margin-top:28px;">
                ${stats.isCompleted ? `
                    <button class="btn btn-success" onclick="claimCertificate('${course.id}')" style="font-size:16px; padding:12px 28px; font-weight:700; box-shadow:0 4px 14px rgba(16,185,129,0.35);">
                        <i class="fas fa-award"></i> Claim Certificate
                    </button>
                ` : ''}
                <button class="btn btn-primary" onclick="openAssessment('${course.id}')" style="font-size:15px; padding:12px 24px;">
                    <i class="fas fa-pencil-alt"></i> ${stats.quizPassed ? 'Retake Assessment' : 'Take Final Assessment'}
                </button>
                ${stats.quizPassed ? `
                    <button class="btn btn-secondary" onclick="showAnswerReview('${course.id}')" style="font-size:15px; padding:12px 20px;">
                        <i class="fas fa-list-check"></i> Review Quiz Answers
                    </button>
                ` : ''}
                <a href="quize.html?course=${course.id}" class="btn btn-secondary" style="font-size:15px; padding:12px 20px; text-decoration:none;">
                    <i class="fas fa-bolt"></i> Open in Quiz Portal
                </a>
            </div>
        `;
    }

    container.innerHTML = `
        <div class="view-header">
            <h2 style="font-size:30px;">Course Details</h2>
            <button class="btn btn-secondary" onclick="navigateTo('courses')" style="margin-top:16px;">
                <i class="fas fa-arrow-left"></i> Back to Courses
            </button>
        </div>

        <div class="course-detail-header" style="flex-direction:column; align-items:center; text-align:center;">
            <div class="course-detail-icon" style="margin-bottom:20px;">
                <i class="${course.iconType || 'fas'} ${course.icon}"></i>
            </div>
            <div class="course-detail-info" style="width:100%;">
                <h2 style="margin-bottom:10px;">${course.title}</h2>
                <div class="course-meta" style="justify-content:center; margin-bottom:20px;">
                    <span><i class="fas fa-clock"></i> ${course.duration}</span>
                    <span style="color:var(--primary-accent);"><i class="fas fa-layer-group"></i> ${course.difficulty}</span>
                    <span><i class="fas fa-book"></i> ${stats.totalModules} Modules &bull; ${stats.totalQuizzes} Required Quizzes</span>
                </div>
                <p style="margin-bottom:25px; color:var(--text-muted);">${course.subtitle}</p>

                <!-- Certificate Status Card (Locked until 100% Course Completion) -->
                ${certCardHTML}

                <!-- Course Modules & Lessons Section -->
                <div style="background:rgba(13,27,61,0.03); padding:25px; border-radius:15px; border:1px solid var(--glass-border); margin-bottom:24px; text-align:left;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:10px;">
                        <h3 style="margin:0; color:var(--primary-accent); font-weight:800; display:flex; align-items:center; gap:8px; font-size:18px;">
                            <i class="fas fa-book-open"></i> Course Modules & Lessons
                        </h3>
                        <span style="font-size:13px; font-weight:700; color:var(--text-muted);">
                            ${stats.modulesCompleted} of ${stats.totalModules} Modules Completed
                        </span>
                    </div>
                    <div>
                        ${moduleListHTML}
                    </div>

                    <!-- Required Quizzes Section -->
                    <div style="margin-top: 24px;">
                        <h4 style="margin: 0 0 12px 0; color: var(--primary-accent); font-weight: 800; font-size: 16px; display: flex; align-items: center; gap: 8px;">
                            <i class="fas fa-award"></i> Required Quizzes & Assessments (≥ 70% to Pass)
                        </h4>
                        ${quizzesHTML}
                    </div>
                </div>

                <div style="background:rgba(13,27,61,0.03); padding:20px 25px; border-radius:15px; border:1px solid var(--glass-border); text-align:left;">
                    <h3 style="margin-bottom:10px; color:var(--primary-accent); font-size:17px;"><i class="fas fa-info-circle"></i> Certificate Requirements</h3>
                    <ul style="color:var(--text-muted); padding-left:20px; line-height:2; font-size:14px; margin:0;">
                        <li>Complete every required lesson inside all <strong>${stats.totalModules} study modules</strong>.</li>
                        <li>Pass all <strong>${stats.totalQuizzes} required course quizzes</strong> with a score of at least <strong>70%</strong>.</li>
                        <li>Overall course progress must reach <strong>100%</strong> to claim your accredited certificate.</li>
                    </ul>
                </div>

                ${bottomActions}
            </div>
        </div>
    `;
    navigateTo('course-details');
}

// ===============================
// ASSESSMENT
// ===============================

async function openAssessment(courseId, moduleName) {
    let course = coursesData.find(c => c.id === courseId);
    if (!course) {
        course = coursesData.find(c => c.id && c.id.toLowerCase() === (courseId || '').toLowerCase());
    }
    if (!course) {
        return alert('Course track not found.');
    }

    // Always ensure course questions have complete answer keys from COURSE_QUESTIONS_BANK
    if (typeof COURSE_QUESTIONS_BANK !== 'undefined' && COURSE_QUESTIONS_BANK[courseId] && COURSE_QUESTIONS_BANK[courseId].length >= 50) {
        course.questions = COURSE_QUESTIONS_BANK[courseId];
    } else if (!course.questions || course.questions.length < 50 || typeof course.questions[0].answer !== 'number') {
        const fileUrl = course.questionsUrl || `data/${courseId}.json`;
            try {
                const fRes = await fetch(fileUrl);
                if (fRes.ok) {
                    const qList = await fRes.json();
                    if (Array.isArray(qList) && qList.length > 0) {
                        course.questions = qList.map((q, idx) => {
                            const rawOptions = (q.options || q.answers || []).map(opt =>
                                typeof opt === 'object' ? (opt.text || opt.label || String(opt)) : String(opt)
                            );
                            const options = rawOptions.length > 0 ? rawOptions : ["Option A", "Option B", "Option C", "Option D"];
                            let answerIdx = 0;
                            if (typeof q.answer === 'number') {
                                answerIdx = q.answer;
                            } else if (typeof q.answer === 'string') {
                                const found = options.findIndex(opt => opt.trim() === q.answer.trim());
                                answerIdx = found !== -1 ? found : 0;
                            }
                            return {
                                id: idx,
                                qId: idx,
                                q: q.q || q.question || `Question ${idx + 1}`,
                                question: q.q || q.question || `Question ${idx + 1}`,
                                options,
                                answer: answerIdx,
                                explanation: q.explanation || `The correct answer is "${options[answerIdx]}".`
                            };
                        });
                    }
                }
            } catch (e) {
                console.warn('Local JSON questions fetch fallback:', e);
            }

            // Try embedded questions if needed
            if ((!course.questions || course.questions.length === 0) && typeof EMBEDDED_QUESTIONS !== 'undefined' && EMBEDDED_QUESTIONS[courseId]) {
                course.questions = EMBEDDED_QUESTIONS[courseId];
            }
        }

    const pool = getModuleQuestions(course, moduleName);
    const shuffledBank = shuffleArray(pool || []);
    const maxCount = (!moduleName || moduleName === 'Final Assessment') ? 50 : 10;
    const selectedQuestions = shuffledBank.slice(0, Math.min(maxCount, shuffledBank.length));

    const quizTitle = (moduleName && moduleName !== 'Final Assessment')
        ? `${course.title} — ${moduleName}`
        : `${course.title} — Final Master Assessment`;

    appState.currentAssessment = {
        courseId,
        title: quizTitle,
        moduleName: moduleName || 'Final Assessment',
        questions: selectedQuestions.length > 0 ? selectedQuestions : (course.questions || []).slice(0, 10),
        totalBankCount: pool.length,
        currentQ:  0,
        answers:   {},
        marked:    {},
        startedAt: Date.now()
    };
    renderAssessmentQ();
    navigateTo('assessment');
}

function renderAssessmentQ() {
    const asmt = appState.currentAssessment;
    asmt.marked = asmt.marked || {};
    asmt.startedAt = asmt.startedAt || Date.now();
    const qData = asmt.questions[asmt.currentQ];
    const container = document.getElementById('assessment-container');
    const progressPct = Math.round(((asmt.currentQ + 1) / asmt.questions.length) * 100);
    const elapsedSeconds = Math.floor((Date.now() - (asmt.startedAt || Date.now())) / 1000);
    const elapsedLabel = `${String(Math.floor(elapsedSeconds / 60)).padStart(2, '0')}:${String(elapsedSeconds % 60).padStart(2, '0')}`;

    const optionsHtml = qData.options.map((opt, optIdx) => {
        const isChecked = asmt.answers[asmt.currentQ] === optIdx ? 'checked' : '';
        return `
            <label class="quiz-option" style="display:flex; align-items:center; margin-bottom:12px; background:rgba(13,27,61,0.03); padding:18px; border-radius:10px; cursor:pointer; font-size:16px; border:1px solid rgba(13,27,61,0.12); transition:0.2s; gap:12px;">
                <input type="radio" name="aq" value="${optIdx}" ${isChecked} onchange="saveAq(${optIdx})" style="flex-shrink:0;">
                <span>${opt}</span>
            </label>
        `;
    }).join('');

    container.innerHTML = `
        <div class="view-header" style="margin-bottom:30px;">
            <h2 style="font-size:30px;">${asmt.title || 'Final Assessment'}</h2>
            <p style="color:var(--text-muted);">Question <strong>${asmt.currentQ + 1}</strong> of <strong>${asmt.questions.length}</strong></p>
            <p style="color:var(--text-muted);"><i class="fas fa-stopwatch"></i> <strong id="assessment-timer">${elapsedLabel}</strong></p>
        </div>

        <div style="max-width:800px; margin:auto; background:var(--bg-panel); border:1px solid var(--glass-border); padding:50px; border-radius:20px; box-shadow:0 4px 20px rgba(0,0,0,0.04);">

            <div style="margin-bottom:8px; display:flex; justify-content:space-between; font-size:13px; color:var(--text-muted);">
                <span>Progress</span><span>${progressPct}%</span>
            </div>
            <div style="margin-bottom:28px; height:10px; background:#f3f4f6; border-radius:10px;">
                <div style="height:100%; background:var(--success); border-radius:10px; width:${progressPct}%; transition:0.35s ease-out;"></div>
            </div>

            <h3 style="font-size:21px; margin-bottom:25px; color:var(--text-main); line-height:1.4;">
                ${asmt.currentQ + 1}. ${qData.question || qData.q}
            </h3>

            ${optionsHtml}

            <div style="display:flex; justify-content:space-between; align-items:center; gap:12px; margin-top:22px; flex-wrap:wrap;">
                <button class="btn btn-secondary" onclick="toggleAptitudeMark()"><i class="fas fa-star"></i> ${asmt.marked[asmt.currentQ] ? 'Marked for Review' : 'Mark for Review'}</button>
                <div class="question-palette">${asmt.questions.map((_, index) => `<button class="palette-item ${asmt.answers[index] !== undefined ? 'answered' : ''} ${asmt.marked[index] ? 'marked' : ''} ${index === asmt.currentQ ? 'current' : ''}" onclick="jumpToAq(${index})">${index + 1}</button>`).join('')}</div>
            </div>

            <div style="display:flex; justify-content:space-between; margin-top:40px; gap:12px;">
                <button class="btn btn-secondary" onclick="prevAq()" ${asmt.currentQ === 0 ? 'disabled' : ''}>
                    <i class="fas fa-arrow-left"></i> Previous
                </button>
                ${asmt.currentQ === asmt.questions.length - 1
                    ? `<button class="btn btn-success" onclick="submitAssessment()"><i class="fas fa-check"></i> Submit Assessment</button>`
                    : `<button class="btn btn-primary" onclick="nextAq()">Next <i class="fas fa-arrow-right"></i></button>`
                }
            </div>
        </div>
    `;
    if (typeof assessmentTimer !== 'undefined' && assessmentTimer) {
        clearInterval(assessmentTimer);
    }
    assessmentTimer = setInterval(() => {
        const timer = document.getElementById('assessment-timer');
        if (!timer) {
            if (assessmentTimer) clearInterval(assessmentTimer);
            return;
        }
        const seconds = Math.floor((Date.now() - asmt.startedAt) / 1000);
        timer.textContent = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
    }, 1000);
}

function saveAq(val) {
    appState.currentAssessment.answers[appState.currentAssessment.currentQ] = val;
}
function nextAq() {
    if (appState.currentAssessment.currentQ < appState.currentAssessment.questions.length - 1) {
        appState.currentAssessment.currentQ++;
        renderAssessmentQ();
    }
}
function prevAq() {
    if (appState.currentAssessment.currentQ > 0) {
        appState.currentAssessment.currentQ--;
        renderAssessmentQ();
    }
}
function jumpToAq(index) {
    appState.currentAssessment.currentQ = index;
    renderAssessmentQ();
}
function toggleAptitudeMark() {
    const asmt = appState.currentAssessment;
    asmt.marked[asmt.currentQ] = !asmt.marked[asmt.currentQ];
    renderAssessmentQ();
}

// ===============================
// SUBMIT & RESULT
// ===============================

function submitAssessment() {
    const asmt = appState.currentAssessment;
    clearInterval(assessmentTimer);
    const answered = Object.keys(asmt.answers).filter(k => typeof asmt.answers[k] === 'number' && asmt.answers[k] >= 0).length;
    const unanswered = Math.max(0, asmt.questions.length - answered);
    const timeTaken = Math.floor((Date.now() - (asmt.startedAt || Date.now())) / 1000);
    const confirmSubmit = confirm(`Are you sure you want to submit?\n\nAnswered: ${answered} / ${asmt.questions.length}\nUnanswered: ${unanswered}\n\n[ Review Answers ] [ Submit Test ]`);
    if (!confirmSubmit) return;

    let correct = 0;
    const bankCourse = (typeof COURSE_QUESTIONS_BANK !== 'undefined' && COURSE_QUESTIONS_BANK[asmt.courseId]) ? COURSE_QUESTIONS_BANK[asmt.courseId] : null;

    const reviewData = asmt.questions.map((q, idx) => {
        let trueQuestion = q;
        if (typeof trueQuestion.answer !== 'number' && bankCourse) {
            const match = bankCourse.find(b => (b.question || b.q) === (q.question || q.q));
            if (match) trueQuestion = match;
            else if (bankCourse[idx]) trueQuestion = bankCourse[idx];
        }

        const userAnswer = asmt.answers[idx];
        const isAnswered = typeof userAnswer === 'number' && userAnswer >= 0;

        const correctIdx = typeof trueQuestion.answer === 'number'
            ? trueQuestion.answer
            : (typeof trueQuestion.correctAnswer === 'number' ? trueQuestion.correctAnswer : 0);

        const isCorrect = isAnswered && (userAnswer === correctIdx);
        if (isCorrect) correct++;

        const safeOptions = trueQuestion.options || q.options || [];
        const safeAnswer = (safeOptions && safeOptions[correctIdx]) ? safeOptions[correctIdx] : 'Correct Option';
        const safeExplanation = trueQuestion.explanation || `The correct answer is "${safeAnswer}". This option matches the question correctly.`;
        const qText = trueQuestion.question || trueQuestion.q || `Question ${idx + 1}`;
        const selectedText = (isAnswered && safeOptions && safeOptions[userAnswer]) ? safeOptions[userAnswer] : 'Not answered';

        return {
            q: qText,
            question: qText,
            options: safeOptions,
            answer: correctIdx,
            correctAnswer: correctIdx,
            correctOption: safeAnswer,
            userAnswer: isAnswered ? userAnswer : undefined,
            selectedAnswer: isAnswered ? userAnswer : undefined,
            selectedOption: selectedText,
            selectedText,
            isCorrect: Boolean(isCorrect),
            explanation: safeExplanation
        };
    });

    const percentage = asmt.questions.length > 0 ? Math.round((correct / asmt.questions.length) * 100) : 0;
    const passed      = percentage >= 70;
    const incorrect   = Math.max(0, answered - correct);

    const quizId = (asmt.moduleName && asmt.moduleName !== 'Final Assessment')
        ? `quiz-${asmt.moduleName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
        : 'final';

    if (!appState.progress[asmt.courseId]) {
        appState.progress[asmt.courseId] = { completedModules: [], completedLessonIds: [], completedQuizzes: {} };
    }
    const prog = appState.progress[asmt.courseId];
    if (!prog.completedQuizzes) prog.completedQuizzes = {};
    if (passed) {
        prog.completedQuizzes[quizId] = {
            score: percentage,
            passed: true,
            completedAt: new Date().toISOString()
        };
    }
    prog.quizScore = percentage;
    prog.score = percentage;
    prog.passed = passed;
    prog.quizPassed = passed;
    prog.correct = correct;
    prog.total = asmt.questions.length;
    prog.reviewData = reviewData;
    prog.title = asmt.title || asmt.courseId;

    // Accurately calculate course metrics
    const stats = calculateCourseProgress(asmt.courseId);
    prog.percentage = stats.courseProgress;
    prog.courseCompleted = stats.isCompleted;
    prog.eligibleForCertificate = stats.isCompleted;
    prog.completedModules = stats.completedModules;

    saveProgress();
    renderCourses();

    // Sync assessment score and status to backend
    const token = localStorage.getItem('learnMeAuthToken');
    if (token) {
        fetch(`${API_BASE}/progress/${asmt.courseId}/assessment`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({
                quizId,
                score: percentage,
                passed,
                correct,
                total: asmt.questions.length,
                title: asmt.title
            })
        }).then(r => r.json()).then(data => {
            if (data && data.overallPercentage !== undefined) {
                prog.percentage = data.overallPercentage;
                prog.eligibleForCertificate = data.eligibleForCertificate;
                saveProgress();
            }
        }).catch(err => console.warn('Failed to sync assessment progress to backend', err));
    }

    const container = document.getElementById('result-container');
    container.innerHTML = `
        <div style="max-width:680px; margin:auto; text-align:center; background:var(--bg-panel); border:1px solid var(--glass-border); padding:40px clamp(18px, 4vw, 50px); border-radius:20px; box-shadow:0 8px 30px rgba(0,0,0,0.06);">
            <i class="fas ${passed ? 'fa-check-circle' : 'fa-times-circle'}"
               style="font-size:72px; color:${passed ? 'var(--success)' : 'var(--danger)'}; margin-bottom:18px;"></i>
            <h2 style="font-size:32px; margin-bottom:8px; color:var(--text-main);">${passed ? '🎉 Assessment Passed!' : 'Assessment Not Passed'}</h2>
            <p style="font-size:17px; color:var(--text-muted); margin-bottom:26px;">
                You scored <strong style="color:var(--text-main); font-size:20px;">${percentage}%</strong> on this exam
                ${percentage >= 90 ? ' — Outstanding! 🌟' : percentage >= 70 ? ' — Well done! 🎯' : ' — Keep practising to reach 70%!'}
            </p>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:28px; text-align:left;">
                <div style="background:rgba(13,27,61,0.04); padding:14px; border-radius:10px;">
                    <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase;">Total Questions</div>
                    <strong style="font-size:20px;">${asmt.questions.length}</strong>
                </div>
                <div style="background:rgba(16,185,129,0.07); padding:14px; border-radius:10px;">
                    <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase;">Correct</div>
                    <strong style="font-size:20px; color:var(--success);">${correct}</strong>
                </div>
                <div style="background:rgba(239,68,68,0.05); padding:14px; border-radius:10px;">
                    <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase;">Incorrect</div>
                    <strong style="font-size:20px; color:var(--danger);">${incorrect}</strong>
                </div>
                <div style="background:rgba(37,99,235,0.06); padding:14px; border-radius:10px;">
                    <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase;">Time Taken</div>
                    <strong style="font-size:20px; color:var(--secondary-accent);">${String(Math.floor(timeTaken / 60)).padStart(2, '0')}:${String(timeTaken % 60).padStart(2, '0')}</strong>
                </div>
            </div>

            <!-- Certificate Status UI Card (Reflects true entire course completion) -->
            ${renderCertificateStatusCard(asmt.courseId)}

            <div style="display:flex; flex-direction:column; gap:10px; margin-top:24px;">
                ${stats.isCompleted ? `
                    <button class="btn btn-success" onclick="claimCertificate('${asmt.courseId}')" style="width:100%; padding:14px; font-weight:700; font-size:15px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);">
                        <i class="fas fa-award"></i> Claim Verified Certificate
                    </button>
                ` : `
                    <button class="btn btn-primary" onclick="openCourseDetails('${asmt.courseId}')" style="width:100%; padding:14px; font-weight:700; font-size:15px;">
                        <i class="fas fa-book-open"></i> Complete Course Modules to Unlock Certificate (${stats.modulesCompleted}/${stats.totalModules})
                    </button>
                `}
                <button class="btn btn-secondary" onclick="showAnswerReview('${asmt.courseId}')" style="width:100%;">
                    <i class="fas fa-list-check"></i> Review My Answers & Explanations
                </button>
                <button class="btn btn-secondary" onclick="openAssessment('${asmt.courseId}')" style="width:100%;">
                    <i class="fas fa-redo"></i> Retake Assessment
                </button>
                <button class="btn btn-secondary" onclick="openCourseDetails('${asmt.courseId}')" style="width:100%;">
                    <i class="fas fa-arrow-left"></i> Return to Course Overview
                </button>
            </div>
        </div>
    `;
    navigateTo('result');
}

// ===============================
// ANSWER REVIEW
// ===============================

function showAnswerReview(courseId) {
    const prog = appState.progress[courseId];
    if (!prog || !prog.reviewData || prog.reviewData.length === 0) {
        return alert('No review data available. Please take the assessment first.');
    }

    const course = coursesData.find(c => c.id === courseId);
    const container = document.getElementById('result-container');
    const bankCourse = (typeof COURSE_QUESTIONS_BANK !== 'undefined' && COURSE_QUESTIONS_BANK[courseId]) ? COURSE_QUESTIONS_BANK[courseId] : null;

    const questionsHtml = prog.reviewData.map((rawItem, idx) => {
        // Self-heal corrupted or undefined entries from question bank
        const fallbackQ = bankCourse && bankCourse[idx] ? bankCourse[idx] : null;

        let questionText = rawItem.question || rawItem.q;
        if (!questionText || questionText === 'undefined' || questionText.includes('undefined')) {
            questionText = fallbackQ ? (fallbackQ.question || fallbackQ.q) : `Question ${idx + 1}`;
        }

        let options = Array.isArray(rawItem.options) && rawItem.options.length > 0
            ? rawItem.options
            : (fallbackQ ? fallbackQ.options : ["Option A", "Option B", "Option C", "Option D"]);

        let answerIdx = typeof rawItem.answer === 'number'
            ? rawItem.answer
            : (typeof rawItem.correctAnswer === 'number' ? rawItem.correctAnswer : (fallbackQ ? fallbackQ.answer : 0));

        let correctOptionText = options[answerIdx] || rawItem.correctOption || (fallbackQ ? fallbackQ.options[fallbackQ.answer] : 'Correct Option');
        if (!correctOptionText || correctOptionText === 'undefined') {
            correctOptionText = options[0] || 'Correct Option';
        }

        let userIdx = typeof rawItem.userAnswer === 'number'
            ? rawItem.userAnswer
            : (typeof rawItem.selectedAnswer === 'number' ? rawItem.selectedAnswer : undefined);

        let userSelectedText = 'Not answered';
        if (userIdx !== undefined && options[userIdx]) {
            userSelectedText = options[userIdx];
        } else if (rawItem.selectedOption && rawItem.selectedOption !== 'Not Answered' && rawItem.selectedOption !== 'Not answered' && rawItem.selectedOption !== 'undefined') {
            userSelectedText = rawItem.selectedOption;
        } else if (rawItem.selectedText && rawItem.selectedText !== 'Not answered' && rawItem.selectedText !== 'undefined') {
            userSelectedText = rawItem.selectedText;
        }

        const isAnswered = userSelectedText !== 'Not answered' && userSelectedText !== 'undefined';
        const isCorrect = isAnswered && (rawItem.isCorrect !== undefined ? Boolean(rawItem.isCorrect) : (userSelectedText.trim() === correctOptionText.trim()));

        // Status styling
        const statusText = isCorrect ? 'Correct' : (!isAnswered ? 'Unanswered' : 'Incorrect');
        const statusColor = isCorrect ? '#059669' : (!isAnswered ? '#d97706' : '#dc2626');
        const statusBg = isCorrect ? 'rgba(16,185,129,0.12)' : (!isAnswered ? 'rgba(245,158,11,0.12)' : 'rgba(239,68,68,0.12)');
        const statusBorder = isCorrect ? 'rgba(16,185,129,0.3)' : (!isAnswered ? 'rgba(245,158,11,0.3)' : 'rgba(239,68,68,0.3)');
        const statusIcon = isCorrect ? '<i class="fas fa-check-circle"></i>' : (!isAnswered ? '<i class="fas fa-exclamation-circle"></i>' : '<i class="fas fa-times-circle"></i>');

        let explanation = rawItem.explanation;
        if (!explanation || explanation === 'undefined' || explanation.includes('undefined')) {
            explanation = fallbackQ ? fallbackQ.explanation : `The correct answer is "${correctOptionText}". This option accurately answers the question.`;
        }

        const showSeparateCorrect = !isCorrect;

        return `
            <div style="background:var(--bg-panel, #ffffff); border:1px solid var(--glass-border, rgba(13,27,61,0.1)); padding:26px 24px; border-radius:18px; margin-bottom:20px; box-shadow:0 8px 24px rgba(15,23,42,0.04); text-align:left;">
                <!-- Question Header -->
                <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px; margin-bottom:18px;">
                    <h3 style="font-weight:700; font-size:17px; line-height:1.5; color:var(--text-main, #0f172a); margin:0;">
                        ${idx + 1}. ${questionText}
                    </h3>
                    <span style="display:inline-flex; align-items:center; gap:6px; background:${statusBg}; color:${statusColor}; border:1px solid ${statusBorder}; padding:6px 14px; border-radius:999px; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.04em; flex-shrink:0;">
                        ${statusIcon} ${statusText}
                    </span>
                </div>

                <!-- All Options with Selected & Correct Badges -->
                <div style="margin-bottom:18px;">
                    <small style="display:block; font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-muted, #64748b); margin-bottom:10px;">
                        <i class="fas fa-list-ul"></i> Options:
                    </small>
                    <div style="display:flex; flex-direction:column; gap:8px;">
                        ${options.map((opt, oi) => {
                            const isThisCorrect = (oi === answerIdx) || (opt.trim() === correctOptionText.trim());
                            const isThisSelected = isAnswered && ((userIdx !== undefined && oi === userIdx) || (opt.trim() === userSelectedText.trim()));

                            let optBorder = 'rgba(13, 27, 61, 0.1)';
                            let optBg = '#f8fafc';
                            let optColor = 'var(--text-main, #0f172a)';
                            let badge = '';

                            if (isThisCorrect && isThisSelected) {
                                optBorder = '#10b981';
                                optBg = 'rgba(16, 185, 129, 0.08)';
                                badge = `<span style="font-size:11px; font-weight:700; color:#059669; background:rgba(16,185,129,0.18); padding:3px 10px; border-radius:6px; display:inline-flex; align-items:center; gap:4px;"><i class="fas fa-check"></i> Your Answer (Correct)</span>`;
                            } else if (isThisCorrect) {
                                optBorder = '#10b981';
                                optBg = 'rgba(16, 185, 129, 0.06)';
                                badge = `<span style="font-size:11px; font-weight:700; color:#059669; background:rgba(16,185,129,0.18); padding:3px 10px; border-radius:6px; display:inline-flex; align-items:center; gap:4px;"><i class="fas fa-check-circle"></i> Correct Option</span>`;
                            } else if (isThisSelected) {
                                optBorder = '#ef4444';
                                optBg = 'rgba(239, 68, 68, 0.06)';
                                badge = `<span style="font-size:11px; font-weight:700; color:#dc2626; background:rgba(239,68,68,0.14); padding:3px 10px; border-radius:6px; display:inline-flex; align-items:center; gap:4px;"><i class="fas fa-times"></i> Your Answer (Incorrect)</span>`;
                            } else {
                                optColor = '#64748b';
                            }

                            const letter = ['A', 'B', 'C', 'D', 'E', 'F'][oi] || (oi + 1);
                            return `
                                <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 16px; border-radius:10px; border:1.5px solid ${optBorder}; background:${optBg}; gap:12px; flex-wrap:wrap;">
                                    <div style="display:flex; align-items:center; gap:10px;">
                                        <span style="display:inline-flex; align-items:center; justify-content:center; width:26px; height:26px; border-radius:6px; font-size:12px; font-weight:700; background:${isThisCorrect ? '#10b981' : (isThisSelected ? '#ef4444' : '#e2e8f0')}; color:${isThisCorrect || isThisSelected ? '#ffffff' : '#64748b'}; flex-shrink:0;">
                                            ${letter}
                                        </span>
                                        <span style="font-size:14px; font-weight:${isThisCorrect || isThisSelected ? '600' : '400'}; color:${optColor};">
                                            ${opt}
                                        </span>
                                    </div>
                                    ${badge}
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                <!-- Explanation Box -->
                <div style="background:rgba(37,99,235,0.05); border:1px solid rgba(37,99,235,0.12); border-left:4px solid var(--primary-accent, #2563eb); border-radius:12px; padding:14px 18px;">
                    <strong style="display:flex; align-items:center; gap:6px; font-size:13px; text-transform:uppercase; letter-spacing:0.04em; color:var(--primary-accent, #2563eb); margin-bottom:6px;">
                        <i class="fas fa-lightbulb"></i> Explanation
                    </strong>
                    <div style="font-size:14px; line-height:1.65; color:var(--text-main, #0f172a);">
                        ${explanation}
                    </div>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = `
        <div class="view-header" style="margin-bottom:30px;">
            <h2 style="font-size:30px;">Answer Review</h2>
            <p style="color:var(--text-muted);">${course ? course.title : prog.title || courseId} — Best Score: <strong>${prog.score}%</strong></p>
            <button class="btn btn-secondary" onclick="openCourseDetails('${courseId}')" style="margin-top:16px;">
                <i class="fas fa-arrow-left"></i> Back to Course
            </button>
        </div>
        <div style="max-width:860px; margin:auto;">
            ${questionsHtml}
        </div>
    `;
    navigateTo('result');
}

// ===============================
// CERTIFICATE GENERATION
// ===============================

async function claimCertificate(courseId) {
    return generateCertificate(courseId);
}
window.claimCertificate = claimCertificate;

async function generateCertificate(courseId) {
    const course = coursesData.find(c => c.id === courseId || (c.id && c.id.toLowerCase() === (courseId || '').toLowerCase()));
    const stats  = calculateCourseProgress(courseId);

    // Strict Client-Side Verification: Requires 100% Complete Course Completion
    if (!stats.isCompleted) {
        alert("Certificate unavailable. Please complete the entire course before claiming your certificate.");
        return;
    }

    const token = localStorage.getItem('learnMeAuthToken');
    if (!token) {
        if (confirm("Please sign in or create an account to verify your complete course completion and claim your official certificate.")) {
            openAuthModal('login');
        }
        return;
    }

    let certData = null;
    try {
        const res = await fetch(`${API_BASE}/certificates/generate`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ courseId })
        });
        const data = await res.json();

        if (!res.ok) {
            // Anti-bypass alert: Backend rejected certificate generation
            alert(data.message || "Certificate unavailable. Please complete the entire course before claiming your certificate.");
            return;
        }

        certData = {
            certificateId: data.certificateId,
            userId: data.userId,
            studentName: data.userName || appState.studentName || 'Learner',
            courseId: data.courseId,
            courseName: data.courseName || (course ? course.title : courseId),
            score: data.score || stats.quizScore || 100,
            issueDate: data.createdAt ? new Date(data.createdAt).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
            status: 'valid'
        };
    } catch (e) {
        console.error('Certificate claim network error:', e);
        alert("Network error connecting to certificate service. Please try again.");
        return;
    }

    if (certData) {
        const localCerts = getStoredCertificates();
        if (!localCerts.find(c => c.courseId === courseId || c.certificateId === certData.certificateId)) {
            localCerts.push(certData);
            saveStoredCertificates(localCerts);
            if (appState.currentView === 'dashboard') renderDashboard();
        }
        await generateLocalPdf(certData, appState.progress[courseId]);
    }
}
window.generateCertificate = generateCertificate;


async function executeCertificateDownload(courseId, certificateId) {
    const course = coursesData.find(c => c.id === courseId);
    const prog   = appState.progress[courseId];
    let studentName = appState.studentName || 'Learner';

    const token = localStorage.getItem('learnMeAuthToken');
    if (!token) {
        const certData = buildCertificateRecord(courseId, prog?.score || 100, studentName || 'Learner');
        if (certData) {
            certData.certificateId = certificateId || certData.certificateId;
            await generateLocalPdf(certData, prog);
        }
        return;
    }

    let certRecordFromBackend = null;
    try {
        const response = await fetch(`${API_BASE}/certificates/download/${certificateId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Unauthorized certificate download attempt.');
        }
        
        if (!data.authorized) throw new Error('Not authorized to download this certificate.');
        
        certRecordFromBackend = data.certificate;
    } catch (err) {
        console.warn('Backend download verification notice:', err.message);
        const certData = buildCertificateRecord(courseId, prog?.score || 100, studentName || 'Learner');
        if (certData) {
            certData.certificateId = certificateId || certData.certificateId;
            await generateLocalPdf(certData, prog);
        }
        return;
    }

    const certificateRecord = {
        certificateId: certRecordFromBackend.certificateId,
        studentName: certRecordFromBackend.userName || studentName,
        courseName: certRecordFromBackend.courseName || course?.title || courseId,
        score: certRecordFromBackend.score || prog?.score || 100,
        issueDate: certRecordFromBackend.issueDate || certRecordFromBackend.completionDate || new Date().toISOString()
    };

    if (typeof unlockPaidCertificateView === 'function') {
        unlockPaidCertificateView(certificateRecord.certificateId);
    }

    await generateLocalPdf(certificateRecord, prog);
}

async function generateLocalPdf(certificateRecord, prog) {
    document.getElementById('cert-student-name').textContent = certificateRecord.studentName;
    document.getElementById('cert-course-name').textContent  = certificateRecord.courseName;
    document.getElementById('cert-score').textContent        = `${prog?.correct ?? 10} / ${prog?.total ?? 10}`;
    document.getElementById('cert-percentage').textContent   = (certificateRecord.score || 100) + '%';
    document.getElementById('cert-date').textContent         = new Date(certificateRecord.issueDate).toLocaleDateString('en-GB', { day:'2-digit', month:'long', year:'numeric' });
    document.getElementById('cert-id').textContent           = certificateRecord.certificateId;
    
    fitCertificateText('cert-student-name', certificateRecord.studentName, 29, 20, 36);
    fitCertificateText('cert-course-name', certificateRecord.courseName, 22, 16, 48);

    const certElement = document.getElementById('certificate-template');
    certElement.style.left = '0px';
    let generatedPdf = null;
    const fileName = `LearnMe_Certificate_${certificateRecord.studentName.replace(/[^a-z0-9]+/gi, '')}_${certificateRecord.courseName.replace(/[^a-z0-9]+/gi, '')}.pdf`;

    try {
        if (!window.html2canvas || !window.jspdf || !window.jspdf.jsPDF) {
            throw new Error('Certificate download libraries are unavailable.');
        }
        await document.fonts.ready;
        await new Promise(resolve => setTimeout(resolve, 200));
        const canvas  = await html2canvas(certElement, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
        const imgData = canvas.toDataURL('image/png');
        const certificateWidth = certElement.offsetWidth;
        const certificateHeight = certElement.offsetHeight;
        generatedPdf = new window.jspdf.jsPDF('landscape', 'px', [certificateWidth, certificateHeight]);
        generatedPdf.addImage(imgData, 'PNG', 0, 0, certificateWidth, certificateHeight);
        generatedPdf.save(fileName);
    } catch (err) {
        console.error('Certificate generation failed:', err);
        alert(`Certificate download error: ${err.message}`);
    } finally {
        certElement.style.left = '-9999px';
    }
}

// Anti-copy deterrents
document.addEventListener('contextmenu', e => {
    if (e.target.closest('#view-course-details, #view-assessment, #certificate-preview-modal')) {
        e.preventDefault();
    }
});

document.addEventListener('keydown', e => {
    // Secret Admin Toggle (Alt + A)
    if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        const secretAdminNav = document.getElementById('secret-admin-nav');
        if (secretAdminNav) {
            const isCurrentlyHidden = secretAdminNav.style.display === 'none' || !secretAdminNav.style.display;
            secretAdminNav.style.display = isCurrentlyHidden ? 'inline-block' : 'none';
        }
    }

    if ((e.ctrlKey || e.metaKey) && ['c', 's', 'u'].includes(e.key.toLowerCase())) {
        if (document.querySelector('#view-course-details.active, #view-assessment.active, #view-course-details.active-view, #view-assessment.active-view')) {
            e.preventDefault();
        }
    }
});

async function loadRemoteCertificates() {
    const token = localStorage.getItem('learnMeAuthToken');
    if (!token) return;
    try {
        const response = await fetch(`${CERTIFICATES_API_URL}/my-certificates`, { headers: { Authorization: `Bearer ${token}` } });
        if (!response.ok) return;
        const serverCertificates = (await response.json()).map(normalizeCertificateRecord);
        const localCertificates = getStoredCertificates();
        const merged = [...serverCertificates, ...localCertificates.filter(local => !serverCertificates.some(server => server.certificateId === local.certificateId))];
        saveStoredCertificates(merged);
    } catch (error) {
        console.warn('Using locally stored certificates:', error.message);
    }
}

function normalizeCertificateRecord(record) {
    return {
        ...record,
        studentName: record.studentName || record.userName,
        issueDate: record.issueDate || record.completionDate || record.issuedAt,
        score: record.score ?? record.percentage,
        percentage: record.percentage ?? record.score,
        verificationUrl: record.verificationUrl || `verify.html?certificate=${encodeURIComponent(record.certificateId)}`
    };
}

function showCertificatePreview(certificateRecord, courseId) {
    const template = document.getElementById('certificate-template');
    const preview = document.getElementById('certificate-preview-content');
    const modal = document.getElementById('certificate-preview-modal');
    if (!template || !preview || !modal) return;
    preview.replaceChildren(template);
    modal.hidden = false;
    modal.dataset.courseId = courseId;
    document.getElementById('certificate-preview-verify').href = `verify.html?certificate=${encodeURIComponent(certificateRecord.certificateId)}`;
}

function closeCertificatePreview() {
    const modal = document.getElementById('certificate-preview-modal');
    const template = document.getElementById('certificate-template');
    if (modal) modal.hidden = true;
    if (template) {
        document.body.appendChild(template);
        template.style.left = '-9999px';
    }
}

function fitCertificateText(elementId, value, defaultSize, minimumSize, threshold) {
    const element = document.getElementById(elementId);
    if (!element) return;
    const length = String(value).length;
    const size = length > threshold ? Math.max(minimumSize, defaultSize - Math.ceil((length - threshold) / 8)) : defaultSize;
    element.style.fontSize = `${size}px`;
}

function downloadPreviewCertificate() {
    const modal = document.getElementById('certificate-preview-modal');
    if (modal?.dataset.courseId) generateCertificate(modal.dataset.courseId);
}

// ===============================
// DASHBOARD
// ===============================

function getStoredCertificates() {
    try {
        const records = JSON.parse(localStorage.getItem('learnMeCertificates') || '[]');
        return Array.isArray(records) ? records.map(normalizeCertificateRecord) : [];
    } catch (error) {
        return [];
    }
}

function saveStoredCertificates(records) {
    localStorage.setItem('learnMeCertificates', JSON.stringify(records));
}

function buildCertificateRecord(courseId, score, studentName) {
    const course = coursesData.find(item => item.id === courseId);
    const progress = appState.progress[courseId];
    if (!course && !progress) return null;

    const certificateKey = course ? course.id : courseId;
    const randomId = window.crypto?.randomUUID
        ? window.crypto.randomUUID().split('-')[0].toUpperCase()
        : Math.random().toString(36).slice(2, 8).toUpperCase();
    const certificateId = `LM-${certificateKey.toUpperCase()}-${new Date().getFullYear()}-${randomId}`;
    let userId = 'guest';
    try {
        userId = JSON.parse(localStorage.getItem('learnMeCurrentUser') || 'null')?.id || 'guest';
    } catch (error) {
        userId = 'guest';
    }

    return {
        certificateId,
        userId,
        studentName: studentName.trim(),
        courseId,
        courseName: course ? course.title : progress.title,
        score,
        rawScore: progress.correct ?? null,
        totalQuestions: progress.total ?? null,
        percentage: score,
        issueDate: new Date().toISOString().slice(0, 10),
        status: 'valid',
        verificationUrl: `verify.html?certificate=${encodeURIComponent(certificateId)}`
    };
}

function renderDashboard() {
    const container = document.getElementById('dashboard-container');
    let totalAttempted = 0;
    let enrolledCount = 0;
    let enrolledHTML = '';
    let recentHTML = '';
    const userCertificates = getStoredCertificates();
    const certificates = userCertificates.length;

    coursesData.forEach(c => {
        const prog = appState.progress[c.id];
        const isEnrolled = Boolean((appState.enrollments && appState.enrollments[c.id]) || prog);
        const stats = calculateCourseProgress(c.id);

        if (isEnrolled) {
            enrolledCount++;
            let statusLabel;
            if (stats.isCompleted) {
                statusLabel = `<span style="background:var(--success); color:white; padding:4px 12px; border-radius:20px; font-size:12px; font-weight:700;">Completed (100%)</span>`;
            } else if (stats.overallPercentage > 0) {
                statusLabel = `<span style="background:#f59e0b; color:white; padding:4px 12px; border-radius:20px; font-size:12px; font-weight:700;">In Progress (${stats.overallPercentage}%)</span>`;
            } else {
                statusLabel = `<span style="background:rgba(37,99,235,0.12); color:var(--primary-accent); padding:4px 12px; border-radius:20px; font-size:12px; font-weight:700;">Enrolled (0%)</span>`;
            }

            enrolledHTML += `
                <div style="background:rgba(13,27,61,0.03); padding:18px 22px; border-radius:14px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center; border:1px solid var(--glass-border); flex-wrap:wrap; gap:12px;">
                    <div style="display:flex; align-items:center; gap:16px;">
                        <div style="width:42px; height:42px; border-radius:10px; background:rgba(37,99,235,0.08); color:var(--primary-accent); display:flex; align-items:center; justify-content:center; font-size:20px;">
                            <i class="${c.iconType || 'fas'} ${c.icon}"></i>
                        </div>
                        <div>
                            <h4 style="font-size:16px; font-weight:700; margin-bottom:4px; color:var(--text-main);">${c.title}</h4>
                            <div style="display:flex; align-items:center; gap:10px; font-size:13px; color:var(--text-muted); flex-wrap:wrap;">
                                <span><i class="fas fa-clock"></i> ${c.duration}</span>
                                <span>•</span>
                                <span>Modules: ${stats.completedModulesCount}/${stats.totalModules}</span>
                                <span>•</span>
                                <span>Quiz: ${stats.quizPassed ? 'Passed' : 'Pending'}</span>
                                <span>•</span>
                                <span>${statusLabel}</span>
                            </div>
                        </div>
                    </div>
                    <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                        <button class="btn btn-secondary" onclick="openCourseDetails('${c.id}')" style="padding:8px 16px; font-size:13px;">
                            <i class="fas fa-book-open"></i> Study (${stats.completedModulesCount}/${stats.totalModules})
                        </button>
                        <a class="btn btn-primary" href="quize.html?course=${c.id}" style="padding:8px 16px; font-size:13px; text-decoration:none;">
                            <i class="fas fa-bolt"></i> Quiz
                        </a>
                        ${stats.isCompleted ? `
                            <button class="btn btn-success" onclick="claimCertificate('${c.id}')" style="padding:8px 16px; font-size:13px;" title="Claim Certificate">
                                <i class="fas fa-certificate"></i> Claim Cert
                            </button>
                        ` : `
                            <button class="btn btn-secondary" disabled style="padding:8px 16px; font-size:13px; opacity:0.6; cursor:not-allowed;" title="Complete all modules and quiz to unlock">
                                <i class="fas fa-lock"></i> Locked
                            </button>
                        `}
                    </div>
                </div>
            `;
        }

        if (prog) {
            totalAttempted++;
            const badge = prog.passed
                ? `<span style="background:var(--success); color:white; padding:4px 12px; border-radius:20px; font-size:12px; font-weight:700;">Quiz Passed (${prog.score}%)</span>`
                : `<span style="background:var(--danger);   color:white; padding:4px 12px; border-radius:20px; font-size:12px; font-weight:700;">Quiz Failed (${prog.score}%)</span>`;

            recentHTML += `
                <div style="background:rgba(13,27,61,0.04); padding:16px 20px; border-radius:12px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center; border:1px solid var(--glass-border);">
                    <div>
                        <h4 style="font-size:15px; font-weight:700; margin-bottom:3px;">${c.title}</h4>
                        <p style="font-size:13px; color:var(--text-muted);">Quiz Score: ${prog.score}% • Modules: ${stats.completedModulesCount}/${stats.totalModules} • Course Progress: ${stats.overallPercentage}%</p>
                    </div>
                    <div style="display:flex; align-items:center; gap:10px;">
                        ${badge}
                        ${stats.isCompleted
                            ? `<button class="btn btn-success" onclick="claimCertificate('${c.id}')" style="padding:6px 14px; font-size:13px;"><i class="fas fa-certificate"></i> Cert</button>`
                            : `<button class="btn btn-secondary" onclick="openCourseDetails('${c.id}')" style="padding:6px 14px; font-size:13px;" title="Complete remaining course content"><i class="fas fa-book-open"></i> Complete</button>`
                        }
                    </div>
                </div>
            `;
        }
    });

    if (!enrolledHTML) {
        enrolledHTML = `
            <div class="empty-state-card">
                <div class="empty-state-icon"><i class="fas fa-graduation-cap"></i></div>
                <h3>No Active Enrollments</h3>
                <p>You haven't enrolled in any learning tracks yet. All 20 tracks are available with free open enrollment.</p>
                <button class="btn btn-primary" onclick="navigateTo('courses')">
                    <i class="fas fa-book-open"></i> Browse All Courses
                </button>
            </div>
        `;
    }

    if (!recentHTML) {
        recentHTML = `
            <div class="empty-state-card">
                <div class="empty-state-icon"><i class="fas fa-tasks"></i></div>
                <h3>No Assessments Taken Yet</h3>
                <p>Study course modules and take quizzes to test your knowledge and unlock your certificate.</p>
                <button class="btn btn-secondary" onclick="navigateTo('courses')">
                    <i class="fas fa-arrow-right"></i> Choose a Course
                </button>
            </div>
        `;
    }

    const certificateList = userCertificates.length
        ? userCertificates.map(cert => `
            <div style="background:rgba(13,27,61,0.04); border:1px solid var(--glass-border); border-radius:12px; padding:16px 18px; display:flex; justify-content:space-between; align-items:center; gap:12px; margin-bottom:12px; flex-wrap:wrap;">
                <div>
                    <strong style="display:block; margin-bottom:4px;">${cert.courseName}</strong>
                    <small style="color:var(--text-muted);">ID: ${cert.certificateId} • ${cert.score}% • ${new Date(cert.issueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</small>
                </div>
                <div style="display:flex; gap:8px; flex-wrap:wrap;">
                    <a class="btn btn-secondary" href="verify.html?certificate=${encodeURIComponent(cert.certificateId)}" style="padding:8px 14px; font-size:13px; text-decoration:none;">Verify</a>
                    <button class="btn btn-success" onclick="generateCertificate('${cert.courseId}')" style="padding:8px 14px; font-size:13px;">Download</button>
                </div>
            </div>
        `).join('')
        : `
            <div class="empty-state-card">
                <div class="empty-state-icon"><i class="fas fa-award"></i></div>
                <h3>No Certificates Earned Yet</h3>
                <p>Complete 100% of all required lessons, modules, and quizzes (with score $\\ge$ 70%) to claim accredited certificates.</p>
                <button class="btn btn-secondary" onclick="navigateTo('courses')">
                    <i class="fas fa-book-open"></i> Start Learning
                </button>
            </div>
        `;

    const nameSection = appState.studentName
        ? `<p style="color:var(--text-muted); margin-top:8px; font-size:14px;">Welcome back, <strong>${appState.studentName}</strong>!
           <button onclick="changeStudentName()" style="background:none;border:none;color:var(--primary-accent);cursor:pointer;font-size:13px;text-decoration:underline;">(change)</button></p>`
        : `<button class="btn btn-secondary" onclick="changeStudentName()" style="margin-top:12px; font-size:14px; padding:10px 20px;"><i class="fas fa-user-edit"></i> Set Your Name for Certificates</button>`;

    container.innerHTML = `
        <div class="view-header" style="margin-bottom:32px;">
            <h2 style="color:var(--primary-accent);">Student Dashboard</h2>
            <p>Track your enrollments, quiz scores, and verified certifications.</p>
            ${nameSection}
        </div>

        <div class="dashboard-stats-grid">
            <div class="dashboard-stat-card">
                <i class="fas fa-user-check" style="color:var(--primary-accent);"></i>
                <h3>${enrolledCount}</h3>
                <p>Enrolled Tracks</p>
            </div>
            <div class="dashboard-stat-card">
                <i class="fas fa-award" style="color:#f59e0b;"></i>
                <h3>${certificates}</h3>
                <p>Certificates Earned</p>
            </div>
            <div class="dashboard-stat-card">
                <i class="fas fa-book-open" style="color:var(--primary-accent);"></i>
                <h3>${totalAttempted}</h3>
                <p>Assessments Taken</p>
            </div>
            <div class="dashboard-stat-card">
                <i class="fas fa-graduation-cap" style="color:var(--success);"></i>
                <h3>${coursesData.length}</h3>
                <p>Catalog Courses</p>
            </div>
        </div>

        <!-- Enrolled Courses -->
        <div class="dashboard-panel">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:10px;">
                <h3 style="font-size:20px; color:var(--primary-accent); margin:0;">
                    <i class="fas fa-laptop-code"></i> My Enrolled Tracks
                </h3>
                <a href="quize.html" class="btn btn-secondary" style="font-size:13px; padding:6px 14px; text-decoration:none;">
                    <i class="fas fa-bolt"></i> Open Quiz Center
                </a>
            </div>
            ${enrolledHTML}
        </div>

        <div class="dashboard-panel">
            <h3 style="font-size:20px; margin-bottom:20px; color:var(--primary-accent);">
                <i class="fas fa-history"></i> Assessment History
            </h3>
            ${recentHTML}
        </div>

        <div id="certificates-section" class="dashboard-panel">
            <h3 style="font-size:20px; margin-bottom:20px; color:var(--primary-accent);">
                <i class="fas fa-certificate"></i> My Certificates
            </h3>
            ${certificateList}
        </div>
    `;
}

function changeStudentName() {
    const newName = prompt('Enter your full name for certificates:', appState.studentName || '');
    if (newName !== null && newName.trim()) {
        saveStudentName(newName);
        renderDashboard();
    }
}

// ===============================
// BOOT
// ===============================
document.addEventListener('DOMContentLoaded', initApp);
/* ========================================
   LEARN ME - AUTHENTICATION SYSTEM
======================================== */

// Check user when website loads
document.addEventListener("DOMContentLoaded", function () {

    const loggedUser = JSON.parse(
        localStorage.getItem("learnMeCurrentUser")
    );

    if (loggedUser) {
        updateUserUI(loggedUser);
    }

    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");

    if (loginForm) {
        loginForm.addEventListener("submit", loginUser);
    }

    if (signupForm) {
        signupForm.addEventListener("submit", signupUser);
    }

});


/* OPEN AUTH MODAL */
let isSignUpMode = false;

function openAuthModal(mode = 'login') {
    isSignUpMode = (mode === 'signup' || mode === 'register');
    updateAuthModalUI();
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.style.display = 'flex';
        modal.hidden = false;
        modal.classList.add('show');
    }
}

function closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.style.display = 'none';
        modal.hidden = true;
        modal.classList.remove('show');
    }
}

function toggleAuthMode() {
    isSignUpMode = !isSignUpMode;
    const errorEl = document.getElementById('auth-error-msg');
    if (errorEl) errorEl.innerHTML = '';
    updateAuthModalUI();
}

function updateAuthModalUI() {
    const title = document.getElementById('auth-title');
    const nameGroup = document.getElementById('auth-name-group');
    const submitBtn = document.getElementById('auth-submit-btn');
    const toggleMsg = document.getElementById('auth-toggle-msg');
    const toggleLink = document.getElementById('auth-toggle-link');

    if (isSignUpMode) {
        if (title) title.textContent = 'Student Sign Up';
        if (nameGroup) nameGroup.style.display = 'block';
        if (submitBtn) submitBtn.textContent = 'Create Account';
        if (toggleMsg) toggleMsg.textContent = 'Already have an account?';
        if (toggleLink) toggleLink.textContent = 'Sign In';
    } else {
        if (title) title.textContent = 'Student Sign In';
        if (nameGroup) nameGroup.style.display = 'none';
        if (submitBtn) submitBtn.textContent = 'Sign In';
        if (toggleMsg) toggleMsg.textContent = "Don't have an account?";
        if (toggleLink) toggleLink.textContent = 'Sign Up';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const studentForm = document.getElementById('student-auth-form');
    if (studentForm) {
        studentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('student-auth-email').value.trim();
            const password = document.getElementById('student-auth-password').value;
            const name = document.getElementById('student-auth-name')?.value.trim();
            const errorEl = document.getElementById('auth-error-msg');
            if (errorEl) errorEl.innerHTML = '';

            const hp = document.getElementById('student-auth-hp')?.value || '';
            if (hp) {
                console.warn('Bot submission blocked via honeypot trap.');
                return;
            }

            const endpoint = isSignUpMode ? `${AUTH_API_URL}/register` : `${AUTH_API_URL}/login`;
            const payload = isSignUpMode ? { name, email, password, website_hp: hp } : { email, password, website_hp: hp };

            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.message || 'Authentication failed.');

                localStorage.setItem('learnMeAuthToken', data.token);
                localStorage.setItem('learnMeCurrentUser', JSON.stringify(data.user));
                saveStudentName(data.user.name);
                updateUserUI(data.user);
                closeAuthModal();
                if (data.message && data.message.includes('Owner')) {
                    showToast(data.message, 'info');
                } else {
                    showToast(`Welcome, ${data.user.name}! 👋`, 'success');
                }
                navigateTo('dashboard');
            } catch (err) {
                if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError') || err.message.includes('Network Error')) {
                    console.warn(`Backend unavailable; using local ${isSignUpMode ? 'signup' : 'login'}:`, err.message);
                    
                    let users = JSON.parse(localStorage.getItem("learnMeUsers")) || [];
                    if (isSignUpMode) {
                        if (users.find(u => u.email === email)) {
                            if (errorEl) {
                                errorEl.innerHTML = `An account with this email already exists. <a href="#" id="local-switch-signin" style="color:var(--primary-accent, #2563eb); font-weight:700; text-decoration:underline;">Sign In here &rarr;</a>`;
                                document.getElementById('local-switch-signin')?.addEventListener('click', (ev) => { ev.preventDefault(); toggleAuthMode(); });
                            }
                            return;
                        }
                        const newUser = { id: "LM-" + Date.now(), name: name || 'Student', email, password, joinedDate: new Date().toLocaleDateString() };
                        users.push(newUser);
                        localStorage.setItem("learnMeUsers", JSON.stringify(users));
                        localStorage.setItem('learnMeCurrentUser', JSON.stringify(newUser));
                        saveStudentName(newUser.name);
                        updateUserUI(newUser);
                        closeAuthModal();
                        showToast(`Welcome to Learn Me, ${newUser.name}! 🎉`, 'success');
                        navigateTo('dashboard');
                    } else {
                        const user = users.find(u => u.email === email && u.password === password);
                        if (!user) {
                            if (errorEl) errorEl.textContent = "Invalid email or password.";
                            return;
                        }
                        localStorage.setItem('learnMeCurrentUser', JSON.stringify(user));
                        saveStudentName(user.name);
                        updateUserUI(user);
                        closeAuthModal();
                        showToast(`Welcome back, ${user.name}! 👋`, 'success');
                        navigateTo('dashboard');
                    }
                } else {
                    if (errorEl) {
                        if (err.message.includes('already exists')) {
                            errorEl.innerHTML = `${err.message} <a href="#" id="auth-inline-switch" style="color:var(--primary-accent, #2563eb); font-weight:700; text-decoration:underline; display:inline-block; margin-top:4px;">Sign In with your password &rarr;</a>`;
                            const switchLink = document.getElementById('auth-inline-switch');
                            if (switchLink) {
                                switchLink.addEventListener('click', (ev) => {
                                    ev.preventDefault();
                                    toggleAuthMode();
                                });
                            }
                        } else {
                            errorEl.textContent = err.message;
                        }
                    }
                }
            }
        });
    }
});


/* SIGNUP */

async function signupUser(event) {

    event.preventDefault();

    const name =
        document
            .getElementById("signup-name")
            .value
            .trim();

    const email =
        document
            .getElementById("signup-email")
            .value
            .trim()
            .toLowerCase();

    const password =
        document
            .getElementById("signup-password")
            .value;

    try {
        const response = await fetch(`${AUTH_API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        if (response.ok) {
            const result = await response.json();
            localStorage.setItem('learnMeAuthToken', result.token);
            localStorage.setItem('learnMeCurrentUser', JSON.stringify(result.user));
            saveStudentName(result.user.name);
            updateUserUI(result.user);
            closeAuth();
            navigateTo('dashboard');
            return;
        }
    } catch (error) {
        console.warn('Backend unavailable; using local signup:', error.message);
    }


    let users =
        JSON.parse(
            localStorage.getItem("learnMeUsers")
        ) || [];


    // Check existing user
    const userExists =
        users.find(user =>
            user.email === email
        );


    if (userExists) {

        alert(
            "An account with this email already exists."
        );

        return;
    }


    const newUser = {
        id: "LM-" + Date.now(),
        name: name,
        email: email,
        password: password,
        joinedDate: new Date().toLocaleDateString()
    };


    users.push(newUser);


    localStorage.setItem(
        "learnMeUsers",
        JSON.stringify(users)
    );


    localStorage.setItem(
        "learnMeCurrentUser",
        JSON.stringify(newUser)
    );


    // Save student name for certificate
    saveStudentName(name);


    updateUserUI(newUser);


    closeAuth();


    alert(
        "Welcome to Learn Me, " + name + "! 🎉"
    );


    navigateTo("dashboard");

}


/* LOGIN */

async function loginUser(event) {

    event.preventDefault();

    const email =
        document
            .getElementById("login-email")
            .value
            .trim()
            .toLowerCase();

    const password =
        document
            .getElementById("login-password")
            .value;

    try {
        const response = await fetch(`${AUTH_API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        if (response.ok) {
            const result = await response.json();
            localStorage.setItem('learnMeAuthToken', result.token);
            localStorage.setItem('learnMeCurrentUser', JSON.stringify(result.user));
            saveStudentName(result.user.name);
            updateUserUI(result.user);
            closeAuth();
            await loadRemoteCertificates();
            navigateTo('dashboard');
            return;
        }
    } catch (error) {
        console.warn('Backend unavailable; using local login:', error.message);
    }


    const users =
        JSON.parse(
            localStorage.getItem("learnMeUsers")
        ) || [];


    const user =
        users.find(
            user =>
                user.email === email &&
                user.password === password
        );


    if (!user) {

        alert(
            "Invalid email or password."
        );

        return;
    }


    localStorage.setItem(
        "learnMeCurrentUser",
        JSON.stringify(user)
    );


    // Save student name
    saveStudentName(user.name);


    updateUserUI(user);


    closeAuth();


    alert(
        "Welcome back, " + user.name + "! 👋"
    );


    navigateTo("dashboard");

}


/* UPDATE HEADER */

function updateUserUI(user) {
    const authSec = document.getElementById("auth-section");
    const userSec = document.getElementById("user-section");

    if (authSec) authSec.style.display = "none";
    if (userSec) userSec.style.display = "flex";

    const name = user ? user.name : (appState.studentName || 'Learner');
    const email = user ? user.email : 'Self-Paced Student';

    const headerUserName = document.getElementById("header-user-name");
    if (headerUserName) headerUserName.textContent = name.split(" ")[0];
    const menuUserName = document.getElementById("menu-user-name");
    if (menuUserName) menuUserName.textContent = name;
    const menuUserEmail = document.getElementById("menu-user-email");
    if (menuUserEmail) menuUserEmail.textContent = email;
    const userAvatar = document.getElementById("user-avatar");
    if (userAvatar) userAvatar.textContent = name.charAt(0).toUpperCase();
}


/* LOGOUT */

async function logoutUser() {

    const confirmLogout =
        confirm("Are you sure you want to logout?");


    if (!confirmLogout) {
        return;
    }

    const token = localStorage.getItem('learnMeAuthToken');
    if (token) {
        fetch(`${AUTH_API_URL}/logout`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
        localStorage.removeItem('learnMeAuthToken');
    }


    localStorage.removeItem(
        "learnMeCurrentUser"
    );


    document
        .getElementById("auth-section")
        .style.display = "flex";


    document
        .getElementById("user-section")
        .style.display = "none";


    closeProfileMenu();


    navigateTo("home");


    alert(
        "You have been logged out successfully."
    );

}


/* PROFILE MENU */

function toggleProfileMenu() {
    const menu = document.getElementById("profile-menu");
    if (menu) {
        menu.style.display = menu.style.display === "none" ? "flex" : "none";
    }
}

function closeProfileMenu() {
    const menu = document.getElementById("profile-menu");
    if (menu) menu.style.display = "none";
}

/* CLOSE MENU WHEN CLICK OUTSIDE */

document.addEventListener("click", function (event) {
    const userSection = document.getElementById("user-section");
    const profileMenu = document.getElementById("profile-menu");
    
    if (userSection && !userSection.contains(event.target)) {
        if (profileMenu) profileMenu.style.display = "none";
    }
});


/* SHOW / HIDE PASSWORD */

function togglePassword(inputId, icon) {

    const input =
        document.getElementById(inputId);


    if (input.type === "password") {

        input.type = "text";

        icon.classList.remove("fa-eye");

        icon.classList.add("fa-eye-slash");

    } else {

        input.type = "password";

        icon.classList.remove("fa-eye-slash");

        icon.classList.add("fa-eye");

    }

}


/* MY CERTIFICATES */

function showMyCertificates() {
    navigateTo('dashboard');
    setTimeout(() => {
        const certificateSection = document.getElementById('certificates-section');
        if (certificateSection) {
            certificateSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 300);
}

// Progressive Web App (PWA) Service Worker Registration
if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(reg => console.log('Learn Me PWA Service Worker Registered:', reg.scope))
            .catch(err => console.debug('Service Worker Registration Note:', err.message));
    });
}
