const Cell = require('./cell.js');

class Board {
  constructor() {
    this.squares = {};
    this.setupGrid();

    this.getNeighborCount = this.getNeighborCount.bind(this);
    this.updateGrid = this.updateGrid.bind(this);
    this.drawMirrorGrid = this.drawMirrorGrid.bind(this);

    this.loop = this.loop.bind(this);
    // debugger
  }

  setupGrid() {
    this.grid = [];
    for (let col = 0; col < 20; col++) {
      this.grid[col] = [];
      for (let row = 0; row < 15; row++) {
        let cell = new Cell();
        cell.yPos = col * 15;
        cell.xPos = row * 15;
        // cell.alive = Math.floor(Math.random() * 2);
        this.grid[col][row] = cell;
        this.squares[[col, row]] = cell;
      }
    }
    this.grid[2][0].alive = true;
    this.grid[3][1].alive = true;

    this.grid[1][2].alive = true;
    this.grid[2][2].alive = true;
    this.grid[3][2].alive = true;
    //
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



      if (this.grid[col + colDirection][row + rowDirection].alive === true) {
        liveNeighborCount += 1;
        if (liveNeighborCount > 3) { return; }
      }

    });
    //returns number of live neighbors
    // console.log(`${col}${row}`);
    // console.log(liveNeighborCount);
    return liveNeighborCount;
  }

  updateGrid() {
    for (let col = 0; col < this.grid.length; col++) {

      for (let row = 0; row < this.grid[col].length; row++) {
        let neighborCount = this.getNeighborCount([col, row]);
        let isLiving = this.grid[col][row].alive;

        if ((neighborCount === 2 || neighborCount === 3) && isLiving) {
          this.mirrorGrid[col][row].alive = true;
          this.squares[[col, row]].alive = true;

        } else if (neighborCount === 3 && !isLiving) {

          this.mirrorGrid[col][row].alive = true;
          this.squares[[col, row]].alive = true;
        } else if (neighborCount < 2 || neighborCount > 3) {

          this.mirrorGrid[col][row].alive = false;
          this.squares[[col, row]].alive = false;
        }
      }
    }
    
    this.grid = JSON.parse(JSON.stringify(this.mirrorGrid));
  }

  renderNextGen() {
    //call updateGrid to get new mirrorGrid,

    //call draw again
  }


  drawMirrorGrid() {
    this.stage = new createjs.Stage("easel");

    for (let key in this.squares) {
      // debugger
      let square = new createjs.Shape();
      if (this.squares.hasOwnProperty(key)) {
        // debugger
        if (this.squares[key].alive) {
          square.graphics.beginStroke("black");
          square.graphics.beginFill("green");
          square.graphics.setStrokeStyle(1);
          square.graphics.drawRect(0, 0, 15, 15);
        } else {
          square.graphics.beginStroke("black");
          square.graphics.beginFill("gray");
          square.graphics.setStrokeStyle(1);
          square.graphics.drawRect(0, 0, 15, 15);
        }
        square.x = this.squares[key].yPos;
        square.y = this.squares[key].xPos;
        this.stage.addChild(square);
      }
    }
    this.stage.update();

  }
  //
  // // drawGrid() {
  //   // Create a stage by getting a reference to the canvas
  //   this.stage = new createjs.Stage("easel");
  //   this.stage.enableMouseOver(20);
  //
  //   for (let x = 0; x < 5; x++) {
  //     for (let y = 0; y < 5; y++) {
  //       //Create a Shape DisplayObject.
  //
  //
  //
  //       let square = new createjs.Shape();
  //       //Set position of Shape instance.
  //       square.graphics.beginStroke("black");
  //       square.graphics.setStrokeStyle(1);
  //
  //       let fillSquare = square.graphics.beginFill("gray").command;
  //
  //       square.graphics.drawRect(0, 0, 15, 15);
  //       square.x = x * 15;
  //       square.y = y * 15;
  //       square.on('mouseover', this.handlePressMove);
  //       square.on('pressup', this.handlePressUp);
  //
  //
  //       //Add Shape instance to stage display list.
  //       this.stage.addChild(square);
  //       //Update stage will render next frame
  //       this.squares[square.id] = {``
  //         square: square,
  //         fillSquare: fillSquare,
  //         coords: [x, y]
  //       };
  //
  //       this.stage.update();
  //
  //     }
  //   }
  // }

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
  loop() {
    // debugger
    this.drawMirrorGrid();
    // debugger
    this.updateGrid();
    requestAnimationFrame(this.loop);

  }
}

document.addEventListener("DOMContentLoaded", function(){
  let board = new Board();
  // board.drawMirrorGrid();


  // board.updateGrid();
  // debugger
  // board.drawMirrorGrid();
  board.loop();
  // createjs.Ticker.setInterval(25);
  // createjs.Ticker.setFPS(100);
  // createjs.Ticker.addEventListener("tick", board.loop);

});
