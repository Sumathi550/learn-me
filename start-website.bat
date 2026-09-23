@echo off
echo ============================================================
echo   Starting Learn Me Production Architecture Platform
echo   - Student Website:  http://localhost:3000
echo   - Admin Dashboard:  http://localhost:3001
echo   - Central REST API: http://localhost:5000
echo ============================================================

timeout /t 2 /nobreak >nul
start http://localhost:3000
start http://localhost:3001
node dev-all.js
pause
