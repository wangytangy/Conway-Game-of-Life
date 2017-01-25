const Cell = require('./cell.js');
const configs = require('./cell_configs.js');

class Board {
  constructor() {
    this.squares = {};

    this.settings = {
      canvasWidth: 1000,
      canvasHeight: 440,
      colNum: 140,
      rowNum: 60,
      cellWidth: 1200/160,
    };

    $("#grid").attr({
      "height": `${this.settings.canvasHeight}`,
      "width": `${this.settings.canvasWidth}`,
    });
    $("#easel").attr({
      "height": `${this.settings.canvasHeight}`,
      "width": `${this.settings.canvasWidth}`,
    });
    $(".canvas-container").css({
      "height": `${this.settings.canvasHeight}`,
      "width": `${this.settings.canvasWidth}`,
    });

    this.setupInitialGrid = this.setupInitialGrid.bind(this);
    this.setupInitialGrid();
    this.drawGridBackground = this.drawGridBackground.bind(this);
    this.drawGridBackground();

    this.parseTextIntoConfig = this.parseTextIntoConfig.bind(this);
    this.setupRandomGrid = this.setupRandomGrid.bind(this);
    this.setupGliders = this.setupGliders.bind(this);
    this.setupBenchmark = this.setupBenchmark.bind(this);
    this.setupBeaconMaker = this.setupBeaconMaker.bind(this);
    this.setupGosperGun = this.setupGosperGun.bind(this);
    this.setupInfiniteGrowthGun = this.setupInfiniteGrowthGun.bind(this);
    this.setupCellsHorizontal = this.setupCellsHorizontal.bind(this);
    this.setupCellsHorizontalReverse = this.setupCellsHorizontalReverse.bind(this);
    this.setupCellsVertical = this.setupCellsVertical.bind(this);
    this.setupCellsCenter = this.setupCellsCenter.bind(this);

    this.getNeighborCount = this.getNeighborCount.bind(this);
    this.updateGrid = this.updateGrid.bind(this);
    this.drawMirrorGrid = this.drawMirrorGrid.bind(this);
    this.toggleGridAliveStatus = this.toggleGridAliveStatus.bind(this);

    // this.clearGrid = this.clearGrid.bind(this);
    // this.toggleGrid = this.toggleGrid.bind(this);
  }

  drawMirrorGrid() {
    this.stage = this.stage || new createjs.Stage("easel");
    this.stage.removeAllChildren();
    let width = this.settings.cellWidth;

    Object.keys(this.squares).forEach((key) => {
      let squareObj = this.squares[key];
      let square = new createjs.Shape();

      if (squareObj.alive === true) {
        if (squareObj.isColorToggled) {
          square.graphics.beginFill(squareObj.color);
        } else {
          square.graphics.beginFill("#ffffff");
        }
        square.graphics.setStrokeStyle(1);
        square.graphics.drawRect(0, 0, width - 3, width - 3);
        square.x = squareObj.xPos * width + 1.5;
        square.y = squareObj.yPos * width + 1.5;
        this.stage.addChild(square);
        squareObj.id = square.parent.getChildIndex(square);
      }
    });

    this.stage.update();
  }

  drawGridBackground() {
    this.background = this.background || new createjs.Stage("grid");
    this.background.removeAllChildren();
    let width = this.settings.cellWidth;

    Object.keys(this.squares).forEach((key) => {
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


  setupInitialGrid() {
    this.grid = [];
    for (let col = 0; col < this.settings.colNum; col++) {
      this.grid[col] = [];
      for (let row = 0; row < this.settings.rowNum; row++) {
        let cell = new Cell();
        cell.xPos = col;
        cell.yPos = row;
        cell.width = this.settings.cellWidth;
        this.squares[[col, row]] = cell;
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
      this.grid[0 + col][30] = 1;
      this.squares[[0 + col, 30]].alive = true;

    }
    this.drawMirrorGrid();
  }

  setupRandomGrid(e) {
    this.setupInitialGrid();

    for (let col = 0; col < this.grid.length; col++) {
      for (let row = 0; row < this.grid[col].length; row++) {
        let bool = Math.random() > 0.8;

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

  setupGosperGun() {
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

    for (let i = 0; i < gun.length; i++) {
      for (let j = 0; j < gun[i].length; j++) {
        if (gun[i][j] === 1) {
          this.grid[10 + j][3 + i] = 1;
          this.squares[[10 + j, 3 + i]].alive = true;
        }
      }
    }

    this.drawMirrorGrid();
  }

  setupInfiniteGrowthGun() {
    this.setupInitialGrid();

    let gun = [
      [0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,0,0,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,0,1,1,1,1,1]
    ];

    for (let i = 0; i < gun.length; i++) {
      for (let j = 0; j < gun[i].length; j++) {
        if (gun[i][j] === 1) {
          this.grid[60][10 + j] = 1;
          this.squares[[60, 10 + j]].alive = true;
        }
      }
    }

    this.drawMirrorGrid();
  }

  parseTextIntoConfig(string) {
    let setupArray = string.split("\n").map((line) => {
      line = line.replace(/\s+/g, '');
      return line.split("");
    });
    return setupArray;
  }

  setupCellsHorizontal(pattern) {
    this.setupInitialGrid();

    let setupArray = this.parseTextIntoConfig(configs[pattern]);

    for (let i = 0; i < setupArray.length; i++) {
      for (let j = 0; j < setupArray[i].length; j++) {

        if (setupArray[i][j] === "O") {
          this.grid[j][i + 20] = 1;
          this.squares[[j, i + 20]].alive = true;
        }
      }
    }

    this.drawMirrorGrid();
  }

  setupCellsHorizontalReverse(pattern) {
    this.setupInitialGrid();

    let setupArray = this.parseTextIntoConfig(configs[pattern]);

    setupArray = setupArray.map((line) => {
      return line.reverse();
    });

    for (let i = 0; i < setupArray.length; i++) {
      for (let j = 0; j < setupArray[i].length; j++) {

        if (setupArray[i][j] === "O") {
          this.grid[j][i + 20] = 1;
          this.squares[[j, i + 20]].alive = true;
        }
      }
    }
    this.drawMirrorGrid();
  }

  setupCellsVertical(pattern) {
    this.setupInitialGrid();

    let setupArray = this.parseTextIntoConfig(configs[pattern]);

    for (let i = 0; i < setupArray.length; i++) {
      for (let j = 0; j < setupArray[i].length; j++) {

        if (setupArray[i][j] === "O") {
          this.grid[i][j] = 1;
          this.squares[[i, j]].alive = true;
        }
      }
    }
    this.drawMirrorGrid();
  }

  setupCellsCenter(pattern) {
    this.setupInitialGrid();

    let setupArray = this.parseTextIntoConfig(configs[pattern]);

    for (let i = 0; i < setupArray.length; i++) {
      for (let j = 0; j < setupArray[i].length; j++) {

        if (setupArray[i][j] === "O") {
          this.grid[i + 30][j + 10] = 1;
          this.squares[[i + 30, j + 10]].alive = true;
        }
      }
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
    let changedCellsCount = 0;
    Object.keys(this.squares).forEach((key) => {
      let squareObj = this.squares[key];

      let neighborCount = this.getNeighborCount([squareObj.xPos, squareObj.yPos]);
      let isLiving = squareObj.alive;

      if ((neighborCount === 2 || neighborCount === 3) && isLiving) {
        this.mirrorGrid[squareObj.xPos][squareObj.yPos] = 1;
        squareObj.alive = true;

      } else if (neighborCount === 3 && !isLiving) {
        this.mirrorGrid[squareObj.xPos][squareObj.yPos] = 1;
        squareObj.toggleAliveStatus();

      } else if ((neighborCount < 2 || neighborCount > 3) && isLiving) {
        this.mirrorGrid[squareObj.xPos][squareObj.yPos] = 0;
        squareObj.toggleAliveStatus();

      }
    });

    this.grid = JSON.parse(JSON.stringify(this.mirrorGrid));
  }

  toggleGridAliveStatus(xPos, yPos) {
    if (this.grid[xPos][yPos] === 1) {
      this.grid[xPos][yPos] = 0;
    } else {
      this.grid[xPos][yPos] = 1;
    }
  }

  // toggleGrid() {
  //   $('#grid').toggleClass("block-grid");
  //   $('#toggle-grid').toggleClass("pressed");
  // }
  //
  // clearGrid() {
  //   this.setupInitialGrid();
  //   this.drawMirrorGrid();
  // }

}

module.exports = Board;
