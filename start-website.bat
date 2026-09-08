@echo off
echo ====================================================
echo Starting Learn Me Full-Stack Web Platform...
echo Backend API + Frontend UI on http://localhost:5000
echo ====================================================

timeout /t 2 /nobreak >nul
start http://localhost:5000
node backend/server.js
pause
