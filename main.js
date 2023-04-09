window.addEventListener('load', () => {
  mainFunc();
  const addMatrixButton = document.getElementById('addMatrix');
  addMatrixButton.addEventListener('click', createNewMatrix);

  const testButton = document.getElementById('test');
  testButton.addEventListener('click', setNewTarget);
 
  const clearTestButton = document.getElementById('clear');
  clearTestButton.addEventListener('click', clearTest);

  const startFigureButton = document.getElementById('startFigure');
  startFigureButton.addEventListener('click', startFigure);

  const endFigureButton = document.getElementById('endFigure');
  endFigureButton.addEventListener('click', endFigure);

  createNewMatrix();
});

let drawInProgress = false;
let targetCoords = null;
const grid_size = 15
let ogCoords = [[-2 * grid_size,-2 * grid_size, 1],[2 * grid_size,-2 * grid_size, 1],
                [2 * grid_size ,2 * grid_size, 1],[-2 * grid_size,2 * grid_size, 1]]


function setNewTarget() {
  const startCoords = [[-2 * grid_size,-2 * grid_size, 1]
                        ,[2 * grid_size,-2 * grid_size, 1]
                        ,[2 * grid_size ,2 * grid_size, 1]
                        ,[-2 * grid_size,2 * grid_size, 1]]
  targetCoords = new Array(4);
  const tmpMatrix = getRandomMatrix();

  for(let i = 0; i < 4; i++) {
    targetCoords[i] = calculateTransformation(tmpMatrix, startCoords[i]);
  }
  mainFunc();
}

function clearTest() {
  targetCoords = null;
  mainFunc();
}

function startFigure() {
  const c = document.getElementById("mainCanvas");
  ogCoords = []
  drawInProgress = true
  c.addEventListener('mousedown', getCursorPosition)
}

function endFigure() {
  drawInProgress = false;
  const canvas = document.getElementById("mainCanvas");
  canvas.removeEventListener('mousedown', getCursorPosition)
  mainFunc();
}

function clearFigure() {
  ogCoords = [[-2 * grid_size,-2 * grid_size, 1],[2 * grid_size,-2 * grid_size, 1],
              [2 * grid_size ,2 * grid_size, 1],[-2 * grid_size,2 * grid_size, 1]]
  drawInProgress = false;
  const canvas = document.getElementById("mainCanvas");
  canvas.removeEventListener('mousedown', getCursorPosition)
  mainFunc()
}


const getCursorPosition = (event) => {
  const canvas = document.getElementById('mainCanvas')
  const rect = canvas.getBoundingClientRect()
  const x = event.clientX - rect.left - canvas.width /2
  const y = (event.clientY - rect.top - canvas.height/2)
  ogCoords.push([x, y])
  mainFunc()
}



function mainFunc() {
    const c = document.getElementById("mainCanvas");
    const ctx = c.getContext('2d');
    ctx.clearRect(-c.width, -c.height, 2*c.width, 2*c.height);
    ctx.reset()

    addGrid();

    if(drawInProgress){
      for(const dot of ogCoords) {
        ctx.fillStyle = "rgba(0,0,255,1)"
        ctx.fillRect(dot[0], dot[1], 2, 2)
      }
      return;
    }
    ctx.fillStyle = "rgba(255,0,0,0.2)"
    ctx.beginPath();
    ctx.moveTo(ogCoords[0][0], ogCoords[0][1]);
    for(let i = 1; i < ogCoords.length; i++) {
      ctx.lineTo(ogCoords[i][0], ogCoords[i][1]);
    }
    ctx.closePath();
    ctx.fill();

    if (targetCoords) {
      ctx.fillStyle = "rgba(0,0,255,0.6)"
      ctx.beginPath();
      ctx.moveTo(targetCoords[0][0], targetCoords[0][1]);
      ctx.lineTo(targetCoords[1][0], targetCoords[1][1]);
      ctx.lineTo(targetCoords[2][0], targetCoords[2][1]);
      ctx.lineTo(targetCoords[3][0], targetCoords[3][1]);

      ctx.closePath();
      ctx.fill();
    }

    const newCoords = new Array(ogCoords.length)
    const matrices = loadMatrices()
    const matrix = composeMatrices(matrices) 

    setResultMatrix(matrix);

    matrix[0][2] =  matrix[0][2]*grid_size
    matrix[1][2] = -matrix[1][2]*grid_size
    
    for (let i = 0; i < newCoords.length; i++) {
        newCoords[i] = new Array(3)
        newCoords[i] = calculateTransformation(matrix, ogCoords[i])  
    }

    ctx.fillStyle = "rgba(0,255,0,0.6)"
    ctx.beginPath();
    ctx.moveTo(newCoords[0][0], newCoords[0][1]);
    for(let i = 1; i < newCoords.length; i++) {
      ctx.lineTo(newCoords[i][0], newCoords[i][1]);
    }
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
  let currentMatrix = [[1,0,0],[0,1,0],[0,0,1]]

  for(const m of matrices ) {
    currentMatrix = multiplyMatrices(currentMatrix, m)
  }
  return currentMatrix
}

function multiplyMatrices(A, B) {
    const rowsA = A.length;
    const colsA = A[0].length;
    const colsB = B[0].length;
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

  function setResultMatrix(matrix) {
    const resMatrix = document.getElementById('resultMatrix');
    for(let i = 0; i < 3; i++){
      for(let j = 0; j < 3; j++){
          resMatrix.rows[i].cells[j].textContent = Math.round(matrix[i][j] * 1000) / 1000;
      }
    }
  }

  function loadMatrices () {
    const queue = document.getElementById('queue')
    const matrices = []
    for( matrix of queue.children ) {
      matrices.push( loadMatrix(matrix.children[0]) )
    }
    return matrices
  }
  

  function loadMatrix(m) {
    let matrix = new Array(3)
    if(m.className == 'rotation') {
      angle =  +m.children[0].value 
      angle = -(Math.PI / 180) * angle
      matrix[0] = [Math.cos(angle), -Math.sin(angle), 0 ]
      matrix[1] = [Math.sin(angle),  Math.cos(angle), 0 ]
    }
    else if(m.className == 'translation') {
      b1 = +m.children[0].value
      b2 = +m.children[1].value
      matrix[0] = [1, 0, b1 ]
      matrix[1] = [0, 1, b2 ]
    }
    else if(m.className == 'scaling') {
      s1 = +m.children[0].value
      s2 = +m.children[1].value
      matrix[0] = [s1, 0, 0 ]
      matrix[1] = [0, s2, 0 ]
    }
    else{
      for(let i = 0; i < 2; i++){
        matrix[i] = new Array(3)
        for(let j = 0; j < 3; j++){
            matrix[i][j]  = +m.rows[i].cells[j].children[0].value
        }
      }
    }
    matrix[2] = [0,0,1]

    return matrix
    }

  function removeMatrix(el) {
    const matrix = el.parentElement;
    matrix.remove();
    mainFunc();
  }

  function moveLeft(el) {
    el = el.parentElement;
    const parent = el.parentElement;
    parent.insertBefore(el, el.previousElementSibling);
    mainFunc();
  } 

  function moveRight(el) {
    el = el.parentElement;
    const parent = el.parentElement;

    if (el.nextElementSibling) {
      el.nextElementSibling.after(el);
    }else {
      parent.insertBefore(el, parent.children[0]);
    }
    mainFunc();
  }

  function createNewMatrix() {
    const select = document.querySelector('.select');
    select.style.display = 'unset';
    
    switch (select.value) {
      case 'custom':
        addCustomMatrix()
        break;
  
      case 'translation':
        addTranslationMatrix()
        break;
  
      case 'rotation':
        addRotationMatrix()
        break;
    
      case 'scaling':
        addScaleMatrix()
        break;

      default:
        break;
    }
  }
  
function addCustomMatrix() {
  const queue = document.getElementById('queue')
  const div = document.createElement('div');
  div.className = 'queue-element';
  div.innerHTML = `
      <table>
          <tr>
              <td><input type="number" onchange="mainFunc()" name=""  value="1"></td>
              <td><input type="number" onchange="mainFunc()" name=""  value="0"></td>
              <td><input type="number" onchange="mainFunc()" name=""  value="0"></td>
          </tr>
          <tr>
              <td><input type="number" onchange="mainFunc()" name=""  value="0"></td>
              <td><input type="number" onchange="mainFunc()" name=""  value="1"></td>
              <td><input type="number" onchange="mainFunc()" name=""  value="0"></td>
          </tr>
          <tr>
              <td>0</td>
              <td>0</td>
              <td>1</td>
          </tr>
      </table>
      <button onclick="removeMatrix(this)">X</button>
      <button onclick="moveLeft(this)">&lt</button>
      <button onclick="moveRight(this)">&gt</button>
  `
  queue.appendChild(div);
  mainFunc();
}
  
function addRotationMatrix() {
  const queue = document.getElementById('queue')
  const div = document.createElement('div');
  div.className = 'queue-element';
  div.innerHTML = `
      <div class="rotation" style="display:inline-block">
      R(
      <input type='number' onchange="mainFunc()" value='0'>
      )
      </div>
      <br><br>
      <button onclick="removeMatrix(this)">X</button>
      <button onclick="moveLeft(this)">&lt</button>
      <button onclick="moveRight(this)">&gt</button>
  `
  queue.appendChild(div);
  mainFunc();
}

function addTranslationMatrix() {
  const queue = document.getElementById('queue')
  const div = document.createElement('div');
  div.className = 'queue-element';
  div.innerHTML = `
      <div class="translation" style="display:inline-block">
      T(
      <input type='number' onchange="mainFunc()" value='0'>
      <input type='number' onchange="mainFunc()" value='0'>
      )
      </div>
      <br><br>
      <button onclick="removeMatrix(this)">X</button>
      <button onclick="moveLeft(this)">&lt</button>
      <button onclick="moveRight(this)">&gt</button>
  `
  queue.appendChild(div);
  mainFunc();
}

function addScaleMatrix() {
  const queue = document.getElementById('queue')
  const div = document.createElement('div');
  div.className = 'queue-element';
  div.innerHTML = `
      <div class="scaling" style="display:inline-block">
      S(
      <input type='number' onchange="mainFunc()" value='1'>
      <input type='number' onchange="mainFunc()" value='1'>
      )
      </div>
      <br><br>
      <button onclick="removeMatrix(this)">X</button>
      <button onclick="moveLeft(this)">&lt</button>
      <button onclick="moveRight(this)">&gt</button>
  `
  queue.appendChild(div);
  mainFunc();
}

function addReflectionMatrix() {
  const queue = document.getElementById('queue')
  const div = document.createElement('div');
  div.className = 'queue-element';
  div.innerHTML = `
      <div class="reflection" style="display:inline-block">
      Ref(
      <input type='number' onchange="mainFunc()" value='1'>
      <input type='number' onchange="mainFunc()" value='1'>
      )
      </div>
      <br><br>
      <button onclick="removeMatrix(this)">X</button>
      <button onclick="moveLeft(this)">&lt</button>
      <button onclick="moveRight(this)">&gt</button>
  `
  queue.appendChild(div);
  mainFunc();
}

function hideHelp() {
  const p = document.getElementById('help');
  if (p.style.display === 'none') {
    p.style.display = 'block';
  } else {
    p.style.display = 'none';
  }
}