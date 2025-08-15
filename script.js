// Game state variables
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

// DOM elements
const cells = document.querySelectorAll('.cell');
const currentPlayerText = document.getElementById('current-player-text');
const gameStatus = document.getElementById('game-status');
const resetButton = document.getElementById('reset-button');

// Winning combinations (indices of game board)
const winningCombinations = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal top-left to bottom-right
    [2, 4, 6]  // Diagonal top-right to bottom-left
];

// Initialize the game
function initializeGame() {
    // Add click event listeners to all cells
    cells.forEach((cell, index) => {
        cell.addEventListener('click', () => handleCellClick(index));
    });
    
    // Add reset button event listener
    resetButton.addEventListener('click', resetGame);
    
    // Set initial player display
    updatePlayerDisplay();
}

// Handle cell click
function handleCellClick(index) {
    // Check if the game is active and the cell is empty
    if (!gameActive || gameBoard[index] !== '') {
        return;
    }
    
    // Make the move
    makeMove(index);
    
    // Check for win or draw
    checkGameResult();
    
    // Switch players if game is still active
    if (gameActive) {
        switchPlayer();
    }
}

// Make a move on the board
function makeMove(index) {
    // Update game board array
    gameBoard[index] = currentPlayer;
    
    // Update visual board
    const cell = cells[index];
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());
    cell.classList.add('occupied');
}

// Switch current player
function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updatePlayerDisplay();
}

// Update current player display
function updatePlayerDisplay() {
    currentPlayerText.textContent = `Player ${currentPlayer}'s Turn`;
}

// Check game result (win or draw)
function checkGameResult() {
    // Check for win
    const winningCombination = checkWin();
    if (winningCombination) {
        handleWin(winningCombination);
        return;
    }
    
    // Check for draw
    if (checkDraw()) {
        handleDraw();
        return;
    }
}

// Check if current player has won
function checkWin() {
    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (gameBoard[a] && 
            gameBoard[a] === gameBoard[b] && 
            gameBoard[a] === gameBoard[c]) {
            return combination;
        }
    }
    return null;
}

// Check if the game is a draw
function checkDraw() {
    return gameBoard.every(cell => cell !== '');
}

// Handle win condition
function handleWin(winningCombination) {
    gameActive = false;
    gameStatus.textContent = `🎉 Player ${currentPlayer} Wins! 🎉`;
    gameStatus.classList.add('winner');
    
    // Highlight winning cells
    winningCombination.forEach(index => {
        cells[index].classList.add('winning');
    });
    
    // Update player display
    currentPlayerText.textContent = `Game Over`;
}

// Handle draw condition
function handleDraw() {
    gameActive = false;
    gameStatus.textContent = `🤝 It's a Draw! 🤝`;
    gameStatus.classList.add('draw');
    currentPlayerText.textContent = `Game Over`;
}

// Reset the game
function resetGame() {
    // Reset game state
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    
    // Clear visual board
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o', 'occupied', 'winning');
    });
    
    // Clear game status
    gameStatus.textContent = '';
    gameStatus.classList.remove('winner', 'draw');
    
    // Update player display
    updatePlayerDisplay();
}

// Add keyboard support for accessibility
document.addEventListener('keydown', (event) => {
    // Allow space or enter to reset when game is over
    if (!gameActive && (event.code === 'Space' || event.code === 'Enter')) {
        resetGame();
        event.preventDefault();
    }
    
    // Allow number keys 1-9 to select cells
    if (gameActive && event.code.startsWith('Digit')) {
        const digit = parseInt(event.code.slice(-1));
        if (digit >= 1 && digit <= 9) {
            const index = digit - 1;
            handleCellClick(index);
            event.preventDefault();
        }
    }
    
    // Allow numpad keys 1-9 to select cells
    if (gameActive && event.code.startsWith('Numpad')) {
        const digit = parseInt(event.code.slice(-1));
        if (digit >= 1 && digit <= 9) {
            const index = digit - 1;
            handleCellClick(index);
            event.preventDefault();
        }
    }
});

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', initializeGame);

// Add visual feedback for better user experience
cells.forEach((cell, index) => {
    // Add hover effect that shows which player will move
    cell.addEventListener('mouseenter', () => {
        if (gameActive && gameBoard[index] === '') {
            cell.style.color = currentPlayer === 'X' ? '#e53e3e' : '#3182ce';
            cell.textContent = currentPlayer;
            cell.style.opacity = '0.3';
        }
    });
    
    // Remove hover effect
    cell.addEventListener('mouseleave', () => {
        if (gameActive && gameBoard[index] === '') {
            cell.textContent = '';
            cell.style.opacity = '1';
        }
    });
});
