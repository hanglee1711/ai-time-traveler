@echo off
echo ================================================
echo     AI Time Traveler - Starting Application
echo ================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH!
    echo Please install Python 3.8+ from https://www.python.org/
    pause
    exit /b 1
)

echo [OK] Python detected
echo.

REM Check if virtual environment exists
if not exist "venv" (
    echo [INFO] Virtual environment not found. Creating...
    python -m venv venv
    echo [OK] Virtual environment created
    echo.
)

REM Activate virtual environment
echo [INFO] Activating virtual environment...
call venv\Scripts\activate.bat

REM Check if requirements are installed
pip show streamlit >nul 2>&1
if errorlevel 1 (
    echo [INFO] Installing requirements...
    pip install -r requirements.txt
    echo [OK] Requirements installed
    echo.
)

REM Check if .env exists
if not exist ".env" (
    echo [WARNING] .env file not found!
    echo Please create .env file from .env.example and add your API keys.
    echo.
    echo Do you want to continue anyway? (Y/N)
    set /p continue=
    if /i not "%continue%"=="Y" (
        echo Exiting...
        pause
        exit /b 0
    )
)

REM Run Streamlit
echo.
echo ================================================
echo     Starting AI Time Traveler...
echo     App will open at: http://localhost:8501
echo ================================================
echo.
echo Press Ctrl+C to stop the server
echo.

streamlit run app.py

pause
