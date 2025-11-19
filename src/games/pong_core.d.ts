// pong_core.d.ts
// TypeScript definitions for pong_core.js

/**
 * Paddle or ball position and state
 */
export interface PongPaddle {
  x: number;
  y: number;
  w: number;
  h: number;
  score: number;
}

export interface PongBall {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
}

export interface PongInput {
  left?: number;
  right?: number;
}

/**
 * Reusable logic-only Pong game class.
 * Handles game state, physics, collision detection, and scoring.
 */
export class Pong {
  /** Width of playfield */
  w: number;
  /** Height of playfield */
  h: number;
  /** Left paddle state */
  left: PongPaddle;
  /** Right paddle state */
  right: PongPaddle;
  /** Ball state */
  ball: PongBall;

  /**
   * Create a new Pong game instance
   * @param w - Width of playfield (default: 800)
   * @param h - Height of playfield (default: 500)
   */
  constructor(w?: number, h?: number);

  /**
   * Spawn ball at center with randomized angle
   * @param direction - Initial horizontal direction (-1 for left, 1 for right)
   */
  spawnBall(direction?: number): void;

  /**
   * Advance simulation by one time step
   * @param dt - Delta time in seconds
   * @param input - Paddle movement input (-1 up, 0 none, 1 down)
   */
  step(dt: number, input: PongInput): void;
}
