module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        name: { type: DataTypes.STRING(120), allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false, unique: true },
        password: { type: DataTypes.STRING, allowNull: true },
        role: { type: DataTypes.ENUM('user', 'admin'), defaultValue: 'user' },
        isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
        lastLogin: { type: DataTypes.DATE },
        lastLogout: { type: DataTypes.DATE },
        lastSeen: { type: DataTypes.DATE }
    });
    return User;
};