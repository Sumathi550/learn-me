module.exports = (sequelize, DataTypes) => {
    const AdminAuditLog = sequelize.define('AdminAuditLog', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        adminId: { type: DataTypes.UUID },
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
};