module.exports = (sequelize, DataTypes) => {
    const Progress = sequelize.define('Progress', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        userId: { type: DataTypes.UUID, allowNull: false },
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
    }, {
        tableName: 'progress'
    });
    return Progress;
};