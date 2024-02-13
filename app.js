

const btn_rungame = document.getElementById("btn_rungame");
const canvas = document.getElementById("canvas");
var gl = canvas.getContext("webgl2");

btn_rungame.addEventListener("click", () => {
    openFullscreen();
});

function openFullscreen() {
    if (canvas.requestFullscreen) {
        canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) { /* Safari */
        canvas.webkitRequestFullscreen();
    } else if (canvas.msRequestFullscreen) { /* IE11 */
        canvas.msRequestFullscreen();
    }
}