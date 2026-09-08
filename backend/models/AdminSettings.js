module.exports = (sequelize, DataTypes) => {
    const AdminSettings = sequelize.define('AdminSettings', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        siteName: { type: DataTypes.STRING, defaultValue: 'Learn Me Platform' },
        normalCertificatePrice: { type: DataTypes.FLOAT, defaultValue: 10 },
        aptitudeCertificatePrice: { type: DataTypes.FLOAT, defaultValue: 100 },
        upiId: { type: DataTypes.STRING, defaultValue: 'sumathiaz550@upi' },
        qrImageUrl: { type: DataTypes.STRING, defaultValue: '' },
        paymentInstructions: { type: DataTypes.STRING },
        contactEmail: { type: DataTypes.STRING, defaultValue: 'sumathiaz550@gmail.com' }
    });
    return AdminSettings;
};