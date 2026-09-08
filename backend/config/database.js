const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');
const net = require('net');
require('dotenv').config();

const dialect = (process.env.DB_DIALECT || 'sqlite').toLowerCase();
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
    try {
        fs.mkdirSync(dataDir, { recursive: true });
    } catch (e) {}
}

const sqlitePath = path.join(dataDir, 'learnme.sqlite');

let sequelize;
if (dialect === 'mysql') {
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
            console.log(`SQLite database connected successfully: ${sqlitePath}`);
            console.log(`Learn Me database ready (dialect: sqlite)`);
            return true;
        } catch (error) {
            console.error('SQLite connection error:', error.message);
            return false;
        }
    }

    const host = process.env.DB_HOST || '127.0.0.1';
    const port = Number(process.env.DB_PORT) || 3306;
    const databaseAvailable = await new Promise(resolve => {
        const socket = net.createConnection({ host, port });
        const finish = available => {
            socket.destroy();
            resolve(available);
        };
        socket.once('connect', () => finish(true));
        socket.once('error', () => finish(false));
        socket.setTimeout(1000, () => finish(false));
    });

    if (!databaseAvailable) {
        console.error(`Unable to connect to MySQL database: ${host}:${port} is unavailable`);
        return false;
    }

    try {
        await sequelize.authenticate();
        await sequelize.sync();
        console.log(`MySQL connected successfully at ${host}:${port}`);
        console.log(`Learn Me database ready: ${process.env.DB_NAME || 'learnme'}`);
        return true;
    } catch (error) {
        console.error('Unable to connect to the database:', error.message);
        await sequelize.close();
        return false;
    }
}

module.exports = { sequelize, connectDB };