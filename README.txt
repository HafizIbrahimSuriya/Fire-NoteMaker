FIRE - notes, tasks, goals and reminders.

BUILD THE .EXE
 1. Install Node.js (https://nodejs.org)
 2. Double-click build.bat  -> builds every Windows type into the dist folder:
      Fire-x64.exe    64-bit Intel/AMD (most PCs)
      Fire-x86.exe    32-bit Intel/AMD (old PCs, also runs on 64-bit)
      Fire-arm64.exe  64-bit ARM (Snapdragon laptops, Surface Pro X)
    Want only the normal 64-bit one, faster? Double-click build-x64.bat
 Needs Windows 10 or newer. 32-bit ARM (Windows RT / Windows Phone) is not supported by Electron, so there is no 4th file.

TRY IT WITHOUT BUILDING: double-click run.bat

NOTES
 - Open Settings (top-right) to switch Light / Dark / System and pick any theme color. Default is orange.
 - Click a picture in a note to resize it (drag the dots), move it (drag it), or wrap text around it.
 - Closing the window keeps Fire in the system tray. Right-click the tray icon to open, add a note, or quit.
 - Set a reminder on a note, or a deadline on a task, and Fire sends a desktop notification.
 - Everything is saved on this PC only, in Documents\Fire: every note is its own .fire file in Notes\<notebook>, settings in settings.json, deleted notes go to Trash.
 - Notes open read-only. Press Edit to change a note, then Save (or Cancel).
