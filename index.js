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
let overlay;
let portrait = false;
let container;
let width = window.screen.width;
let height = window.screen.height;

function init() {
    console.log(width, height)
    if (window.innerWidth < window.innerHeight) {
        portrait = true;
    }
    container = document.createElement("container");
    canvas = document.createElement("canvas");
    overlay = document.createElement("div");
    container.style.position = "relative";
    container.width = width;
    container.height = height
    container.display = "block";
    canvas.id = "canvas";
    canvas.style.display = "block";
    canvas.style.position = "absolute";
    canvas.width = width;
    canvas.height = height;
    overlay.id = "overlay";
    overlay.style.position = "absolute";
    overlay.style.width = "200px";
    overlay.style.height = "200px";
    overlay.style.backgroundColor = "rgb(255,0,0,0.5)";
    document.body.appendChild(container);
    container.appendChild(canvas);
    container.appendChild(overlay);

    gl = canvas.getContext("webgl2");
    console.log(canvas.width, canvas.height);
}

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
        console.log(window.innerWidth);
        translationMatrix = m3.translation(window.innerWidth, 0);
        rotationMatrix = m3.rotation(-Math.PI / 2);
    }

    var matrix = m3.multiply(translationMatrix, rotationMatrix);

    var positionBuffer = gl.createBuffer();
    var vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    var vertices = new Float32Array([
        -50, 50,
        50, 50,
        0, -50,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    var size = 2;
    var type = gl.FLOAT;
    var normalize = false;
    var stride = 0;
    var offset = 0;
    gl.vertexAttribPointer(
        positionLocation, size, type, normalize, stride, offset);
    var translation = [100, 100];
    var color = [Math.random(), Math.random(), Math.random(), 1];
    var translationSpeed = 100;
    var then = 0;
    if (state != -1)
        requestAnimationFrame(drawScene);

    function drawScene(now) {
        now *= 0.001;
        if (prev_state == 0 || prev_state == -1) {
            then = now;
            prev_state = 1;
        }
        var deltaTime = now - then;
        then = now;
        //translation[0] += translationSpeed * deltaTime;
        webglUtils.resizeCanvasToDisplaySize(gl.canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0.9, 0.9, 0.5, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.useProgram(program);
        gl.enableVertexAttribArray(positionLocation);
        gl.bindVertexArray(vao);
        gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
        gl.uniform4fv(colorLocation, color);
        gl.uniform2fv(translationLocation, translation);
        gl.uniformMatrix3fv(matrixLocation, false, matrix);
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 3;
        gl.drawArrays(primitiveType, offset, count);
        if (state != 0)
            requestAnimationFrame(drawScene);
    }

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
            canvas.width = width;
            canvas.height = height;
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
    }
}