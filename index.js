import Pendulum from "./pendulum.js"
import * as Geometry from "./geometry.js"
import * as Game from "./game.js";

const vertexShaderSource = `#version 300 es
in vec2 a_position;

uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform mat3 u_matrix;

void main() {
  vec2 position = a_position + u_translation;
  position = (u_matrix * vec3(position, 1)).xy;
  vec2 zeroToOne = position / u_resolution;
  vec2 zeroToTwo = zeroToOne * 2.0;
  vec2 clipSpace = zeroToTwo - 1.0;
  
  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
}`;

const fragmentShaderSource = `#version 300 es
precision lowp float;

uniform vec4 u_color;

out vec4 outColor;

void main() {
  outColor = u_color;
}`;

let state = -1;
let prev_state;
const btn_rungame = document.getElementById("btn_rungame");
let canvas;
let gl;
// let overlay;
let portrait = false;
let container;
// let pixel_ratio = window.devicePixelRatio;
let device_width = window.screen.width;
let device_height = window.screen.height;
let width = device_width;
let height = device_height;

// INIT ---------------------------------------------------------------------------

function init() {
    if (width < height) {
        portrait = true;
        width = device_height;
        height = device_width;
    }
    container = document.createElement("container");
    canvas = document.createElement("canvas");
    gl = canvas.getContext("webgl2");
    // overlay = document.createElement("div");
    container.style.position = "relative";
    container.width = device_width;
    container.height = device_height;
    container.display = "block";
    container.style.backgroundColor = "red";
    canvas.style.display = "block";
    canvas.style.position = "absolute";
    canvas.width = device_width;
    canvas.height = device_height;
    // overlay.style.position = "absolute";
    // overlay.style.padding = "15px";
    // overlay.style.fontFamily = "Verdana";
    // overlay.innerText =
    //     "resolution: " + width + " x " + height +
    //     "\npixel ratio: " + pixel_ratio +
    //     "\nportrait: " + portrait;

    document.body.appendChild(container);
    container.appendChild(canvas);
    // container.appendChild(overlay);

    Game.setup();
}

// MAIN ---------------------------------------------------------------------------

function main() {
    if (!gl) {
        return;
    }
    var program = webglUtils.createProgramFromSources(gl,
        [vertexShaderSource, fragmentShaderSource]);
    var positionLocation = gl.getAttribLocation(program, "a_position");
    var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    var colorLocation = gl.getUniformLocation(program, "u_color");
    var translationLocation = gl.getUniformLocation(program, "u_translation");
    var matrixLocation = gl.getUniformLocation(program, "u_matrix");

    var translationMatrix = m3.identity();
    var rotationMatrix = m3.rotation(0);
    if (portrait) {
        translationMatrix = m3.translation(device_width, 0);
        rotationMatrix = m3.rotation(-Math.PI / 2);
    }

    var matrix = m3.multiply(translationMatrix, rotationMatrix);

    var positionBuffer = gl.createBuffer();
    var vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    var vertices = Geometry.circle(width / 2, height / 2, 50, 40);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    var size = 2;
    var type = gl.FLOAT;
    var normalize = false;
    var stride = 0;
    var offset = 0;
    gl.vertexAttribPointer(
        positionLocation, size, type, normalize, stride, offset);

    var color = [1, 0, 0, 1];
    var then = 0;
    if (state != -1)
        requestAnimationFrame(drawScene);

    // DRAW ------------------------------------------------------------------------
    function drawScene(now) {
        now *= 0.001;
        if (prev_state == 0 || prev_state == -1) {
            then = now;
            prev_state = 1;
        }
        var deltaTime = now - then;
        then = now;
        //translation[1] += translationSpeed * deltaTime;
        Game.update();
        webglUtils.resizeCanvasToDisplaySize(gl.canvas);
        gl.viewport(0, 0, device_width, device_height);
        gl.clearColor(0.9, 0.9, 0.5, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.useProgram(program);
        gl.enableVertexAttribArray(positionLocation);
        gl.bindVertexArray(vao);
        gl.uniform2f(resolutionLocation, device_width, device_height);
        gl.uniform4fv(colorLocation, color);
        //gl.uniform2fv(translationLocation, translation);
        gl.uniformMatrix3fv(matrixLocation, false, matrix);
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = vertices.length / 2;
        gl.drawArrays(primitiveType, offset, count);
        if (state != 0)
            requestAnimationFrame(drawScene);
    }
    // END DRAW ---------------------------------------------------------------
    document.addEventListener("fullscreenchange", function () {
        if (state == -1) {
            prev_state = state;
            state = 1;
            btn_rungame.textContent = "Continue Game"
            requestAnimationFrame(drawScene);
        }
        else if (state == 0) {
            prev_state = state;
            state = 1;
            container.style.display = "block";
            canvas.width = device_width;
            canvas.height = device_height;
            requestAnimationFrame(drawScene);
        }
        else if (state == 1) {
            prev_state = state;
            state = 0;
            container.style.display = "none";
        }
    });

}

btn_rungame.addEventListener("click", () => {
    if (state == -1) {
        init();
        main();
    }
    openFullscreen(container);
});

function openFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) { /* Safari */
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) { /* IE11 */
        element.msRequestFullscreen();
    } else if (element.mozRequestFullscreen) {
        element.mozRrquestFullscreen();
    }
}

document.addEventListener('contextmenu', function (e) {
    if (e.button === 2) {
        e.preventDefault();
        return false;
    }
}, false);