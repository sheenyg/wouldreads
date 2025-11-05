import { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface GameState {
  ballX: number;
  ballY: number;
  ballSpeedX: number;
  ballSpeedY: number;
  paddle1Y: number;
  paddle2Y: number;
  score1: number;
  score2: number;
  isPlaying: boolean;
  isPaused: boolean;
}

export function PongGame() {
  // Game constants
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;
  const PADDLE_WIDTH = 10;
  const PADDLE_HEIGHT = 100;
  const BALL_SIZE = 10;
  const PADDLE_SPEED = 6;
  const WINNING_SCORE = 5;
  const PADDLE_INFLUENCE_FACTOR = 10;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    ballX: CANVAS_WIDTH / 2,
    ballY: CANVAS_HEIGHT / 2,
    ballSpeedX: 5,
    ballSpeedY: 5,
    paddle1Y: (CANVAS_HEIGHT - PADDLE_HEIGHT) / 2,
    paddle2Y: (CANVAS_HEIGHT - PADDLE_HEIGHT) / 2,
    score1: 0,
    score2: 0,
    isPlaying: false,
    isPaused: false,
  });

  const keysPressed = useRef<Set<string>>(new Set());
  const animationFrameId = useRef<number>();

  const resetBall = useCallback(() => {
    return {
      ballX: CANVAS_WIDTH / 2,
      ballY: CANVAS_HEIGHT / 2,
      ballSpeedX: 5 * (Math.random() > 0.5 ? 1 : -1),
      ballSpeedY: 5 * (Math.random() > 0.5 ? 1 : -1),
    };
  }, []);

  const startGame = () => {
    setGameState((prev) => ({
      ...prev,
      ...resetBall(),
      score1: 0,
      score2: 0,
      isPlaying: true,
      isPaused: false,
    }));
  };

  const togglePause = () => {
    setGameState((prev) => ({
      ...prev,
      isPaused: !prev.isPaused,
    }));
  };

  const resetGame = () => {
    setGameState({
      ballX: CANVAS_WIDTH / 2,
      ballY: CANVAS_HEIGHT / 2,
      ballSpeedX: 5,
      ballSpeedY: 5,
      paddle1Y: (CANVAS_HEIGHT - PADDLE_HEIGHT) / 2,
      paddle2Y: (CANVAS_HEIGHT - PADDLE_HEIGHT) / 2,
      score1: 0,
      score2: 0,
      isPlaying: false,
      isPaused: false,
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key);
      if (e.key === ' ' && gameState.isPlaying) {
        e.preventDefault();
        togglePause();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState.isPlaying]);

  useEffect(() => {
    if (!gameState.isPlaying || gameState.isPaused) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameLoop = () => {
      // Update paddle positions based on keys pressed
      setGameState((prev) => {
        let newPaddle1Y = prev.paddle1Y;
        let newPaddle2Y = prev.paddle2Y;

        // Player 1 controls (W/S)
        if (keysPressed.current.has('w') || keysPressed.current.has('W')) {
          newPaddle1Y = Math.max(0, prev.paddle1Y - PADDLE_SPEED);
        }
        if (keysPressed.current.has('s') || keysPressed.current.has('S')) {
          newPaddle1Y = Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, prev.paddle1Y + PADDLE_SPEED);
        }

        // Player 2 controls (Arrow Up/Down)
        if (keysPressed.current.has('ArrowUp')) {
          newPaddle2Y = Math.max(0, prev.paddle2Y - PADDLE_SPEED);
        }
        if (keysPressed.current.has('ArrowDown')) {
          newPaddle2Y = Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, prev.paddle2Y + PADDLE_SPEED);
        }

        // Update ball position
        let newBallX = prev.ballX + prev.ballSpeedX;
        let newBallY = prev.ballY + prev.ballSpeedY;
        let newBallSpeedX = prev.ballSpeedX;
        let newBallSpeedY = prev.ballSpeedY;
        let newScore1 = prev.score1;
        let newScore2 = prev.score2;

        // Ball collision with top and bottom walls
        if (newBallY <= 0 || newBallY >= CANVAS_HEIGHT - BALL_SIZE) {
          newBallSpeedY = -newBallSpeedY;
          newBallY = newBallY <= 0 ? 0 : CANVAS_HEIGHT - BALL_SIZE;
        }

        // Ball collision with paddles
        // Left paddle (Player 1)
        if (
          newBallX <= PADDLE_WIDTH &&
          newBallY + BALL_SIZE >= newPaddle1Y &&
          newBallY <= newPaddle1Y + PADDLE_HEIGHT
        ) {
          newBallSpeedX = Math.abs(newBallSpeedX) * 1.05; // Speed up slightly
          newBallX = PADDLE_WIDTH;
          // Add angle based on where ball hits paddle
          const hitPos = (newBallY - newPaddle1Y) / PADDLE_HEIGHT - 0.5;
          newBallSpeedY = hitPos * PADDLE_INFLUENCE_FACTOR;
        }

        // Right paddle (Player 2)
        if (
          newBallX + BALL_SIZE >= CANVAS_WIDTH - PADDLE_WIDTH &&
          newBallY + BALL_SIZE >= newPaddle2Y &&
          newBallY <= newPaddle2Y + PADDLE_HEIGHT
        ) {
          newBallSpeedX = -Math.abs(newBallSpeedX) * 1.05; // Speed up slightly
          newBallX = CANVAS_WIDTH - PADDLE_WIDTH - BALL_SIZE;
          // Add angle based on where ball hits paddle
          const hitPos = (newBallY - newPaddle2Y) / PADDLE_HEIGHT - 0.5;
          newBallSpeedY = hitPos * PADDLE_INFLUENCE_FACTOR;
        }

        // Ball goes out of bounds (scoring)
        let shouldReset = false;
        if (newBallX < 0) {
          newScore2 += 1;
          shouldReset = true;
        } else if (newBallX > CANVAS_WIDTH) {
          newScore1 += 1;
          shouldReset = true;
        }

        if (shouldReset) {
          const reset = resetBall();
          newBallX = reset.ballX;
          newBallY = reset.ballY;
          newBallSpeedX = reset.ballSpeedX;
          newBallSpeedY = reset.ballSpeedY;
        }

        // Check for winner
        if (newScore1 >= WINNING_SCORE || newScore2 >= WINNING_SCORE) {
          // Render final state before stopping
          ctx.fillStyle = '#000';
          ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 2;
          ctx.setLineDash([10, 10]);
          ctx.beginPath();
          ctx.moveTo(CANVAS_WIDTH / 2, 0);
          ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.fillStyle = '#fff';
          ctx.fillRect(0, newPaddle1Y, PADDLE_WIDTH, PADDLE_HEIGHT);
          ctx.fillRect(CANVAS_WIDTH - PADDLE_WIDTH, newPaddle2Y, PADDLE_WIDTH, PADDLE_HEIGHT);
          ctx.fillRect(newBallX, newBallY, BALL_SIZE, BALL_SIZE);
          ctx.font = '48px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(newScore1.toString(), CANVAS_WIDTH / 4, 60);
          ctx.fillText(newScore2.toString(), (CANVAS_WIDTH * 3) / 4, 60);

          return {
            ...prev,
            ballX: newBallX,
            ballY: newBallY,
            paddle1Y: newPaddle1Y,
            paddle2Y: newPaddle2Y,
            score1: newScore1,
            score2: newScore2,
            isPlaying: false,
          };
        }

        // Render
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Draw center line
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.setLineDash([10, 10]);
        ctx.beginPath();
        ctx.moveTo(CANVAS_WIDTH / 2, 0);
        ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw paddles
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, newPaddle1Y, PADDLE_WIDTH, PADDLE_HEIGHT);
        ctx.fillRect(CANVAS_WIDTH - PADDLE_WIDTH, newPaddle2Y, PADDLE_WIDTH, PADDLE_HEIGHT);

        // Draw ball
        ctx.fillRect(newBallX, newBallY, BALL_SIZE, BALL_SIZE);

        // Draw scores
        ctx.font = '48px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(newScore1.toString(), CANVAS_WIDTH / 4, 60);
        ctx.fillText(newScore2.toString(), (CANVAS_WIDTH * 3) / 4, 60);

        return {
          ...prev,
          ballX: newBallX,
          ballY: newBallY,
          ballSpeedX: newBallSpeedX,
          ballSpeedY: newBallSpeedY,
          paddle1Y: newPaddle1Y,
          paddle2Y: newPaddle2Y,
          score1: newScore1,
          score2: newScore2,
        };
      });

      animationFrameId.current = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [gameState.isPlaying, gameState.isPaused, resetBall]);

  const getGameStatus = () => {
    if (!gameState.isPlaying && (gameState.score1 >= WINNING_SCORE || gameState.score2 >= WINNING_SCORE)) {
      return `Player ${gameState.score1 >= WINNING_SCORE ? '1' : '2'} Wins!`;
    }
    if (gameState.isPaused) {
      return 'Paused';
    }
    if (!gameState.isPlaying) {
      return 'Press Start to Play';
    }
    return 'Playing';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <Card className="p-6 space-y-4">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold mb-2">Pong Game</h2>
          <p className="text-muted-foreground">First to {WINNING_SCORE} points wins!</p>
        </div>

        <div className="flex justify-center items-center">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="border-2 border-primary rounded-lg"
          />
        </div>

        <div className="text-center">
          <p className="text-xl font-semibold mb-4">{getGameStatus()}</p>
          <div className="flex justify-center gap-4">
            {!gameState.isPlaying ? (
              <Button onClick={startGame} size="lg">
                {gameState.score1 >= WINNING_SCORE || gameState.score2 >= WINNING_SCORE
                  ? 'Play Again'
                  : 'Start Game'}
              </Button>
            ) : (
              <>
                <Button onClick={togglePause} variant="outline" size="lg">
                  {gameState.isPaused ? 'Resume' : 'Pause'}
                </Button>
                <Button onClick={resetGame} variant="outline" size="lg">
                  Reset
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground space-y-2">
          <p className="font-semibold">Controls:</p>
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <div>
              <p className="font-medium">Player 1 (Left)</p>
              <p>W - Move Up</p>
              <p>S - Move Down</p>
            </div>
            <div>
              <p className="font-medium">Player 2 (Right)</p>
              <p>↑ - Move Up</p>
              <p>↓ - Move Down</p>
            </div>
          </div>
          <p className="mt-2">Press SPACE to pause/resume during game</p>
        </div>
      </Card>
    </div>
  );
}
