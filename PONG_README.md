# Pong Game

A classic Pong game implementation using vanilla JavaScript and HTML5 Canvas.

## How to Play

1. Open `pong.html` in your web browser
2. Click the "Start Game" button to begin
3. First player to reach 10 points wins!

## Controls

### Player 1 (Left Paddle - Green)
- **W** - Move paddle up
- **S** - Move paddle down

### Player 2 (Right Paddle - Red)
- **↑ (Arrow Up)** - Move paddle up
- **↓ (Arrow Down)** - Move paddle down

## Game Features

- **Two-player gameplay**: Compete against a friend on the same keyboard
- **Score tracking**: Real-time score display for both players
- **Collision detection**: Smooth physics for ball-paddle and ball-wall collisions
- **Progressive difficulty**: Ball speed increases slightly with each paddle hit
- **Win condition**: First player to 10 points wins
- **Game restart**: Easy reset after a game ends
- **Responsive design**: Adapts to different screen sizes

## Technical Details

- Built with vanilla JavaScript (no frameworks)
- HTML5 Canvas for rendering
- Smooth 60 FPS animations using `requestAnimationFrame`
- Clean, commented code for easy understanding and modification

## Game Mechanics

- **Ball Physics**: The ball bounces off the top and bottom walls, and off both paddles
- **Speed Increase**: Each time the ball hits a paddle, its speed increases by 0.5 units
- **Angle Variation**: The ball's angle changes based on where it hits the paddle, adding strategy to gameplay
- **Random Start**: The ball starts in a random direction at the beginning and after each point

## Customization

You can easily customize the game by modifying the constants in `pong.js`:

```javascript
const WINNING_SCORE = 10;        // Points needed to win
const PADDLE_SPEED = 6;          // How fast paddles move
const INITIAL_BALL_SPEED = 5;    // Starting ball speed
const SPEED_INCREASE = 0.5;      // Speed increase per paddle hit
```

## Browser Compatibility

This game works in all modern browsers that support HTML5 Canvas:
- Chrome
- Firefox
- Safari
- Edge
- Opera

## Files

- `pong.html` - Game structure and layout
- `pong.js` - Game logic and mechanics
- `pong.css` - Styling and visual design
- `PONG_README.md` - This file

Enjoy the game! 🏓
