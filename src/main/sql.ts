import { ipcMain } from 'electron'
import sqlite3 from 'sqlite3'
import { app } from 'electron'
import { is } from '@electron-toolkit/utils'
import { join } from 'path'

const sqlIpc = (): void => {
  let sqliteFilePath: string
  if (is.dev) {
    sqliteFilePath = './database.sqlite'
  } else {
    sqliteFilePath = join(app.getPath('userData'), '/database.sqlite')
  }
  //数据库查询
  ipcMain.handle('query-database', () => {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(sqliteFilePath, (err) => {
        if (err) {
          reject(err)
        }
      })
      db.all('SELECT * FROM orders', (err, rows) => {
        if (err) {
          reject(err)
        }
        resolve(rows)
      })
      db.close()
    })
  })
}
export default sqlIpc
