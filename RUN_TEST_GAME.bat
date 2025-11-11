@echo off
echo ============================================
echo QUIZ BATTLE ARENA - AUTO TEST
echo ============================================
echo.
echo Backend is running at: http://localhost:5000
echo.
echo Opening test page in 3 seconds...
timeout /t 3 /nobreak > nul

start http://localhost:5000/test_game_auto.html

echo.
echo Test page opened!
echo Click "Run Full Test" to verify game is working
echo.
echo Then test the actual game at:
echo http://localhost:5000/quiz-battle.html
echo.
pause
