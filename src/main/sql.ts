import sqlite3 from 'sqlite3'
import { app } from 'electron'
import { is } from '@electron-toolkit/utils'
import { join } from 'path'
import { format } from 'date-fns'

// sql操作类型
enum sqlType {
  CREATE_TABLE = 'CREATE_TABLE',
  INSERT = 'INSERT',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  SELECT = 'SELECT'
}

// 执行sql
const doSql = (sql: string, sql_type: sqlType): Promise<unknown[] | boolean> => {
  let sqliteFilePath: string
  if (is.dev) {
    sqliteFilePath = './database.sqlite'
  } else {
    sqliteFilePath = join(app.getPath('userData'), '/database.sqlite')
  }
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(sqliteFilePath, (err) => {
      if (err) {
        console.error(err.message)
        reject(err)
      }
    })
    if (sqlType.INSERT === sql_type) {
      db.run(sql, (err) => {
        if (err) {
          reject(err)
        }
        resolve(true)
      })
    } else if (sqlType.SELECT === sql_type) {
      db.all(sql, (err, rows) => {
        if (err) {
          reject(err)
        }
        resolve(rows)
      })
    } else if (sqlType.UPDATE === sql_type) {
      db.run(sql, (err) => {
        if (err) {
          reject(err)
        }
        resolve(true)
      })
    }
  })
}

//查询orders表
const select_orders = (args): Promise<unknown[] | boolean> => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT * FROM orders`
    if (args) {
      sql += ` where ${args}`
    }
    sql += ` order by bjSendTime desc`
    console.log(sql)
    doSql(sql, sqlType.SELECT)
      .then((result) => {
        resolve(result)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

/**
 * 插入orders表 伯俊销售单
 * @param items
 * @returns
 */
const insert_orders_bj_sale = (items): Promise<unknown> => {
  let sql_batch =
    'insert or replace into orders (wingOrderNo, bjSendTime, totalNumSalse, totalAmountSalse) values '
  for (let i = 0; i < items.length; i++) {
    sql_batch += `('${items[i].wingOrderNo}', '${format(
      items[i].bjSendTime,
      'yyyy-MM-dd HH:mm:ss'
    )}', '${items[i].totalNumSalse}', '${items[i].totalAmountSalse}')`
    if (i < items.length - 1) {
      sql_batch += ','
    }
  }
  sql_batch +=
    'on conflict(wingOrderNo) do update set bjSendTime=excluded.bjSendTime, totalNumSalse=ifnull(orders.totalNumSalse,0)+excluded.totalNumSalse, totalAmountSalse=ifnull(orders.totalAmountSalse,0)+excluded.totalAmountSalse'
  console.log(sql_batch)
  return new Promise((resolve, reject) => {
    doSql(sql_batch, sqlType.INSERT)
      .then((result) => {
        resolve(result)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

/**
 * 插入orders表 伯俊退货单
 * @param items
 * @returns
 */
const insert_orders_bj_return = (items): Promise<unknown> => {
  let sql_batch =
    'insert or replace into orders (wingOrderNo, totalNumRefund, totalAmountRefund) values '
  for (let i = 0; i < items.length; i++) {
    sql_batch += `('${items[i].wingOrderNo}', '${items[i].totalNumRefund}', '${items[i].totalAmountRefund}')`
    if (i < items.length - 1) {
      sql_batch += ','
    }
  }
  sql_batch +=
    'on conflict(wingOrderNo) do update set totalNumRefund=ifnull(orders.totalNumRefund,0)+excluded.totalNumRefund, totalAmountRefund=ifnull(orders.totalAmountRefund,0)+excluded.totalAmountRefund'
  return new Promise((resolve, reject) => {
    doSql(sql_batch, sqlType.INSERT)
      .then((result) => {
        resolve(result)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

/**
 * 插入orders表 资金流水
 * @param items
 * @returns
 */
const insert_orders_cash_flow = (items): Promise<unknown> => {
  let sql_batch =
    'insert or replace into orders (wingOrderNo, payTime,goodsPay,platformDiscount1,platformDiscount2,platformDiscount3,platformDiscount4,freightPay,refundTime,goodsRefund,platformDiscountRecovery1,platformDiscountRecovery2,platformDiscountRecovery3,platformDiscountRecovery4,freightRefund) values '
  for (let i = 0; i < items.length; i++) {
    console.log(items[i])
    sql_batch += `('${items[i].wingOrderNo}', '${items[i].payTime}', '${items[i].goodsPay}', '${items[i].platformDiscount1}', '${items[i].platformDiscount2}', '${items[i].platformDiscount3}', '${items[i].platformDiscount4}', '${items[i].freightPay}', '${items[i].refundTime}', '${items[i].goodsRefund}', '${items[i].platformDiscountRecovery1}', '${items[i].platformDiscountRecovery2}', '${items[i].platformDiscountRecovery3}', '${items[i].platformDiscountRecovery4}', '${items[i].freightRefund}')`
    if (i < items.length - 1) {
      sql_batch += ','
    }
  }
  sql_batch += `on conflict(wingOrderNo) do update set payTime=excluded.payTime,goodsPay=ifnull(orders.goodsPay,0)+excluded.goodsPay,platformDiscount1=ifnull(orders.platformDiscount1,0)+excluded.platformDiscount1,platformDiscount2=ifnull(orders.platformDiscount2,0)+excluded.platformDiscount2,platformDiscount3=ifnull(orders.platformDiscount3,0)+excluded.platformDiscount3,platformDiscount4=ifnull(orders.platformDiscount4,0)+excluded.platformDiscount4,freightPay=ifnull(orders.freightPay,0)+excluded.freightPay,refundTime=excluded.refundTime,goodsRefund=ifnull(orders.goodsRefund,0)+excluded.goodsRefund,platformDiscountRecovery1=ifnull(orders.platformDiscountRecovery1,0)+excluded.platformDiscountRecovery1,platformDiscountRecovery2=ifnull(orders.platformDiscountRecovery2,0)+excluded.platformDiscountRecovery2,platformDiscountRecovery3=ifnull(orders.platformDiscountRecovery3,0)+excluded.platformDiscountRecovery3,platformDiscountRecovery4=ifnull(orders.platformDiscountRecovery4,0)+excluded.platformDiscountRecovery4,freightRefund=ifnull(orders.freightRefund,0)+excluded.freightRefund`
  return new Promise((resolve, reject) => {
    doSql(sql_batch, sqlType.INSERT)
      .then((result) => {
        resolve(result)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export { select_orders, insert_orders_bj_sale, insert_orders_bj_return, insert_orders_cash_flow }
