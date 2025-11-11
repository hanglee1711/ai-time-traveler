@echo off
chcp 65001 >nul
title VIET SU KY - LAN Sharing Setup
color 0E

echo ╔════════════════════════════════════════════════════════════════╗
echo ║         VIET SU KY - LAN SHARING SETUP                       ║
echo ║         Chia sẻ cho người khác trong cùng mạng                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Get IP address
echo [1/4] Lấy địa chỉ IP của máy...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
    set IP=%%a
    goto :found
)
:found
set IP=%IP:~1%
echo       Your IP: %IP%
echo.

REM Check Python
echo [2/4] Kiểm tra Python...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python chưa cài đặt!
    pause
    exit /b 1
)
echo       OK
echo.

REM Start servers
echo [3/4] Khởi động servers...
echo       Backend: http://%IP%:5000
echo       Frontend: http://%IP%:8000
echo.

start "Backend" cmd /c "cd backend && python app.py"
timeout /t 3 >nul
start "Frontend" cmd /c "cd frontend && python -m http.server 8000"
timeout /t 2 >nul

echo [4/4] Servers đã sẵn sàng!
echo.

echo ╔════════════════════════════════════════════════════════════════╗
echo ║                    CÁCH CHIA SẺ                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo Gửi link này cho người khác:
echo.
echo    http://%IP%:8000/index.html
echo.
echo Hoặc QR Code (tạo tại qr-code-generator.com):
echo    %IP%:8000
echo.
echo Họ phải ở trong cùng mạng WiFi/LAN với bạn!
echo.

echo ╔════════════════════════════════════════════════════════════════╗
echo ║                    LƯU Ý                                       ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 1. Tắt Firewall hoặc allow Python qua Firewall
echo 2. Máy tính không được sleep/hibernate
echo 3. Giữ cửa sổ này mở
echo 4. Nhấn Ctrl+C để dừng servers
echo.

echo Nhấn phím bất kỳ để dừng servers...
pause >nul

REM Stop servers
taskkill /F /FI "WindowTitle eq Backend*" >nul 2>&1
taskkill /F /FI "WindowTitle eq Frontend*" >nul 2>&1

echo.
echo Đã dừng! Tạm biệt!
timeout /t 2 >nul
