@echo off
echo ===============================
echo   Portfolio Dev Environment
echo ===============================
echo 1. Start Local Server (npm start)
echo 2. Build for Production (npm run build)
echo 3. Exit
echo ===============================
set /p choice="Select an option (1-3): "

if "%choice%"=="1" (
    echo Starting local server...
    npm start
) else if "%choice%"=="2" (
    echo Building for production...
    npm run build
) else if "%choice%"=="3" (
    exit
) else (
    echo Invalid choice.
)
pause
