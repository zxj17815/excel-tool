import { dialog, ipcMain } from 'electron'
import sqlIpc from './sql'
import * as ExcelJS from 'exceljs'

const customIpc = (): void => {
  //数据库查询
  sqlIpc()

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
        const workbook = new ExcelJS.Workbook()
        await workbook.xlsx.readFile(filePath)
        // console.log(workbook)
        workbook.eachSheet((worksheet, sheetId) => {
          console.log('sheetId', sheetId)
          console.log('worksheet', worksheet.name)
        })
        const worksheet = workbook.getWorksheet(2)
        worksheet.eachRow((row, rowNumber) => {
          console.log('Row ' + rowNumber + ' = ' + JSON.stringify(row.values))
        })
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
