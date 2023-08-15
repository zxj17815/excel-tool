import { ElectronAPI } from '@electron-toolkit/preload'

interface CustomApi {
  queryDatabase: () => Promise<Array>
  uploadFile: () => Promise<string>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: CustomApi
  }
}
