require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/database');
const seedDatabase = require('./utils/seedData');

const port = Number(process.env.PORT) || 5000;

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection encountered:', reason && reason.message ? reason.message : reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception encountered:', error.message);
});

let serverInstance = null;

if (require.main === module) {
    serverInstance = app.listen(port, () => {
        console.log(`🚀 Learn Me Central Cloud API listening on http://localhost:${port}`);
        console.log(`📡 CORS allowed origins: Student (${process.env.STUDENT_WEB_URL || 'http://localhost:3000'}), Admin (${process.env.ADMIN_WEB_URL || 'http://localhost:3001'})`);
    });

    connectDB()
        .then(databaseReady => {
            if (databaseReady) {
                return seedDatabase();
            }
        })
        .catch(error => {
            console.error('Database initialization warning:', error.message);
        });
}

module.exports = app;
