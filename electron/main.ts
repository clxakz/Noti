import { app, BrowserWindow, ipcMain } from 'electron'
import { fileURLToPath } from 'node:url'
import { Note, savePath } from './note'
import path from "node:path";
import { promises as fs } from 'fs';
import Store from 'electron-store';
const store = new Store();

const __dirname = path.dirname(fileURLToPath(import.meta.url))
process.env.APP_ROOT = path.join(__dirname, '..')

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    width: 900,
    height: 700,
    titleBarStyle: "hidden",
    titleBarOverlay: {
      height: 1,
      color: "rgba(255, 255, 255, 0)",
      symbolColor: "#4a4a4a"
    },

    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      contextIsolation: true,
      nodeIntegration: false
    },
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }

  // Hide menu-bar
  win.setMenu(null);
  win.webContents.openDevTools({mode: "detach"})

  // Send all note names to renderer on startup
  win.webContents.on('did-finish-load', async () => {
    let namesToLoad: string[] = [];

    // Create a default note on fresh install
    if (!store.has("freshinstall")) {
      const readmeNote = new Note("readme", "Thank's for installing Noti!");
      readmeNote.save();
      
      namesToLoad.push("readme");
      store.set("freshinstall", true);
    }

    // Load saved notes if any
    try {
      const fileContent = await fs.readFile(savePath, "utf-8");
      const jsonData = JSON.parse(fileContent);
  

      if (jsonData) {
        for (const [name] of Object.entries(jsonData)) {
          namesToLoad.push(name);
        }
      }
  
    } catch {
      console.error("no saved notes yet");
    }

    if (namesToLoad.length > 0) {
      win?.webContents.send('note-loadallnames', namesToLoad);
    }
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.disableHardwareAcceleration();
app.whenReady().then(() => {
  createWindow();

  // Handle ipc calls
  ipcMain.handle("note-create", async (_event, name: string) => {
    const newNote = new Note(name, '');
    newNote.save();
    return newNote.name;
  })

  ipcMain.on("note-save", (_event, name: string, value: string) => {
    const loadedNote = new Note(name, value);
    loadedNote.save();
  })

  ipcMain.handle("note-get-value", async (_event, name: string) => {
    const loadedNote = new Note(name);
    return loadedNote.returnValueByName();
  })

  ipcMain.on("note-delete", (_event, name: string) => {
    const loadedNote = new Note(name);
    loadedNote.delete();
  })

  ipcMain.on("note-rename", (_event, name: string, newname: string) => {
    const loadedNote = new Note(name);
    loadedNote.rename(newname);
  })

  // Handle storage
  ipcMain.on('store-set', (_event, key, value) => {
    store.set(key, value);
  });
  
  ipcMain.handle('store-get', (_event, key) => {
    return store.get(key);
  });
})
