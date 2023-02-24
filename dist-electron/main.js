'use strict';
const r = require('electron-window-state'),
	{ app: e, BrowserWindow: s } = require('electron'),
	n = require('electron-is-dev');
function o() {
	const i = r({ defaultWidth: 1e3, defaultHeight: 800 }),
		t = new s({
			...i,
			show: !0,
			webPreferences: {
				devTools: n,
				webSecurity: !0,
				nodeIntegration: !0,
				contextIsolation: !1,
				plugins: !0,
				experimentalFeatures: !0,
				experimentalCanvasFeatures: !0,
				minimumFontSize: 10,
			},
		});
	e.setUserTasks([]),
		n
			? (t.loadURL('http://localhost:3100/jinluo'), t.webContents.openDevTools())
			: t.loadURL(`http://${process.env.VITE_DEV_SERVER_HOST}:${process.env.VITE_DEV_SERVER_PORT}`);
}
e.whenReady().then(() => {
	o(),
		e.on('activate', () => {
			s.getAllWindows().length === 0 && o();
		});
});
e.on('window-all-closed', () => {
	process.platform !== 'darwin' && e.quit();
});
