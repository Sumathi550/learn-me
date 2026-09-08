const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const { User } = require('../models');
const { Course } = require('../models');
const { Category } = require('../models');
const { AdminSettings } = require('../models');
const { AUTHORIZED_ADMIN_EMAIL } = require('../middleware/authMiddleware');

const defaultCategories = [
    { categoryId: 'programming', name: 'Programming', description: 'Core programming languages and paradigms.', icon: 'fa-code' },
    { categoryId: 'python', name: 'Python & Data Science', description: 'Python, NumPy, Pandas, and ML fundamentals.', icon: 'fa-python' },
    { categoryId: 'aptitude', name: 'Advanced Aptitude', description: 'Quantitative, logical reasoning, and verbal practice.', icon: 'fa-bolt' },
    { categoryId: 'ai-ml', name: 'AI & Data Science', description: 'Machine Learning, Deep Learning, and Computer Vision.', icon: 'fa-brain' },
    { categoryId: 'web-dev', name: 'Web Development', description: 'HTML, CSS, JavaScript, React, and MongoDB.', icon: 'fa-laptop-code' }
];

function loadCourseQuestions(questionFile) {
    if (!questionFile) return [];
    const questionPath = path.join(__dirname, '..', '..', 'frontend', 'data', questionFile);
    if (!fs.existsSync(questionPath)) return [];
    try {
        const raw = JSON.parse(fs.readFileSync(questionPath, 'utf8'));
        if (!Array.isArray(raw)) return [];
        return raw.map(item => ({
            q: item.q || item.question,
            options: (item.options || item.answers || []).map(opt => typeof opt === 'object' ? (opt.text || opt.label || String(opt)) : String(opt)),
            answer: typeof item.answer === 'number'
                ? item.answer
                : Math.max(0, (item.options || []).indexOf(item.answer)),
            explanation: item.explanation || ''
        }));
    } catch(e) {
        return [];
    }
}

const defaultCourses = [
    {
        courseId: 'python',
        title: 'Python Programming',
        subtitle: 'Master Python fundamentals, data structures, and automation.',
        icon: 'fa-python',
        iconType: 'fab',
        duration: '10 hrs',
        difficulty: 'Beginner',
        category: 'Python',
        certificatePrice: 10,
        questionsUrl: 'data/python.json',
        modules: ['Python Basics', 'Functions & Control Flow', 'OOP & Data Structures', 'Final Assessment'],
        lessons: [
            { lessonId: 'py-1', title: 'Python Basics & Variables', content: 'Introduction to Python syntax, dynamic typing, and fundamental variables.', duration: '20 mins' },
            { lessonId: 'py-2', title: 'Functions & Control Flow', content: 'Learn def statements, if/else logic, while loops, and for loops.', duration: '30 mins' }
        ],
        questions: loadCourseQuestions('python.json')
    },
    {
        courseId: 'c',
        title: 'C Programming',
        subtitle: 'Build a strong foundation in procedural programming with C.',
        icon: 'fa-code',
        iconType: 'fas',
        duration: '8 hrs',
        difficulty: 'Beginner',
        category: 'Programming',
        certificatePrice: 10,
        questionsUrl: 'data/c.json',
        modules: ['C Fundamentals', 'Functions & Pointers', 'Arrays & Structures', 'Final Assessment'],
        lessons: [
            { lessonId: 'c-1', title: 'C Syntax & Memory Fundamentals', content: 'Introduction to data types, printf/scanf, and memory layout.', duration: '25 mins' }
        ],
        questions: loadCourseQuestions('c.json')
    },
    {
        courseId: 'cpp',
        title: 'C++ Programming',
        subtitle: 'Learn modern C++ syntax, object-oriented programming, and STL.',
        icon: 'fa-code',
        iconType: 'fas',
        duration: '10 hrs',
        difficulty: 'Intermediate',
        category: 'Programming',
        certificatePrice: 10,
        questionsUrl: 'data/c++.json',
        modules: ['C++ Fundamentals', 'OOP in C++', 'STL & Modern C++', 'Final Assessment'],
        lessons: [
            { lessonId: 'cpp-1', title: 'Classes, Objects, and Templates', content: 'OOP principles in C++, constructors, inheritance, and STL containers.', duration: '30 mins' }
        ],
        questions: loadCourseQuestions('c++.json')
    },
    {
        courseId: 'java',
        title: 'Java Programming',
        subtitle: 'Learn Java fundamentals, OOP, collections, and platform basics.',
        icon: 'fa-coffee',
        iconType: 'fas',
        duration: '10 hrs',
        difficulty: 'Beginner',
        category: 'Programming',
        certificatePrice: 10,
        questionsUrl: 'data/java.json',
        modules: ['Java Basics', 'OOP & Inheritance', 'Collections & Exceptions', 'Final Assessment'],
        lessons: [
            { lessonId: 'java-1', title: 'Java Syntax & JVM Architecture', content: 'Bytecode, JVM execution model, public static void main, and Garbage Collection.', duration: '30 mins' }
        ],
        questions: loadCourseQuestions('java.json')
    },
    {
        courseId: 'advanced-aptitude',
        title: 'Advanced Aptitude',
        subtitle: 'Build speed and accuracy across quantitative aptitude, reasoning, data interpretation, and verbal ability.',
        icon: 'fa-bolt',
        iconType: 'fas',
        duration: 'Self-paced',
        difficulty: 'Advanced',
        category: 'Aptitude',
        certificatePrice: 100, // Special Pricing Rule: ₹100 for Aptitude Certificate
        questionsUrl: 'data/advanced-aptitude.json',
        modules: ['Quantitative Aptitude', 'Logical Reasoning', 'Data Interpretation', 'Verbal Ability', 'Final Assessment'],
        lessons: [
            { lessonId: 'apt-1', title: 'Quantitative Shortcut Methods', content: 'Speed math techniques, percentage shortcuts, time-work matrix methods.', duration: '40 mins' }
        ],
        questions: loadCourseQuestions('advanced-aptitude.json')
    }
];

const additionalCourses = [
    ['numpy', 'NumPy', 'Numerical computing with powerful N-dimensional arrays.', 'fa-table', 'fas', '5 hrs', 'Intermediate', ['Array Fundamentals', 'Indexing & Slicing', 'Math Operations', 'Final Assessment'], 'numpy.json'],
    ['pandas', 'Pandas', 'Data analysis and manipulation made easy.', 'fa-database', 'fas', '7 hrs', 'Intermediate', ['Series & DataFrames', 'Filtering & Grouping', 'Cleaning & Analysis', 'Final Assessment'], 'pandas.json'],
    ['statistics', 'Statistics for ML', 'Core statistical concepts for data science and machine learning.', 'fa-chart-bar', 'fas', '8 hrs', 'Beginner', ['Descriptive Stats', 'Probability', 'Hypothesis Testing', 'Final Assessment'], 'statistics.json'],
    ['ml', 'Machine Learning (ML)', 'Train supervised and unsupervised learning models using Scikit-Learn.', 'fa-brain', 'fas', '12 hrs', 'Intermediate', ['Data Preparation', 'Supervised Learning', 'Model Evaluation', 'Final Assessment'], 'ml.json'],
    ['dl', 'Deep Learning (DL)', 'Build neural networks and understand deep architectures.', 'fa-network-wired', 'fas', '15 hrs', 'Advanced', ['Neural Networks', 'CNN & RNN', 'Optimization & Training', 'Final Assessment'], 'dl.json'],
    ['cv', 'Computer Vision (CV)', 'Learn image processing and computer vision techniques with AI.', 'fa-eye', 'fas', '14 hrs', 'Advanced', ['Image Basics', 'Filtering & Thresholding', 'Object Detection', 'Final Assessment'], 'cv.json'],
    ['csharp', 'C# and .NET', 'Create robust applications with C# and the .NET platform.', 'fa-laptop-code', 'fas', '10 hrs', 'Intermediate', ['C# Fundamentals', 'Object-Oriented C#', '.NET Application Basics', 'Final Assessment'], 'c#.json'],
    ['dotnet', '.NET Development', 'Understand the tools and platform behind modern .NET applications.', 'fa-window-maximize', 'fas', '8 hrs', 'Intermediate', ['.NET Fundamentals', 'Runtime & Libraries', 'Application Development', 'Final Assessment'], 'dot_net.json'],
    ['javascript', 'JavaScript', 'Build interactive web experiences with modern JavaScript.', 'fa-js', 'fab', '8 hrs', 'Beginner', ['JavaScript Basics', 'Functions & DOM', 'Modern JavaScript', 'Final Assessment'], 'js.json'],
    ['htmlcss', 'HTML and CSS', 'Structure and style accessible, responsive web pages.', 'fa-html5', 'fab', '6 hrs', 'Beginner', ['HTML Structure', 'CSS Styling', 'Responsive Layouts', 'Final Assessment'], 'html&css.json'],
    ['react', 'React', 'Create component-based user interfaces with React.', 'fa-react', 'fab', '8 hrs', 'Intermediate', ['React Fundamentals', 'Components & Props', 'State & Application Flow', 'Final Assessment'], 'react.json'],
    ['sql', 'SQL', 'Query, manage, and analyze data in relational databases.', 'fa-database', 'fas', '7 hrs', 'Beginner', ['SQL Basics', 'Filtering & Joins', 'Aggregation & Database Design', 'Final Assessment'], 'sql.json'],
    ['dsa', 'Data Structures and Algorithms', 'Develop efficient problem-solving skills with core algorithms.', 'fa-sitemap', 'fas', '12 hrs', 'Intermediate', ['Data Structures', 'Searching & Sorting', 'Complexity & Problem Solving', 'Final Assessment'], 'dsa.json'],
    ['mongodb', 'MongoDB', 'Store and query flexible document data with MongoDB.', 'fa-leaf', 'fas', '7 hrs', 'Intermediate', ['MongoDB Fundamentals', 'Documents & Collections', 'Queries & Indexes', 'Final Assessment'], 'mangodb.json'],
    ['github', 'Git and GitHub', 'Track changes and collaborate effectively with Git and GitHub.', 'fa-github', 'fab', '5 hrs', 'Beginner', ['Git Fundamentals', 'Branches & Merging', 'GitHub Collaboration', 'Final Assessment'], 'GitHub.json']
].map(([courseId, title, subtitle, icon, iconType, duration, difficulty, modules, questionFile], order) => {
    let questions = [];
    const questionPath = path.join(__dirname, '..', '..', 'frontend', 'data', questionFile);
    if (fs.existsSync(questionPath)) {
        questions = JSON.parse(fs.readFileSync(questionPath, 'utf8')).map(item => ({
            q: item.q || item.question,
            options: item.options || [],
            answer: typeof item.answer === 'number'
                ? item.answer
                : Math.max(0, (item.options || []).indexOf(item.answer)),
            explanation: item.explanation || ''
        }));
    }
    return {
        courseId, title, subtitle, icon, iconType, duration, difficulty,
        category: ['ml', 'dl', 'cv', 'statistics'].includes(courseId) ? 'AI & Data Science' : 'Programming',
        certificatePrice: 10,
        modules,
        lessons: modules.slice(0, -1).map((module, index) => ({
            lessonId: `${courseId}-${index + 1}`,
            title: module,
            content: `Learn the core concepts of ${module} through guided lessons and practice.`,
            duration: '30 mins'
        })),
        questions,
        order
    };
});

async function seedDatabase() {
    try {
        // Seed Admin Settings
        let settings = await AdminSettings.findOne();
        if (!settings) {
            await AdminSettings.create({
                siteName: 'Learn Me Platform',
                normalCertificatePrice: 10,
                aptitudeCertificatePrice: 100,
                upiId: 'sumathiaz550@upi',
                paymentInstructions: 'Scan QR or send UPI payment to sumathiaz550@upi. Enter UTR reference number for instant verification.'
            });
            console.log('Seeded AdminSettings');
        }

        // Seed Categories
        for (const cat of defaultCategories) {
            await Category.findOneAndUpdate(
                { categoryId: cat.categoryId },
                cat,
                { upsert: true, new: true }
            );
        }
        console.log('Seeded Categories');

        // Seed Courses
        for (const courseData of [...defaultCourses, ...additionalCourses]) {
            const existingCourse = await Course.findOne({ courseId: courseData.courseId });
            if (!existingCourse) {
                await Course.create(courseData);
                console.log(`Seeded Course: ${courseData.title}`);
            } else if (courseData.questions && courseData.questions.length >= 50 && (!existingCourse.questions || existingCourse.questions.length < 50)) {
                existingCourse.questions = courseData.questions;
                existingCourse.lessons = courseData.lessons || existingCourse.lessons;
                existingCourse.questionsUrl = courseData.questionsUrl || existingCourse.questionsUrl;
                await existingCourse.save();
                console.log(`Updated Course with 50 questions: ${courseData.title}`);
            }
        }

        // Ensure Owner Admin Account Exists (sumathiaz550@gmail.com)
        let adminUser = await User.findOne({ email: AUTHORIZED_ADMIN_EMAIL.toLowerCase() });
        const adminPasswordRaw = process.env.ADMIN_INITIAL_PASSWORD || 'Sumathi@12345';

        if (!adminUser) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(adminPasswordRaw, salt);

            adminUser = await User.create({
                name: 'Sumathi Admin',
                email: AUTHORIZED_ADMIN_EMAIL.toLowerCase(),
                password: hashedPassword,
                role: 'admin',
                isActive: true
            });
            console.log(`Initial Owner Admin Account created: ${AUTHORIZED_ADMIN_EMAIL} (Password: ${adminPasswordRaw})`);
        } else if (adminUser.role !== 'admin') {
            adminUser.role = 'admin';
            await adminUser.save();
            console.log(`Updated existing user role to admin for ${AUTHORIZED_ADMIN_EMAIL}`);
        }

    } catch (error) {
        console.error('Database seeding failed:', error.message);
    }
}

module.exports = seedDatabase;
