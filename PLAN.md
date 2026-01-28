# Plan for Issue #980: Add a Countdown Timer

## Issue Summary
Add a 60-second countdown timer to the memory card game. When the timer reaches 0, the player loses and is returned to the start screen with a notification.

## Current State
The game (`src/App.jsx`) has:
- `gameStarted` state to track if game is active
- `gameWon` state and modal for win detection
- `initializeGame()` function that resets all state and sets `gameStarted` to true
- Stats display showing moves and matches during gameplay

## Implementation Steps

### 1. Add Timer State
Add new state variable in the `MemoryGame` component:
```jsx
const [timeRemaining, setTimeRemaining] = useState(60);
const [gameLost, setGameLost] = useState(false);
```

### 2. Reset Timer in `initializeGame()`
Modify `initializeGame()` to reset timer state:
- Set `timeRemaining` to 60
- Set `gameLost` to false

### 3. Add Timer Effect
Create a `useEffect` hook to handle the countdown:
- Run only when `gameStarted` is true and `gameWon`/`gameLost` are false
- Decrement `timeRemaining` every second using `setInterval`
- When `timeRemaining` reaches 0, set `gameLost` to true
- Clean up interval on unmount or when dependencies change

### 4. Block Card Clicks on Loss
Update `handleCardClick()` to return early if `gameLost` is true (similar to existing `gameWon` check).

### 5. Display Timer in Stats Section
Add the timer display alongside existing "Moves" and "Matches" stats:
```jsx
<div>Time: {timeRemaining}s</div>
```

### 6. Add Lose Modal
Create a modal similar to the win modal that displays:
- "Time's Up!" message
- Option to play again (calls `initializeGame()`)

The modal should appear when `gameLost` is true and overlay the game board.

## Files to Modify
- `src/App.jsx` - All changes are contained in this single file

## Acceptance Criteria
- Timer starts at 60 seconds when game begins
- Timer counts down every second during gameplay
- Timer stops when player wins (all pairs matched)
- When timer reaches 0:
  - Game ends immediately
  - Lose modal appears with notification
  - Player can click to return to start screen / play again
- Timer resets to 60 when starting a new game
