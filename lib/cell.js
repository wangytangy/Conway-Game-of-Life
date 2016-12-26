
const COLORS = [
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "violet"
];

class Cell {

  constructor() {
    this.alive = false;
    this.xPos;
    this.yPos;
    this.width = 1000/100;
    this.color = "green";


  }

  toggleAliveStatus() {
    this.alive = (this.alive === true) ? false : true;
  }







}

module.exports = Cell;
