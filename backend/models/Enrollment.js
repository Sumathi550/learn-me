module.exports = (sequelize, DataTypes) => {
    const Enrollment = sequelize.define('Enrollment', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        userId: { type: DataTypes.UUID, allowNull: false },
        courseId: { type: DataTypes.STRING, allowNull: false },
        enrolledAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        status: { type: DataTypes.ENUM('active', 'completed', 'dropped'), defaultValue: 'active' },
        completedAt: { type: DataTypes.DATE }
    });
    return Enrollment;
};