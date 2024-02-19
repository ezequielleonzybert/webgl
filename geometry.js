function get_earcut(vertices) {
    let result = [];
    let ear = earcut(vertices);
    for (let i = 0; i < ear.length * 2; i++) {
        let index = ear[i] * 2;
        result.push(vertices[index]);
        result.push(vertices[index + 1]);
    }
    return result;
}

function rectangle(x, y, w, h) {
    let vertices = [];

    vertices[0] = x - w / 2;
    vertices[1] = y - h / 2;
    vertices[2] = x + w / 2;
    vertices[3] = y - h / 2;
    vertices[4] = x + w / 2;
    vertices[5] = y + h / 2;
    vertices[6] = x - w / 2;
    vertices[7] = y + h / 2;

    return get_earcut(vertices);
}

function circle(x, y, r, segments) {
    let vertices = [];
    const angle_increment = (2 * Math.PI) / segments;

    for (let i = 0; i < segments; i++) {
        const ang = angle_increment * i;
        vertices.push(x + r * Math.cos(ang))
        vertices.push(y + r * Math.sin(ang))
    }
    return get_earcut(vertices);
}

export { rectangle, circle };