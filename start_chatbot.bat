@echo off
chcp 65001 >nul
echo ============================================================
echo VIET KY SU - Chatbot Interface
echo ============================================================
echo.
echo Starting Backend Server...
echo.

cd /d "%~dp0"
start "VIET KY SU Backend" python backend/app.py

echo.
echo Waiting for server to start...
timeout /t 5 /nobreak >nul

echo.
echo Opening Chatbot in browser...
start "" http://localhost:5000/chatbot.html

echo.
echo ============================================================
echo Chatbot is ready!
echo.
echo Backend Server: http://localhost:5000
echo Chatbot: http://localhost:5000/chatbot.html
echo.
echo Press any key to keep backend running...
echo (Do NOT close this window or backend will stop)
echo ============================================================
pause >nul
