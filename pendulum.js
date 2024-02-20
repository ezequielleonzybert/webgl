import * as Geometry from "./geometry.js"

class Pendulum {
    x;
    y;
    r;
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.r = 20;
    }
    update() {
        this.x += 0.01;
    }
}

export default Pendulum;