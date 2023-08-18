import { ElectronAPI } from '@electron-toolkit/preload'

interface CustomApi {
  selectOrders: (args) => Promise<Array>
  uploadFile: () => Promise<string>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: CustomApi
  }
}
