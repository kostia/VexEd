'use strict';

var app = require('app');
var ipc = require('ipc');

var BrowserWindow = require('browser-window');
var Menu          = require('menu');

var menuTemplate = require('./main/menu-template');

var mainWindow = null;
var warnBeforeClose = true;

app.on('ready', function() {
  mainWindow = new BrowserWindow({width: 1200, height: 700});
  mainWindow.loadUrl('file://' + __dirname + '/../editor-renderer.html');

  var applicationMenu = Menu.buildFromTemplate(menuTemplate(mainWindow, app));
  Menu.setApplicationMenu(applicationMenu);

  if (process.env.TOOLS) {
    mainWindow.webContents.on('did-finish-load', function() {
      mainWindow.toggleDevTools();
    });
  }

  mainWindow.on('close', function(e) {
    if (warnBeforeClose) {
      e.preventDefault();
      mainWindow.webContents.send('window-close');
    }
  });
});

ipc.on('app-quit', function() {
  warnBeforeClose = false;
  app.quit();
});
