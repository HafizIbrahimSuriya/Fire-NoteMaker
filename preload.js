const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('fire', {
  load: () => ipcRenderer.sendSync('load'),
  save: (json) => ipcRenderer.send('save', json),
  saveFile: (name, data, ext) => ipcRenderer.invoke('save-file', { name, data, ext }),
  dataPath: () => ipcRenderer.invoke('data-path'),
  openFolder: () => ipcRenderer.invoke('open-folder'),
  getStartup: () => ipcRenderer.invoke('get-startup'),
  setStartup: (on) => ipcRenderer.invoke('set-startup', on),
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  notify: (title, body) => ipcRenderer.send('notify', { title, body }),
  onNewNote: (cb) => ipcRenderer.on('new-note', cb)
});
