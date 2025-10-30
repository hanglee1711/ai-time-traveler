@echo off
chcp 65001 >nul
color 0A

echo.
echo ╔═══════════════════════════════════════════════════════╗
echo ║    🚀 AI TIME TRAVELER - CHẠY APP SIÊU DỄ           ║
echo ╚═══════════════════════════════════════════════════════╝
echo.

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python chưa cài!
    echo 📥 Tải Python tại: https://www.python.org/downloads/
    echo ⚠️  NHỚ TICK: "Add Python to PATH" khi cài
    echo.
    pause
    exit /b 1
)

echo ✅ Python đã sẵn sàng
echo.

REM Check .env file
if not exist ".env" (
    echo ❌ File .env chưa có!
    echo.
    echo 🔑 BẠN CẦN LẤY API KEY TRƯỚC:
    echo.
    echo    1. Vào: https://aistudio.google.com/app/apikey
    echo    2. Đăng nhập Gmail
    echo    3. Click "Create API Key"
    echo    4. Copy key
    echo.
    echo 📝 SAU ĐÓ TẠO FILE .env:
    echo.
    echo    1. Mở Notepad
    echo    2. Gõ 3 dòng:
    echo.
    echo       AI_PROVIDER=gemini
    echo       GEMINI_API_KEY=dán-key-ở-đây
    echo       GEMINI_MODEL=gemini-1.5-pro
    echo.
    echo    3. Lưu thành: .env trong folder này
    echo.
    pause
    exit /b 1
)

echo ✅ File .env đã có
echo.

REM Check if packages installed
echo 📦 Kiểm tra packages...
python -c "import streamlit" >nul 2>&1
if errorlevel 1 (
    echo.
    echo 📥 Đang cài đặt packages lần đầu...
    echo ⏳ Đợi khoảng 2-3 phút...
    echo.
    pip install streamlit google-generativeai python-dotenv pyyaml --quiet
    if errorlevel 1 (
        echo ❌ Cài đặt thất bại!
        echo 💡 Thử chạy lệnh này thủ công:
        echo    pip install streamlit google-generativeai python-dotenv pyyaml
        echo.
        pause
        exit /b 1
    )
    echo ✅ Cài đặt thành công!
    echo.
)

echo ✅ Packages đã sẵn sàng
echo.
echo ╔═══════════════════════════════════════════════════════╗
echo ║    🎉 BẮT ĐẦU KHỞI ĐỘNG APP...                       ║
echo ╚═══════════════════════════════════════════════════════╝
echo.
echo 🌐 App sẽ mở tại: http://localhost:8501
echo.
echo 💡 THỬ NGAY KHI APP MỞ:
echo    - Xin chào Quang Trung
echo    - Đưa tôi đến năm 1945
echo.
echo ⚠️  Nhấn Ctrl+C để dừng app
echo.
echo ═══════════════════════════════════════════════════════
echo.

streamlit run app.py

echo.
echo App đã dừng!
pause
