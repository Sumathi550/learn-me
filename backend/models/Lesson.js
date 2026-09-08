module.exports = (sequelize, DataTypes) => {
    const Lesson = sequelize.define('Lesson', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        lessonId: { type: DataTypes.STRING, allowNull: false },
        courseId: { type: DataTypes.STRING, allowNull: false },
        title: { type: DataTypes.STRING, allowNull: false },
        content: { type: DataTypes.TEXT },
        videoUrl: { type: DataTypes.STRING },
        duration: { type: DataTypes.STRING }
    });
    return Lesson;
};