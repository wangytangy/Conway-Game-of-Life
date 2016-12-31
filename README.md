# Conway's Game of Life

[Play Conway's Game of Life!](https://wangytangy.github.io/Conway-Game-of-Life/)

Conway's Game of Life is a classic simulation of **cellular automata**.  The game plays out on a rectangular grid with each cell on the grid starting as either dead or alive when the game begins. On the next iteration of the game (called a "generation") the cells are updated according to its surrounding neighbors.

### Features  

* Start, pause, and clear the grid
* Generate a grid of randomly placed cells
* Toggle visibility of colors of the cell and the grid itself
* Click on an animation slider to dynamically alter the speed of the game
* Click user interaction to create and destroy cells on the grid
* Generate a pre-set collection of cell patterns from a drop-down menu

### Technologies Used

* JavaScript
* EaselJS
* jQuery
* HTML5
* CSS

### Feature Implementations

#### Importing Cell Patterns for Quick Setup

Many complex cell patterns that have been discovered throughout the decades
would be too time-consuming to hardcode in the grid as they may involve hundreds
of cells positioned at specific locations. To automate the process, I store
the patterns (available in online libraries) as a string with "dead" cells are represented by "." and live cells are represented by "O". These strings are stored in variables held by a JavaScript object and imported into the Board class.

```javascript
//cell_configs.js

const lightwire =
"....OO..OO..OO..OO..OO..OO..OO..OO..OO..OO..OO..OO..OO....\n\
....OO..OO..OO..OO..OO..OO..OO..OO..OO..OO..OO..OO..OO....\n\
..........................................................\n\
..OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO..\n\
.O......O...............................................O.\n\
O.OOOOO....OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO.O\n\
.O.....O................................................O.\n\
..OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO..\n\
..........................................................\n\
....OO..OO..OO..OO..OO..OO..OO..OO..OO..OO..OO..OO..OO....\n\
....OO..OO..OO..OO..OO..OO..OO..OO..OO..OO..OO..OO..OO....";

const configs = {
  lightwire: lightwire
}
```
The `parseTextIntoConfig` helper function parses the string pattern and returns a 2D array. `setupCellsHorizontal` takes the 2D array as a parameter and generates the corresponding cells in the grid. Using these two methods, it's possible to import any cell pattern and quickly render it on the game grid without laborious hard-coding.

```javascript
//board.js

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
```

#### Optimizing Render Process

With a game grid of thousands of cells, all of which need to be iterated over and re-drawn at every generation, optimizing performance speed is necessary for Conway's Game of Life to run at a reasonable speed.

The first optimization feature I implemented was to store each cell's X and Y position on the canvas as instance variables. Every cell is also stored in a `squares` Javascript object with it's X and Y position as the key. By iterating over the `squares` object's keys, I can get each cell's position on the canvas and perform neighbor checks and other functions without using nested `for` loops after the initial setup.

```javascript
//board.js

setupInitialGrid() {
  this.grid = [];
  for (let col = 0; col < 120; col++) {
    this.grid[col] = [];
    for (let row = 0; row < 60; row++) {
      let cell = new Cell();
      cell.xPos = col;
      cell.yPos = row;
      cell.width = 1200/120;

      //store each Cell object in a 'squares' object
      this.squares[[col, row]] = cell;
      this.grid[col][row] = 0;
    }
  }
  this.mirrorGrid = JSON.parse(JSON.stringify(this.grid));
}
```

The second optimization feature I implemented was to simply avoid drawing EaselJS shape objects for dead cells. Due to the intense computing power needed to draw and render shapes, allowing EaselJS to only draw live cells at each generation greatly improved the performance speed of the code.

However this presented a problem when implementing user interaction as they could not click on an "empty" section of the grid to toggle the living status of that cell. Because EaselJS shapes did not exist at dead squares, it was no longer possible to attach `click` eventListeners.

```javascript
//board.js

drawMirrorGrid() {
  this.stage = this.stage || new createjs.Stage("easel");
  this.stage.removeAllChildren();

  //iterate over the `squares` object's keys instead of using a nested loop
  Object.keys(this.squares).forEach((key) => {
    let squareObj = this.squares[key];
    let square = new createjs.Shape();
    let width = this.squares[key].width;

    //only draw shapes if the cell is "alive"
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
```
To get around this, I attached a `click` eventListener on the entire canvas and extrapolated the mouse's X and Y positions. I then subtracted the offset of the canvas's X and Y position relative to the window and divided the difference of each offset position by the width of each cell, yielding the X and Y position of the dead cell if it had existed at that spot. After calculating it's X and Y position relative to the canvas, I could then access that particular cell in the `squares` object, toggle it's living status, and re-render the grid to reflect the changes.

```javascript
//board.js

$("#easel").click(function(e) {
  let parentOffset = $(this).offset();
  let relX = Math.floor(((e.pageX - parentOffset.left) / 10));
  let relY = Math.floor(((e.pageY - parentOffset.top) / 10));
  let squareObj = board.squares[[relX, relY]];

  squareObj.toggleAliveStatus();
  board.toggleGridAliveStatus(relX, relY);
  board.drawMirrorGrid();
});
```
### Future Plans

#### Enable Click and Drag Cell Creation

Users should be able to click on the canvas and drag their mouse to generate
cells.

#### Larger Grid and Speed Optimization

Construct a larger grid while keeping performance speed high.

#### Custom Grid Sizes

Create an input form which allow users to create grids with a custom number of cells.

#### Complete Library of Configurations

Build a complete library of cell configurations with buttons to auto-generate them on the game grid.
