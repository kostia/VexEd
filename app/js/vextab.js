module.exports = function(input, output, error) {
  var renderer = new Vex.Flow.Renderer(output, Vex.Flow.Renderer.Backends.CANVAS);
  var artist = new Artist(10, 10, 600, {scale: 0.8});
  var vextab = new VexTab(artist);

  return {
    render: function() {
      try {
        vextab.reset();
        artist.reset();
        vextab.parse(input.innerText);
        artist.render(renderer);
        error.innerText = '';
      } catch (e) {
        console.log(e);
        error.innerText = e.message.replace(/[\n]/g, '<br/>');
      }
    }
  };
};
