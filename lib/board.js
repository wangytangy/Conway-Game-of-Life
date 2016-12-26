const Cell = require('./cell.js');

class Board {
  constructor() {
    this.squares = {};
    this.isPaused = true;
    this.generationCount = 0;
    // this.handlePressMove = this.handlePressMove.bind(this);
    // this.handlePressUp = this.handlePressUp.bind(this);
    this.setupInitialGrid = this.setupInitialGrid.bind(this);
    this.setupInitialGrid();
    this.drawGridBackground = this.drawGridBackground.bind(this);
    this.drawGridBackground();


    this.setupRandomGrid = this.setupRandomGrid.bind(this);
    this.setupGliders = this.setupGliders.bind(this);
    this.setupBenchmark = this.setupBenchmark.bind(this);
    this.setupBeaconMaker = this.setupBeaconMaker.bind(this);
    this.setupGospelGun = this.setupGospelGun.bind(this);
    this.setupCross = this.setupCross.bind(this);


    this.getNeighborCount = this.getNeighborCount.bind(this);
    this.updateGrid = this.updateGrid.bind(this);
    this.drawMirrorGrid = this.drawMirrorGrid.bind(this);

    this.togglePause = this.togglePause.bind(this);
    this.start = this.start.bind(this);
    this.runAnimation = this.runAnimation.bind(this);
    this.getNextGeneration = this.getNextGeneration.bind(this);
    this.toggleGrid = this.toggleGrid.bind(this);
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

  setupGliders() {
    this.setupInitialGrid();

    for (let col = 10; col < this.grid.length - 40; col += 5) {
      for (let row = 10; row < 15; row += 5) {
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
      this.grid[0 + col][24] = 1;
      this.squares[[0 + col, 24]].alive = true;
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

    this.grid[28][40] = 1;
    this.grid[29][40] = 1;
    this.grid[30][40] = 1;
    this.grid[30][41] = 1;
    this.grid[30][42] = 1;

    this.squares[[28, 40]].alive = true;
    this.squares[[29, 40]].alive = true;
    this.squares[[30, 40]].alive = true;
    this.squares[[30, 41]].alive = true;
    this.squares[[30, 42]].alive = true;

    for (let i = 0; i < 29; i++) {
      this.grid[31 + i][39 - i] = 1;
      this.squares[[31 + i, 39 - i]].alive = true;
    }

    this.grid[40 + 20][11] = 1;
    this.grid[40 + 20][12] = 1;

    this.squares[[40 + 20, 11]].alive = true;
    this.squares[[40 + 20, 12]].alive = true;


    this.drawMirrorGrid();
  }

  setupGospelGun() {
    this.setupInitialGrid();

    let gun =[
     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
     [0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
     [1,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
     [1,1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1,1,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
   ];

    for (var i = 0; i < gun.length; i++) {
      for (var j = 0; j < gun[i].length; j++) {
        // debugger
        if (gun[i][j] === 1) {
          this.grid[10 + j][3 + i] = 1;
          this.squares[[10 + j, 3 + i]].alive = true;
        }
      }
    }
    this.drawMirrorGrid();
  }

  setupCross() {
    this.setupInitialGrid();

    let cross =[
     [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0]
   ];

   for (let i = 0; i < cross.length; i++) {
     for (let j = 0; j < cross[i].length; j++) {
       // debugger
       if (cross[i][j] === 1) {
         this.grid[30 + j][15 + i] = 1;
         this.squares[[30 + j, 15 + i]].alive = true;
       }
     }
   }

   for (var k = 0; k < 15; k++) {
     this.squares[[54 + k, 29 + k]].alive = true;
     this.squares[[54 + k, 14 - k]].alive = true;
     this.squares[[39 - k, 29 + k]].alive = true;
     this.squares[[39 - k, 14 - k]].alive = true;
   }

   this.drawMirrorGrid();

  }


  getNeighborCount(coordinates) {
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

      let colDirection = delta[0];
      let rowDirection = delta[1];

      if ((col + colDirection) < 0 || (col + colDirection >= this.grid.length)) { return; }
      if ((row + rowDirection) < 0 || (row + rowDirection) >= this.grid[col].length) { return; }

      if (this.grid[col + colDirection][row + rowDirection] === 1) {
        liveNeighborCount += 1;
        if (liveNeighborCount > 3) { return; }
      }

    });
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
        squareObj.toggleAliveStatus();

      } else if (neighborCount < 2 || neighborCount > 3) {

        this.mirrorGrid[squareObj.xPos][squareObj.yPos] = 0;
        squareObj.alive = false;
      }

    });

    this.grid = JSON.parse(JSON.stringify(this.mirrorGrid));
    this.generationCount += 1;
  }

  drawMirrorGrid() {
<<<<<<< HEAD
    this.stage = this.stage || new createjs.Stage("easel");
    this.stage.removeAllChildren();



    Object.keys(this.squares).forEach((key) => {
      
      let width = this.squares[key].width;
=======

    this.stage = this.stage || new createjs.Stage("easel");
    this.stage.removeAllChildren();

    Object.keys(this.squares).forEach((key) => {

      let squareObj = this.squares[key];
>>>>>>> refactor2
      let square = new createjs.Shape();
      let width = this.squares[key].width;

      if (squareObj.alive === true) {

        if (squareObj.isColorToggled) {
          square.graphics.beginFill(squareObj.color);
        } else {
          square.graphics.beginFill("green");
        }

        square.graphics.beginStroke("black");
<<<<<<< HEAD
        square.graphics.beginFill("green");
=======
        square.graphics.setStrokeStyle(1);
        square.graphics.drawRect(0, 0, width - 3, width - 3);
        square.x = squareObj.xPos * width + 1.5;
        square.y = squareObj.yPos * width + 1.5;
        this.stage.addChild(square);
>>>>>>> refactor2
      }

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

      square.graphics.beginStroke("#4d4d4d");


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

  toggleGrid() {
    $('#grid').toggleClass("block");
  }

  getNextGeneration() {
    if (!this.isPaused) {
      this.isPaused = true;
    }
    this.updateGrid();
    this.drawMirrorGrid();
  }

  runAnimation() {
    if (!this.isPaused) {
      this.drawMirrorGrid();
      this.updateGrid();
    }
    requestAnimationFrame(this.runAnimation);
  }

  start() {
    this.runAnimation();
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    this.runAnimation.bind(this);
  }

}

document.addEventListener("DOMContentLoaded", function(){
  let board = new Board();

  $('#pause').on('click', board.togglePause);
  $('#random').on('click', board.setupRandomGrid);
  $('#glider').on('click', board.setupGliders);
  $('#benchmark').on('click', board.setupBenchmark);
  $('#beacon-maker').on('click', board.setupBeaconMaker);
  $('#gospel-gun').on('click', board.setupGospelGun);
  $('#cross').on('click', board.setupCross);
  $('#step-generation').on('click', board.getNextGeneration);
  $('#toggle-grid').on('click', board.toggleGrid);
  board.start();
});
