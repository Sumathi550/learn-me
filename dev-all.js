/**
 * Learn Me - Local Multi-Service Development Server Launcher
 * Launches Backend API (5000), Student Web (3000), Admin Web (3001), and Frontend (5500) concurrently.
 */
const { spawn } = require('child_process');
const path = require('path');
const net = require('net');

console.log('===========================================================');
console.log('       LEARN ME - MULTI-TIER PRODUCTION ARCHITECTURE       ');
console.log('===========================================================');
console.log('🚀 Initializing all services locally...\n');

function isPortInUse(port) {
    return new Promise((resolve) => {
        const socket = new net.Socket();
        socket.setTimeout(300);
        socket.once('connect', () => {
            socket.destroy();
            resolve(true);
        });
        socket.once('timeout', () => {
            socket.destroy();
            resolve(false);
        });
        socket.once('error', () => {
            resolve(false);
        });
        socket.connect(port, '127.0.0.1');
    });
}

const spawnedProcesses = [];

function runProcess(name, command, args, cwd) {
    const proc = spawn(command, args, {
        cwd: cwd || __dirname,
        stdio: 'inherit'
    });

    proc.on('close', (code) => {
        if (code !== 0 && code !== null) {
            console.log(`[${name}] Process exited with code ${code}`);
        }
    });

    spawnedProcesses.push({ name, proc });
    return proc;
}

async function startAll() {
    const nodeExec = process.execPath;

    // 1. Backend Central API (Port 5000) & SQLite Database
    const backendRunning = await isPortInUse(5000);
    if (backendRunning) {
        console.log('   📡 Backend Cloud API:  http://localhost:5000 [ALREADY ACTIVE]');
        console.log('   🗄️  Database:           SQLite (Connected to backend/data/learnme.sqlite)');
    } else {
        console.log('   📡 Backend Cloud API:  Starting on http://localhost:5000...');
        console.log('   🗄️  Database:           SQLite (Connecting via backend/data/learnme.sqlite)...');
        runProcess('Backend API', nodeExec, ['backend/server.js']);
    }

    // 2. Student Website (Port 3000)
    const studentRunning = await isPortInUse(3000);
    if (studentRunning) {
        console.log('   🎓 Student Website:    http://localhost:3000 [ALREADY ACTIVE]');
    } else {
        console.log('   🎓 Student Website:    Starting on http://localhost:3000...');
        runProcess('Student Web', nodeExec, ['serve-static.js', '3000', 'student-web']);
    }

    // 3. Admin Website (Port 3001)
    const adminRunning = await isPortInUse(3001);
    if (adminRunning) {
        console.log('   🛡️  Admin Website:      http://localhost:3001 [ALREADY ACTIVE]');
    } else {
        console.log('   🛡️  Admin Website:      Starting on http://localhost:3001...');
        runProcess('Admin Web', nodeExec, ['serve-static.js', '3001', 'admin-web']);
    }

    // 4. Frontend Legacy & Live DB Explorer (Port 5500)
    const frontendRunning = await isPortInUse(5500);
    if (frontendRunning) {
        console.log('   🌐 Frontend Explorer:  http://localhost:5500 [ALREADY ACTIVE]');
    } else {
        console.log('   🌐 Frontend Explorer:  Starting on http://localhost:5500...');
        runProcess('Frontend Explorer', nodeExec, ['serve-static.js', '5500', 'frontend']);
    }

    console.log('\n===========================================================');
    console.log('✨ All systems connected! Access URLs:');
    console.log('   • 🎓 Student Portal:     http://localhost:3000');
    console.log('   • 🛡️  Admin Dashboard:   http://localhost:3001');
    console.log('   • 🗄️  Database Viewer:   http://localhost:5500/database.html');
    console.log('   • 📡 Central Cloud API:  http://localhost:5000/api/health');
    console.log('===========================================================\n');
}

startAll();

process.on('SIGINT', () => {
    console.log('\n🛑 Gracefully shutting down all launched services...');
    spawnedProcesses.forEach(({ name, proc }) => {
        try {
            proc.kill();
        } catch (e) {}
    });
    process.exit(0);
});

