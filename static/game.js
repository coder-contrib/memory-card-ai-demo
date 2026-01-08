/**
 * Memory Card Game - Client-side JavaScript
 * Handles UI interactions and communicates with Flask backend
 */

// DOM Elements
const startScreen = document.getElementById('start-screen');
const startBtn = document.getElementById('start-btn');
const gameBoard = document.getElementById('game-board');
const statsDiv = document.getElementById('stats');
const movesSpan = document.getElementById('moves');
const matchesSpan = document.getElementById('matches');
const totalPairsSpan = document.getElementById('total-pairs');
const resetBtn = document.getElementById('reset-btn');
const winModal = document.getElementById('win-modal');
const finalMovesSpan = document.getElementById('final-moves');
const playAgainBtn = document.getElementById('play-again-btn');

// Game state
let gameState = null;
let isProcessing = false;

/**
 * Start a new game
 */
async function startGame() {
    try {
        const response = await fetch('/api/start', { method: 'POST' });
        gameState = await response.json();
        renderGame();
    } catch (error) {
        console.error('Failed to start game:', error);
    }
}

/**
 * Flip a card at the given index
 */
async function flipCard(index) {
    if (isProcessing || !gameState) return;
    
    // Don't flip if already flipped or matched
    if (gameState.flippedIndices.includes(index)) return;
    if (gameState.matchedPairs.includes(gameState.cards[index].symbol)) return;
    
    try {
        isProcessing = true;
        const response = await fetch(`/api/flip/${index}`, { method: 'POST' });
        gameState = await response.json();
        renderGame();
        
        // If two cards are flipped and no match, reset after delay
        if (gameState.flippedIndices.length === 2) {
            setTimeout(async () => {
                const resetResponse = await fetch('/api/reset-flip', { method: 'POST' });
                gameState = await resetResponse.json();
                renderGame();
                isProcessing = false;
            }, 1000);
        } else {
            isProcessing = false;
        }
        
        // Check for win
        if (gameState.gameWon) {
            setTimeout(() => showWinModal(), 500);
        }
    } catch (error) {
        console.error('Failed to flip card:', error);
        isProcessing = false;
    }
}

/**
 * Render the game board based on current state
 */
function renderGame() {
    if (!gameState || !gameState.gameStarted) {
        startScreen.classList.remove('hidden');
        gameBoard.classList.add('hidden');
        statsDiv.classList.add('hidden');
        resetBtn.classList.add('hidden');
        return;
    }
    
    // Hide start screen, show game
    startScreen.classList.add('hidden');
    gameBoard.classList.remove('hidden');
    statsDiv.classList.remove('hidden');
    resetBtn.classList.remove('hidden');
    
    // Update stats
    movesSpan.textContent = gameState.moves;
    matchesSpan.textContent = gameState.matchedPairs.length;
    totalPairsSpan.textContent = gameState.totalPairs;
    
    // Render cards
    gameBoard.innerHTML = '';
    gameState.cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        
        const isFlipped = gameState.flippedIndices.includes(index);
        const isMatched = gameState.matchedPairs.includes(card.symbol);
        
        if (isFlipped) cardElement.classList.add('flipped');
        if (isMatched) cardElement.classList.add('matched');
        
        cardElement.textContent = (isFlipped || isMatched) ? card.symbol : '?';
        cardElement.addEventListener('click', () => flipCard(index));
        
        gameBoard.appendChild(cardElement);
    });
}

/**
 * Show the win modal
 */
function showWinModal() {
    finalMovesSpan.textContent = gameState.moves;
    winModal.classList.remove('hidden');
}

/**
 * Hide the win modal
 */
function hideWinModal() {
    winModal.classList.add('hidden');
}

// Event listeners
startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', () => {
    hideWinModal();
    startGame();
});
playAgainBtn.addEventListener('click', () => {
    hideWinModal();
    startGame();
});

// Check for existing game state on page load
(async function init() {
    try {
        const response = await fetch('/api/state');
        gameState = await response.json();
        if (gameState.gameStarted) {
            renderGame();
        }
    } catch (error) {
        console.error('Failed to load game state:', error);
    }
})();
