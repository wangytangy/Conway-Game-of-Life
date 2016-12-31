# Conway's Game of Life

[Play Conway's Game of Life](https://wangytangy.github.io/Conway-Game-of-Life/)

Conway's Game of Life is a classic example of the concept of **cellular automata**.  The game plays out on a rectangular grid with each cell on the grid starting as either dead or alive when the game begins. On the next iteration of the game (called a "generation") the cells are updated according to its surrounding neighbors.

### Features  

* Start, pause, and clear the grid
* Generate a grid of randomly placed cells
* Toggle visibility of colors of the cell and the grid itself
* Click on an animation slider to dynamically alter the speed of the game
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
would be too time-consuming to hardcode in the grid as they involve hundreds
of cells positioned at specific locations. To automate the process, I store
the patterns as a string. Dead cells are represented by "." and live cells are represented by "O". These strings are stored in a JavaScript object and referenced in the Board class.

```javascript
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
The `parseTextIntoConfig` helper function parses the string into a 2D array.
Another function reads the 2D array and generates the corresponding cells in the grid. Using these two methods, it's possible to import any cell pattern and quickly render it on the game grid.
