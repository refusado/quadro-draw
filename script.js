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
const eraserBtn = document.getElementById('eraser');
const penBtn = document.getElementById('pen');

let painting = true;
penBtn.addEventListener('click', () => {
    painting = true;
});
eraserBtn.addEventListener('click', () => {
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

    window.addEventListener('mousedown', () => {
       square.addEventListener('mouseover', draw);
    });
    window.addEventListener('mouseup', () => {
        square.removeEventListener('mouseover', draw);
    });

    function draw() {
        if (painting){
            painteds.push(square);
            square.classList.add('painted');
        }
        else {
            if (square.hasAttribute) square.classList.remove('painted');
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
    }
    else {
        console.error('não tem nada para salvar aí não maluquinho');
    }
}
function redraw() {
    if (savedDraw.length) {
        clear();
        for (const square of savedDraw) {
            square.classList.add('painted');
        };
        painteds = savedDraw;
    }
    else {
        console.error('não tem desenho salvo não seu doido');
    }
}
function clear() {
    for (const square of painteds) {
        square.classList.remove('painted');
    }
    painteds = [];
}


clearBtn.addEventListener('click', clear);

saveBtn.addEventListener('click', saveDraw);

drawsBtn.addEventListener('click', redraw);


window.addEventListener('dblclick', () => {
    console.info(painteds);
});













container.addEventListener('dragstart', (e) => {
    e.preventDefault();
});