import { ipcMain } from 'electron'
import sqlite3 from 'sqlite3'
import { app } from 'electron'
import { is } from '@electron-toolkit/utils'
import { join } from 'path'

// sql操作类型
enum sqlType {
  CREATE_TABLE = 'CREATE_TABLE',
  INSERT = 'INSERT',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  SELECT = 'SELECT'
}

// 执行sql
const doSql = (sql: string, sql_type: sqlType): Promise<unknown> => {
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
const select_orders = (args): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM orders'
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
 * 插入orders表
 * @param items
 * @returns
 */
const insert_orders = (items): Promise<unknown> => {
  let sql_batch =
    'insert into orders (order_id, order_no, order_time, order_amount, order_status, order_remark) values '
  for (let i = 0; i < items.length; i++) {
    sql_batch += `('${items[i].order_id}', '${items[i].order_no}', '${items[i].order_time}', '${items[i].order_amount}', '${items[i].order_status}', '${items[i].order_remark}')`
    if (i < items.length - 1) {
      sql_batch += ','
    }
  }
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

export { select_orders, insert_orders }
