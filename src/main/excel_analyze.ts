import * as ExcelJS from 'exceljs'
import * as sql from './sql'

enum ExcelSheet {
  BJ_SALES = '伯俊销售单',
  BJ_RETURN = '伯俊退货单',
  CASH_FLOW = '资金流水'
}

// 伯俊销售单
interface BjSalesItem {
  wingOrderNo: string
  bjSendTime: Date
  totalNumSalse: number
  totalAmountSalse: number
}

// 伯俊退货单
interface BjReturnItem {
  wingOrderNo: string
  totalNumRefund: number
  totalAmountRefund: number
}

// 现金流水
interface CashFlowItem {
  wingOrderNo: string
  payTime: Date
  goodsPay: number
  platformDiscount1: number
  platformDiscount2: number
  platformDiscount3: number
  platformDiscount4: number
  freightPay: number
  refundTime: Date
  goodsRefund: number
  platformDiscountRecovery1: number
  platformDiscountRecovery2: number
  platformDiscountRecovery3: number
  platformDiscountRecovery4: number
  freightRefund: number
}

const sheet_analyze = async (filePath: string): Promise<unknown> => {
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.readFile(filePath)
  const worksheet_sale = workbook.getWorksheet(ExcelSheet.BJ_SALES)
  const items_bj_sale = [] as BjSalesItem[]
  if (worksheet_sale) {
    const wingOrderNo = 1
    const bjSendTime = 2
    const totalNumSalse = 3
    const totalAmountSalse = 4

    worksheet_sale.eachRow((row, rowNumber) => {
      if (
        rowNumber != 1 && //第一行是标题
        row.values[wingOrderNo] != null &&
        row.values[wingOrderNo] != '' &&
        row.values[wingOrderNo] != undefined
      ) {
        items_bj_sale.push({
          wingOrderNo: row.values[wingOrderNo],
          bjSendTime: row.values[bjSendTime],
          totalNumSalse: row.values[totalNumSalse],
          totalAmountSalse: row.values[totalAmountSalse]
        })
      }
    })
  }
  const worksheet_return = workbook.getWorksheet(ExcelSheet.BJ_RETURN)
  const items_bj_return = [] as BjReturnItem[]
  if (worksheet_return) {
    const wingOrderNo = 1
    const totalNumRefund = 2
    const totalAmountRefund = 3

    worksheet_return.eachRow((row, rowNumber) => {
      if (
        rowNumber != 1 && //第一行是标题
        row.values[wingOrderNo] != null &&
        row.values[wingOrderNo] != '' &&
        row.values[wingOrderNo] != undefined
      ) {
        items_bj_return.push({
          wingOrderNo: row.values[wingOrderNo],
          totalNumRefund: row.values[totalNumRefund],
          totalAmountRefund: row.values[totalAmountRefund]
        })
      }
    })
  }
  const worksheet_cash_flow = workbook.getWorksheet(ExcelSheet.CASH_FLOW)
  const items_cash_flow = [] as CashFlowItem[]
  if (worksheet_cash_flow) {
    const wingOrderNo = 1
    const payTime = 2
    const goodsPay = 3
    const platformDiscount1 = 4
    const platformDiscount2 = 5
    const platformDiscount3 = 6
    const platformDiscount4 = 7
    const freightPay = 8
    const refundTime = 9
    const goodsRefund = 10
    const platformDiscountRecovery1 = 11
    const platformDiscountRecovery2 = 12
    const platformDiscountRecovery3 = 13
    const platformDiscountRecovery4 = 14
    const freightRefund = 15

    worksheet_cash_flow.eachRow((row, rowNumber) => {
      if (
        rowNumber != 1 && //第一行是标题
        row.values[wingOrderNo] != null &&
        row.values[wingOrderNo] != '' &&
        row.values[wingOrderNo] != undefined
      ) {
        items_cash_flow.push({
          wingOrderNo: row.values[wingOrderNo],
          payTime: row.values[payTime] == undefined ? null : row.values[payTime],
          goodsPay: row.values[goodsPay] == undefined ? null : row.values[goodsPay],
          platformDiscount1:
            row.values[platformDiscount1] == undefined ? null : row.values[platformDiscount1],
          platformDiscount2:
            row.values[platformDiscount2] == undefined ? null : row.values[platformDiscount2],
          platformDiscount3:
            row.values[platformDiscount3] == undefined ? null : row.values[platformDiscount3],
          platformDiscount4:
            row.values[platformDiscount4] == undefined ? null : row.values[platformDiscount4],
          freightPay: row.values[freightPay] == undefined ? null : row.values[freightPay],
          refundTime: row.values[refundTime] == undefined ? null : row.values[refundTime],
          goodsRefund: row.values[goodsRefund] == undefined ? null : row.values[goodsRefund],
          platformDiscountRecovery1:
            row.values[platformDiscountRecovery1] == undefined
              ? null
              : row.values[platformDiscountRecovery1],
          platformDiscountRecovery2:
            row.values[platformDiscountRecovery2] == undefined
              ? null
              : row.values[platformDiscountRecovery2],
          platformDiscountRecovery3:
            row.values[platformDiscountRecovery3] == undefined
              ? null
              : row.values[platformDiscountRecovery3],
          platformDiscountRecovery4:
            row.values[platformDiscountRecovery4] == undefined
              ? null
              : row.values[platformDiscountRecovery4],
          freightRefund: row.values[freightRefund] == undefined ? null : row.values[freightRefund]
        })
      }
    })
  }
  return new Promise((resolve, reject) => {
    sql
      .insert_orders_bj_sale(items_bj_sale)
      .then(() => {
        console.log('insert_orders_bj_sale success')
        sql.insert_orders_bj_return(items_bj_return)
      })
      .then(() => {
        console.log('insert_orders_bj_return success')
        sql.insert_orders_cash_flow(items_cash_flow)
      })
      .then(() => {
        console.log('insert_orders_cash_flow success')
        resolve('success')
      })
      .catch((err) => {
        reject(err)
      })
  })
}
export { sheet_analyze }
