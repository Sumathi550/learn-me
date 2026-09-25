/**
 * Learn Me - Zero-Dependency Static File Server for Local Development
 * 
 * Usage:
 *   node serve-static.js <PORT> <DIRECTORY>
 * Examples:
 *   node serve-static.js 3000 student-web
 *   node serve-static.js 3001 admin-web
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const port = Number(process.argv[2]) || 3000;
const targetDirName = process.argv[3] || 'student-web';
const baseDir = path.resolve(__dirname, targetDirName);

const MIME_TYPES = {
    '.html': 'text/html; charset=UTF-8',
    '.js': 'application/javascript; charset=UTF-8',
    '.css': 'text/css; charset=UTF-8',
    '.json': 'application/json; charset=UTF-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
    // Add open CORS for local development
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    let parsedUrl = new URL(req.url, `http://localhost:${port}`);
    let pathname = decodeURIComponent(parsedUrl.pathname);

    // Dynamic public environment configuration endpoint for frontend
    if (pathname === '/env.js') {
        const rootEnvPath = path.resolve(__dirname, '.env');
        let envVars = {};
        if (fs.existsSync(rootEnvPath)) {
            const lines = fs.readFileSync(rootEnvPath, 'utf8').split('\n');
            for (const line of lines) {
                const trimmed = line.trim();
                if (trimmed && !trimmed.startsWith('#')) {
                    const idx = trimmed.indexOf('=');
                    if (idx !== -1) {
                        const key = trimmed.slice(0, idx).trim();
                        const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
                        if (key.startsWith('VITE_') || key.startsWith('SUPABASE_')) {
                            envVars[key] = val;
                        }
                    }
                }
            }
        }
        res.writeHead(200, { 'Content-Type': 'application/javascript; charset=UTF-8' });
        res.end(`window.__ENV__ = Object.assign(window.__ENV__ || {}, ${JSON.stringify(envVars)});\nwindow.VITE_SUPABASE_URL = window.__ENV__.VITE_SUPABASE_URL || '';\nwindow.VITE_SUPABASE_PUBLISHABLE_KEY = window.__ENV__.VITE_SUPABASE_PUBLISHABLE_KEY || '';`);
        return;
    }

    let filePath = path.join(baseDir, pathname);

    // If requesting directory or root, serve index.html
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
    } else if (!fs.existsSync(filePath) && !path.extname(filePath)) {
        // Try appending .html
        if (fs.existsSync(filePath + '.html')) {
            filePath = filePath + '.html';
        }
    }

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(`<h1>404 Not Found</h1><p>The file <code>${pathname}</code> was not found in <code>${targetDirName}</code>.</p>`);
        return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
});

server.listen(port, () => {
    console.log(`🌐 [${targetDirName}] Serving at http://localhost:${port}`);
});
