/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    APP_ROOT: string
    /** /dist/ or /public/ */
    VITE_PUBLIC: string
  }
}

// Used in Renderer process, expose in `preload.ts`
interface Window {
  ipcRenderer: import('electron').IpcRenderer,

  api: {
    createNote: (name: string) => Promise<string>;
    saveNote: (name: string, value: string) => void;
    loadNoteValue: (name: string) => Promise<string>;
    deleteNote: (name: string) => Void;
    renameNote: (name: string, newname: string) => void;
    loadAllNoteNames: () => Promise<string[]>;

    storeSet: (key: string, value: any) => void;
    storeGet: (key: string) => Promise<any>;
  }
}
