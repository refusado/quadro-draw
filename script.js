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
let row = 1;
let column = 1;
for (let i = 1; i <= squareNumber; i++) {
    const square = document.createElement('span');
    allSquares.push(square);
    square.classList.add('square');
    square.setAttribute('id', `${row}-${column}`);
    container.appendChild(square);

    column++;
    if (i % (boardWidth / squareWidth) === 0) {
        row++;
        column = 1;
    }
}

const clearBtn = document.getElementById('clear');
const drawsBtn = document.getElementById('draws');
const saveBtn = document.getElementById('save');
const eraserBtn = document.getElementById('eraser');
const penBtn = document.getElementById('pen');

let color = 'black';
let painting = true;
penBtn.addEventListener('click', () => {
    color = 'black';
    painting = true;
});
eraserBtn.addEventListener('click', () => {
    color = '';
    painting = false;
});
drawsBtn.addEventListener('click', () => {
    color = 'black';
});

let painteds = [];
let eraseds = [];
let savedDraw = [];
for (const square of allSquares) {
    window.addEventListener('mousedown', () => {
       square.addEventListener('mouseover', draw);
    });
    square.addEventListener('click', draw);

    window.addEventListener('mouseup', () => {
       square.removeEventListener('mouseover', draw);
    });

    function draw() {
        square.style.backgroundColor = color;
        if (painting){
            painteds.push(square);
            square.setAttribute('painted','');
        }
        else {
            if (square.hasAttribute) square.removeAttribute('painted');
        }
    };
}

function saveDraw() {
    savedDraw = [];
    if (painteds.length) {
        for (const elem of painteds) {
            if (elem.hasAttribute('painted')) {
                savedDraw.push(elem);
            }
        }
        clear();
    }
    else {
        console.error('não tem nada para salvar aí não maluquinho');
    }
}
function redraw() {
    // console.info(savedDraw);
    if (savedDraw.length) {
        clear();
        for (const square of savedDraw) {
            square.style.backgroundColor = color;
        };
        painteds = savedDraw;
    }
    else {
        console.error('não tem desenho salvo não seu doido');
    }
}
function clear() {
    for (const square of painteds) {
        square.style.backgroundColor = '';
    }
    painteds = [];
}


clearBtn.addEventListener('click', clear);

saveBtn.addEventListener('click', saveDraw);

drawsBtn.addEventListener('click', redraw);
















container.addEventListener('dragstart', (e) => {
    e.preventDefault();
});