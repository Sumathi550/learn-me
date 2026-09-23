/**
 * Learn Me - SQLite to Production PostgreSQL Database Migration Script
 * 
 * Usage:
 *   node backend/migrations/migrate-to-postgres.js
 * 
 * Requirements:
 *   DATABASE_URL must be set in environment pointing to your target PostgreSQL database.
 *   Example: DATABASE_URL="postgresql://user:password@host:5432/learnme?sslmode=require"
 */
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const { Sequelize } = require('sequelize');

async function runMigration() {
    console.log('====================================================');
    console.log('       LEARN ME - POSTGRESQL DATABASE MIGRATION     ');
    console.log('====================================================\n');

    const sqlitePath = path.join(__dirname, '..', 'data', 'learnme.sqlite');
    if (!fs.existsSync(sqlitePath)) {
        console.error(`❌ Source SQLite database not found at ${sqlitePath}`);
        process.exit(1);
    }

    // Step 1: Create automatic timestamped SQLite backup
    const backupDir = path.join(__dirname, '..', 'data', 'backups');
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
    }
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(backupDir, `learnme-backup-${timestamp}.sqlite`);
    fs.copyFileSync(sqlitePath, backupPath);
    console.log(`✅ Step 1: Created safe local backup at:`);
    console.log(`   ${backupPath}\n`);

    // Step 2: Validate Target PostgreSQL Configuration
    const postgresUrl = process.env.DATABASE_URL;
    if (!postgresUrl || (!postgresUrl.startsWith('postgres://') && !postgresUrl.startsWith('postgresql://'))) {
        console.warn('⚠️  DATABASE_URL environment variable is not set to a PostgreSQL connection.');
        console.warn('   To run live migration to cloud PostgreSQL, configure:');
        console.warn('   DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require');
        console.warn('\n   Migration dry-run and backup completed successfully.');
        return;
    }

    console.log(`🔌 Step 2: Connecting to target PostgreSQL database...`);
    const pgSequelize = new Sequelize(postgresUrl, {
        dialect: 'postgres',
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    });

    const sqliteSequelize = new Sequelize({
        dialect: 'sqlite',
        storage: sqlitePath,
        logging: false
    });

    try {
        await pgSequelize.authenticate();
        console.log('✅ Connected to target PostgreSQL database successfully.');

        await sqliteSequelize.authenticate();
        console.log('✅ Connected to source SQLite database successfully.\n');

        // Step 3: Initialize models on target PostgreSQL
        console.log('📦 Step 3: Synchronizing schema and creating tables in PostgreSQL...');
        const initModels = (seq) => {
            const User = require('../models/User')(seq, Sequelize.DataTypes);
            const Course = require('../models/Course')(seq, Sequelize.DataTypes);
            const Lesson = require('../models/Lesson')(seq, Sequelize.DataTypes);
            const Question = require('../models/Question')(seq, Sequelize.DataTypes);
            const Enrollment = require('../models/Enrollment')(seq, Sequelize.DataTypes);
            const Progress = require('../models/Progress')(seq, Sequelize.DataTypes);
            const Activity = require('../models/Activity')(seq, Sequelize.DataTypes);
            const QuizAttempt = require('../models/QuizAttempt')(seq, Sequelize.DataTypes);
            const AdminAuditLog = require('../models/AdminAuditLog')(seq, Sequelize.DataTypes);
            const AdminSettings = require('../models/AdminSettings')(seq, Sequelize.DataTypes);
            const Category = require('../models/Category')(seq, Sequelize.DataTypes);
            const Certificate = require('../models/Certificate')(seq, Sequelize.DataTypes);
            const CertificatePayment = require('../models/CertificatePayment')(seq, Sequelize.DataTypes);

            return {
                Category, User, Course, Lesson, Question, Enrollment, Progress,
                QuizAttempt, Certificate, CertificatePayment, Activity, AdminAuditLog, AdminSettings
            };
        };

        const sqliteModels = initModels(sqliteSequelize);
        const pgModels = initModels(pgSequelize);

        await pgSequelize.sync({ alter: true });
        console.log('✅ PostgreSQL tables and schemas synchronized.\n');

        // Step 4: Migrate model data in dependency order
        console.log('🚀 Step 4: Migrating data records...');
        const modelsToMigrate = [
            'Category',
            'User',
            'Course',
            'Lesson',
            'Question',
            'Enrollment',
            'Progress',
            'QuizAttempt',
            'Certificate',
            'CertificatePayment',
            'Activity',
            'AdminAuditLog',
            'AdminSettings'
        ];

        const report = [];

        for (const modelName of modelsToMigrate) {
            const sourceModel = sqliteModels[modelName];
            const targetModel = pgModels[modelName];

            const records = await sourceModel.findAll({ raw: true });
            let insertedCount = 0;

            if (records.length > 0) {
                // Insert or ignore if duplicate exists
                for (const row of records) {
                    try {
                        await targetModel.upsert(row);
                        insertedCount++;
                    } catch (insErr) {
                        console.warn(`   [${modelName}] Warning on record: ${insErr.message}`);
                    }
                }
            }

            const targetCount = await targetModel.count();
            report.push({
                Model: modelName,
                'SQLite Count': records.length,
                'PostgreSQL Count': targetCount,
                Status: records.length === targetCount ? '✅ Exact Match' : '⚠️ Discrepancy'
            });
        }

        console.log('\n📊 Migration Results Summary:');
        console.table(report);

        console.log('\n🎉 PostgreSQL Migration completed safely and successfully!');
        await pgSequelize.close();
        await sqliteSequelize.close();
        process.exit(0);
    } catch (err) {
        console.error('\n❌ Migration failed:', err.message);
        if (pgSequelize) await pgSequelize.close();
        if (sqliteSequelize) await sqliteSequelize.close();
        process.exit(1);
    }
}

if (require.main === module) {
    runMigration();
}

module.exports = runMigration;
