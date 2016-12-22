class Board {
  constructor() {
    this.squares = {};
    this.handlePressMove = this.handlePressMove.bind(this);
    this.handlePressUp = this.handlePressUp.bind(this);
    this.setupGrid();
    // debugger
  }

  setupGrid() {
    this.grid = [];
    for (var x = 0; x < 5; x++) {
      this.grid[x] = [];
      for (var y = 0; y < 5; y++) {
        this.grid[x][y] = 0;
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
  board.drawGrid();
});
