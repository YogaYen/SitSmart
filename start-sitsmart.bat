@echo off
title SitSmart - AI Ergonomics Live Platform
echo ===================================================
echo   SitSmart - AI Ergonomics Live Platform
echo   Tagline: Sit Smart, Work Better
echo   Advancing UN SDG 3: Good Health ^& Well-being
echo ===================================================
echo.
echo Starting Backend API Server (Port 5000)...
start "SitSmart Backend API" cmd /k "cd /d %~dp0server && npm run dev"

echo Starting Frontend Vite Client (Port 5173)...
start "SitSmart Frontend Web" cmd /k "cd /d %~dp0client && npm run dev"

timeout /t 3 >nul
echo.
echo Opening SitSmart Web Platform in your default browser...
start http://localhost:5173

echo.
echo ===================================================
echo   SitSmart is running!
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:5000
echo   Health:   http://localhost:5000/healthz
echo ===================================================
echo Keep this terminal or minimized windows open while using SitSmart.
