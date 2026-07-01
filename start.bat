@echo off
echo Starting Stock News App...
start "Backend" cmd /k "cd /d C:\Users\dwish\Downloads\stock-news-app\backend && node index.js"
timeout /t 2 /nobreak >nul
start "Frontend" cmd /k "cd /d C:\Users\dwish\Downloads\stock-news-app\frontend && npm run dev"
timeout /t 3 /nobreak >nul
start http://localhost:5173
