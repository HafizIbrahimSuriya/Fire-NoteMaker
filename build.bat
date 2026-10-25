@echo off
title Fire - Build all
cd /d "%~dp0"
echo.
echo  ===== Building Fire for every Windows type =====
echo.
echo    Fire-x64.exe    64-bit Intel/AMD  (x64)    most PCs, the one you want
echo    Fire-x86.exe    32-bit Intel/AMD  (x86)    old PCs, also runs on 64-bit Windows
echo    Fire-arm64.exe  64-bit ARM        (arm64)  Snapdragon laptops, Surface Pro X
echo.
echo    32-bit ARM (Windows RT / Windows Phone) cannot be built: Electron has no
echo    build for it, and those devices cannot run desktop apps anyway.
echo.
where node >nul 2>nul
if errorlevel 1 (
  echo [X] Node.js was not found. Install it from https://nodejs.org then run this file again.
  pause
  exit /b 1
)
echo [1/4] Installing packages...
call npm install
if errorlevel 1 goto fail
echo.
if exist dist rmdir /s /q dist
set CSC_IDENTITY_AUTO_DISCOVERY=false
echo [2/4] Building 64-bit Intel/AMD (x64)...
call npx electron-builder --win portable --x64
if errorlevel 1 goto fail
echo.
echo [3/4] Building 32-bit Intel/AMD (x86)...
call npx electron-builder --win portable --ia32
if errorlevel 1 goto fail
echo.
echo [4/4] Building 64-bit ARM (arm64)...
call npx electron-builder --win portable --arm64
if errorlevel 1 goto fail
echo.
if exist "dist\Fire-ia32.exe" ren "dist\Fire-ia32.exe" "Fire-x86.exe"
echo  Done!  Your apps are in the dist folder:
echo.
dir /b dist\Fire-*.exe
echo.
explorer "%~dp0dist"
pause
exit /b 0
:fail
echo.
echo [X] Build failed. Check your internet connection and try again
echo     (the 32-bit and ARM64 versions need to download extra parts).
echo     If you see a "symbolic link" error, right-click build.bat and choose "Run as administrator".
pause
exit /b 1
