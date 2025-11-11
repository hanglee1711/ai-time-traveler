@echo off
echo ====================================
echo    VIET KY SU - GAME TEST
echo ====================================
echo.
echo Starting backend server...
cd backend
start /B python app.py
echo.
echo Waiting for server to start...
timeout /t 3 /nobreak > nul
echo.
echo Opening test page in browser...
start http://localhost:5000/test_game_simple.html
echo.
echo Opening actual game in browser...
timeout /t 2 /nobreak > nul
start http://localhost:5000/quiz-battle.html
echo.
echo ====================================
echo Backend is running on port 5000
echo Close this window to stop the server
echo ====================================
echo.
pause
