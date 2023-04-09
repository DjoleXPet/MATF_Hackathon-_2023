function getRotationMatrix(alpha) {
    alpha *= Math.PI/180;
    return [[Math.cos(alpha), -Math.sin(alpha), 0], [Math.sin(alpha), Math.cos(alpha), 0], [0, 0, 1]];
}

function randInt(max) {
    return Math.ceil(Math.random()*max);
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

function multiplyMatrices(A, B) {
    let rowsA = A.length;
    let colsA = A[0].length;
    let rowsB = B.length;
    let colsB = B[0].length;
    let C = new Array(rowsA);
    for (let i = 0; i < rowsA; i++) {
      C[i] = new Array(colsB);
      for (let j = 0; j < colsB; j++) {
        C[i][j] = 0;
        for (let k = 0; k < colsA; k++) {
          C[i][j] += A[i][k] * B[k][j];
        }
      }
    }
    return C;
}

function getRandomMatrix() {
    let m = [getRotationMatrix(randInt(12) * 15)
            ,getScalingMatrix([randInt(2), randInt(2)])
            ,getTranslationMatrix([randInt(12)*15, randInt(8)*15])];

    let count = m.length;
    m.sort(() => Math.random() - 0.5);
    result = [[1,0,0],[0,1,0],[0,0,1]];
    for (let i = 0; i < count; i++) {
        result = multiplyMatrices(result,m[i]);
    }
    return result;
}

