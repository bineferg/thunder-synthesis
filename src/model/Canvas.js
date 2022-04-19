// Encapsulated canvas model for lighting generation
// Does not generat imagery for multistrike visibly

// Model available at https://nemisindo.com/models/thunder.html

class Canvas {
    // Initialise the canvas and setup the sizing etc
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext("2d");
        this.context.strokeStyle = '#FFFFCC';
        this.context.clearRect(0, 0, 500, 200);
        this.context.beginPath();

        this.prevRandom = (Math.random() * this.canvas.width / 2) + this.canvas.width / 8;
        this.currRandom = 0;
        this.prevRandom2 = (Math.random() * this.canvas.width / 2) + this.canvas.width / 8;
        this.currRandom2 = 0;
        this.prevInitial = 0;
        this.currInitial;
        this.prevInitial2 = 0;
        this.currInitial2;
        this.strokeLengths = [[]];
        this.strokeIdx = 0;

        this.myInitial = 1;
        this.myInitial2 = 1;
        this.myRandom = 0;

    }

    height() {
        return this.canvas.height;
    }

    draw() {
        this.context.moveTo(this.prevRandom, this.prevInitial);
        this.currRandom = ((Math.random() - 0.5) * 60) + this.prevRandom;
        this.currInitial = (this.myInitial / 85) * this.canvas.height;
        this.context.lineTo(this.currRandom, this.currInitial);
        this.context.lineWidth = Math.floor(Math.random() * 3 + 0.5);
        this.strokeLengths[this.strokeIdx] = [this.currRandom, this.currInitial];
        this.strokeIdx++;
        this.context.stroke();
    }
    draw2() {
        this.context.moveTo(this.prevRandom2, this.prevInitial2);
        this.currRandom2 = ((Math.random() - 0.5) * 60) + this.prevRandom2;
        this.currInitial2 = (this.myInitial2 / 85) * this.canvas.height;
        this.context.lineTo(this.currRandom2, this.currInitial2);
        this.context.lineWidth = Math.floor(Math.random() * 3 + 0.5);
        this.strokeLengths[this.strokeIdx] = [this.currRandom2, this.currInitial2];
        this.strokeIdx++;
        this.context.stroke();
    }
    update(split) {
        this.prevInitial = this.currInitial;
        this.prevRandom = this.currRandom;
        this.myRandom = (Math.random() * 100) / 10;
        this.myInitial += this.myRandom;
        if (split) {
            this.myRandom2 = (Math.random() * 100) / 10;
            this.myInitial2 += this.myRandom2;
            this.prevInitial2 = this.currInitial2;
            this.prevRandom2 = this.currRandom2;
        } else {
            this.myInitial2 += this.myRandom;
            this.prevInitial2 = this.currInitial;
            this.prevRandom2 = this.currRandom;
        }
    }
}