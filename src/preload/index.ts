import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  selectImage: async (): Promise<string | null> => {
    return await ipcRenderer.invoke('select-image')
  },
  saveImage: async (data: {
    base64: string
    pnombre: string
    papellido: string
    cedula: string
    tipo: string
  }): Promise<{ success: boolean; path: string }> => {
    return await ipcRenderer.invoke('save-image', data)
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
