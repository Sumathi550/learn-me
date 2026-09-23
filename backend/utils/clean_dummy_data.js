/**
 * Learn Me - Clean Dummy & Test Data Utility
 * Purges all fake/test accounts, mock certificates, test progress, and test activity logs.
 * Preserves Owner Admin account, courses, categories, and settings.
 */
const { 
    sequelize, 
    User, 
    Certificate, 
    Progress, 
    Enrollment, 
    Activity, 
    QuizAttempt, 
    AdminAuditLog, 
    CertificatePayment 
} = require('../models');
const { AUTHORIZED_ADMIN_EMAIL } = require('../middleware/authMiddleware');

async function cleanDummyData() {
    console.log('🧹 Starting cleanup of dummy and test data from Learn Me database...');

    try {
        await sequelize.authenticate();
        console.log('✅ Connected to database successfully.');

        const adminEmail = (AUTHORIZED_ADMIN_EMAIL || 'sumathiaz550@gmail.com').toLowerCase();

        // 1. Delete all non-admin users
        const deletedUsers = await User.destroy({
            where: sequelize.where(
                sequelize.fn('lower', sequelize.col('email')),
                { [sequelize.Sequelize.Op.ne]: adminEmail }
            )
        });
        console.log(`🗑️ Deleted ${deletedUsers} dummy/test user account(s).`);

        // 2. Delete all certificates
        const deletedCerts = await Certificate.destroy({
            where: {},
            truncate: false
        });
        console.log(`🗑️ Deleted ${deletedCerts} mock certificate(s).`);

        // 3. Delete all progress records
        const deletedProgress = await Progress.destroy({
            where: {},
            truncate: false
        });
        console.log(`🗑️ Deleted ${deletedProgress} test progress record(s).`);

        // 4. Delete all enrollments
        const deletedEnrollments = await Enrollment.destroy({
            where: {},
            truncate: false
        });
        console.log(`🗑️ Deleted ${deletedEnrollments} dummy enrollment(s).`);

        // 5. Delete all student activity logs
        const deletedActivities = await Activity.destroy({
            where: {},
            truncate: false
        });
        console.log(`🗑️ Deleted ${deletedActivities} mock activity log(s).`);

        // 6. Delete all quiz attempts
        const deletedQuizAttempts = await QuizAttempt.destroy({
            where: {},
            truncate: false
        });
        console.log(`🗑️ Deleted ${deletedQuizAttempts} mock quiz attempt(s).`);

        // 7. Delete all certificate payments
        const deletedPayments = await CertificatePayment.destroy({
            where: {},
            truncate: false
        });
        console.log(`🗑️ Deleted ${deletedPayments} mock payment record(s).`);

        // 8. Delete test audit logs (keep clean)
        const deletedAuditLogs = await AdminAuditLog.destroy({
            where: {},
            truncate: false
        });
        console.log(`🗑️ Deleted ${deletedAuditLogs} mock audit log(s).`);

        // Verify Owner Admin still exists
        const adminUser = await User.findOne({ 
            where: { email: adminEmail }
        });

        if (adminUser) {
            console.log(`👑 Verified Owner Admin account is active: ${adminUser.name} (${adminUser.email})`);
        } else {
            console.warn(`⚠️ Warning: Admin account was not found. Seed will re-create it.`);
        }

        console.log('\n✨ Learn Me database is now 100% clean and ready for real users!');
        return true;
    } catch (error) {
        console.error('❌ Error during data cleanup:', error.message);
        throw error;
    }
}

if (require.main === module) {
    cleanDummyData()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
}

module.exports = cleanDummyData;
