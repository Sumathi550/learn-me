const mongoose = require('mongoose');
const Course = require('./models/Course');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const coursesData = [
    { id: "python",     title: "Python Programming",      subtitle: "Master Python fundamentals.",                          icon: "fa-python",        iconType: "fab", duration: "10 hrs", difficulty: "Beginner",      modules: ["Python Basics", "Final Assessment"] },
    { id: "numpy",      title: "NumPy",                   subtitle: "Numerical computing with arrays.",                              icon: "fa-table",         iconType: "fas", duration: "5 hrs",  difficulty: "Intermediate",  modules: ["Array Fundamentals", "Final Assessment"] },
    { id: "pandas",     title: "Pandas",                  subtitle: "Data analysis and manipulation made easy.",                                            icon: "fa-database",      iconType: "fas", duration: "7 hrs",  difficulty: "Intermediate",  modules: ["Series & DataFrames", "Final Assessment"] },
    { id: "statistics", title: "Statistics for ML",       subtitle: "Core statistical concepts.",           icon: "fa-chart-bar",     iconType: "fas", duration: "8 hrs",  difficulty: "Beginner",      modules: ["Descriptive Stats", "Final Assessment"] },
    { id: "ml",         title: "Machine Learning (ML)",   subtitle: "Train models using Scikit-Learn.",                icon: "fa-brain",         iconType: "fas", duration: "12 hrs", difficulty: "Intermediate",  modules: ["Data Preparation", "Final Assessment"] },
    { id: "dl",         title: "Deep Learning (DL)",      subtitle: "Build neural networks.",                             icon: "fa-network-wired", iconType: "fas", duration: "15 hrs", difficulty: "Advanced",      modules: ["Neural Networks", "Final Assessment"] },
    { id: "cv",         title: "Computer Vision (CV)",    subtitle: "Image processing techniques.",                             icon: "fa-eye",           iconType: "fas", duration: "14 hrs", difficulty: "Advanced",      modules: ["Image Basics", "Final Assessment"] },
    { id: "c",          title: "C Programming",           subtitle: "Build a strong foundation.",                         icon: "fa-code",          iconType: "fas", duration: "8 hrs", difficulty: "Beginner", modules: ["C Fundamentals", "Final Assessment"] },
    { id: "cpp",        title: "C++ Programming",         subtitle: "Learn modern C++.",                     icon: "fa-code",          iconType: "fas", duration: "10 hrs", difficulty: "Intermediate", modules: ["C++ Fundamentals", "Final Assessment"] },
    { id: "csharp",     title: "C# and .NET",             subtitle: "Create robust applications.",                         icon: "fa-laptop-code",   iconType: "fas", duration: "10 hrs", difficulty: "Intermediate", modules: ["C# Fundamentals", "Final Assessment"] },
    { id: "dotnet",     title: ".NET Development",        subtitle: "Understand the .NET framework.",                  icon: "fa-window-maximize", iconType: "fas", duration: "8 hrs", difficulty: "Intermediate", modules: [".NET Fundamentals", "Final Assessment"] },
    { id: "java",       title: "Java Programming",         subtitle: "Learn Java fundamentals.",                    icon: "fa-coffee",        iconType: "fas", duration: "10 hrs", difficulty: "Beginner", modules: ["Java Basics", "Final Assessment"] },
    { id: "javascript", title: "JavaScript",               subtitle: "Build interactive web experiences.",                          icon: "fa-js",            iconType: "fab", duration: "8 hrs", difficulty: "Beginner", modules: ["JavaScript Basics", "Final Assessment"] },
    { id: "htmlcss",    title: "HTML and CSS",             subtitle: "Structure and style web pages.",                              icon: "fa-html5",         iconType: "fab", duration: "6 hrs", difficulty: "Beginner", modules: ["HTML Structure", "Final Assessment"] },
    { id: "react",      title: "React",                    subtitle: "Create user interfaces with React.",                                  icon: "fa-react",         iconType: "fab", duration: "8 hrs", difficulty: "Intermediate", modules: ["React Fundamentals", "Final Assessment"] },
    { id: "sql",        title: "SQL",                      subtitle: "Query relational databases.",                             icon: "fa-database",      iconType: "fas", duration: "7 hrs", difficulty: "Beginner", modules: ["SQL Basics", "Final Assessment"] },
    { id: "dsa",        title: "Data Structures and Algorithms", subtitle: "Develop problem-solving skills.", icon: "fa-sitemap", iconType: "fas", duration: "12 hrs", difficulty: "Intermediate", modules: ["Data Structures", "Final Assessment"] },
    { id: "mongodb",    title: "MongoDB",                  subtitle: "Store document data with MongoDB.",                                icon: "fa-leaf",          iconType: "fas", duration: "7 hrs", difficulty: "Intermediate", modules: ["MongoDB Fundamentals", "Final Assessment"] },
    { id: "github",     title: "Git and GitHub",            subtitle: "Collaborate effectively with Git.",                     icon: "fa-github",         iconType: "fab", duration: "5 hrs", difficulty: "Beginner", modules: ["Git Fundamentals", "Final Assessment"] },
    { id: "advanced-aptitude", title: "Advanced Aptitude", subtitle: "Build speed and accuracy.", icon: "fa-bolt", iconType: "fas", duration: "Self-paced", difficulty: "Advanced", type: "aptitude" }
];

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('Connected to DB');
        let count = 0;
        for (const c of coursesData) {
            const exists = await Course.findOne({ courseId: c.id });
            if (!exists) {
                await Course.create({
                    courseId: c.id,
                    title: c.title,
                    subtitle: c.subtitle,
                    icon: c.icon,
                    iconType: c.iconType,
                    duration: c.duration,
                    difficulty: c.difficulty,
                    category: c.type === 'aptitude' ? 'Aptitude' : 'Programming',
                    certificatePrice: c.type === 'aptitude' ? 100 : 10,
                    modules: c.modules || []
                });
                count++;
            }
        }
        console.log('Inserted', count, 'courses');
        mongoose.connection.close();
    });
