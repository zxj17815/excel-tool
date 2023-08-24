import { dialog, ipcMain } from 'electron'
import * as sql from './sql'
import * as ExcelAnalyze from './excel_analyze'

const customIpc = (): void => {
  //查询orders表
  ipcMain.handle('select-orders', async (event, args) => {
    return sql.select_orders(args)
  })
  // //插入orders表
  // ipcMain.handle('insert-orders', async (event, args) => {
  //   return insert_orders(args)
  // })

  //导入excel
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
        return ExcelAnalyze.sheet_analyze(filePath)
      }
    } catch (err) {
      // 错误处理
      console.log(err)
      return err
    }
  })
}
export default customIpc
