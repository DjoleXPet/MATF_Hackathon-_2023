window.addEventListener('load', mainFunc);


document.querySelectorAll('table input').forEach(item => {
  item.addEventListener('change', event => {
    mainFunc();
  })
})

function mainFunc() {
    /*const poly = document.getElementById('mainPoly');
    points = [200, 10, 250, 190, 360, 210];
    poly.setAttribute('points', `${points[0]},${points[1]} ${points[2]},${points[3]} ${points[4]},${points[5]}`);*/

    

    const grid_size = 15

    // const ogCoords = [[0 * grid_size,0 * grid_size],[5 * grid_size,0 * grid_size],
    //                  [5 * grid_size ,-5 * grid_size],[0 * grid_size,-5 * grid_size]]

    const ogCoords = [[0 * grid_size,0 * grid_size, 1],[5 * grid_size,0 * grid_size, 1],
                      [5 * grid_size ,-5 * grid_size, 1],[0 * grid_size,-5 * grid_size, 1]]

    var c = document.getElementById("mainCanvas");
    var ctx = c.getContext('2d');
    ctx.clearRect(-c.width, -c.height, 2*c.width, 2*c.height);
    ctx.reset()
   // ctx.setTransform(1, 0, 0, 1, 0, 0);

    addGrid();
    
    ctx.fillStyle = '#f00';
    ctx.beginPath();
    ctx.moveTo(ogCoords[0][0], ogCoords[0][1]);
    ctx.lineTo(ogCoords[1][0], ogCoords[1][1]);
    ctx.lineTo(ogCoords[2][0], ogCoords[2][1]);
    ctx.lineTo(ogCoords[3][0], ogCoords[3][1]);
    
    ctx.closePath();
    ctx.fill();

    const newCoords = new Array(4)

    // let matrix = loadMatrix();


    matrices = loadMatrices()

    matrix = composeMatrices(matrices) 


    matrix[0][2] = matrix[0][2]*grid_size
    matrix[1][2] = -matrix[1][2]*grid_size
    
    for (let i = 0; i < newCoords.length; i++) {
        newCoords[i] = new Array(3)
        newCoords[i] = calculateTransformation(matrix, ogCoords[i])  
    }

    ctx.fillStyle = '#0f0';
    ctx.beginPath();
    ctx.moveTo(newCoords[0][0], newCoords[0][1]);
    ctx.lineTo(newCoords[1][0], newCoords[1][1]);
    ctx.lineTo(newCoords[2][0], newCoords[2][1]);
    ctx.lineTo(newCoords[3][0], newCoords[3][1]);

    ctx.closePath();
    ctx.fill();
}


function calculateTransformation (matrix, ogCoords) {
    const newCoords = new Array(2)
    newCoords[0] = ogCoords[0] * matrix[0][0] + ogCoords[1] * matrix[0][1] + matrix[0][2]
    newCoords[1] = ogCoords[0] * matrix[1][0] + ogCoords[1] * matrix[1][1] + matrix[1][2]
    return newCoords
}

function composeMatrices(matrices){
  currentMatrix = [[1,0,0],[0,1,0],[0,0,1]]

  for(m of matrices ) {
    currentMatrix = multiplyMatrices(currentMatrix, m)
  }
  return currentMatrix
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

  function loadMatrices () {
    const queue = document.getElementById('queue')
    //console.log(queue.childNodes)
    matrices = []
    for( matrix of queue.children ) {
      console.log(matrix)
      matrices.push( loadMatrix(matrix) )

    }
    return matrices
  }
  

  function loadMatrix(m) {
    let matrix = new Array(3)
  //  console.log(document.getElementById("m1").rows[0].cells[2].children[0].value)
    for(let i = 0; i < 2; i++){
        matrix[i] = new Array(3)
        for(let j = 0; j < 3; j++){
            matrix[i][j]  = +m.rows[i].cells[j].children[0].value
        }
    }
    matrix[2] = [0,0,1]

    return matrix
    }