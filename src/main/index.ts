import { app, shell, BrowserWindow } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import customIpc from './customIpc'
import sqlite3 from 'sqlite3'
import fs from 'fs'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 960,
    height: 720,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
  //init sqldb
  // SQLite 文件的路径
  let sqliteFilePath: string
  if (is.dev) {
    sqliteFilePath = './database.sqlite'
  } else {
    sqliteFilePath = join(app.getPath('userData'), 'database.sqlite')
  }
  // 检查文件是否存在
  if (!fs.existsSync(sqliteFilePath)) {
    console.error('SQLite file does not exist')
    const db = new sqlite3.Database(sqliteFilePath, (err) => {
      if (err) {
        console.error(err.message)
      }
      console.log('Connected to the database.')
      db.run(
        'create table if not exists orders(id integer primary key autoincrement, wingOrderNo varchar(255) not null unique, bjSendTime datetime, totalNumSalse double, totalAmountSalse double, totalNumRefund double, totalAmountRefund double, payTime datetime, goodsPay double, platformDiscount1 double, platformDiscount2 double, platformDiscount3 double, platformDiscount4 double, freightPay double, refundTime datetime, goodsRefund double, platformDiscountRecovery1 double, platformDiscountRecovery2 double, platformDiscountRecovery3 double, platformDiscountRecovery4 double, freightRefund double)',
        (err) => {
          if (err) {
            console.error(err.message)
          } else {
            console.log('Table created.')
            const stmt = db.prepare('INSERT INTO orders (wingOrderNo) VALUES (?)')
            for (let i = 0; i < 100; i++) {
              stmt.run(`wing_no_${i}`)
            }
            stmt.finalize()
          }
        }
      )
    })
    db.close((err) => {
      if (err) {
        console.error(err.message)
      }
      console.log('Close the database connection.')
    })
  } else {
    console.log('SQLite file exists')
  }

  customIpc()

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
