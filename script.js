window.ondragstart = (e) => e.preventDefault(); 
const container = document.getElementById('board');

let boardWidth = Math.floor(container.clientWidth);
let boardHeight = Math.floor(container.clientHeight);

function boardWidthMod() {
    let hasMod = false;
    let mod;
    while (!hasMod) {
        for (let i = 10; i < 40; i++) {
            if (boardWidth % i === 0) {
                hasMod = true;
                mod = i;
                break;
            }
        }

        if (hasMod) return mod;
        else boardWidth--;
    }
}

let squareWidth = boardWidthMod();
while (boardHeight % squareWidth !== 0) boardHeight--;
let squareNumber = ((boardWidth / squareWidth) * (boardHeight / squareWidth));

document.documentElement.style.setProperty('--square-width', `${squareWidth}px`);
document.documentElement.style.setProperty('--board-width', `${boardWidth}px`);
document.documentElement.style.setProperty('--board-height', `${boardHeight}px`);

let allSquares = [];
for (let i = 1; i <= squareNumber; i++) {
    const square = document.createElement('span');
    square.classList.add('square');
    container.appendChild(square);
    allSquares.push(square);
}

const clearBtn = document.getElementById('clear');
const saveBtn = document.getElementById('save');
const drawsBtn = document.getElementById('draws');

const eraserInput = document.getElementById('eraser-input');
const eraserBtn = document.getElementById('eraser');

const penInput = document.getElementById('pen-input');
const penBtn = document.getElementById('pen');

let painting = true;
penBtn.addEventListener('click', () => {
    penInput.checked = true;
    painting = true;
});
eraserBtn.addEventListener('click', () => {
    eraserInput.checked = true;
    painting = false;
});

let painteds = [];
function savePainteds() {
    let newPainteds = []
    for (square of painteds) {
        if (square.classList.contains('painted')) newPainteds.push(square);
    }
    painteds = newPainteds;
}

for (const square of allSquares) {
    square.addEventListener('click', draw);

    window.addEventListener('mousedown', () => square.addEventListener('mouseover', draw));
    window.addEventListener('mouseup', () => square.removeEventListener('mouseover', draw));

    function draw() {
        if (painting){
            painteds.push(square);
            square.classList.add('painted');
        }
        else {
            square.classList.remove('painted');
        }
        savePainteds();
    };
}

let savedDraw = [];
function saveDraw() {
    if (painteds.length) {
        savePainteds();
        savedDraw = painteds;
        clear();
        alert('Desenho salvo com sucesso!', 1);
    }
    else {
        alert('Não há desenho para ser salvo', 0);
    }
}
function redraw() {
    if (savedDraw.length) {
        clear();
        for (const square of savedDraw) {
            square.classList.add('painted');
        };
        painteds = savedDraw;
        alert('Desenho restaurado!', 1);
    }
    else {
        alert('Não há desenhos salvos', 0);
    }
}
function clear() {
    for (const square of painteds) {
        square.classList.remove('painted');
    }
    painteds = [];
    alert('Quadro limpo!', 1);
}

clearBtn.addEventListener('click', clear);
saveBtn.addEventListener('click', saveDraw);
drawsBtn.addEventListener('click', redraw);

// window.ondblclick = () => alert('Testando cuzão', 0);

const alertContainer = document.getElementById('alert-container');
let alertTimer = null;
function alert(message, isSucess) {
    if (alertContainer.childNodes.length < 5) {
        if (alertContainer.childNodes.length === 4) message = "Vai com calma amg";
        const alertDiv = document.createElement('div');
        alertDiv.classList.add('alert');
        alertDiv.style.display = 'block';
        alertDiv.innerText = message;

        if (isSucess) alertDiv.classList.add('sucess');
        else alertDiv.classList.add('error');

        alertContainer.appendChild(alertDiv);

        alertTimer = setTimeout(() => {
            alertContainer.removeChild(alertDiv);
        }, 2000);
    }
}