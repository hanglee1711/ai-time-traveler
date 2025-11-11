@echo off
title VIỆT KÝ SỬ - Game Launcher
color 0A

echo ========================================
echo    VIỆT KÝ SỬ - GAME LAUNCHER
echo ========================================
echo.
echo Starting backend and frontend servers...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH!
    echo Please install Python from https://www.python.org/
    pause
    exit /b 1
)

echo [OK] Python detected
echo.

REM Start Backend in a new window
echo [1/2] Starting Backend API...
start "VIỆT KÝ SỬ - Backend" cmd /k "cd backend && python app.py"
timeout /t 3 /nobreak >nul

echo [OK] Backend started at http://localhost:5000
echo.

REM Start Frontend in a new window
echo [2/2] Starting Frontend...
start "VIỆT KÝ SỬ - Frontend" cmd /k "cd frontend && python -m http.server 8000"
timeout /t 3 /nobreak >nul

echo [OK] Frontend started at http://localhost:8000
echo.

REM Wait a bit for servers to fully start
echo Waiting for servers to initialize...
timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo    SERVERS ARE READY!
echo ========================================
echo.
echo Backend API: http://localhost:5000
echo Frontend:    http://localhost:8000
echo Game Page:   http://localhost:8000/game.html
echo.
echo Opening game in your default browser...
timeout /t 2 /nobreak >nul

REM Open game in default browser
start http://localhost:8000/game.html

echo.
echo Game is now running!
echo.
echo Press any key to stop all servers and close...
pause >nul

REM Kill the server windows
taskkill /FI "WindowTitle eq VIỆT KÝ SỬ - Backend*" /F >nul 2>&1
taskkill /FI "WindowTitle eq VIỆT KÝ SỬ - Frontend*" /F >nul 2>&1

echo.
echo Servers stopped. Goodbye!
timeout /t 2 /nobreak >nul
