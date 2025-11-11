@echo off
chcp 65001 >nul
title VIỆT KÝ SỬ - Open All Links
color 0E

echo ╔════════════════════════════════════════════════════════════════╗
echo ║         VIỆT KÝ SỬ - OPEN DEMO LINKS                     ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Check if servers are running
echo [*] Checking servers...
echo.

REM Check Backend
curl -s http://localhost:5000/api/health >nul 2>&1
if %errorlevel% equ 0 (
    echo [✓] Backend: RUNNING at http://localhost:5000
) else (
    echo [✗] Backend: NOT RUNNING!
    echo.
    echo Please start backend first:
    echo   cd backend
    echo   python app.py
    echo.
    pause
    exit /b 1
)

REM Check Frontend
curl -s http://localhost:8000 >nul 2>&1
if %errorlevel% equ 0 (
    echo [✓] Frontend: RUNNING at http://localhost:8000
) else (
    echo [✗] Frontend: NOT RUNNING!
    echo.
    echo Please start frontend first:
    echo   cd frontend
    echo   python -m http.server 8000
    echo.
    pause
    exit /b 1
)

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                  SERVERS ARE READY!                            ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

echo Opening demo links...
echo.

echo [1/5] Opening Home...
start http://localhost:8000/index.html
timeout /t 2 /nobreak >nul

echo [2/5] Opening Chatbot (MAIN DEMO)...
start http://localhost:8000/chatbot.html
timeout /t 2 /nobreak >nul

echo [3/5] Opening Game...
start http://localhost:8000/game.html
timeout /t 2 /nobreak >nul

echo [4/5] Opening Timeline...
start http://localhost:8000/timeline.html
timeout /t 2 /nobreak >nul

echo [5/5] Opening Journey...
start http://localhost:8000/journey.html
timeout /t 2 /nobreak >nul

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                   ALL LINKS OPENED!                            ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo Tabs opened in your browser:
echo   • Home:     http://localhost:8000/
echo   • Chatbot:  http://localhost:8000/chatbot.html  ⭐
echo   • Game:     http://localhost:8000/game.html
echo   • Timeline: http://localhost:8000/timeline.html
echo   • Journey:  http://localhost:8000/journey.html
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║  DEMO CHATBOT - TẠI TAB "CHATBOT"                              ║
echo ╠════════════════════════════════════════════════════════════════╣
echo ║  1. Click "Trần Hưng Đạo" ở sidebar                           ║
echo ║  2. Hỏi: "Anh đã đánh thắng Mông Cổ như thế nào?"            ║
echo ║  3. Xem AI trả lời chi tiết & chân thực!                      ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

pause
