const mongoose = require('mongoose');
const Course = require('./backend/models/Course');
const dotenv = require('dotenv');

dotenv.config({ path: './backend/.env' });

const coursesData = [
    { id: "python",     title: "Python Programming",      subtitle: "Master Python fundamentals, data structures, and automation.",                          icon: "fa-python",        iconType: "fab", duration: "10 hrs", difficulty: "Beginner",      questionsUrl: "python.json",     modules: ["Python Basics", "Functions & Control Flow", "OOP & Data Structures", "Final Assessment"] },
    { id: "numpy",      title: "NumPy",                   subtitle: "Numerical computing with powerful N-dimensional arrays.",                              icon: "fa-table",         iconType: "fas", duration: "5 hrs",  difficulty: "Intermediate",  questionsUrl: "numpy.json",      modules: ["Array Fundamentals", "Indexing & Slicing", "Math Operations", "Final Assessment"] },
    { id: "pandas",     title: "Pandas",                  subtitle: "Data analysis and manipulation made easy.",                                            icon: "fa-database",      iconType: "fas", duration: "7 hrs",  difficulty: "Intermediate",  questionsUrl: "pandas.json",     modules: ["Series & DataFrames", "Filtering & Grouping", "Cleaning & Analysis", "Final Assessment"] },
    { id: "statistics", title: "Statistics for ML",       subtitle: "Core statistical concepts necessary for Data Science and Machine Learning.",           icon: "fa-chart-bar",     iconType: "fas", duration: "8 hrs",  difficulty: "Beginner",      questionsUrl: "statistics.json", modules: ["Descriptive Stats", "Probability", "Hypothesis Testing", "Final Assessment"] },
    { id: "ml",         title: "Machine Learning (ML)",   subtitle: "Train supervised and unsupervised learning models using Scikit-Learn.",                icon: "fa-brain",         iconType: "fas", duration: "12 hrs", difficulty: "Intermediate",  questionsUrl: "ml.json",         modules: ["Data Preparation", "Supervised Learning", "Model Evaluation", "Final Assessment"] },
    { id: "dl",         title: "Deep Learning (DL)",      subtitle: "Build neural networks and understand deep architectures.",                             icon: "fa-network-wired", iconType: "fas", duration: "15 hrs", difficulty: "Advanced",      questionsUrl: "dl.json",         modules: ["Neural Networks", "CNN & RNN", "Optimization & Training", "Final Assessment"] },
    { id: "cv",         title: "Computer Vision (CV)",    subtitle: "Image processing and computer vision techniques with AI.",                             icon: "fa-eye",           iconType: "fas", duration: "14 hrs", difficulty: "Advanced",      questionsUrl: "cv.json",         modules: ["Image Basics", "Filtering & Thresholding", "Object Detection", "Final Assessment"] },
    { id: "c",          title: "C Programming",           subtitle: "Build a strong foundation in procedural programming with C.",                         icon: "fa-code",          iconType: "fas", duration: "8 hrs", difficulty: "Beginner", questionsUrl: "c.json", modules: ["C Fundamentals", "Functions & Pointers", "Arrays & Structures", "Final Assessment"] },
    { id: "cpp",        title: "C++ Programming",         subtitle: "Learn modern C++ syntax, object-oriented programming, and STL.",                     icon: "fa-code",          iconType: "fas", duration: "10 hrs", difficulty: "Intermediate", questionsUrl: "c++.json", modules: ["C++ Fundamentals", "OOP in C++", "STL & Modern C++", "Final Assessment"] },
    { id: "csharp",     title: "C# and .NET",             subtitle: "Create robust applications with C# and the .NET platform.",                         icon: "fa-laptop-code",   iconType: "fas", duration: "10 hrs", difficulty: "Intermediate", questionsUrl: "c#.json", modules: ["C# Fundamentals", "Object-Oriented C#", ".NET Application Basics", "Final Assessment"] },
    { id: "dotnet",     title: ".NET Development",        subtitle: "Understand the tools and platform behind modern .NET applications.",                  icon: "fa-window-maximize", iconType: "fas", duration: "8 hrs", difficulty: "Intermediate", questionsUrl: "dot_net.json", modules: [".NET Fundamentals", "Runtime & Libraries", "Application Development", "Final Assessment"] },
    { id: "java",       title: "Java Programming",         subtitle: "Learn Java fundamentals, OOP, collections, and platform basics.",                    icon: "fa-coffee",        iconType: "fas", duration: "10 hrs", difficulty: "Beginner", questionsUrl: "java.json", modules: ["Java Basics", "OOP & Inheritance", "Collections & Exceptions", "Final Assessment"] },
    { id: "javascript", title: "JavaScript",               subtitle: "Build interactive web experiences with modern JavaScript.",                          icon: "fa-js",            iconType: "fab", duration: "8 hrs", difficulty: "Beginner", questionsUrl: "js.json", modules: ["JavaScript Basics", "Functions & DOM", "Modern JavaScript", "Final Assessment"] },
    { id: "htmlcss",    title: "HTML and CSS",             subtitle: "Structure and style accessible, responsive web pages.",                              icon: "fa-html5",         iconType: "fab", duration: "6 hrs", difficulty: "Beginner", questionsUrl: "html&css.json", modules: ["HTML Structure", "CSS Styling", "Responsive Layouts", "Final Assessment"] },
    { id: "react",      title: "React",                    subtitle: "Create component-based user interfaces with React.",                                  icon: "fa-react",         iconType: "fab", duration: "8 hrs", difficulty: "Intermediate", questionsUrl: "react.json", modules: ["React Fundamentals", "Components & Props", "State & Application Flow", "Final Assessment"] },
    { id: "sql",        title: "SQL",                      subtitle: "Query, manage, and analyze data in relational databases.",                             icon: "fa-database",      iconType: "fas", duration: "7 hrs", difficulty: "Beginner", questionsUrl: "sql.json", modules: ["SQL Basics", "Filtering & Joins", "Aggregation & Database Design", "Final Assessment"] },
    { id: "dsa",        title: "Data Structures and Algorithms", subtitle: "Develop efficient problem-solving skills with core data structures and algorithms.", icon: "fa-sitemap", iconType: "fas", duration: "12 hrs", difficulty: "Intermediate", questionsUrl: "dsa.json", modules: ["Data Structures", "Searching & Sorting", "Complexity & Problem Solving", "Final Assessment"] },
    { id: "mongodb",    title: "MongoDB",                  subtitle: "Store and query flexible document data with MongoDB.",                                icon: "fa-leaf",          iconType: "fas", duration: "7 hrs", difficulty: "Intermediate", questionsUrl: "mongodb.json", modules: ["MongoDB Fundamentals", "Documents & Collections", "Queries & Indexes", "Final Assessment"] },
    { id: "github",     title: "Git and GitHub",            subtitle: "Track changes and collaborate effectively with Git and GitHub.",                     icon: "fa-github",         iconType: "fab", duration: "5 hrs", difficulty: "Beginner", questionsUrl: "GitHub.json", modules: ["Git Fundamentals", "Branches & Merging", "GitHub Collaboration", "Final Assessment"] },
    { id: "advanced-aptitude", title: "Advanced Aptitude", subtitle: "Build speed and accuracy across quantitative aptitude, reasoning, data interpretation, and verbal ability.", icon: "fa-bolt", iconType: "fas", duration: "Self-paced", difficulty: "Advanced", type: "aptitude" }
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
