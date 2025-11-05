/**
 * Pong Game - A classic arcade game implementation
 * Features: Two-player gameplay, score tracking, collision detection, and smooth animations
 */

// Canvas setup
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Score elements
const player1ScoreEl = document.getElementById('player1Score');
const player2ScoreEl = document.getElementById('player2Score');
const gameMessageEl = document.getElementById('gameMessage');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');

// Game constants
const WINNING_SCORE = 10;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 10;
const PADDLE_SPEED = 6;
const INITIAL_BALL_SPEED = 5;
const SPEED_INCREASE = 0.5;

// Game state
let gameRunning = false;
let gameOver = false;

// Paddle objects
const leftPaddle = {
    x: 20,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0
};

const rightPaddle = {
    x: canvas.width - 20 - PADDLE_WIDTH,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0
};

// Ball object
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: BALL_SIZE,
    height: BALL_SIZE,
    dx: INITIAL_BALL_SPEED,
    dy: INITIAL_BALL_SPEED,
    speed: INITIAL_BALL_SPEED
};

// Score tracking
let player1Score = 0;
let player2Score = 0;

// Keyboard state
const keys = {};

// Event listeners for keyboard controls
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Start button click handler
startButton.addEventListener('click', () => {
    startButton.classList.add('hidden');
    gameRunning = true;
    gameLoop();
});

// Restart button click handler
restartButton.addEventListener('click', () => {
    resetGame();
    restartButton.classList.add('hidden');
    gameMessageEl.classList.add('hidden');
    gameRunning = true;
    gameLoop();
});

/**
 * Draw a rectangle on the canvas
 */
function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

/**
 * Draw the ball (circle)
 */
function drawBall(x, y, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
    ctx.fill();
}

/**
 * Draw the center line
 */
function drawCenterLine() {
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

/**
 * Update paddle positions based on keyboard input
 */
function updatePaddles() {
    // Left paddle controls (W and S)
    if (keys['w'] || keys['W']) {
        leftPaddle.dy = -PADDLE_SPEED;
    } else if (keys['s'] || keys['S']) {
        leftPaddle.dy = PADDLE_SPEED;
    } else {
        leftPaddle.dy = 0;
    }

    // Right paddle controls (Arrow Up and Arrow Down)
    if (keys['ArrowUp']) {
        rightPaddle.dy = -PADDLE_SPEED;
    } else if (keys['ArrowDown']) {
        rightPaddle.dy = PADDLE_SPEED;
    } else {
        rightPaddle.dy = 0;
    }

    // Update paddle positions
    leftPaddle.y += leftPaddle.dy;
    rightPaddle.y += rightPaddle.dy;

    // Keep paddles within canvas bounds
    if (leftPaddle.y < 0) leftPaddle.y = 0;
    if (leftPaddle.y + leftPaddle.height > canvas.height) {
        leftPaddle.y = canvas.height - leftPaddle.height;
    }

    if (rightPaddle.y < 0) rightPaddle.y = 0;
    if (rightPaddle.y + rightPaddle.height > canvas.height) {
        rightPaddle.y = canvas.height - rightPaddle.height;
    }
}

/**
 * Update ball position and handle collisions
 */
function updateBall() {
    // Move ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall collision (top and bottom)
    if (ball.y <= 0 || ball.y + ball.height >= canvas.height) {
        ball.dy *= -1;
    }

    // Paddle collision detection
    // Left paddle
    if (ball.x <= leftPaddle.x + leftPaddle.width &&
        ball.x + ball.width >= leftPaddle.x &&
        ball.y + ball.height >= leftPaddle.y &&
        ball.y <= leftPaddle.y + leftPaddle.height) {
        
        ball.dx = Math.abs(ball.dx) + SPEED_INCREASE;
        ball.x = leftPaddle.x + leftPaddle.width;
        
        // Add some angle variation based on where the ball hits the paddle
        const hitPos = (ball.y + ball.height / 2 - leftPaddle.y) / leftPaddle.height;
        ball.dy = (hitPos - 0.5) * 10;
    }

    // Right paddle
    if (ball.x + ball.width >= rightPaddle.x &&
        ball.x <= rightPaddle.x + rightPaddle.width &&
        ball.y + ball.height >= rightPaddle.y &&
        ball.y <= rightPaddle.y + rightPaddle.height) {
        
        ball.dx = -(Math.abs(ball.dx) + SPEED_INCREASE);
        ball.x = rightPaddle.x - ball.width;
        
        // Add some angle variation based on where the ball hits the paddle
        const hitPos = (ball.y + ball.height / 2 - rightPaddle.y) / rightPaddle.height;
        ball.dy = (hitPos - 0.5) * 10;
    }

    // Score detection (ball goes off screen)
    if (ball.x < 0) {
        // Player 2 scores
        player2Score++;
        updateScore();
        resetBall();
        checkWinCondition();
    } else if (ball.x > canvas.width) {
        // Player 1 scores
        player1Score++;
        updateScore();
        resetBall();
        checkWinCondition();
    }
}

/**
 * Reset ball to center with random direction
 */
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * INITIAL_BALL_SPEED;
    ball.dy = (Math.random() * 2 - 1) * INITIAL_BALL_SPEED;
    ball.speed = INITIAL_BALL_SPEED;
}

/**
 * Update score display
 */
function updateScore() {
    player1ScoreEl.textContent = player1Score;
    player2ScoreEl.textContent = player2Score;
}

/**
 * Check if a player has won
 */
function checkWinCondition() {
    if (player1Score >= WINNING_SCORE) {
        endGame('Player 1 Wins! 🎉');
    } else if (player2Score >= WINNING_SCORE) {
        endGame('Player 2 Wins! 🎉');
    }
}

/**
 * End the game and display winner
 */
function endGame(message) {
    gameRunning = false;
    gameOver = true;
    gameMessageEl.textContent = message;
    gameMessageEl.classList.remove('hidden');
    restartButton.classList.remove('hidden');
}

/**
 * Reset the game state
 */
function resetGame() {
    player1Score = 0;
    player2Score = 0;
    updateScore();
    resetBall();
    leftPaddle.y = canvas.height / 2 - PADDLE_HEIGHT / 2;
    rightPaddle.y = canvas.height / 2 - PADDLE_HEIGHT / 2;
    gameOver = false;
}

/**
 * Render all game objects
 */
function render() {
    // Clear canvas
    drawRect(0, 0, canvas.width, canvas.height, '#0a0a0a');

    // Draw center line
    drawCenterLine();

    // Draw paddles
    drawRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height, '#00ff00');
    drawRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height, '#ff0000');

    // Draw ball
    drawBall(ball.x, ball.y, ball.width, '#ffffff');
}

/**
 * Main game loop
 */
function gameLoop() {
    if (!gameRunning) return;

    updatePaddles();
    updateBall();
    render();

    requestAnimationFrame(gameLoop);
}

// Initial render
render();
