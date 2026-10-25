const { app, BrowserWindow, Tray, Menu, Notification, ipcMain, nativeImage, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');

app.setAppUserModelId('com.fire.notes');
if (!app.requestSingleInstanceLock()) { app.quit(); process.exit(0); }

const ICON = path.join(__dirname, 'assets', 'icon.png');
const EXE = process.env.PORTABLE_EXECUTABLE_FILE || process.execPath;
const STARTUP = { path: EXE, args: ['--hidden'] };
// ---------- storage: Documents\Fire (like an Obsidian vault) ----------
//   Fire\settings.json            notebooks, labels, theme, your name + picture
//   Fire\Notes\<Notebook>\*.fire  one file per note
//   Fire\Trash\                   deleted notes are moved here, not erased
const crypto = require('crypto');
const legacyFile = () => path.join(app.getPath('userData'), 'fire-data.json');
function rootDir() {
  let d = path.join(app.getPath('documents'), 'Fire');
  try { fs.mkdirSync(d, { recursive: true }); fs.accessSync(d, fs.constants.W_OK); }
  catch { d = path.join(app.getPath('userData'), 'Fire'); fs.mkdirSync(d, { recursive: true }); }
  return d;
}
const notesDir = () => path.join(rootDir(), 'Notes');
const metaFile = () => path.join(rootDir(), 'settings.json');
const md5 = (s) => crypto.createHash('md5').update(s).digest('hex');
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
function safe(s) {
  let n = String(s || '').replace(/[\\/:*?"<>|\u0000-\u001f]/g, '_').replace(/^\s+/, '').slice(0, 80).replace(/[.\s]+$/, '');
  if (n && /^(con|prn|aux|nul|com\d|lpt\d)$/i.test(n)) n = '_' + n;
  return n;
}
function writeAtomic(f, data) { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f + '.tmp', data); fs.renameSync(f + '.tmp', f); }
const store = { paths: new Map(), hashes: new Map(), metaHash: '' };
const noteText = (it) => { const n = { ...it }; delete n.notebook; return JSON.stringify({ format: 'fire-note', version: 3, note: n, labels: (it.labels || []).map((name) => ({ name })) }, null, 2); };

function trash(p) {
  try {
    if (!fs.existsSync(p)) return;
    const t = path.join(rootDir(), 'Trash'); fs.mkdirSync(t, { recursive: true });
    const b = path.basename(p, '.fire');
    fs.renameSync(p, path.join(t, `${b} (${new Date().toISOString().slice(0, 10)} ${uid()}).fire`));
  } catch (err) { console.error(err); }
}

function persist(S) {
  const nd = notesDir(), meta = { ...S }; delete meta.items;
  const mj = JSON.stringify(meta, null, 2), mh = md5(mj);
  if (mh !== store.metaHash) { writeAtomic(metaFile(), mj); store.metaHash = mh; }
  if (!Array.isArray(S.items)) return;
  const wanted = new Set();
  (S.notebooks || []).forEach((n) => { const f = safe(n); if (f) { wanted.add(f.toLowerCase()); fs.mkdirSync(path.join(nd, f), { recursive: true }); } });
  const owners = new Map(); store.paths.forEach((p, id) => owners.set(p.toLowerCase(), id));
  const used = new Set(), next = new Map();
  for (const it of S.items) {
    const nb = safe(it.notebook) || 'General', folder = path.join(nd, nb), stem = safe(it.title) || 'Untitled note';
    wanted.add(nb.toLowerCase());
    const prev = store.paths.get(it.id); let p = null;
    if (prev && path.dirname(prev) === folder && !used.has(prev.toLowerCase())) {
      const b = path.basename(prev, '.fire');
      if (b === stem || (b.startsWith(stem + ' ') && /^\d+$/.test(b.slice(stem.length + 1)))) p = prev;
    }
    for (let i = 1; !p; i++) {
      const c = path.join(folder, i === 1 ? `${stem}.fire` : `${stem} ${i}.fire`), k = c.toLowerCase(), o = owners.get(k);
      if (!used.has(k) && (o === it.id || (o === undefined && !fs.existsSync(c)))) p = c;
    }
    used.add(p.toLowerCase());
    try {
      const text = noteText(it), h = md5(text);
      if (prev && prev !== p && prev.toLowerCase() === p.toLowerCase()) fs.renameSync(prev, p); // only the letter case changed
      if (prev !== p || store.hashes.get(it.id) !== h) { writeAtomic(p, text); store.hashes.set(it.id, h); }
      if (prev && prev.toLowerCase() !== p.toLowerCase()) { try { fs.unlinkSync(prev); } catch {} }
      next.set(it.id, p);
    } catch (err) { console.error(err); if (prev) next.set(it.id, prev); }
  }
  store.paths.forEach((p, id) => { if (!next.has(id)) { trash(p); store.hashes.delete(id); } });
  store.paths = next;
  try { fs.readdirSync(nd, { withFileTypes: true }).forEach((d) => { if (d.isDirectory() && !wanted.has(d.name.toLowerCase())) { try { fs.rmdirSync(path.join(nd, d.name)); } catch {} } }); } catch {}
}

function migrateLegacy() {
  if (fs.existsSync(metaFile())) return;
  for (const f of [path.join(rootDir(), 'fire-data.json'), legacyFile()]) {
    try {
      const S = JSON.parse(fs.readFileSync(f, 'utf8')); if (!Array.isArray(S.items)) continue;
      persist(S);
      const b = path.join(rootDir(), 'Backups'); fs.mkdirSync(b, { recursive: true });
      fs.copyFileSync(f, path.join(b, 'fire-data.before-migration.json')); fs.renameSync(f, f + '.migrated');
      return;
    } catch {}
  }
}

function loadAll() {
  migrateLegacy();
  store.paths = new Map(); store.hashes = new Map(); store.metaHash = '';
  let meta = null;
  try { const t = fs.readFileSync(metaFile(), 'utf8'); meta = JSON.parse(t); store.metaHash = md5(t); } catch {}
  const orig = new Map(((meta && meta.notebooks) || []).map((n) => [safe(n).toLowerCase(), n]));
  const nd = notesDir(), items = [], found = [];
  let dirs = []; try { dirs = fs.readdirSync(nd, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name); } catch {}
  for (const d of dirs) {
    const nb = orig.get(d.toLowerCase()) || d; found.push(nb);
    let files = []; try { files = fs.readdirSync(path.join(nd, d)).filter((f) => f.toLowerCase().endsWith('.fire')); } catch {}
    for (const f of files) {
      const p = path.join(nd, d, f);
      try {
        const j = JSON.parse(fs.readFileSync(p, 'utf8')); if (j.format !== 'fire-note' || !j.note) continue;
        const n = j.note; n.notebook = nb;
        const fresh = !n.id || store.paths.has(n.id); if (fresh) n.id = uid();
        store.paths.set(n.id, p); store.hashes.set(n.id, fresh ? '' : md5(noteText(n)));
        items.push(n);
      } catch (err) { console.error(err); }
    }
  }
  if (!meta && !items.length) return '';
  const S = meta || {}, nbs = [...(S.notebooks || [])];
  found.forEach((n) => { if (!nbs.includes(n)) nbs.push(n); });
  if (nbs.length) S.notebooks = nbs;
  items.sort((a, b) => (b.created || 0) - (a.created || 0)); S.items = items;
  return JSON.stringify(S);
}

ipcMain.on('load', (e) => { try { e.returnValue = loadAll(); } catch (err) { console.error(err); e.returnValue = ''; } });
ipcMain.on('save', (_e, json) => { try { persist(JSON.parse(json)); } catch (err) { console.error(err); } });
ipcMain.handle('data-path', () => rootDir());
const openExt = (url) => { try { const u = new URL(url); if (u.protocol === 'https:' || u.protocol === 'http:') shell.openExternal(u.href); } catch {} };
ipcMain.handle('open-external', (_e, url) => openExt(url));
ipcMain.handle('open-folder', () => shell.openPath(rootDir()));
ipcMain.handle('save-file', async (_e, { name, data, ext }) => {
  const r = await dialog.showSaveDialog(win, { defaultPath: name, filters: [{ name: ext === 'fire' ? 'Fire note' : 'Fire data', extensions: [ext] }] });
  if (r.canceled || !r.filePath) return null;
  fs.writeFileSync(r.filePath, data); return r.filePath;
});
ipcMain.handle('get-startup', () => app.getLoginItemSettings(STARTUP).openAtLogin);
ipcMain.handle('set-startup', (_e, on) => { app.setLoginItemSettings({ openAtLogin: !!on, ...STARTUP }); trayMenu(); return on; });
ipcMain.on('notify', (_e, { title, body }) => {
  const n = new Notification({ title: title || 'Fire', body: body || '', icon: ICON });
  n.on('click', showWin);
  n.show();
});

// ---------- window, tray, lifecycle ----------
let win = null, tray = null, quitting = false;
const startHidden = process.argv.includes('--hidden');

function createWin(show) {
  win = new BrowserWindow({
    width: 1280, height: 800, minWidth: 900, minHeight: 600,
    show: false, title: 'Fire', icon: ICON, backgroundColor: '#ffffff', autoHideMenuBar: true,
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false, backgroundThrottling: false }
  });
  win.setMenuBarVisibility(false);
  win.webContents.setWindowOpenHandler(({ url }) => { openExt(url); return { action: 'deny' }; });
  win.webContents.on('will-navigate', (e, url) => { if (!url.startsWith('file://')) { e.preventDefault(); openExt(url); } });
  win.loadFile(path.join(__dirname, 'src', 'index.html'));
  win.once('ready-to-show', () => { if (show) win.show(); });
  win.webContents.on('render-process-gone', (_e, d) => console.error('renderer gone', d));
  win.on('close', (e) => { if (!quitting) { e.preventDefault(); win.hide(); } }); // keep running in tray
  win.on('closed', () => { win = null; });
}

function showWin() {
  if (!win) { createWin(true); return; }
  if (win.isMinimized()) win.restore();
  win.show(); win.focus();
}

function addNote() {
  showWin();
  const send = () => win && win.webContents.send('new-note');
  if (win.webContents.isLoading()) win.webContents.once('did-finish-load', send); else send();
}

function trayImage() {
  const tryLoad = (f) => { try { const i = nativeImage.createFromPath(path.join(__dirname, 'assets', f)); return i.isEmpty() ? null : i; } catch { return null; } };
  const img = (process.platform === 'win32' ? tryLoad('tray.ico') : null) || tryLoad('tray.png') || tryLoad('icon.png') || nativeImage.createEmpty();
  return img.resize({ width: 16, height: 16 });
}

function trayMenu() {
  if (!tray) return;
  const on = app.getLoginItemSettings(STARTUP).openAtLogin;
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: 'Open Fire', click: showWin },
    { label: 'Add a note', click: addNote },
    { type: 'separator' },
    { label: 'Start with Windows', type: 'checkbox', checked: on, click: (m) => app.setLoginItemSettings({ openAtLogin: m.checked, ...STARTUP }) },
    { type: 'separator' },
    { label: 'Quit Fire', click: () => { quitting = true; app.quit(); } }
  ]));
}

app.on('second-instance', showWin);
app.on('before-quit', () => { quitting = true; });
app.on('window-all-closed', () => { /* stay alive in the tray */ });

app.whenReady().then(() => {
  tray = new Tray(trayImage());
  tray.setToolTip('Fire');
  tray.on('click', showWin);
  tray.on('double-click', showWin);
  trayMenu();
  createWin(!startHidden);
}).catch((err) => { console.error(err); dialog.showErrorBox('Fire failed to start', String(err && err.stack || err)); app.quit(); });
