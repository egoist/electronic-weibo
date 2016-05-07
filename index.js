'use strict'
const path = require('path')
const fs = require('fs')
const electron = require('electron')
const store = require('./store')
require('electron-debug')()
require('electron-dl')()

const {app, globalShortcut} = electron
const BrowserWindow = electron.BrowserWindow

const isDev = process.env.NODE_ENV === 'development'

const isAlreadyRunning = app.makeSingleInstance(() => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore()
    }

    mainWindow.show()
  }
})

if (isAlreadyRunning) {
  app.quit();
}

let mainWindow
let isQuitting = false

function createMainWindow () {
  const lastWindowState = store.get('lastWindowState') || {width: 430, height: 720}

  const win = new BrowserWindow({
    width: lastWindowState.width,
    height: lastWindowState.height,
    x: lastWindowState.x,
    y: lastWindowState.y,
    show: false,
    titleBarStyle: 'hidden-inset',
    webPreferences: {
      preload: path.join(__dirname, 'browser.js'),
      nodeIntegration: false,
      webSecurity: false,
      plugins: true
    }
  })

  if (process.platform === 'darwin') {
    win.setSheetOffset(40)
  }

  win.loadURL('http://m.weibo.cn')

  if (isDev) {
    win.webContents.openDevTools()
  }

  win.on('close', e => {
    if (!isQuitting) {
      e.preventDefault();

      if (process.platform === 'darwin') {
        app.hide();
      } else {
        win.hide();
      }
    }
  })
  return win
}

function regShortcuts() {
  // show window
  // TODO: allow custom keys
  globalShortcut.register('CommandOrControl+Shift+O', () => app.focus())
}

app.on('ready', () => {
  regShortcuts()
  mainWindow = createMainWindow()

  const page = mainWindow.webContents

  page.on('dom-ready', () => {
    page.insertCSS(fs.readFileSync(path.join(__dirname, 'browser.css'), 'utf8'))
    mainWindow.show()
  })

  page.on('new-window', (e, url) => {
    e.preventDefault()
    electron.shell.openExternal(url)
  })

  page.on('will-navigate', (e, url) => {
    const externalPrefix = 'http://weibo.cn/sinaurl?u='
    if (url.indexOf(externalPrefix) !== -1) {
      e.preventDefault()
      electron.shell.openExternal(decodeURIComponent(url.replace(externalPrefix, '')))
    }
  })
})

app.on('activate', function () {
  mainWindow.show()
})

app.on('before-quit', () => {
  isQuitting = true

  if (!mainWindow.isFullScreen()) {
    store.set('lastWindowState', mainWindow.getBounds())
  }
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})
