const Mousetrap = require('./modules/mousetrap')
const humane = require('./modules/humane')

document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('e-weibo')
  init()
})

const electron = require('electron')
const ipc = electron.ipcRenderer

ipc.on('new-weibo', () => newWeibo())

function newWeibo() {
  location.href = '/mblog'
}

function registerShortcuts() {
  Mousetrap.bind('g h', () => {
    location.href = '/'
  })
}

function init() {
  registerShortcuts()
}
