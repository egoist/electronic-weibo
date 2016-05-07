'use strict'
const os = require('os')
const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const shell = electron.shell
const appName = app.getName()

function sendAction(action, data) {
	const win = BrowserWindow.getAllWindows()[0]

	if (process.platform === 'darwin') {
		win.restore()
	}

	win.webContents.send(action, data)
}

const helpSubmenu = [
	{
		label: `${appName} 项目地址`,
		click() {
			shell.openExternal('https://github.com/egoist/electronic-weibo')
		}
	},
	{
		label: '报告问题',
		click() {
			const body = `
<!-- 请简要描述重现这个 bug 的步骤 -->
-
${app.getName()} ${app.getVersion()}
Electron ${process.versions.electron}
${process.platform} ${process.arch} ${os.release()}`

			shell.openExternal(`https://github.com/egoist/electronic-weibo/issues/new?body=${encodeURIComponent(body)}`)
		}
	}
]

const darwinTpl = [
	{
		label: appName,
		submenu: [
			{
				label: `关于 ${appName}`,
				role: 'about'
			},
			{
				type: 'separator'
			},
			{
				label: '退出账户',
				click() {
					sendAction('log-out')
				}
			},
			{
				type: 'separator'
			},
			{
				label: '服务',
				role: 'services',
				submenu: []
			},
			{
				type: 'separator'
			},
			{
				label: `隐藏 ${appName}`,
				accelerator: 'Cmd+H',
				role: 'hide'
			},
			{
				label: '隐藏其它',
				accelerator: 'Cmd+Shift+H',
				role: 'hideothers'
			},
			{
				label: '显示全部',
				role: 'unhide'
			},
			{
				type: 'separator'
			},
			{
				label: `退出 ${appName}`,
				accelerator: 'Cmd+Q',
				click() {
					app.quit()
				}
			}
		]
	},
	{
		label: '文件',
		submenu: [
			{
				label: '发布新微博',
				accelerator: 'Shift+W',
				click() {
					sendAction('new-weibo')
				}
			}
		]
	},
	{
		label: '编辑',
		submenu: [
			{
				label: '撤销',
				accelerator: 'CmdOrCtrl+Z',
				role: 'undo'
			},
			{
				label: '重做',
				accelerator: 'Shift+CmdOrCtrl+Z',
				role: 'redo'
			},
			{
				type: 'separator'
			},
			{
				label: '剪切',
				accelerator: 'CmdOrCtrl+X',
				role: 'cut'
			},
			{
				label: '复制',
				accelerator: 'CmdOrCtrl+C',
				role: 'copy'
			},
			{
				label: '粘贴',
				accelerator: 'CmdOrCtrl+V',
				role: 'paste'
			},
			{
				label: '全选',
				accelerator: 'CmdOrCtrl+A',
				role: 'selectall'
			}
		]
	},
	{
		label: '窗口',
		role: 'window',
		submenu: [
			{
				label: '最小化',
				accelerator: 'CmdOrCtrl+M',
				role: 'minimize'
			},
			{
				label: '关闭',
				accelerator: 'CmdOrCtrl+W',
				role: 'close'
			},
			{
				type: 'separator'
			},
			{
				label: '新窗口',
				accelerator: 'Ctrl+Tab',
				click() {
					sendAction('next-tab')
				}
			},
			{
				label: '上一个窗口',
				accelerator: 'Ctrl+Shift+Tab',
				click() {
					sendAction('previous-tab')
				}
			},
			{
				type: 'separator'
			},
			{
				label: '置顶所有窗口',
				role: 'front'
			},

			// temp workaround for:
			// https://github.com/sindresorhus/caprine/issues/5
			{
				label: '切换全屏',
				accelerator: 'Ctrl+Cmd+F',
				click() {
					const win = BrowserWindow.getAllWindows()[0]
					win.setFullScreen(!win.isFullScreen())
				}
			}
		]
	},
	{
		label: '帮助',
		role: 'help'
	}
]

const linuxTpl = [
	{
		label: '文件',
		submenu: [
			{
				label: '发布新微博',
				accelerator: 'Shift+W',
				click() {
					sendAction('new-weibo')
				}
			},
			{
				type: 'separator'
			},
			{
				label: '下一个窗口',
				accelerator: 'Ctrl+Tab',
				click() {
					sendAction('next-tab')
				}
			},
			{
				label: '上一个窗口',
				accelerator: 'Ctrl+Shift+Tab',
				click() {
					sendAction('previous-tab')
				}
			},
			{
				type: 'separator'
			},
			{
				label: '退出账户',
				click() {
					sendAction('log-out')
				}
			},
			{
				label: '退出',
				click() {
					app.quit()
				}
			}
		]
	},
	{
		label: '编辑',
		submenu: [
			{
				label: '剪切',
				accelerator: 'CmdOrCtrl+X',
				role: 'cut'
			},
			{
				label: '复制',
				accelerator: 'CmdOrCtrl+C',
				role: 'copy'
			},
			{
				label: '粘贴',
				accelerator: 'CmdOrCtrl+V',
				role: 'paste'
			}
		]
	},
	{
		label: '视图',
		submenu: viewSubmenu
	},
	{
		label: '帮助',
		role: 'help'
	}
]

let tpl
if (process.platform === 'darwin') {
	tpl = darwinTpl
} else {
	tpl = linuxTpl
}

tpl[tpl.length - 1].submenu = helpSubmenu

module.exports = electron.Menu.buildFromTemplate(tpl)
