import { ElectronAPI } from '@electron-toolkit/preload'

interface CustomApi {
  selectOrders: (args) => Promise<Array>
  uploadFile: () => Promise<string>
  exportFile: (args) => Promise<string>
  deleteOrders: (args) => Promise<string>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: CustomApi
  }
}
