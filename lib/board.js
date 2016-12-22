const Cell = require('./cell.js');

class Board {
  constructor() {
    this.squares = {};
    this.handlePressMove = this.handlePressMove.bind(this);
    this.handlePressUp = this.handlePressUp.bind(this);
    this.setupGrid();
    this.mirrorGrid = this.grid;
    // debugger
  }

  setupGrid() {
    this.grid = [];
    for (var x = 0; x < 10; x++) {
      this.grid[x] = [];
      for (var y = 0; y < 10; y++) {
        let cell = new Cell();
        cell.alive = (Math.random() >= 0.5);
        this.grid[x][y] = cell;
      }
    }
  }

  getNeighborCount() {
    //returns number of live neighbors

  }

  updateGrid() {
    //iterates through the grid, constructing the next generation state

    //uses getNeighborCount()

    //don't update this.grid:
    //add updated cell to same position in this.mirrorGrid

  }


  drawRandomGrid() {
    this.stage = new createjs.Stage("easel");

    for (var x = 0; x < 10; x++) {
      for (var y = 0; y < 10; y++) {
        let square = new createjs.Shape();
        if (this.mirrorGrid[x][y].alive === false) {
          console.log(`x:${x} y:${y}`);
          square.graphics.beginStroke("black");
          square.graphics.beginFill("gray");
        } else {
          square.graphics.beginStroke("black");
          square.graphics.beginFill("green");
        }
        square.graphics.setStrokeStyle(1);
        square.graphics.drawRect(0, 0, 15, 15);
        square.x = x * 15;
        square.y = y * 15;
        this.stage.addChild(square);
        this.stage.update();
      }
    }

  }

  drawGrid() {
    // Create a stage by getting a reference to the canvas
    this.stage = new createjs.Stage("easel");
    this.stage.enableMouseOver(20);

    for (let x = 0; x < 5; x++) {
      for (let y = 0; y < 5; y++) {
        //Create a Shape DisplayObject.
        console.log(`${x}, ${y}`);


        let square = new createjs.Shape();
        //Set position of Shape instance.
        square.graphics.beginStroke("black");
        square.graphics.setStrokeStyle(1);

        let fillSquare = square.graphics.beginFill("gray").command;

        square.graphics.drawRect(0, 0, 15, 15);
        square.x = x * 15;
        square.y = y * 15;
        square.on('mouseover', this.handlePressMove);
        square.on('pressup', this.handlePressUp);


        //Add Shape instance to stage display list.
        this.stage.addChild(square);
        //Update stage will render next frame
        this.squares[square.id] = {
          square: square,
          fillSquare: fillSquare,
          coords: [x, y]
        };

        this.stage.update();

      }
    }
  }

  handlePressUp() {
    console.log("up");
  }

  handlePressMove(e) {
    console.log(`${e.target.id}`);

    //Set position of Shape instance.
    let currentSquare = this.squares[e.target.id].square;
    this.squares[e.target.id].fillSquare.style = "green";
    // debugger
    this.stage.update();
  }
}

document.addEventListener("DOMContentLoaded", function(){
  let board = new Board();
  board.drawRandomGrid();
});
