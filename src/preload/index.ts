import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  selectOrders: (args): Promise<string> => ipcRenderer.invoke('select-orders', args),
  uploadFile: (): Promise<string> => ipcRenderer.invoke('upload-file'),
  exportFile: (args): Promise<string> => ipcRenderer.invoke('export-file', args),
  deleteOrders: (args): Promise<string> => ipcRenderer.invoke('delete-orders', args)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  console.log('contextIsolated')
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
