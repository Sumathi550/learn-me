/**
 * Learn Me - Environment Configuration Loader
 */
require('dotenv').config();

const env = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: Number(process.env.PORT) || 5000,
    DATABASE_URL: process.env.DATABASE_URL || '',
    DB_DIALECT: (process.env.DB_DIALECT || 'sqlite').toLowerCase(),
    DB_HOST: process.env.DB_HOST || '127.0.0.1',
    DB_PORT: Number(process.env.DB_PORT) || 5432,
    DB_NAME: process.env.DB_NAME || 'learnme',
    DB_USER: process.env.DB_USER || 'postgres',
    DB_PASSWORD: process.env.DB_PASSWORD || '',
    JWT_SECRET: process.env.JWT_SECRET || 'learn_me_super_secret_jwt_key_2026_production_grade',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'learn_me_super_secret_refresh_key_2026',
    STUDENT_WEB_URL: process.env.STUDENT_WEB_URL || 'http://localhost:3000',
    ADMIN_WEB_URL: process.env.ADMIN_WEB_URL || 'http://localhost:3001',
    CORS_ORIGINS: process.env.CORS_ORIGINS || '',
    ADMIN_INITIAL_PASSWORD: process.env.ADMIN_INITIAL_PASSWORD || 'Sumathi@12345'
};

module.exports = env;
