@echo off
title Fire - Build x64
cd /d "%~dp0"
echo.
echo  ===== Building Fire for 64-bit Intel/AMD (x64) only =====
echo.
where node >nul 2>nul
if errorlevel 1 (
  echo [X] Node.js was not found. Install it from https://nodejs.org then run this file again.
  pause
  exit /b 1
)
call npm install
if errorlevel 1 goto fail
if exist dist rmdir /s /q dist
set CSC_IDENTITY_AUTO_DISCOVERY=false
call npm run build:x64
if errorlevel 1 goto fail
echo.
echo  Done!  Your app is here:  dist\Fire-x64.exe
explorer "%~dp0dist"
pause
exit /b 0
:fail
echo.
echo [X] Build failed. Check your internet connection and try again.
echo     If you see a "symbolic link" error, right-click build-x64.bat and choose "Run as administrator".
pause
exit /b 1
