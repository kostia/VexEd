var _      = require('lodash');
var fs     = require('fs');
var ipc    = require('ipc');
var remote = require('remote');

var Dialog = remote.require('dialog');

var ui = {
  input: document.getElementById('input'),
  output: document.getElementById('output'),
  error: document.getElementById('error')
};

var state = (function() {
  var currentWindow = remote.getCurrentWindow();

  var that = {
    isDirty: false,

    reset: function(filename, data) {
      that.isDirty      = false;
      that.filename     = filename;
      that.originalData = data;

      currentWindow.setTitle(`VexEd - ${filename}`);
    },

    markDirty: function() {
      that.isDirty = true;

      if (that.filename) {
        currentWindow.setTitle(`VexEd - ${that.filename}*`);
      } else {
        currentWindow.setTitle(`VexEd - *`);
      }
    }
  };

  return that;
}());

var vextab = require('./js/vextab')(ui.input, ui.output, ui.error);

ui.input.addEventListener('input', function() {
  if (input.innerText !== state.originalData) {
    state.markDirty();
  }
  vextab.render();
});

ipc.on('file-open', function() {
  trySaveNotPersisted(function() {
    Dialog.showOpenDialog(null, {}, function(filenames) {
      if (filenames) {
        var filename = filenames[0];
        fs.readFile(filename, 'utf8', function(err, data) {
          if (err) {
            return Dialog.showErrorBox(`Error opening ${filename}`, err);
          }

          state.reset(filename, data);
          ui.input.innerText = data;
          vextab.render();
        });
      }
    });
  });
});

ipc.on('file-save', function() {
  saveFile();
});

ipc.on('window-close', function() {
  trySaveNotPersisted(function() {
    ipc.send('app-quit');
  });
});

var saveFile = function(next) {
  if (state.filename) {
    saveKnownFile(state.filename, next);
  } else {
    saveUnknownFile(next);
  }
};

var saveUnknownFile = function(next) {
  Dialog.showSaveDialog(null, {}, function(filename) {
    if (filename) {
      saveKnownFile(filename, next);
    }
  });
};

var saveKnownFile = function(filename, next) {
  var data = ui.input.innerText;
  fs.writeFile(filename, data, function(err) {
    if (err) {
      return Dialog.showErrorBox(`Error saving ${filename}`, err);
    }

    state.reset(filename, data);
    if (next) { next(); }
  });
};

var trySaveNotPersisted = function(next) {
  if (state.isDirty) {
    Dialog.showMessageBox(null, {
      type: 'question',
      message: 'Save the changes?',
      buttons: ['Save', "Don't save"]
    }, function(response) {
      if (response === 0) {
        saveFile(next);
      } else {
        next();
      }
    });
  } else {
    next();
  }
};

var autoHeight = function() {
  var colLeft = $('#col-left');
  var colRight = $('#col-right');

  var height = _.max([$(window).height(), colLeft.height(), colRight.height(), 650]);

  colLeft.height(height);
  colRight.height(height);
};

$(window).on('resize', function() {
  autoHeight();
  vextab.render();
});

autoHeight();
vextab.render();
