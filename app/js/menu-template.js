var menuCommands = require('./menu-commands');

module.exports = function(mainWindow) {
  var vexEdMenu = {label: 'VexEd', submenu: [
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
  ]};

  var fileMenu = {label: 'File', submenu: [
    {
      label: 'Open...',
      accelerator: 'CmdOrCtrl+O',
      click: function() { menuCommands.openFile(mainWindow); }
    },
    {
      label: 'Save',
      accelerator: 'CmdOrCtrl+S',
      click: function() { }
    },
    {
      label: 'Save as...',
      accelerator: 'CmdOrCtrl+Shift+S',
      click: function() { }
    }
  ]};

  var editMenu = {label: 'Edit', submenu: [
    {
      label: 'Undo',
      accelerator: 'CmdOrCtrl+Z',
      role: 'undo'
    },
    {
      label: 'Redo',
      accelerator: 'CmdOrCtrl+Shift+Z',
      role: 'redo'
    },


    {type: 'separator'},

    {
      label: 'Copy',
      accelerator: 'CmdOrCtrl+C',
      role: 'copy'
    },
    {
      label: 'Paste',
      accelerator: 'CmdOrCtrl+V',
      role: 'paste'
    },
    {
      label: 'Cut',
      accelerator: 'CmdOrCtrl+X',
      role: 'cut'
    },
    {
      label: 'Select All',
      accelerator: 'CmdOrCtrl+A',
      role: 'selectall'
    },
  ]};

  var windowMenu = {label: 'Window', role: 'window', submenu: [
    {
      label: 'Minimize',
      accelerator: 'CmdOrCtrl+M',
      role: 'minimize'
    },
    {
      label: 'Close',
      accelerator: 'CmdOrCtrl+W',
      role: 'close'
    }
  ]};

  var developMenu = {label: 'Develop', submenu: [
    {
      label: 'Reload',
      accelerator: 'CmdOrCtrl+R',
      click: function() { mainWindow.reload(); }
    },
    {
      label: 'Toggle DevTools',
      accelerator: 'Alt+CmdOrCtrl+I',
      click: function() { mainWindow.toggleDevTools(); }
    }
  ]};

  var menuTemplate = [
    vexEdMenu,
    fileMenu,
    editMenu,
    windowMenu
  ];

  if (process.env.DEBUG) { menuTemplate.push(developMenu); }

  return menuTemplate;
};
