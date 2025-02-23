"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("api", {
  createNote: (name) => electron.ipcRenderer.invoke("note-create", name),
  saveNote: (name, value) => electron.ipcRenderer.send("note-save", name, value),
  loadNoteValue: (name) => electron.ipcRenderer.invoke("note-get-value", name),
  deleteNote: (name) => electron.ipcRenderer.send("note-delete", name),
  renameNote: (name, newname) => electron.ipcRenderer.send("note-rename", name, newname),
  onLoadAllNoteNames: (callback) => electron.ipcRenderer.on("note-loadallnames", (_event, message) => callback(message)),
  storeSet: (key, value) => electron.ipcRenderer.send("store-set", key, value),
  storeGet: (key) => electron.ipcRenderer.invoke("store-get", key)
});
