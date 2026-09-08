module.exports = (sequelize, DataTypes) => {
    const Question = sequelize.define('Question', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        courseId: { type: DataTypes.STRING, allowNull: false },
        q: { type: DataTypes.TEXT, allowNull: false },
        options: { type: DataTypes.JSON, allowNull: false },
        answer: { type: DataTypes.INTEGER, allowNull: false },
        explanation: { type: DataTypes.TEXT }
    });
    return Question;
};