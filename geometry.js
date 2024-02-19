function rectangle(x, y, w, h) {
    let vertices = [];
    let ear = [];
    let result = [];

    vertices[0] = x - w / 2;
    vertices[1] = y - h / 2;
    vertices[2] = x + w / 2;
    vertices[3] = y - h / 2;
    vertices[4] = x + w / 2;
    vertices[5] = y + h / 2;
    vertices[6] = x - w / 2;
    vertices[7] = y + h / 2;

    ear = earcut(vertices);

    for (let i = 0; i < ear.length * 2; i++) {
        let index = ear[i] * 2;
        result.push(vertices[index]);
        result.push(vertices[index + 1]);
    }

    return result;
}

export { rectangle };