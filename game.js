import Pendulum from "./pendulum.js";

var player;

function setup() {
    player = new Pendulum(100, 100);
}

function update() {
    player.update();
}

export { setup, update };