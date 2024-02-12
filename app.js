var canvas;

function runGame() {
    canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    fullscreen();;
}

function fullscreen() {
    if (canvas.requestFullscreen) {
        canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) { /* Safari */
        canvas.webkitRequestFullscreen();
    } else if (canvas.msRequestFullscreen) { /* IE11 */
        canvas.msRequestFullscreen();
    }
}