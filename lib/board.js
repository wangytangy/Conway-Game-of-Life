const Cell = require('./cell.js');

class Board {
  constructor() {
    this.squares = {};
    this.isPaused = false;
    // this.handlePressMove = this.handlePressMove.bind(this);
    // this.handlePressUp = this.handlePressUp.bind(this);
    this.setupInitialGrid = this.setupInitialGrid.bind(this);
    this.setupInitialGrid();
    this.drawGridBackground = this.drawGridBackground.bind(this);
    this.drawGridBackground();


    this.setupRandomGrid = this.setupRandomGrid.bind(this);
    this.setupSingleGliders = this.setupSingleGliders.bind(this);
    this.setupBenchmark = this.setupBenchmark.bind(this);
    this.setupBeaconMaker = this.setupBeaconMaker.bind(this);


    this.getNeighborCount = this.getNeighborCount.bind(this);
    this.updateGrid = this.updateGrid.bind(this);
    this.drawMirrorGrid = this.drawMirrorGrid.bind(this);

    this.togglePause = this.togglePause.bind(this);
    this.pause = this.pause.bind(this);
    this.start = this.start.bind(this);
    // debugger
  }

  setupInitialGrid() {
    // debugger
    this.grid = [];
    for (let col = 0; col < 100; col++) {
      this.grid[col] = [];
      for (let row = 0; row < 50; row++) {

        let copyCell = new Cell();
        copyCell.xPos = col;
        copyCell.yPos = row;
        this.squares[[col, row]] = copyCell;

        this.grid[col][row] = 0;
      }
    }
    this.mirrorGrid = JSON.parse(JSON.stringify(this.grid));
  }

  setupSingleGliders() {
    this.setupInitialGrid();

    for (let col = 0; col < this.grid.length; col += 5) {
      for (let row = 0; row < this.grid[col].length - 20; row += 5) {
        this.grid[1 + col][0 + row] = 1;
        this.grid[2 + col][1 + row] = 1;
        this.grid[0 + col][2 + row] = 1;
        this.grid[1 + col][2 + row] = 1;
        this.grid[2 + col][2 + row] = 1;
        //
        this.squares[[1 + col, 0 + row]].alive = true;
        this.squares[[2 + col, 1 + row]].alive = true;
        this.squares[[0 + col, 2 + row]].alive = true;
        this.squares[[1 + col, 2 + row]].alive = true;
        this.squares[[2 + col, 2 + row]].alive = true;
      }
    }


    this.drawMirrorGrid();

  }

  setupBenchmark() {
    this.setupInitialGrid();
    for (let col = 0; col < this.grid.length; col++) {
      this.grid[0 + col][20] = 1;
      this.squares[[0 + col, 19]].alive = true;
      //make multiple?

    }
    this.drawMirrorGrid();
  }

  setupRandomGrid() {

    this.setupInitialGrid();

    for (let col = 0; col < this.grid.length; col++) {
      for (let row = 0; row < this.grid[col].length; row++) {
        let bool = Math.random() > 0.7;

        this.grid[col][row] = (bool)? 1 : 0;
        this.squares[[col, row]].alive = bool;
      }
    }

    this.drawMirrorGrid();
  }

  setupBeaconMaker() {
    this.setupInitialGrid();

    this.grid[18][30] = 1;
    this.grid[19][30] = 1;
    this.grid[20][30] = 1;
    this.grid[20][31] = 1;
    this.grid[20][32] = 1;

    this.squares[[18, 30]].alive = true;
    this.squares[[19, 30]].alive = true;
    this.squares[[20, 30]].alive = true;
    this.squares[[20, 31]].alive = true;
    this.squares[[20, 32]].alive = true;

    for (let i = 0; i < 20; i++) {
      this.grid[20 + i][30 - i] = 1;
      this.squares[[20 + i, 30 - i]].alive = true;
    }
    this.grid[20 + 20][11] = 1;
    this.grid[20 + 20][12] = 1;

    this.squares[[20 + 20, 11]].alive = true;
    this.squares[[20 + 20, 12]].alive = true;


    this.drawMirrorGrid();
  }


  getNeighborCount(coordinates) {
    //receives array [x, y] coordinates
    let liveNeighborCount = 0;

    const DELTAS = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1]
    ];

    let col = coordinates[0];
    let row = coordinates[1];

    DELTAS.forEach((delta) => {
      // console.log(`Current SQUARE: col:${col} row:${row}`);
      // console.log(`${this.grid[col][row].alive}`);
      let colDirection = delta[0];
      let rowDirection = delta[1];
      // console.log(`COL delta: ${colDirection}`);
      // console.log(`ROW delta: ${rowDirection}`);
      if ((col + colDirection) < 0 || (col + colDirection >= this.grid.length)) { return; }
      if ((row + rowDirection) < 0 || (row + rowDirection) >= this.grid[col].length) { return; }

      if (this.grid[col + colDirection][row + rowDirection] === 1) {
        liveNeighborCount += 1;
        if (liveNeighborCount > 3) { return; }
      }

    });
    //returns number of live neighbors
    // console.log(`${col}${row}: ${liveNeighborCount}`);
    return liveNeighborCount;
  }

  updateGrid() {
    Object.keys(this.squares).forEach((key) => {
      let squareObj = this.squares[key];

      let neighborCount = this.getNeighborCount([squareObj.xPos, squareObj.yPos]);
      let isLiving = this.grid[squareObj.xPos][squareObj.yPos] === 1;

      if ((neighborCount === 2 || neighborCount === 3) && isLiving) {

        this.mirrorGrid[squareObj.xPos][squareObj.yPos] = 1;
        squareObj.alive = true;

      } else if (neighborCount === 3 && !isLiving) {
        this.mirrorGrid[squareObj.xPos][squareObj.yPos] = 1;
        squareObj.alive = true;
      } else if (neighborCount < 2 || neighborCount > 3) {

        this.mirrorGrid[squareObj.xPos][squareObj.yPos] = 0;
        squareObj.alive = false;
      }
      // console.log(`${key}`);
    });

    this.grid = JSON.parse(JSON.stringify(this.mirrorGrid));
  }

  drawMirrorGrid() {
    this.stage = this.stage || new createjs.Stage("easel");
    // this.stage.clear();
    this.stage.removeAllChildren();
    Object.keys(this.squares).forEach((key) => {
      // debugger
      let width = this.squares[key].width;

      let square = new createjs.Shape();

      if (this.squares[key].alive === true) {
        square.graphics.beginStroke("black");
        square.graphics.beginFill("green");
      }

      square.graphics.setStrokeStyle(1);
      square.graphics.drawRect(0, 0, width - 3, width - 3);
      square.x = this.squares[key].xPos * width + 1.5;
      square.y = this.squares[key].yPos * width + 1.5;
      this.stage.addChild(square);
    });
    this.stage.update();
  }

  drawGridBackground() {
    this.background = this.background || new createjs.Stage("grid");
    this.background.clear();
    Object.keys(this.squares).forEach((key) => {
      // debugger
      let width = this.squares[key].width;

      let square = new createjs.Shape();

      square.graphics.beginStroke("white");


      square.graphics.setStrokeStyle(0.5);
      square.graphics.drawRect(0, 0, width, width);
      square.x = this.squares[key].xPos * width;
      square.y = this.squares[key].yPos * width;
      this.background.addChild(square);
    });
    this.background.update();
  }


  // handlePressUp() {
  //   console.log("up");
  // }
  //
  // handlePressMove(e) {
  //   console.log(`${e.target.id}`);
  //
  //   //Set position of Shape instance.
  //   let currentSquare = this.squares[e.target.id].square;
  //   this.squares[e.target.id].fillSquare.style = "green";
  //   // debugger
  //   this.stage.update();
  // }

  updateNextGen() {
    if (!this.isPaused) {
      this.drawMirrorGrid();
      this.updateGrid();
    }
    requestAnimationFrame(this.updateNextGen.bind(this));
  }

  start() {
    if (!this.isPaused) {
      requestAnimationFrame(this.updateNextGen.bind(this));
    }
  }

  togglePause() {
    this.isPaused = !this.isPaused;
  }

  pause() {
    this.isPaused = true;
  }


}

document.addEventListener("DOMContentLoaded", function(){
  let board = new Board();


  $('#pause').on('click', board.togglePause);
  $('#random').on('click', board.setupRandomGrid);
  $('#glider').on('click', board.setupSingleGliders);
  $('#benchmark').on('click', board.setupBenchmark);
  $('#beacon-maker').on('click', board.setupBeaconMaker);
  board.start();
});
//
