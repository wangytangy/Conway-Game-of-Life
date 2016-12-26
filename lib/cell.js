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
    this.color = "red";

    this.toggleAliveStatus = this.toggleAliveStatus.bind(this);
    this.stepColor = this.stepColor.bind(this);
  }

  toggleAliveStatus() {
    this.alive = (this.alive === true) ? false : true;
    this.stepColor();
  }

  stepColor() {
    if (this.alive === true) {
      let newColorIdx = COLORS.indexOf(this.color) + 1;
      this.color = COLORS[newColorIdx % COLORS.length];
    }
    if (COLORS.indexOf(this.color) < 0) {
      console.log("something's wrong");
    }
  }







}

module.exports = Cell;
