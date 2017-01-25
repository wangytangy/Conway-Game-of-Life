const Board = require('./board.js');

class Game {
  constructor(board) {
    this.isPaused = true;
    this.fps = 45;
    this.board = board;

    this.togglePause = this.togglePause.bind(this);
    this.runAnimation = this.runAnimation.bind(this);
    this.getNextGeneration = this.getNextGeneration.bind(this);
    this.adjustFps = this.adjustFps.bind(this);
    this.start = this.start.bind(this);
  }

  togglePause(e) {
    if (e.keyCode === 32 || e.type === 'click') {
      e.preventDefault();
      $('.play').toggleClass('block-button');
      $('.pause').toggleClass('block-button');
      this.isPaused = !this.isPaused;
      this.runAnimation.bind(this.board);
    }
  }

  runAnimation() {
    if (!this.isPaused) {
      this.board.drawMirrorGrid();
      this.board.updateGrid();
    }
    setTimeout(() => (requestAnimationFrame(this.runAnimation)), 1000/this.fps);
  }

  start() {
    this.runAnimation();
  }

  getNextGeneration(e) {
    if (e.type === "click" || e.keyCode === 78) {
      if (!this.isPaused) {
        this.isPaused = true;
        $('.play').toggleClass('block-button');
        $('.pause').toggleClass('block-button');
      }
      this.board.updateGrid();
      this.board.drawMirrorGrid();
    }
  }

  adjustFps(e) {
    this.fps = e.currentTarget.value;
    $('#slider-max').html(`${this.fps} fps`);
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

    $('.play').on('click', game.togglePause);
    $('.pause').on('click', game.togglePause);
    $('body').on('keyup', game.togglePause);

    $('.next').on('click', game.getNextGeneration);
    $('body').on('keyup', game.getNextGeneration);

    $('#random').on('click', game.board.setupRandomGrid);
    $('#toggle-grid').on('click', game.board.toggleGrid);
    $('#clear-grid').on('click', game.board.clearGrid);
    $('#slider').change('change', game.adjustFps);

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
    game.start();

});
