@echo off
chcp 65001 >nul
title VIỆT KÝ SỬ - Full Launcher
color 0A

echo ╔════════════════════════════════════════════════════════════════╗
echo ║         VIỆT KÝ SỬ - CHATBOT LAUNCHER                    ║
echo ║         Gemini 2.5 Flash - Đã Tối Ưu                         ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo [*] Đang khởi động hệ thống...
echo.

REM Kill existing processes
echo [1/4] Dừng các process cũ...
taskkill /FI "WindowTitle eq *Backend*" /F >nul 2>&1
taskkill /FI "WindowTitle eq *Frontend*" /F >nul 2>&1
timeout /t 1 /nobreak >nul

REM Check Python
echo [2/4] Kiểm tra Python...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python chưa cài đặt!
    echo Vui lòng tải từ: https://www.python.org/
    pause
    exit /b 1
)
echo       ✓ Python OK
echo.

REM Start Backend
echo [3/4] Khởi động Backend API (Gemini 2.5)...
start "VIỆT KÝ SỬ - Backend" cmd /k "cd backend && python app.py"
timeout /t 4 /nobreak >nul
echo       ✓ Backend: http://localhost:5000
echo.

REM Start Frontend
echo [4/4] Khởi động Frontend...
start "VIỆT KÝ SỬ - Frontend" cmd /k "cd frontend && python -m http.server 8000"
timeout /t 3 /nobreak >nul
echo       ✓ Frontend: http://localhost:8000
echo.

echo ╔════════════════════════════════════════════════════════════════╗
echo ║                    SẴN SÀNG SỬ DỤNG!                          ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo    Backend:  http://localhost:5000
echo    Chatbot:  http://localhost:8000/chatbot.html
echo    Game:     http://localhost:8000/game.html
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║  CHATBOT ĐÃ CẢI TIẾN - TRẢ LỜI MỌI CÂU HỎI!                   ║
echo ╠════════════════════════════════════════════════════════════════╣
echo ║  ✓ Nhập vai chân thực với mọi nhân vật                        ║
echo ║  ✓ Trả lời chi tiết, sinh động                                ║
echo ║  ✓ Sử dụng Gemini 2.5 Flash (nhanh, miễn phí)                ║
echo ║  ✓ Temperature 0.9, Max tokens 2000                           ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Open browser
echo [*] Đang mở trình duyệt...
timeout /t 2 /nobreak >nul
start http://localhost:8000/chatbot.html

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                      THỬ NGAY!                                 ║
echo ╠════════════════════════════════════════════════════════════════╣
echo ║  1. Click "Trần Hưng Đạo" ở sidebar                           ║
echo ║  2. Hỏi: "Anh đã đánh thắng Mông Cổ như thế nào?"            ║
echo ║  3. AI sẽ trả lời cực chi tiết và chân thực!                  ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo [*] Nhấn phím bất kỳ để DỪNG tất cả servers...
pause >nul

REM Stop servers
echo.
echo [*] Đang dừng servers...
taskkill /FI "WindowTitle eq *Backend*" /F >nul 2>&1
taskkill /FI "WindowTitle eq *Frontend*" /F >nul 2>&1

echo [*] Đã dừng! Tạm biệt!
timeout /t 2 /nobreak >nul
