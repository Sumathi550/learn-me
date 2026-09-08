const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, '..', 'backend', 'models');

const indexJs = `const { Sequelize } = require('sequelize');
const { sequelize } = require('../config/database');

const User = require('./User')(sequelize, Sequelize.DataTypes);
const Course = require('./Course')(sequelize, Sequelize.DataTypes);
const Lesson = require('./Lesson')(sequelize, Sequelize.DataTypes);
const Question = require('./Question')(sequelize, Sequelize.DataTypes);
const Enrollment = require('./Enrollment')(sequelize, Sequelize.DataTypes);
const Progress = require('./Progress')(sequelize, Sequelize.DataTypes);
const Activity = require('./Activity')(sequelize, Sequelize.DataTypes);
const QuizAttempt = require('./QuizAttempt')(sequelize, Sequelize.DataTypes);
const AdminAuditLog = require('./AdminAuditLog')(sequelize, Sequelize.DataTypes);
const AdminSettings = require('./AdminSettings')(sequelize, Sequelize.DataTypes);
const Category = require('./Category')(sequelize, Sequelize.DataTypes);
const Certificate = require('./Certificate')(sequelize, Sequelize.DataTypes);
const CertificatePayment = require('./CertificatePayment')(sequelize, Sequelize.DataTypes);

// Define Associations

// User Associations
User.hasMany(Enrollment, { foreignKey: 'userId' });
Enrollment.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Progress, { foreignKey: 'userId' });
Progress.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Activity, { foreignKey: 'userId' });
Activity.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(QuizAttempt, { foreignKey: 'userId' });
QuizAttempt.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(AdminAuditLog, { foreignKey: 'adminId' });
AdminAuditLog.belongsTo(User, { foreignKey: 'adminId' });

User.hasMany(Certificate, { foreignKey: 'userId' });
Certificate.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(CertificatePayment, { foreignKey: 'userId' });
CertificatePayment.belongsTo(User, { foreignKey: 'userId' });

// Course Associations
Course.hasMany(Lesson, { foreignKey: 'courseId' });
Lesson.belongsTo(Course, { foreignKey: 'courseId' });

Course.hasMany(Question, { foreignKey: 'courseId' });
Question.belongsTo(Course, { foreignKey: 'courseId' });

module.exports = {
    sequelize,
    User,
    Course,
    Lesson,
    Question,
    Enrollment,
    Progress,
    Activity,
    QuizAttempt,
    AdminAuditLog,
    AdminSettings,
    Category,
    Certificate,
    CertificatePayment
};
`;

const UserJs = `module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        name: { type: DataTypes.STRING(120), allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false, unique: true },
        password: { type: DataTypes.STRING, allowNull: false },
        role: { type: DataTypes.ENUM('user', 'admin'), defaultValue: 'user' },
        isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
        lastLogin: { type: DataTypes.DATE },
        lastLogout: { type: DataTypes.DATE },
        lastSeen: { type: DataTypes.DATE }
    });
    return User;
};`;

const CourseJs = `module.exports = (sequelize, DataTypes) => {
    const Course = sequelize.define('Course', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        courseId: { type: DataTypes.STRING, allowNull: false, unique: true },
        title: { type: DataTypes.STRING(200), allowNull: false },
        subtitle: { type: DataTypes.STRING(500), allowNull: false },
        icon: { type: DataTypes.STRING, defaultValue: 'fa-book' },
        iconType: { type: DataTypes.ENUM('fas', 'fab'), defaultValue: 'fas' },
        duration: { type: DataTypes.STRING(40), allowNull: false },
        difficulty: { type: DataTypes.ENUM('Beginner', 'Intermediate', 'Advanced'), allowNull: false },
        category: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Programming' },
        instructor: { type: DataTypes.STRING(120), defaultValue: 'Learn Me Team' },
        modules: { type: DataTypes.JSON, defaultValue: [] },
        questionsUrl: { type: DataTypes.STRING },
        passingScore: { type: DataTypes.INTEGER, defaultValue: 70 },
        certificatePrice: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 10 },
        hasFinalAssessment: { type: DataTypes.BOOLEAN, defaultValue: true },
        status: { type: DataTypes.ENUM('draft', 'published'), defaultValue: 'published' },
        order: { type: DataTypes.INTEGER, defaultValue: 0 }
    });
    return Course;
};`;

const LessonJs = `module.exports = (sequelize, DataTypes) => {
    const Lesson = sequelize.define('Lesson', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        lessonId: { type: DataTypes.STRING, allowNull: false },
        title: { type: DataTypes.STRING, allowNull: false },
        content: { type: DataTypes.TEXT },
        videoUrl: { type: DataTypes.STRING },
        duration: { type: DataTypes.STRING }
    });
    return Lesson;
};`;

const QuestionJs = `module.exports = (sequelize, DataTypes) => {
    const Question = sequelize.define('Question', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        q: { type: DataTypes.TEXT, allowNull: false },
        options: { type: DataTypes.JSON, allowNull: false },
        answer: { type: DataTypes.INTEGER, allowNull: false },
        explanation: { type: DataTypes.TEXT }
    });
    return Question;
};`;

const EnrollmentJs = `module.exports = (sequelize, DataTypes) => {
    const Enrollment = sequelize.define('Enrollment', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        courseId: { type: DataTypes.STRING, allowNull: false },
        enrolledAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        status: { type: DataTypes.ENUM('active', 'completed', 'dropped'), defaultValue: 'active' },
        completedAt: { type: DataTypes.DATE }
    });
    return Enrollment;
};`;

const ProgressJs = `module.exports = (sequelize, DataTypes) => {
    const Progress = sequelize.define('Progress', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        courseId: { type: DataTypes.STRING, allowNull: false },
        completedLessons: { type: DataTypes.INTEGER, defaultValue: 0 },
        totalLessons: { type: DataTypes.INTEGER, defaultValue: 0 },
        percentage: { type: DataTypes.FLOAT, defaultValue: 0 },
        status: { type: DataTypes.ENUM('Not Started', 'In Progress', 'Completed'), defaultValue: 'Not Started' },
        quizScore: { type: DataTypes.FLOAT },
        quizPassed: { type: DataTypes.BOOLEAN, defaultValue: false },
        eligibleForCertificate: { type: DataTypes.BOOLEAN, defaultValue: false },
        courseUnlocked: { type: DataTypes.BOOLEAN, defaultValue: false },
        lastAccessed: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    });
    return Progress;
};`;

const ActivityJs = `module.exports = (sequelize, DataTypes) => {
    const Activity = sequelize.define('Activity', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        action: {
            type: DataTypes.ENUM(
                'REGISTRATION', 'LOGIN', 'LOGOUT', 'COURSE_OPENED',
                'LESSON_OPENED', 'LESSON_COMPLETED', 'QUIZ_STARTED',
                'QUIZ_SUBMITTED', 'QUIZ_PASSED', 'QUIZ_FAILED',
                'CERTIFICATE_ELIGIBLE', 'PAYMENT_INITIATED',
                'PAYMENT_SUCCESSFUL', 'CERTIFICATE_DOWNLOADED',
                'CERTIFICATE_VERIFIED'
            ),
            allowNull: false
        },
        details: { type: DataTypes.STRING },
        ipAddress: { type: DataTypes.STRING }
    });
    return Activity;
};`;

const QuizAttemptJs = `module.exports = (sequelize, DataTypes) => {
    const QuizAttempt = sequelize.define('QuizAttempt', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        courseId: { type: DataTypes.STRING, allowNull: false },
        attemptNumber: { type: DataTypes.INTEGER, defaultValue: 1 },
        answers: { type: DataTypes.JSON },
        score: { type: DataTypes.FLOAT, allowNull: false },
        totalQuestions: { type: DataTypes.INTEGER, allowNull: false },
        percentage: { type: DataTypes.FLOAT, allowNull: false },
        passed: { type: DataTypes.BOOLEAN, allowNull: false },
        timeTakenSeconds: { type: DataTypes.INTEGER, defaultValue: 0 },
        startedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        completedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    });
    return QuizAttempt;
};`;

const AdminAuditLogJs = `module.exports = (sequelize, DataTypes) => {
    const AdminAuditLog = sequelize.define('AdminAuditLog', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        adminEmail: { type: DataTypes.STRING, allowNull: false },
        action: {
            type: DataTypes.ENUM(
                'ADMIN_LOGIN', 'ADMIN_LOGOUT',
                'COURSE_CREATED', 'COURSE_UPDATED', 'COURSE_DELETED',
                'CATEGORY_CREATED', 'CATEGORY_UPDATED', 'CATEGORY_DELETED',
                'USER_VIEWED', 'USER_DEACTIVATED', 'USER_REACTIVATED', 'USER_DELETED',
                'CERTIFICATE_REVOKED', 'CERTIFICATE_RESTORED', 'CERTIFICATE_VERIFIED',
                'PAYMENT_VERIFIED', 'PAYMENT_REJECTED',
                'SETTINGS_UPDATED', 'ADMIN_PROFILE_VIEWED'
            ),
            allowNull: false
        },
        resourceType: { type: DataTypes.STRING },
        resourceId: { type: DataTypes.STRING },
        resourceName: { type: DataTypes.STRING },
        details: { type: DataTypes.STRING },
        ipAddress: { type: DataTypes.STRING },
        userAgent: { type: DataTypes.STRING },
        status: { type: DataTypes.ENUM('SUCCESS', 'FAILURE'), defaultValue: 'SUCCESS' },
        errorMessage: { type: DataTypes.STRING }
    });
    return AdminAuditLog;
};`;

const AdminSettingsJs = `module.exports = (sequelize, DataTypes) => {
    const AdminSettings = sequelize.define('AdminSettings', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        siteName: { type: DataTypes.STRING, defaultValue: 'Learn Me Platform' },
        normalCertificatePrice: { type: DataTypes.FLOAT, defaultValue: 10 },
        aptitudeCertificatePrice: { type: DataTypes.FLOAT, defaultValue: 100 },
        upiId: { type: DataTypes.STRING, defaultValue: 'sumathiaz550@upi' },
        qrImageUrl: { type: DataTypes.STRING, defaultValue: '' },
        paymentInstructions: { type: DataTypes.STRING },
        contactEmail: { type: DataTypes.STRING, defaultValue: 'sumathiaz550@gmail.com' }
    });
    return AdminSettings;
};`;

const CategoryJs = `module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define('Category', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        categoryId: { type: DataTypes.STRING, allowNull: false, unique: true },
        name: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.TEXT },
        icon: { type: DataTypes.STRING, defaultValue: 'fa-folder' },
        order: { type: DataTypes.INTEGER, defaultValue: 0 }
    });
    return Category;
};`;

const CertificateJs = `module.exports = (sequelize, DataTypes) => {
    const Certificate = sequelize.define('Certificate', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        certificateId: { type: DataTypes.STRING, allowNull: false, unique: true },
        userName: { type: DataTypes.STRING, allowNull: false },
        courseId: { type: DataTypes.STRING, allowNull: false },
        courseName: { type: DataTypes.STRING, allowNull: false },
        score: { type: DataTypes.FLOAT, allowNull: false },
        percentage: { type: DataTypes.FLOAT, allowNull: false },
        completionDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        verificationCode: { type: DataTypes.STRING, allowNull: false, unique: true },
        status: { type: DataTypes.ENUM('valid', 'revoked'), defaultValue: 'valid' },
        paymentStatus: { type: DataTypes.ENUM('pending', 'paid'), defaultValue: 'pending' },
        downloadCount: { type: DataTypes.INTEGER, defaultValue: 0 },
        issuedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    });
    return Certificate;
};`;

const CertificatePaymentJs = `module.exports = (sequelize, DataTypes) => {
    const CertificatePayment = sequelize.define('CertificatePayment', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        transactionId: { type: DataTypes.STRING, allowNull: false, unique: true },
        userName: { type: DataTypes.STRING, allowNull: false },
        userEmail: { type: DataTypes.STRING, allowNull: false },
        certificateId: { type: DataTypes.STRING, allowNull: false },
        courseId: { type: DataTypes.STRING, allowNull: false },
        courseTitle: { type: DataTypes.STRING, allowNull: false },
        amount: { type: DataTypes.FLOAT, allowNull: false },
        category: { type: DataTypes.STRING, defaultValue: 'General' },
        paymentMethod: { type: DataTypes.ENUM('UPI_GATEWAY', 'UPI_QR_MANUAL'), defaultValue: 'UPI_GATEWAY' },
        purpose: { type: DataTypes.ENUM('CERTIFICATE', 'COURSE_ACCESS'), defaultValue: 'CERTIFICATE' },
        paymentStatus: {
            type: DataTypes.ENUM('Pending', 'Successful', 'Failed', 'Refunded', 'Manual Verification Required', 'PENDING', 'APPROVED', 'REJECTED', 'PAID', 'FAILED', 'REFUNDED'),
            defaultValue: 'PENDING'
        },
        utrNumber: { type: DataTypes.STRING },
        paymentProofUrl: { type: DataTypes.STRING },
        verifiedByAdmin: { type: DataTypes.BOOLEAN, defaultValue: false },
        verifiedAt: { type: DataTypes.DATE },
        adminNotes: { type: DataTypes.TEXT }
    });
    return CertificatePayment;
};`;

const filesToWrite = {
    'index.js': indexJs,
    'User.js': UserJs,
    'Course.js': CourseJs,
    'Lesson.js': LessonJs,
    'Question.js': QuestionJs,
    'Enrollment.js': EnrollmentJs,
    'Progress.js': ProgressJs,
    'Activity.js': ActivityJs,
    'QuizAttempt.js': QuizAttemptJs,
    'AdminAuditLog.js': AdminAuditLogJs,
    'AdminSettings.js': AdminSettingsJs,
    'Category.js': CategoryJs,
    'Certificate.js': CertificateJs,
    'CertificatePayment.js': CertificatePaymentJs
};

for (const [filename, content] of Object.entries(filesToWrite)) {
    fs.writeFileSync(path.join(modelsDir, filename), content);
    console.log("Written", filename);
}
console.log("All Sequelize models generated successfully.");
