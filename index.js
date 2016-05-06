'use strict'
const path = require('path')
const fs = require('fs')
const electron = require('electron')
const store = require('./store')
require('electron-debug')()

const app = electron.app
const BrowserWindow = electron.BrowserWindow

const isDev = process.env.NODE_ENV === 'development'

let mainWindow
let isQuitting = false

function createMainWindow () {
  const lastWindowState = store.get('lastWindowState') || {width: 460, height: 720}

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

  win.loadURL('http://m.weibo.cn')

  if (isDev) {
    win.webContents.openDevTools()
  }

  win.on('closed', e => {
    if (!isQuitting) {
      e.preventDefault()

      if (process.platform === 'darwin') {
        app.hide()
      } else {
        win.hide()
      }
    }
  })

  return win
}

app.on('ready', () => {
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
    e.preventDefault()
    const externalPrefix = 'http://weibo.cn/sinaurl?u='
    if (url.indexOf(externalPrefix) !== -1) {
      console.log(url.replace(externalPrefix, ''))
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