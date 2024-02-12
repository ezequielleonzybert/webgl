var pause = true;

const btn_rungame = document.getElementById("btn_rungame");
const canvas = document.getElementById("canvas");

btn_rungame.addEventListener("click", () => {
    pause = false;
    function openFullscreen() {
        if (canvas.requestFullscreen) {
            canvas.requestFullscreen();
        } else if (canvas.webkitRequestFullscreen) { /* Safari */
            canvas.webkitRequestFullscreen();
        } else if (canvas.msRequestFullscreen) { /* IE11 */
            canvas.msRequestFullscreen();
        }
    }
    main();
});