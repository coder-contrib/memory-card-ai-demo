# Plan for Issue #980: Add a Countdown Timer

## Issue Summary
Add a countdown timer starting at 60 seconds. When the timer reaches 0, trigger a lose condition, notify the user they did not complete the game in time, and return to the start screen.

## Current State
The game (`src/App.jsx`) is a React-based memory card matching game with:
- `gameStarted` state to track if game is active
- `gameWon` state to show win modal
- `initializeGame()` function to reset/start the game
- Existing stats display showing moves and matches

## Implementation Plan

### Step 1: Add Timer State
Add a new state variable `timeRemaining` initialized to 60 seconds when the game starts.

```jsx
const [timeRemaining, setTimeRemaining] = useState(60);
```

### Step 2: Add Game Lost State
Add a new state variable `gameLost` to track the lose condition.

```jsx
const [gameLost, setGameLost] = useState(false);
```

### Step 3: Update `initializeGame()` Function
Reset the timer to 60 seconds and clear the `gameLost` state when starting/resetting the game.

### Step 4: Add Timer Effect
Create a `useEffect` hook that:
- Runs an interval every 1 second when `gameStarted` is true and `gameWon`/`gameLost` are false
- Decrements `timeRemaining` by 1 each second
- Triggers lose condition when `timeRemaining` reaches 0
- Cleans up the interval on unmount or when game ends

```jsx
useEffect(() => {
  if (!gameStarted || gameWon || gameLost) return;

  const timer = setInterval(() => {
    setTimeRemaining((prev) => {
      if (prev <= 1) {
        setGameLost(true);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(timer);
}, [gameStarted, gameWon, gameLost]);
```

### Step 5: Display Timer in Stats Section
Add the timer display next to existing stats (moves, matches).

```jsx
<div>Time: {timeRemaining}s</div>
```

### Step 6: Add Lose Modal
Create a modal similar to the win modal that:
- Displays when `gameLost` is true
- Shows a "Time's Up!" message
- Provides a button to return to the start screen (calls a function to reset `gameStarted` to false)

### Step 7: Update Card Click Handler
Prevent card clicks when `gameLost` is true (similar to `gameWon` check).

### Step 8: Add Return to Start Function
Create a function that resets all state to initial values and returns to the start screen:

```jsx
const returnToStart = () => {
  setCards([]);
  setFlippedIndices([]);
  setMatchedPairs([]);
  setMoves(0);
  setGameStarted(false);
  setGameWon(false);
  setGameLost(false);
  setTimeRemaining(60);
};
```

## Files to Modify
- `src/App.jsx` - All changes will be in this single file

## Testing Considerations
- Verify timer counts down correctly
- Verify timer stops when game is won
- Verify lose modal appears at 0 seconds
- Verify "Return to Start" button works correctly
- Verify timer resets on game restart
