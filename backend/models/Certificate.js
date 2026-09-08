module.exports = (sequelize, DataTypes) => {
    const Certificate = sequelize.define('Certificate', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        userId: { type: DataTypes.UUID, allowNull: false },
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
};