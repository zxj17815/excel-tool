import { dialog, ipcMain } from 'electron'
import { select_orders, insert_orders } from './sql'
import * as ExcelJS from 'exceljs'

const customIpc = (): void => {
  //查询orders表
  ipcMain.handle('select-orders', async (event, args) => {
    return select_orders(args)
  })
  //插入orders表
  ipcMain.handle('insert-orders', async (event, args) => {
    return insert_orders(args)
  })

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
        workbook.eachSheet((worksheet, sheetId) => {
          console.log('sheetId', sheetId)
          console.log('worksheet', worksheet.name)
        })
        const worksheet = workbook.getWorksheet('伯俊销售单')
        let wingOrderNo: number
        let bjSendTime: number
        let totalNumSalse: number
        let totalAmountSalse: number
        worksheet.getRow(1).eachCell((cell, colNumber) => {
          console.log('Cell ' + colNumber + ' = ' + cell.value)
          if (cell.value === 'WING平台单号') {
            wingOrderNo = colNumber
          }
          if (cell.value === '单据日期') {
            bjSendTime = colNumber
          }
          if (cell.value === '总数量') {
            totalNumSalse = colNumber
          }
          if (cell.value === '总成交金额') {
            totalAmountSalse = colNumber
          }
        })
        console.log(worksheet.getRow(1))
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
