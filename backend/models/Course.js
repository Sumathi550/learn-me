module.exports = (sequelize, DataTypes) => {
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
        // JSON keeps the existing API contract; normalized Lesson/Question tables
        // remain available for clients that need relational access.
        lessons: { type: DataTypes.JSON, defaultValue: [] },
        questions: { type: DataTypes.JSON, defaultValue: [] },
        questionsUrl: { type: DataTypes.STRING },
        passingScore: { type: DataTypes.INTEGER, defaultValue: 70 },
        certificatePrice: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 10 },
        hasFinalAssessment: { type: DataTypes.BOOLEAN, defaultValue: true },
        status: { type: DataTypes.ENUM('draft', 'published'), defaultValue: 'published' },
        order: { type: DataTypes.INTEGER, defaultValue: 0 }
    });
    return Course;
};