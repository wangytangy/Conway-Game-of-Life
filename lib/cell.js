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

    this.toggleAliveStatus = this.toggleAliveStatus.bind(this);
    this.stepColor = this.stepColor.bind(this);
  }


  toggleAliveStatus() {
    this.alive = (this.alive === true) ? false : true;
    if (this.isColorToggled) { this.stepColor(); }
  }

  stepColor() {
    if (this.alive) {
      let newColorIdx = COLORS.indexOf(this.color) + 1;
      this.color = COLORS[newColorIdx % COLORS.length];
    }
  }
}


Cell.prototype.isColorToggled = false;

Cell.prototype.toggleRainbow = function() {

  if (Cell.prototype.isColorToggled === true) {
    Cell.prototype.isColorToggled = false;
  } else {
    Cell.prototype.isColorToggled = true;
  }
};

document.addEventListener("DOMContentLoaded", function(){
  $('#toggle-colors').on('click', Cell.prototype.toggleRainbow);
});



module.exports = Cell;
