function getRotationMatrix(alpha) {
    alpha *= Math.PI/180;
    return [[Math.cos(alpha), -Math.sin(alpha), 0], [Math.sin(alpha), Math.cos(alpha), 0], [0, 0, 1]];
}

function getTranslationMatrix(vector) {
    let x = vector[0];
    let y = vector[1];

    return [[1, 0, x], [0, 1, y], [0, 0, 1]];
}

function getReflexionMatrix(axis) {
    let x = axis[0];
    let y = axis[1];

    let m = y/x;
    let a = 1/(1+m*m)

    return [[a*(1-m*m), 2*m, 0], [2*m, m*m-1, 0], [0, 0, 1]];
}

function getScalingMatrix(vector) {
    let s1 = vector[0];
    let s2 = vector[1];

    return [[s1, 0, 0], [0, s2, 0], [0, 0, 1]];
}

function getShearingXMatrix(lambda) {
    return [[1, lambda, 0], [0, 1, 0], [0, 0, 1]];
}

function getShearingYMatrix(lambda) {
    return [[1, 0, 0], [lambda, 1, 0], [0, 0, 1]];
}