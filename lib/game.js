const Board = require('./board.js');

class Game {
  constructor(board) {
    this.isPaused = true;
    this.fps = 45;
    this.board = board;
  }
}

document.addEventListener("DOMContentLoaded", function() {

  let game = new Game(new Board());

    $("#easel").click(function(e) {

      let cellWidth = game.board.settings.cellWidth;
      let parentOffset = $(this).offset();
      let relX = Math.floor(((e.pageX - parentOffset.left) / cellWidth));
      let relY = Math.floor(((e.pageY - parentOffset.top) / cellWidth));
      let squareObj = game.board.squares[[relX, relY]];

      squareObj.toggleAliveStatus();
      game.board.toggleGridAliveStatus(relX, relY);
      game.board.drawMirrorGrid();
    });

    $('.play').on('click', game.board.togglePause);
    $('.pause').on('click', game.board.togglePause);
    $('body').on('keyup', game.board.togglePause);

    $('.next').on('click', game.board.getNextGeneration);
    $('body').on('keyup', game.board.getNextGeneration);

    $('#random').on('click', game.board.setupRandomGrid);
    $('#toggle-grid').on('click', game.board.toggleGrid);
    $('#clear-grid').on('click', game.board.clearGrid);
    $('#slider').change('change', game.board.adjustFps);

    $(".configs-dropdown").change(function(e) {
      e.preventDefault();
      let pattern = e.currentTarget.value;
      switch (pattern) {
        case 'glider':
          game.board.setupGliders();
          break;
        case 'benchmark':
          game.board.setupBenchmark();
          break;
        case 'beacon-maker':
          game.board.setupBeaconMaker();
          break;
        case 'gosper-gun':
          game.board.setupGosperGun();
          break;
        case 'growth-gun':
          game.board.setupInfiniteGrowthGun();
          break;
        case 'superstring':
        case 'lightwire':
        case 'electricFence':
        case 'spaceRake':
          game.board.setupCellsHorizontal(pattern);
          break;
        case 'piOrbital':
          game.board.setupCellsVertical(pattern);
          break;
        case 'boatStretcher':
        case 'wickerStretcher':
          game.board.setupCellsHorizontalReverse(pattern);
          break;
        case 'pinwheel':
        case 'kokGalaxy':
        case 'quasar':
        case 'hectic':
        case 'pulShuttle':
        case 'gliderDuplicator':
        case 'spaceshipBouncer':
        case 'trafficCircle':
        case 'spacefiller':
          game.board.setupCellsCenter(pattern);
          break;
      }
    });
    game.board.start();

});
