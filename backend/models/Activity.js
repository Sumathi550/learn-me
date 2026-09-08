module.exports = (sequelize, DataTypes) => {
    const Activity = sequelize.define('Activity', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        userId: { type: DataTypes.UUID },
        action: {
            type: DataTypes.ENUM(
                'REGISTRATION', 'LOGIN', 'LOGOUT', 'COURSE_OPENED',
                'COURSE_ENROLLED', 'COURSE_COMPLETED',
                'LESSON_OPENED', 'LESSON_COMPLETED', 'QUIZ_STARTED',
                'QUIZ_SUBMITTED', 'QUIZ_PASSED', 'QUIZ_FAILED',
                'CERTIFICATE_ELIGIBLE', 'ASSESSMENT_COMPLETED', 'PAYMENT_INITIATED',
                'PAYMENT_SUCCESSFUL', 'CERTIFICATE_DOWNLOADED',
                'CERTIFICATE_VERIFIED'
            ),
            allowNull: false
        },
        details: { type: DataTypes.STRING },
        ipAddress: { type: DataTypes.STRING }
    });
    return Activity;
};