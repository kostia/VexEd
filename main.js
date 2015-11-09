'use sttrict';

require('electron-compile').init();

var app = require('app');
var BrowserWindow = require('browser-window');

var mainWindow = null;

app.on('ready', function() {
  mainWindow = new BrowserWindow({});
  mainWindow.loadUrl('file://' + __dirname + '/app/index.html');
  require('electron-compile').init();
});
