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
  var that = {
    setFilename: function(filename) {
      that.filename = filename;
      remote.getCurrentWindow().setTitle(`VexEd - ${filename}`);
    },

    setPersisted: function() {
      that.persisted = true;
    },

    setNotPersisted: function() {
      that.persisted = false;
    }
  };

  return that;
}());

var vextab = require('./js/vextab')(ui.input, ui.output, ui.error);

ui.input.addEventListener('input', function() { vextab.render(); });

ipc.on('file-open', function() {
  Dialog.showOpenDialog(null, {}, function(filenames) {
    if (filenames) {
      var filename = filenames[0];
      fs.readFile(filename, 'utf8', function(err, data) {
        if (err) { return Dialog.showErrorBox(`Error opening ${filename}`, err); }
        state.setFilename(filename);
        ui.input.innerText = data;
        vextab.render();
      });
    }
  });
});

ipc.on('file-save', function() {
  var data = ui.input.innerText;
  if (state.filename) {
    saveFile(state.filename, data);
  } else {
    Dialog.showSaveDialog(null, {}, function(filename) {
      saveFile(filename, data);
      state.setFilename(filename);
    });
  }
});

var saveFile = function(filename, data) {
  fs.writeFile(filename, data, function(err) {
    if (err) { Dialog.showErrorBox(`Error saving ${filename}`, err); }
  });
};

vextab.render();
