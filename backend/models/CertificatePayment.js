module.exports = (sequelize, DataTypes) => {
    const CertificatePayment = sequelize.define('CertificatePayment', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        userId: { type: DataTypes.UUID, allowNull: false },
        transactionId: { type: DataTypes.STRING, allowNull: false, unique: true },
        userName: { type: DataTypes.STRING, allowNull: false },
        userEmail: { type: DataTypes.STRING, allowNull: false },
        certificateId: { type: DataTypes.STRING, allowNull: false },
        courseId: { type: DataTypes.STRING, allowNull: false },
        courseTitle: { type: DataTypes.STRING, allowNull: false },
        amount: { type: DataTypes.FLOAT, allowNull: false },
        category: { type: DataTypes.STRING, defaultValue: 'General' },
        paymentMethod: { type: DataTypes.ENUM('UPI_GATEWAY', 'UPI_QR_MANUAL'), defaultValue: 'UPI_GATEWAY' },
        purpose: { type: DataTypes.ENUM('CERTIFICATE', 'COURSE_ACCESS'), defaultValue: 'CERTIFICATE' },
        paymentStatus: {
            type: DataTypes.ENUM('Pending', 'Successful', 'Failed', 'Refunded', 'Manual Verification Required', 'PENDING', 'APPROVED', 'REJECTED', 'PAID', 'FAILED', 'REFUNDED'),
            defaultValue: 'PENDING'
        },
        utrNumber: { type: DataTypes.STRING },
        paymentProofUrl: { type: DataTypes.STRING },
        verifiedByAdmin: { type: DataTypes.BOOLEAN, defaultValue: false },
        verifiedAt: { type: DataTypes.DATE },
        adminNotes: { type: DataTypes.TEXT }
    });
    return CertificatePayment;
};