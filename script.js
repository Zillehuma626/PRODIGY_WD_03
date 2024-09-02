const cells = document.querySelectorAll('[data-cell]');
const board = document.querySelector('.game-board');
const restartButton = document.getElementById('restartButton');
const resultDiv = document.getElementById('result');
const X_CLASS = 'x';
const O_CLASS = 'o';
const backgroundMusic = document.getElementById('backgroundMusic');
const dancingBird = document.getElementById('dancingBird');
let oTurn = false;

startGame();
restartButton.addEventListener('click', startGame);

function startGame() {
    oTurn = false;
    cells.forEach(cell => {
        cell.classList.remove(X_CLASS, O_CLASS);
        cell.textContent = ''; // Clear text content
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    setBoardHoverClass();
    resultDiv.classList.add('hidden'); // Hide result div at the start of the game
    resultDiv.textContent = ''; // Clear the result text
    resultDiv.style.display = 'none'; // Hide the result overlay
    const existingLine = document.querySelector('.winning-line');
    if (existingLine) {
        existingLine.remove();
    }
    dancingBird.style.display = 'none';
    backgroundMusic.pause();
    backgroundMusic.currentTime=0;
}

function handleClick(e) {
    const cell = e.target;
    if (oTurn) return; // Prevent player from making a move if it's O's turn
    const currentClass = X_CLASS;
    placeMark(cell, currentClass);
    if (checkWin(currentClass)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        setBoardHoverClass();
        if (!isDraw()) {
            setTimeout(aiMove, 500); // Delay for AI move
        }
    }
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
    cell.textContent = currentClass === X_CLASS ? 'X' : 'O'; // Set cell content directly based on the class
}

function aiMove() {
    const emptyCells = [...cells].filter(cell => !cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS));
    if (emptyCells.length === 0) return; // No moves available
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    placeMark(randomCell, O_CLASS);
    if (checkWin(O_CLASS)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        setBoardHoverClass();
    }
}

function swapTurns() {
    oTurn = !oTurn;
}

function setBoardHoverClass() {
    board.classList.remove(X_CLASS, O_CLASS);
    if (oTurn) {
        board.classList.add(O_CLASS);
    } else {
        board.classList.add(X_CLASS);
    }
}

function checkWin(currentClass) {
    const WINNING_COMBINATIONS = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    const winningCombination = WINNING_COMBINATIONS.find(combination => {
        return combination.every(index => {
            return cells[index].classList.contains(currentClass);
        });
    });

    if (winningCombination) {
        showWinningLine(winningCombination);
        return true;
    }

    return false;
}

function isDraw() {
    return [...cells].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
    });
}

function endGame(draw) {
    if (draw) {
        resultDiv.textContent = "Draw!";
    } else {
        resultDiv.textContent = `${oTurn ? "O's" : "X's"} Wins!`;
    }
    resultDiv.classList.remove('hidden'); // Show result div
    resultDiv.style.display = 'block'; // Make it visible and overlay the board
    if (!draw) {
        dancingBird.style.display = 'block'; // Show the dancing bird
        playVictoryMusic(); // Play the victory music when the bird appears
    }
}

function playVictoryMusic() {
        backgroundMusic.play();
}

function showWinningLine(combination) {
    const [a, b, c] = combination;

    const cellA = cells[a];
    const cellB = cells[b];
    const cellC = cells[c];

    const boardRect = board.getBoundingClientRect();
    const cellARect = cellA.getBoundingClientRect();
    const cellCRect = cellC.getBoundingClientRect();

    const line = document.createElement('div');
    line.classList.add('winning-line');

    // Check if the combination is vertical
    if (a % 3 === b % 3 && b % 3 === c % 3) {
        line.style.width = '4px';
        line.style.height = `${boardRect.height}px`;
        line.style.left = `${(cellARect.left + cellARect.right) / 2 - boardRect.left}px`;
        line.style.top = '0';
    }
    // Check if the combination is horizontal
    else if (Math.floor(a / 3) === Math.floor(b / 3) && Math.floor(b / 3) === Math.floor(c / 3)) {
        line.style.height = '4px';
        line.style.width = `${boardRect.width}px`;
        line.style.top = `${(cellARect.top + cellARect.bottom) / 2 - boardRect.top}px`;
        line.style.left = '0';
    }
    // Check if the combination is diagonal (top-left to bottom-right)
    else if (a === 0 && c === 8) {
        line.style.width = `${Math.sqrt(2) * boardRect.width}px`;
        line.style.height = '4px';
        line.style.top = '0';
        line.style.left = '0';
        line.style.transform = 'rotate(45deg)';
        line.style.transformOrigin = 'top left';
    }
    // Check if the combination is diagonal (top-right to bottom-left)
    else if (a === 2 && c === 6) {
        line.style.width = `${Math.sqrt(2) * boardRect.width}px`;
        line.style.height = '4px';
        line.style.top = '0';
        line.style.right = '0';
        line.style.transform = 'rotate(-45deg)';
        line.style.transformOrigin = 'top right';
    }

    board.appendChild(line);
}
