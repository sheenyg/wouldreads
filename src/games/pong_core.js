// pong_core.js
// Reusable logic-only Pong module.
// Example usage:
// import { Pong } from './pong_core.js';
// const game = new Pong(800, 500);
// let last = performance.now();
// function loop(t){
//   const dt = (t - last) / 1000; last = t;
//   // Collect input, e.g. from keyboard:
//   const input = { left: (keys['KeyW']?-1:0) + (keys['KeyS']?1:0), right: (keys['ArrowUp']?-1:0) + (keys['ArrowDown']?1:0) };
//   game.step(dt, input);
//   // Render using game.left, game.right, game.ball
//   requestAnimationFrame(loop);
// }
// requestAnimationFrame(loop);

export class Pong {
  /**
   * @param {number} w - Width of playfield.
   * @param {number} h - Height of playfield.
   */
  constructor(w = 800, h = 500) {
    this.w = w; this.h = h;
    this.left = { x: 30, y: h/2 - 60, w:16, h:120, score:0 };
    this.right = { x: w - 46, y: h/2 - 60, w:16, h:120, score:0 };
    this.ball = { x: w/2, y: h/2, r:10, vx:0, vy:0 };
    this.spawnBall();
  }
  /** Spawn ball at center with randomized angle. */
  spawnBall(direction = (Math.random() < 0.5 ? -1 : 1)) {
    const angle = (Math.random()*0.6 - 0.3); // ~ -17deg .. 17deg
    const speed = 360;
    this.ball.x = this.w/2;
    this.ball.y = this.h/2;
    this.ball.vx = Math.cos(angle)*speed*direction;
    this.ball.vy = Math.sin(angle)*speed;
  }
  /** Advance simulation.
   * @param {number} dt - Delta time in seconds.
   * @param {{left:number,right:number}} input - Paddle movement (-1 up, 1 down).
   */
  step(dt, input) {
    const speed = 400;
    this.left.y += (input.left||0)*speed*dt;
    this.right.y += (input.right||0)*speed*dt;
    for (const p of [this.left, this.right]) {
      if (p.y < 0) p.y = 0;
      if (p.y + p.h > this.h) p.y = this.h - p.h;
    }
    const b = this.ball;
    b.x += b.vx * dt; b.y += b.vy * dt;
    if (b.y < b.r) { b.y = b.r; b.vy *= -1; }
    if (b.y > this.h - b.r) { b.y = this.h - b.r; b.vy *= -1; }

    const collide = (p) => {
      if (b.x - b.r < p.x + p.w && b.x + b.r > p.x && b.y + b.r > p.y && b.y - b.r < p.y + p.h) {
        const rel = (b.y - (p.y + p.h/2)) / (p.h/2);
        const maxBounce = Math.PI/3; // 60deg
        const angle = rel * maxBounce;
        const speedNow = Math.min(Math.hypot(b.vx,b.vy)*1.05, 900);
        const dir = b.vx < 0 ? 1 : -1; // reverse horizontal direction
        b.vx = Math.cos(angle) * speedNow * dir;
        b.vy = Math.sin(angle) * speedNow;
        // Nudge outside to prevent sticking
        if (dir === 1) b.x = p.x + p.w + b.r; else b.x = p.x - b.r;
      }
    };
    collide(this.left); collide(this.right);

    if (b.x < -b.r) { this.right.score++; this.spawnBall(1); }
    if (b.x > this.w + b.r) { this.left.score++; this.spawnBall(-1); }
  }
}
