const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');
const net = require('net');
require('dotenv').config();

const isServerless = Boolean(process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.LAMBDA_TASK_ROOT);
const dataDir = isServerless ? '/tmp' : path.join(__dirname, '..', 'data');

if (!fs.existsSync(dataDir)) {
    try {
        fs.mkdirSync(dataDir, { recursive: true });
    } catch (e) {}
}

const isTest = process.env.NODE_ENV === 'test';
const sqlitePath = isTest 
    ? path.join(dataDir, 'learnme_test.sqlite')
    : path.join(dataDir, 'learnme.sqlite');

// Determine database dialect and connection strategy
let dialect = (process.env.DB_DIALECT || '').toLowerCase();
const databaseUrl = process.env.DATABASE_URL || '';

if (!dialect) {
    if (databaseUrl.startsWith('postgres://') || databaseUrl.startsWith('postgresql://')) {
        dialect = 'postgres';
    } else if (databaseUrl.startsWith('mysql://')) {
        dialect = 'mysql';
    } else {
        dialect = 'sqlite';
    }
}

// In serverless or test mode, copy pre-seeded SQLite database if target doesn't already exist
if ((isServerless || isTest) && dialect === 'sqlite' && !fs.existsSync(sqlitePath)) {
    const seedPath = path.join(__dirname, '..', 'data', 'learnme.sqlite');
    if (fs.existsSync(seedPath)) {
        try {
            fs.copyFileSync(seedPath, sqlitePath);
            console.log(`Copied initial SQLite database to isolated test/serverless path: ${sqlitePath}`);
        } catch (err) {
            console.warn('Could not copy initial SQLite to test/serverless path:', err.message);
        }
    }
}

let sequelize;

if (databaseUrl && (dialect === 'postgres' || dialect === 'postgresql')) {
    // Cloud Managed PostgreSQL via Connection String (Neon, Supabase, Render, Railway, etc.)
    sequelize = new Sequelize(databaseUrl, {
        dialect: 'postgres',
        logging: false,
        dialectOptions: {
            ssl: process.env.DB_SSL === 'false' ? false : {
                require: true,
                rejectUnauthorized: false
            }
        },
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        define: {
            underscored: true
        }
    });
} else if (dialect === 'postgres' || dialect === 'postgresql') {
    // Standard PostgreSQL via Host/Port parameters
    sequelize = new Sequelize(
        process.env.DB_NAME || 'learnme',
        process.env.DB_USER || 'postgres',
        process.env.DB_PASSWORD || '',
        {
            host: process.env.DB_HOST || '127.0.0.1',
            port: Number(process.env.DB_PORT) || 5432,
            dialect: 'postgres',
            logging: false,
            dialectOptions: process.env.DB_SSL === 'true' ? {
                ssl: { require: true, rejectUnauthorized: false }
            } : {},
            pool: {
                max: 10,
                min: 0,
                acquire: 30000,
                idle: 10000
            },
            define: {
                underscored: true
            }
        }
    );
} else if (dialect === 'mysql') {
    sequelize = new Sequelize(
        process.env.DB_NAME || 'learnme',
        process.env.DB_USER || 'root',
        process.env.DB_PASSWORD || '',
        {
            host: process.env.DB_HOST || '127.0.0.1',
            dialect: 'mysql',
            port: process.env.DB_PORT || 3306,
            logging: false,
            define: {
                underscored: true
            }
        }
    );
} else {
    // Default: SQLite Database for local development
    dialect = 'sqlite';
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: sqlitePath,
        logging: false,
        define: {
            underscored: true
        }
    });
}

async function connectDB() {
    if (dialect === 'sqlite') {
        try {
            await sequelize.authenticate();
            await sequelize.sync();

            // Safe column additions for progress and courses tables in SQLite
            try {
                const [cols] = await sequelize.query("PRAGMA table_info('progress');");
                const colNames = (cols || []).map(c => c.name);
                if (!colNames.includes('completed_modules')) {
                    await sequelize.query("ALTER TABLE progress ADD COLUMN completed_modules TEXT DEFAULT '[]';");
                }
                if (!colNames.includes('total_modules')) {
                    await sequelize.query("ALTER TABLE progress ADD COLUMN total_modules INTEGER DEFAULT 0;");
                }
                if (!colNames.includes('quizzes_completed')) {
                    await sequelize.query("ALTER TABLE progress ADD COLUMN quizzes_completed INTEGER DEFAULT 0;");
                }
                if (!colNames.includes('total_quizzes')) {
                    await sequelize.query("ALTER TABLE progress ADD COLUMN total_quizzes INTEGER DEFAULT 1;");
                }
                if (!colNames.includes('completed_lesson_ids')) {
                    await sequelize.query("ALTER TABLE progress ADD COLUMN completed_lesson_ids TEXT DEFAULT '[]';");
                }
                if (!colNames.includes('completed_quizzes')) {
                    await sequelize.query("ALTER TABLE progress ADD COLUMN completed_quizzes TEXT DEFAULT '[]';");
                }

                const [courseCols] = await sequelize.query("PRAGMA table_info('courses');");
                const courseColNames = (courseCols || []).map(c => c.name);
                if (!courseColNames.includes('quizzes')) {
                    await sequelize.query("ALTER TABLE courses ADD COLUMN quizzes TEXT DEFAULT '[]';");
                }
            } catch (migErr) {
                console.warn('Database column migration check notice:', migErr.message);
            }

            console.log(`SQLite database connected successfully: ${sqlitePath}`);
            console.log(`Learn Me database ready (dialect: sqlite)`);
            return true;
        } catch (error) {
            console.error('SQLite connection error:', error.message);
            return false;
        }
    }

    // Remote PostgreSQL / MySQL connection verification
    const host = process.env.DB_HOST || (databaseUrl ? new URL(databaseUrl).hostname : '127.0.0.1');
    const port = Number(process.env.DB_PORT) || (dialect.includes('postgres') ? 5432 : 3306);

    try {
        await sequelize.authenticate();
        await sequelize.sync();
        console.log(`Cloud ${dialect.toUpperCase()} database connected successfully: ${host}:${port}`);
        console.log(`Learn Me database ready (engine: ${dialect})`);
        return true;
    } catch (error) {
        console.error(`Unable to connect to ${dialect.toUpperCase()} database at ${host}:${port}:`, error.message);
        return false;
    }
}

module.exports = { sequelize, connectDB, dialect, sqlitePath };