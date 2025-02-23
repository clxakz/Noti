import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  createNote: (name: string) => ipcRenderer.invoke("note-create", name),
  saveNote: (name: string, value: string) => ipcRenderer.send("note-save", name, value),
  loadNoteValue: (name: string) => ipcRenderer.invoke("note-get-value", name),
  deleteNote: (name: string) => ipcRenderer.send("note-delete", name),
  renameNote: (name: string, newname: string) => ipcRenderer.send("note-rename", name, newname),
  onLoadAllNoteNames: (callback: (message: string[]) => void) => ipcRenderer.on('note-loadallnames', (_event, message) => callback(message)),

  storeSet: (key: string, value: any) => ipcRenderer.send('store-set', key, value),
  storeGet: (key: string) => ipcRenderer.invoke('store-get', key),
});