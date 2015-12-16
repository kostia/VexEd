module.exports = function(input, output, error, editor) {
  var renderer = new Vex.Flow.Renderer(output.get(0), Vex.Flow.Renderer.Backends.SVG);

  return {
    render: function() {
      var artist = new Artist(10, 10, input.width() - 30);
      var vextab = new VexTab(artist);

      try {
        vextab.reset();
        artist.reset();
        vextab.parse(editor.getValue());
        artist.render(renderer);
        error.text('');
        error.hide();
      } catch (e) {
        console.log(e);
        error.text(`Error: ${e.message.replace(/[\n]/g, '<br/>')}`);
        error.show();
      }
    }
  };
};
