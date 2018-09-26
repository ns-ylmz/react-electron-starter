const electron =  require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');

// Let electron reloads by itself when webpack watches changes in ./app/
require('electron-reload')(__dirname)

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({ height: 600, width: 800 });

    mainWindow.loadURL(`http://localhost:8080`);

    //win.webContents.openDevTools();

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
})