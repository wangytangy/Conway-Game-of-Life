const Cell = require('./cell.js');

class Board {
  constructor() {
    this.squares = {};
    this.isPaused = true;
    // this.handlePressMove = this.handlePressMove.bind(this);
    // this.handlePressUp = this.handlePressUp.bind(this);
    this.setupInitialGrid = this.setupInitialGrid.bind(this);
    this.setupInitialGrid();
    this.setupRandomGrid = this.setupRandomGrid.bind(this);


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
    for (let col = 0; col < 60; col++) {
      this.grid[col] = [];
      for (let row = 0; row < 40; row++) {

        let copyCell = new Cell();
        copyCell.xPos = col;
        copyCell.yPos = row;
        this.squares[[col, row]] = copyCell;

        this.grid[col][row] = 0;
      }
    }

    // this.grid[2][0] = 1;
    // this.grid[3][1] = 1;
    // this.grid[1][2] = 1;
    // this.grid[2][2] = 1;
    // this.grid[3][2] = 1;
    // //
    // this.squares[[2, 0]].alive = true;
    // this.squares[[3, 1]].alive = true;
    // this.squares[[1, 2]].alive = true;
    // this.squares[[2, 2]].alive = true;
    // this.squares[[3, 2]].alive = true;

    this.mirrorGrid = JSON.parse(JSON.stringify(this.grid));

  }
  setupRandomGrid() {
    this.pause();

    this.grid = [];
    for (let col = 0; col < 60; col++) {
      this.grid[col] = [];
      for (let row = 0; row < 40; row++) {

        let copyCell = new Cell();
        copyCell.alive = Math.random() >= 0.5;
        copyCell.xPos = col;
        copyCell.yPos = row;
        this.squares[[col, row]] = copyCell;

        this.grid[col][row] = (copyCell.alive) ? 1 : 0;
      }
      this.drawMirrorGrid();
    }

    this.mirrorGrid = JSON.parse(JSON.stringify(this.grid));

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
    this.stage = new createjs.Stage("easel");


    Object.keys(this.squares).forEach((key) => {
      // debugger
      let width = this.squares[key].width;

      let square = new createjs.Shape();

      if (this.squares[key].alive === true) {
        square.graphics.beginStroke("black");
        square.graphics.beginFill("green");
      }

      square.graphics.setStrokeStyle(1);
      square.graphics.drawRect(0, 0, width, width);
      square.x = this.squares[key].xPos * width;
      square.y = this.squares[key].yPos * width;
      this.stage.addChild(square);
    });
    this.stage.update();
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

  start() {
    if (!this.isPaused) {
      this.drawMirrorGrid();
      this.updateGrid();
    }
    requestAnimationFrame(this.start);
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

  board.drawMirrorGrid();
  board.updateGrid();
  board.start();
});
//
