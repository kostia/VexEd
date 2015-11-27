var _      = require('lodash');
var fs     = require('fs');
var ipc    = require('ipc');
var path   = require('path');
var remote = require('remote');
var shell  = require('shell');

var Dialog = remote.require('dialog');

var ui = {
  input: $('#input'),
  output: $('#output'),
  error: $('#error')
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

var editor = ace.edit('input');
editor.session.setOption('useWorker', false);
editor.session.setMode('ace/mode/ini');

var vextab = require('./js/editor-renderer/vextab')(ui.input, ui.output, ui.error, editor);

editor.on('change', function() {
  if (editor.getValue !== state.originalData) {
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

ipc.on('file-save-as', function() {
  saveUnknownFile();
});

ipc.on('file-save-as-pdf', function() {
  saveAsPdf();
});

ipc.on('window-close', function() {
  trySaveNotPersisted(function() {
    ipc.send('app-quit');
  });
});

ipc.on('help-show-cheatsheet', function() {
  shell.openExternal('http://my.vexflow.com/articles/134');
});

var saveAsPdf = function() {
  var pdf = new jsPDF('s', 'mm');
  pdf.addImage(ui.output.get(0).toDataURL('image/png'), 'PNG', 10, 10);

  var filename;
  if (state.filename) {
    filename = path.basename(state.filename, '.vex') + '.pdf';
  } else {
    filename = 'Notation.pdf';
  }

  filename = `${process.env.HOME || process.env.USERPROFILE}/${filename}`

  Dialog.showSaveDialog(null, {defaultPath: filename}, function(filename) {
    if (filename) {
      var data = pdf.output();
      fs.writeFile(filename, data, 'binary', function(err) {
        if (err) {
          return Dialog.showErrorBox(`Error saving ${filename}`, err);
        }
        shell.showItemInFolder(filename);
      });
    }
  });
};

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
  var windowHeight = $(window).height();
  var elements = $('.auto-height');

  if ($('body').is('.view-vert')) {
    var heights = _.map(elements, function(e) { return $(e).height(); });
    heights.push(windowHeight);
    heights.push(650);
    height = _.max(heights);
  } else {
    height = windowHeight / 2;
  }

  elements.height(height);
};

var render = function() {
  autoHeight();
  vextab.render();
  editor.resize();
};

$(window).on('resize', function() {
  render();
});

var toggleSplit = function() {
  $('body').toggleClass('view-vert');
  render();
};

$('.file-save-as-pdf').on('click', function() {
  saveAsPdf();
});

$('.view-switch-vert').on('click', function() {
  if ($('body').is(':not(.view-vert)')) {
    toggleSplit();
  }
});

$('.view-switch-horiz').on('click', function() {
  if ($('body').is('.view-vert')) {
    toggleSplit();
  }
});

ipc.on('view-switch-vert', function() {
  if ($('body').is(':not(.view-vert)')) {
    toggleSplit();
  }
});

ipc.on('view-switch-horiz', function() {
  if ($('body').is('.view-vert')) {
    toggleSplit();
  }
});

autoHeight();
vextab.render();
