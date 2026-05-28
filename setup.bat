@echo off
REM AIRGUARD Quick Setup Script for Windows

echo.
echo ============================================
echo   AIRGUARD Frontend Setup
echo ============================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo ✓ Node.js found
node --version
npm --version
echo.

REM Check if already installed
if exist node_modules (
    echo Dependencies already installed.
    echo.
    echo Running development server...
    npm run dev
) else (
    echo Installing dependencies...
    echo.
    call npm install
    
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
    
    echo.
    echo ✓ Installation complete!
    echo.
    echo Starting development server...
    npm run dev
)
