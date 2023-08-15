import { dialog, ipcMain } from 'electron'
import sqlIpc from './sql'

const customIpc = (): void => {
  //数据库查询
  sqlIpc()
  ipcMain.handle('upload-file', async (event) => {
    try {
      console.log('upload-file', event)
      // 选择 Excel 文件
      const fileDialogResult = await dialog.showOpenDialog({ properties: ['openFile'] })
      const filePath = fileDialogResult.filePaths[0]
      console.log(filePath)
      if (!filePath) {
        return // 用户取消了选择
      } else {
        return filePath
      }
    } catch (err) {
      // 错误处理
      console.log(err)
      return err
    }
  })
}
export default customIpc
