'use sttrict';

var app = require('app');
var fs = require('fs');
var ipc = require('ipc');

var BrowserWindow = require('browser-window');
var Dialog = require('dialog');
var Menu = require('menu');

var mainWindow = null;

app.on('ready', function() {
  mainWindow = new BrowserWindow({});
  mainWindow.loadUrl('file://' + __dirname + '/app/index.html');

  var menuTemplate = [
    {
      label: 'VexEd',
      submenu: [
        {
          label: 'About VexEd',
          role: 'about'
        },

        {type: 'separator'},

        {
          label: 'Hide VexEd',
          accelerator: 'CmdOrCtrl+H',
          role: 'hide'
        },
        {
          label: 'Hide Others',
          accelerator: 'CmdOrCtrl+Shift+H',
          role: 'hideothers'
        },
        {
          label: 'Show All',
          role: 'unhide'
        },

        {type: 'separator'},

        {
          label: 'Quit',
          accelerator: 'CmdOrCtrl+Q',
          selector: 'terminate:'
        }
      ]
    },

    {
      label: 'File',
      submenu: [
        {
          label: 'Open...',
          accelerator: 'CmdOrCtrl+O',
          click: function() {
            Dialog.showOpenDialog(mainWindow, {
              title: 'Open a Vex File',
              filters: [
                {name: 'Vex Files', extensions: ['vex']},
                {name: 'All Files', extensions: ['*']}
              ]
            }, function(filenames) {
              if (filenames) {
                var filename = filenames[0];
                fs.readFile(filename, 'utf8', function(err, data) {
                  if (err) { return Dialog.showErrorBox(`Error loading ${filename}`, err); }
                  mainWindow.webContents.send('load-data', data);
                  mainWindow.setTitle(`VexEd - ${filename}`);
                });
              }
            });
          }
        },
        {
          label: 'Save',
          accelerator: 'CmdOrCtrl+S',
          click: function() {
          }
        },
        {
          label: 'Save as...',
          accelerator: 'CmdOrCtrl+Shift+S',
          click: function() {
          }
        }
      ]
    }
  ];

  var menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
});
