import { dialog, ipcMain } from 'electron'
import * as sql from './sql'
import * as ExcelAnalyze from './excel_analyze'

const customIpc = (): void => {
  //查询orders表
  ipcMain.handle('select-orders', async (event, args) => {
    console.log('select-orders args', args)
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

  //导出excel
  ipcMain.handle('export-file', async (event, args) => {
    console.log('export-file args', args)
    try {
      // 打开保存文件对话框
      const result = await dialog.showSaveDialog({
        title: '导出文件',
        defaultPath: 'exported-file.xlsx', // 默认文件名
        filters: [{ name: '文本文件', extensions: ['xlsx'] }]
      })
      if (!result.canceled && result.filePath) {
        return ExcelAnalyze.create_excel(result.filePath, args)
      } else {
        return '取消导出'
      }
    } catch (error) {
      console.error('文件导出失败：', error)
      return error
    }
  })
}
export default customIpc
