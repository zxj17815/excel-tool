import { ElectronAPI } from '@electron-toolkit/preload'

interface CustomApi {
  queryDatabase: () => Promise<Array>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: CustomApi
  }
}
