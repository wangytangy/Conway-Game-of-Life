# Conway's Game of Life

### Background

Conway's Game of Life is a classic example of the concept of **cellular automata**.  The game plays out on a rectangular grid with each cell on the grid starting as either dead or alive when the game begins. On the next iteration of the game (called a "generation") the cells are updated according to these rules:


1) Any live cell with 2 or 3 live neighbors (defined to be the eight cells surrounding it) stays alive,
2) Any dead cell with exactly 3 neighbors will come to life,
3) Any live cell with less than 2 neighbors or more than 3 neighbors will die.


This simple simulation that demonstrates how complex structures can arise out of simple rules. When Conway's Game of Life was published in October 1970's Scientific American, it attracted the attention of computer scientists, biologists, mathematicians, and philosophers who pondered on the implication that "design" and "organization" can spontaneously emerge in the absence of a designer.

### Functionality & MVP  

With this Conway's Game of Life simulator, users will be able to:

- [ ] Start, pause, and reset the game board
- [ ] Step button to iterate one generation
- [ ] Control the speed of replication with a slider button
- [ ] Click and drag on the game board to create new cells
- [ ] Draw new cells while simulation is running
- [ ] Choose from preset patterns (gliders, oscillators, still life's, Gospel's Glider Gun) and run the simulations

In addition, this project will include:

- [ ] An About modal describing the background and rules of the game
- [ ] A list of blurbs describing famous patterns (Gospel's Glider Gun, Pulsar, Pentadecathlon, Benchmarks)
- [ ] A production README

### Wireframes

This app will consist of a single screen with game board, game controls, and nav links to the Github, my LinkedIn,
and the About modal.  Game controls will include Start, Stop, Step, and Reset buttons as well as a slider to control the speed.

![wireframes](https://github.com/appacademy/ny-portfolio-curriculum/blob/master/javascript-project/js-proposal-wireframe.jpg)

### Architecture and Technologies

This project will be implemented with the following technologies:

- Vanilla JavaScript and `jQuery` for overall structure and game logic,
- `Easel.js` with `HTML5 Canvas` for DOM manipulation and rendering,
- Webpack to bundle and serve up the various scripts.

In addition to the webpack entry file, there will be three scripts involved in this project:

`board.js`: this script will handle the logic for creating and updating the necessary `Easel.js` elements and rendering them to the DOM.

`automata.js`: this script will handle the logic behind the scenes.  An Automata object will hold a 2D array of `Cell`s.  It will be responsible for doing neighbor checks for each `Cell` upon iteration and updating the `Cell` array appropriately.

`cell.js`: this script will house the constructor and update functions for the `Cell` objects.  Each `Cell` will contain an `aliveState` (`true` or `false`).

### Implementation Timeline

**Day 1**: Setup all necessary Node modules, including getting webpack up and running and `Easel.js` installed.  Create `webpack.config.js` as well as `package.json`.  Write a basic entry file and the bare bones of all 3 scripts outlined above.  Learn the basics of `Easel.js`.  Goals for the day:

- Get a green bundle with `webpack`
- Learn enough `Easel.js` to render an object to the `Canvas` element
- Render an empty grid

**Day 2**: Dedicate this day to learning the `Easel.js` API.  First, build out the `Cell` object to connect to the `Board` object. Then, use `board.js` to create and render at least the square grid. Build in the ability to toggle the live/dead states on click for each cell.  Goals for the day:

- Complete the `cell.js` module (constructor, update functions)
- Render a square grid to the `Canvas` using `Easel.js`
- Make each cell in the grid clickable, toggling the state/color of the square on click


**Day 3**: Create the automata logic backend.  Build out modular functions for neighbor checks. Incorporate the automata logic into the `Board.js` rendering.  Goals for the day:

- Export an `Automata` object with handling logic
- Have a functional grid on the `Canvas` frontend that correctly handles iterations from one generation of the game to the next


**Day 4**: Install the controls for the user to interact with the game.  Style the frontend, making it polished and professional.  Goals for the day:

- Create controls for game speed, stop, start, step, and reset.
- Have a styled `Canvas`, nice looking controls and title

### Bonus features

There are many directions this cellular automata engine could eventually go.  Some anticipated updates are:

- [ ] Add options for different rule sets
- [ ] Add multiple choices for starting states that are interesting
- [ ] Explore multi-state versions of the game, such as the ones outlined
