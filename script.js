window.ondragstart = e => e.preventDefault(); 
const container = document.getElementById('board');

// COLETA AS PROPORÇÕES DA TELA DO USUÁRIO
let boardWidth  = Math.floor(container.clientWidth);
let boardHeight = Math.floor(container.clientHeight);

// SETA A LARGURA DO QUADRO PARA O VALOR MÁXIMO PAR E RETORNA O MÓDULO
function boardWidthMod() {
    let hasMod = false;
    let mod;
    while (!hasMod) {
        for (let i = 8; i < 40; i++) {
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

// ATRIBUI O VALOR DE UM "PIXEL" (SQUARE) DO QUADRO
const squareWidth = boardWidthMod();

// SETA A ALTURA DO QUADRO PARA O VALOR MÁXIMO PAR COM A MESMA DIVISÃO DA LARGURA
while (boardHeight % squareWidth !== 0) boardHeight--;

// DEFINE A QUANTIDADE DE "PIXELS" DO QUADRO
const squareNo = ((boardWidth / squareWidth) * (boardHeight / squareWidth));

// ATRIBUI AS PROPORÇÕES DEFINIDAS ANTERIORMENTE AOS ESTILOS DO QUADRO
document.documentElement.style.setProperty('--square-width', `${squareWidth}px`);
document.documentElement.style.setProperty('--board-width', `${boardWidth}px`);
document.documentElement.style.setProperty('--board-height', `${boardHeight}px`);

// ARRAY PARA GUARDAR OS PIXELS
let allSquares = [];

// CRIA PIXELS, PENDURA NO CONTAINER E INSERE À ARRAY DE PIXELS
for (let i = 1; i <= squareNo; i++) {
    const square = document.createElement('span');
    square.classList.add('square');
    container.appendChild(square);
    allSquares.push(square);
}

// ATRIBUINDO ELEMENTOS DA DOM
const clearBtn      = document.getElementById('clear');
const saveBtn       = document.getElementById('save');
const drawsBtn      = document.getElementById('draws');

const eraserInput   = document.getElementById('eraser-input');
const eraserBtn     = document.getElementById('eraser');

const penInput      = document.getElementById('pen-input');
const penBtn        = document.getElementById('pen');

// COMEÇANDO O  COM O PINCEL ATIVO
let painting = true;
penInput.checked = true;

// ESCUTANDO QUANDO O PINCEL OU A BORRACHA É SELECIONADO
penBtn.addEventListener('click', () => {
    penInput.checked = true;
    painting = true;
});
eraserBtn.addEventListener('click', () => {
    eraserInput.checked = true;
    painting = false;
});

// ARRAY PARA GUARDAR OS PIXELS PINTADOS
let painteds = [];
function savePainteds() {
    let newPainteds = []
    for (square of painteds) {
        if (square.classList.contains('painted')) newPainteds.push(square);
    }
    painteds = newPainteds;
}

// ESCUTADORES PARA QUANDO O USUÁRIO ESTIVER DESENHANDO
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

// FUNÇÃO PARA SALVAR O DESENHO QUE ESTÁ ATUALMENTE NO QUADRO
let savedDraw = [];
function saveDraw() {
    if (painteds.length) {
        savePainteds();
        savedDraw = painteds;
        clear();
        alert('Desenho salvo', 1);
    }
    else {
        alert('Não há desenho para ser salvo', 0);
    }
}

// FUNÇÃO PARA RESTAURAR O DESENHO QUE FOI SALVO PELO USUÁRIO
function redraw() {
    if (savedDraw.length) {
        clear();
        for (const square of savedDraw) {
            square.classList.add('painted');
        };
        painteds = savedDraw;
        alert('Desenho restaurado', 1);
    }
    else {
        alert('Não há desenhos salvos', 0);
    }
}

// FUNÇÃO PARA APAGAR O DESENHO ATUAL DO USUÁRIO
function clear() {
    for (const square of painteds) {
        square.classList.remove('painted');
    }
    painteds = [];
    alert('Quadro limpo', 1);
}

// ADICIONANDO ESCUTADOR AOS BOTÕES DAS AÇÕES EXTRAS E EXECUTANDO AS FUNÇÕES
clearBtn.addEventListener('click', clear);
saveBtn.addEventListener('click', saveDraw);
drawsBtn.addEventListener('click', redraw);

// DEFINIÇÕES DA FERRAMENTA DE AVISOS/POPUPS
const alertContainer = document.getElementById('alert-container');
let alertTimer = null;
function alert(message, isSucess) {
    if (alertContainer.childNodes.length < 6) {
        if (alertContainer.childNodes.length === 5) message = "Vai com calma! Muitas requisições";
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