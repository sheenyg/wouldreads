// Game configuration
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 10;
const PADDLE_SPEED = 6;
const BALL_SPEED_INCREMENT = 0.2;
const INITIAL_BALL_SPEED = 5;
const MAX_SCORE = 10;
const AI_REACTION_SPEED = 0.08;

// Game state
let gameState = {
    mode: null, // 'two-player' or 'ai'
    isPaused: false,
    isRunning: false,
    player1Score: 0,
    player2Score: 0
};

// Canvas and context
let canvas, ctx;

// Game objects
let ball = {
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT / 2,
    dx: INITIAL_BALL_SPEED,
    dy: INITIAL_BALL_SPEED,
    speed: INITIAL_BALL_SPEED
};

let paddle1 = {
    x: 20,
    y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0
};

let paddle2 = {
    x: CANVAS_WIDTH - 20 - PADDLE_WIDTH,
    y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0
};

// Keyboard state
let keys = {};

// DOM elements
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const twoPlayerBtn = document.getElementById('two-player-btn');
const aiPlayerBtn = document.getElementById('ai-player-btn');
const returnMenuBtn = document.getElementById('return-menu-btn');
const pauseOverlay = document.getElementById('pause-overlay');
const player1ScoreElement = document.getElementById('player1-score');
const player2ScoreElement = document.getElementById('player2-score');

// Event listeners
twoPlayerBtn.addEventListener('click', () => startGame('two-player'));
aiPlayerBtn.addEventListener('click', () => startGame('ai'));
returnMenuBtn.addEventListener('click', returnToMenu);

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    
    // Space bar for pause
    if (e.key === ' ' && gameState.isRunning) {
        e.preventDefault();
        togglePause();
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Initialize canvas
function initCanvas() {
    canvas = document.getElementById('pong-canvas');
    ctx = canvas.getContext('2d');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
}

// Start game
function startGame(mode) {
    gameState.mode = mode;
    gameState.isRunning = true;
    gameState.isPaused = false;
    gameState.player1Score = 0;
    gameState.player2Score = 0;
    
    startScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    
    initCanvas();
    resetBall();
    resetPaddles();
    updateScoreDisplay();
    
    gameLoop();
}

// Return to menu
function returnToMenu() {
    gameState.isRunning = false;
    gameState.isPaused = false;
    startScreen.style.display = 'block';
    gameScreen.style.display = 'none';
    pauseOverlay.style.display = 'none';
}

// Toggle pause
function togglePause() {
    gameState.isPaused = !gameState.isPaused;
    pauseOverlay.style.display = gameState.isPaused ? 'block' : 'none';
}

// Reset ball
function resetBall() {
    ball.x = CANVAS_WIDTH / 2;
    ball.y = CANVAS_HEIGHT / 2;
    
    // Random direction
    const angle = (Math.random() * Math.PI / 2) - Math.PI / 4; // -45 to 45 degrees
    const direction = Math.random() < 0.5 ? 1 : -1;
    
    ball.speed = INITIAL_BALL_SPEED;
    ball.dx = Math.cos(angle) * ball.speed * direction;
    ball.dy = Math.sin(angle) * ball.speed;
}

// Reset paddles
function resetPaddles() {
    paddle1.y = CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2;
    paddle2.y = CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2;
    paddle1.dy = 0;
    paddle2.dy = 0;
}

// Update paddle positions
function updatePaddles() {
    // Player 1 controls (W/S)
    if (keys['w'] || keys['W']) {
        paddle1.dy = -PADDLE_SPEED;
    } else if (keys['s'] || keys['S']) {
        paddle1.dy = PADDLE_SPEED;
    } else {
        paddle1.dy = 0;
    }
    
    // Player 2 controls or AI
    if (gameState.mode === 'two-player') {
        if (keys['ArrowUp']) {
            paddle2.dy = -PADDLE_SPEED;
        } else if (keys['ArrowDown']) {
            paddle2.dy = PADDLE_SPEED;
        } else {
            paddle2.dy = 0;
        }
    } else if (gameState.mode === 'ai') {
        // Simple AI: follow the ball
        const paddleCenter = paddle2.y + paddle2.height / 2;
        const ballCenter = ball.y;
        
        if (paddleCenter < ballCenter - 10) {
            paddle2.dy = PADDLE_SPEED * AI_REACTION_SPEED;
        } else if (paddleCenter > ballCenter + 10) {
            paddle2.dy = -PADDLE_SPEED * AI_REACTION_SPEED;
        } else {
            paddle2.dy = 0;
        }
    }
    
    // Update positions
    paddle1.y += paddle1.dy;
    paddle2.y += paddle2.dy;
    
    // Keep paddles in bounds
    paddle1.y = Math.max(0, Math.min(CANVAS_HEIGHT - paddle1.height, paddle1.y));
    paddle2.y = Math.max(0, Math.min(CANVAS_HEIGHT - paddle2.height, paddle2.y));
}

// Update ball position
function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    // Top and bottom wall collision
    if (ball.y <= 0 || ball.y >= CANVAS_HEIGHT - BALL_SIZE) {
        ball.dy = -ball.dy;
    }
    
    // Paddle collision
    if (checkPaddleCollision(paddle1) || checkPaddleCollision(paddle2)) {
        ball.dx = -ball.dx;
        
        // Increase speed slightly
        ball.speed += BALL_SPEED_INCREMENT;
        ball.dx = ball.dx > 0 ? ball.speed : -ball.speed;
        
        // Add some randomness to dy based on where the ball hits the paddle
        const hitPaddle = ball.x < CANVAS_WIDTH / 2 ? paddle1 : paddle2;
        const relativeIntersectY = (hitPaddle.y + hitPaddle.height / 2) - ball.y;
        const normalizedIntersect = relativeIntersectY / (hitPaddle.height / 2);
        const bounceAngle = normalizedIntersect * (Math.PI / 4); // Max 45 degrees
        
        ball.dy = -ball.speed * Math.sin(bounceAngle);
    }
    
    // Scoring
    if (ball.x <= 0) {
        // Player 2 scores
        gameState.player2Score++;
        updateScoreDisplay();
        checkWinner();
        resetBall();
    } else if (ball.x >= CANVAS_WIDTH - BALL_SIZE) {
        // Player 1 scores
        gameState.player1Score++;
        updateScoreDisplay();
        checkWinner();
        resetBall();
    }
}

// Check paddle collision
function checkPaddleCollision(paddle) {
    return ball.x < paddle.x + paddle.width &&
           ball.x + BALL_SIZE > paddle.x &&
           ball.y < paddle.y + paddle.height &&
           ball.y + BALL_SIZE > paddle.y;
}

// Update score display
function updateScoreDisplay() {
    player1ScoreElement.textContent = gameState.player1Score;
    player2ScoreElement.textContent = gameState.player2Score;
}

// Check for winner
function checkWinner() {
    if (gameState.player1Score >= MAX_SCORE || gameState.player2Score >= MAX_SCORE) {
        const winner = gameState.player1Score >= MAX_SCORE ? 'Player 1' : 
                       (gameState.mode === 'ai' ? 'AI' : 'Player 2');
        
        setTimeout(() => {
            alert(`${winner} wins!`);
            returnToMenu();
        }, 100);
    }
}

// Draw everything
function draw() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw center line
    ctx.strokeStyle = '#00ff00';
    ctx.setLineDash([10, 10]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(CANVAS_WIDTH / 2, 0);
    ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw paddles
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
    ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
    
    // Draw ball
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(ball.x, ball.y, BALL_SIZE, BALL_SIZE);
}

// Game loop
function gameLoop() {
    if (!gameState.isRunning) return;
    
    if (!gameState.isPaused) {
        updatePaddles();
        updateBall();
        draw();
    }
    
    requestAnimationFrame(gameLoop);
}
