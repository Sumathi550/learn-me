const serverless = require('serverless-http');
const app = require('../../backend/server');
const { connectDB } = require('../../backend/config/database');
const seedDatabase = require('../../backend/utils/seedData');

let isInitialized = false;

// Configure serverless handler
const serverlessHandler = serverless(app);

module.exports.handler = async (event, context) => {
    // Enable background db connection across serverless invocations
    context.callbackWaitsForEmptyEventLoop = false;

    // Normalize path: rewrite /.netlify/functions/api/... to /api/... so Express routes match seamlessly
    if (event.path && event.path.startsWith('/.netlify/functions/api')) {
        event.path = event.path.replace('/.netlify/functions/api', '/api');
        if (event.path === '/api' || event.path === '/api/') {
            event.path = '/api/health';
        }
    }

    // Lazy initialize database and seeds on cold start
    if (!isInitialized) {
        try {
            const dbReady = await connectDB();
            if (dbReady) {
                await seedDatabase();
            }
            isInitialized = true;
        } catch (err) {
            console.error('Netlify Serverless DB Initialization Warning:', err.message);
        }
    }

    return serverlessHandler(event, context);
};
