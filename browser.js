document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('e-weibo')
})

const electron = require('electron')
const ipc = electron.ipcRenderer

ipc.on('new-weibo', () => newWeibo())

function newWeibo() {
  location.href = '/mblog'
}
