==============================================================
  FIRE  -  v1.0.0
  Notes, tasks, goals and reminders for Windows
  No account. No cloud. Everything stays on your PC.
==============================================================

DOWNLOAD
  https://github.com/HafizIbrahimSuriya/Fire-NoteMaker/releases/latest

  Fire-x64.exe     64-bit Intel/AMD  (pick this one if unsure)
  Fire-x86.exe     32-bit Intel/AMD  (old PCs)
  Fire-arm64.exe   64-bit ARM        (Snapdragon, Surface Pro X)

  Needs Windows 10 or newer.


FEATURES
  * Notes with rich text and resizable pictures
  * Tasks inside every note, each with a deadline
  * Goals with a progress slider
  * Reminders with real desktop notifications
  * Notebooks, labels, pin, star and archive
  * Custom note icons and colors
  * Light, Dark or System theme, any theme color
  * Tray icon (closing the window keeps Fire running)
  * Optional Start with Windows
  * Read-only by default: press Edit, then Save
  * Search across all notes
  * Import/export notes (.fire) and full backups (.firedata)
  * Trash folder for deleted notes


YOUR DATA
  Everything is saved in Documents\Fire

    settings.json     theme, notebooks, labels, your name and picture
    Notes\<Notebook>\ one .fire file per note (plain JSON)
    Trash\            deleted notes


RUN FROM SOURCE  (needs Node.js)
    git clone https://github.com/HafizIbrahimSuriya/Fire-NoteMaker.git
    cd Fire-NoteMaker
    npm install
    npm start
  Or double-click run.bat on Windows.


BUILD THE .EXE
  build.bat       builds x64, x86 and ARM64 into the dist folder
  build-x64.bat   builds only the 64-bit version (faster)

  32-bit ARM (Windows RT / Windows Phone) is not supported.
  If you see a "symbolic link" error, run build.bat as administrator.
  The first build needs internet.


PROJECT STRUCTURE
  main.js        Electron main process
  preload.js     safe bridge to the main process
  src/           the app (index.html, app.js, style.css)
  assets/        logo and icons
  build/         installer icons
  docs/          banner, screenshots, changelog, release notes


MAKER
  HafizIbrahim (HafizIbrahimSuriya)
  GitHub:    https://github.com/HafizIbrahimSuriya
  Instagram: https://instagram.com/HafizIbrahimSuriya
  YouTube:   https://www.youtube.com/@HafizIbrahimSuriya

  Bugs and ideas: https://github.com/HafizIbrahimSuriya/Fire-NoteMaker/issues


LICENSE
  MIT License. See the LICENSE file.
