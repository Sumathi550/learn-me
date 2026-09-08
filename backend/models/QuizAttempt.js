module.exports = (sequelize, DataTypes) => {
    const QuizAttempt = sequelize.define('QuizAttempt', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        userId: { type: DataTypes.UUID, allowNull: false },
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
};