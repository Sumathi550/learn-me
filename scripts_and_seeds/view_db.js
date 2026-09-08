const { User, Course, Enrollment, Progress, Certificate, Activity } = require('../backend/models');

async function viewDatabase() {
    console.log('====================================================');
    console.log('             LEARN ME - DATABASE VIEWER             ');
    console.log('====================================================\n');

    try {
        const users = await User.findAll({ attributes: ['id', 'name', 'email', 'role', 'createdAt'], raw: true });
        console.log(`📌 USERS (${users.length}):`);
        console.table(users);

        const courses = await Course.findAll({ attributes: ['courseId', 'title', 'category', 'difficulty', 'status'], raw: true });
        console.log(`\n📚 COURSES (${courses.length}):`);
        console.table(courses);

        const enrollments = await Enrollment.findAll({ attributes: ['id', 'userId', 'courseId', 'status', 'enrolledAt'], raw: true });
        console.log(`\n🎓 ENROLLMENTS (${enrollments.length}):`);
        if (enrollments.length > 0) console.table(enrollments);
        else console.log('  (No enrollments yet)');

        const certificates = await Certificate.findAll({ attributes: ['certificateId', 'userName', 'courseName', 'score', 'status'], raw: true });
        console.log(`\n🏆 CERTIFICATES (${certificates.length}):`);
        if (certificates.length > 0) console.table(certificates);
        else console.log('  (No certificates issued yet)');

        const activities = await Activity.findAll({ attributes: ['action', 'details', 'createdAt'], limit: 5, order: [['createdAt', 'DESC']], raw: true });
        console.log(`\n⚡ RECENT ACTIVITY (Last 5):`);
        if (activities.length > 0) console.table(activities);
        else console.log('  (No activities logged)');

        console.log('\n====================================================');
    } catch (error) {
        console.error('Error querying database:', error.message);
    } finally {
        process.exit(0);
    }
}

viewDatabase();
