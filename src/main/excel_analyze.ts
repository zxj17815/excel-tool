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

interface excelItem {
  wingOrderNo: string
  bjSendTime: Date
  totalNumSalse: number
  totalAmountSalse: number
  totalNumRefund: number
  totalAmountRefund: number
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

/**
 * 解析excel
 * @param filePath
 * @returns
 */
const sheet_analyze = async (filePath: string): Promise<unknown> => {
  let err_msg = ''
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.readFile(filePath)
  const worksheet_sale = workbook.getWorksheet(ExcelSheet.BJ_SALES)
  const items_bj_sale = [] as BjSalesItem[]
  if (worksheet_sale) {
    const wingOrderNo = 1
    const bjSendTime = 2
    const totalNumSalse = 3
    const totalAmountSalse = 4

    const r1 = worksheet_sale.getRow(1).values
    if (
      r1[wingOrderNo] != 'WING平台单号' ||
      r1[bjSendTime] != '单据日期' ||
      r1[totalNumSalse] != '总数量' ||
      r1[totalAmountSalse] != '总成交金额'
    ) {
      err_msg = '伯俊销售单格式错误'
    }

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

    const r1 = worksheet_return.getRow(1).values
    if (
      r1[wingOrderNo] != 'WING平台单号' ||
      r1[totalNumRefund] != '总数量' ||
      r1[totalAmountRefund] != '总成交金额'
    ) {
      err_msg = '伯俊退货单格式错误'
    }

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

    const r1 = worksheet_cash_flow.getRow(1).values
    if (
      r1[wingOrderNo] != 'WING平台单号' ||
      r1[payTime] != '收款时间' ||
      r1[goodsPay] != '商品实付' ||
      r1[platformDiscount1] != '平台优惠1' ||
      r1[platformDiscount2] != '平台优惠2' ||
      r1[platformDiscount3] != '平台优惠3' ||
      r1[platformDiscount4] != '平台优惠4' ||
      r1[freightPay] != '运费实付' ||
      r1[refundTime] != '退款时间' ||
      r1[goodsRefund] != '商品实退' ||
      r1[platformDiscountRecovery1] != '平台优惠回收1' ||
      r1[platformDiscountRecovery2] != '平台优惠回收2' ||
      r1[platformDiscountRecovery3] != '平台优惠回收3' ||
      r1[platformDiscountRecovery4] != '平台优惠回收4' ||
      r1[freightRefund] != '运费实退'
    ) {
      err_msg = '资金流水格式错误'
    }

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
    if (err_msg != '') {
      reject(err_msg)
    } else {
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
    }
  })
}

/**
 * 创建excel
 * @param filePath
 * @param sql_query
 * @returns
 */
const create_excel = async (filePath: string, sql_query: string): Promise<unknown> => {
  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'jay'
  workbook.lastModifiedBy = 'jay'
  workbook.company = 'northernlights.tech'
  workbook.created = new Date(Date.now())
  workbook.modified = new Date(Date.now())
  workbook.lastPrinted = new Date(Date.now())
  const worksheet = workbook.addWorksheet('My Sheet')
  worksheet.columns = [
    { header: 'WING平台单号', key: 'wingOrderNo', width: 10 },
    { header: '伯俊发货时间', key: 'bjSendTime', width: 32 },
    { header: '总数量', key: 'totalNumSalse', width: 10 },
    { header: '总成交金额', key: 'totalAmountSalse', width: 10 },
    { header: '总数量(退款)', key: 'totalNumRefund', width: 10 },
    { header: '总成交金额(退款)', key: 'totalAmountRefund', width: 10 },
    { header: '收款时间', key: 'payTime', width: 32 },
    { header: '商品实付', key: 'goodsPay', width: 10 },
    { header: '平台优惠1', key: 'platformDiscount1', width: 10 },
    { header: '平台优惠2', key: 'platformDiscount2', width: 10 },
    { header: '平台优惠3', key: 'platformDiscount3', width: 10 },
    { header: '平台优惠4', key: 'platformDiscount4', width: 10 },
    { header: '运费实付', key: 'freightPay', width: 10 },
    { header: '退款时间', key: 'refundTime', width: 32 },
    { header: '商品实退', key: 'goodsRefund', width: 10 },
    { header: '平台优惠回收1', key: 'platformDiscountRecovery1', width: 10 },
    { header: '平台优惠回收2', key: 'platformDiscountRecovery2', width: 10 },
    { header: '平台优惠回收3', key: 'platformDiscountRecovery3', width: 10 },
    { header: '平台优惠回收4', key: 'platformDiscountRecovery4', width: 10 },
    { header: '运费实退', key: 'freightRefund', width: 10 }
  ]
  return sql.select_orders(sql_query).then((data) => {
    const row = data as excelItem[]
    const data_excel = [] as unknown[]
    row.forEach((element) => {
      data_excel.push([
        element.wingOrderNo,
        element.bjSendTime,
        element.totalNumSalse,
        element.totalAmountSalse,
        element.totalNumRefund,
        element.totalAmountRefund,
        element.payTime,
        element.goodsPay,
        element.platformDiscount1,
        element.platformDiscount2,
        element.platformDiscount3,
        element.platformDiscount4,
        element.freightPay,
        element.refundTime,
        element.goodsRefund,
        element.platformDiscountRecovery1,
        element.platformDiscountRecovery2,
        element.platformDiscountRecovery3,
        element.platformDiscountRecovery4,
        element.freightRefund
      ])
    })
    worksheet.addRows(data_excel)
    workbook.xlsx.writeFile(filePath)
  })
}
export { sheet_analyze, create_excel }
