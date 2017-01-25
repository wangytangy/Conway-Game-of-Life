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

    $("#grid, #easel, .canvas-container").attr({
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

        this.toggleGridAliveStatus((1 + col), (0 + row));
        this.toggleGridAliveStatus((2 + col), (1 + row));
        this.toggleGridAliveStatus((0 + col), (2 + row));
        this.toggleGridAliveStatus((1 + col), (2 + row));
        this.toggleGridAliveStatus((2 + col), (2 + row));

      }
    }

    this.drawMirrorGrid();
  }

  setupBenchmark() {
    this.setupInitialGrid();

    for (let col = 0; col < this.grid.length; col++) {
      this.toggleGridAliveStatus((0 + col), (30));
    }
    this.drawMirrorGrid();
  }

  setupRandomGrid() {
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
    this.toggleGridAliveStatus(28, 40);
    this.toggleGridAliveStatus(29, 40);
    this.toggleGridAliveStatus(30, 40);
    this.toggleGridAliveStatus(30, 41);
    this.toggleGridAliveStatus(30, 42);

    for (let i = 0; i < 29; i++) {
      this.toggleGridAliveStatus((31 + i), (39 - i));
    }
    this.toggleGridAliveStatus(60, 11);
    this.toggleGridAliveStatus(60, 12);

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
          this.toggleGridAliveStatus((10 + j), (3 + i));
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
          this.toggleGridAliveStatus((60), (10 + j));
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
          this.toggleGridAliveStatus((j), (i + 20));
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
          this.toggleGridAliveStatus((j), (i + 20));
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
          this.toggleGridAliveStatus(i, j);
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
          this.toggleGridAliveStatus((i + 30), (j + 10));
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
      this.squares[[xPos, yPos]].alive = false;
    } else {
      this.grid[xPos][yPos] = 1;
      this.squares[[xPos, yPos]].alive = true;
    }
  }

}

module.exports = Board;
