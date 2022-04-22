const express = require('express')
const eapp = express()
const port = 3000
const { app, BrowserWindow } = require('electron')

eapp.use(express.static('.'))

app.on('ready', function() {
  mainWindow = new BrowserWindow({
    width: 1080,
    height: 720,
    autoHideMenuBar: true,
    useContentSize: true,
    resizable: false,
  });
  mainWindow.loadURL('http://localhost:3000/');
  mainWindow.focus();

});

eapp.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})