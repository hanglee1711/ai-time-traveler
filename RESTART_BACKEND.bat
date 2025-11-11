@echo off
title VIỆT KÝ SỬ - Restart Backend
color 0A

echo ========================================
echo   RESTART BACKEND - VIỆT KÝ SỬ
echo ========================================
echo.

REM Kill existing backend processes
echo Stopping existing backend...
taskkill /FI "WindowTitle eq *Backend*" /F >nul 2>&1
timeout /t 1 /nobreak >nul

echo.
echo Starting new backend with Gemini 2.5...
echo.

REM Start new backend
cd backend
start "VIỆT KÝ SỬ - Backend" cmd /k "python app.py"

timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo   BACKEND RESTARTED!
echo ========================================
echo.
echo Backend is running at: http://localhost:5000
echo.
echo Now open your browser:
echo   http://localhost:8000/chatbot.html
echo.
echo Try asking:
echo   "Xin chao Tran Hung Dao"
echo   "Anh da danh thang Mong Co nhu the nao?"
echo.
pause
