# Plan: Add Countdown Timer (Issue #980)

## Issue Summary
Add a 60-second countdown timer to the memory card game. When the timer reaches 0, the player loses and is returned to the start screen.

## Implementation Steps

### 1. Add Timer State
Add a new state variable `timeRemaining` initialized to 60 seconds when the game starts.

```jsx
const [timeRemaining, setTimeRemaining] = useState(60);
```

### 2. Add Game Lost State
Add a `gameLost` state to track when the player runs out of time.

```jsx
const [gameLost, setGameLost] = useState(false);
```

### 3. Update `initializeGame` Function
Reset the timer to 60 seconds and clear `gameLost` state when starting/restarting a game.

### 4. Add Timer Effect
Create a `useEffect` hook that:
- Runs only when `gameStarted` is true and `gameWon`/`gameLost` are false
- Decrements `timeRemaining` every second using `setInterval`
- When `timeRemaining` reaches 0, set `gameLost` to true
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

### 5. Update `handleCardClick` Function
Block card clicks when `gameLost` is true (similar to `gameWon` check).

### 6. Display Timer in Stats Section
Add the timer display next to existing "Moves" and "Matches" stats:

```jsx
<div>Time: {timeRemaining}s</div>
```

### 7. Add Lose Modal
Create a modal similar to the win modal that:
- Displays when `gameLost` is true
- Shows a "Time's Up!" message
- Provides a "Try Again" button that calls `initializeGame`

### 8. Return to Start Screen Option
The "Try Again" button resets `gameStarted` to false (returning to start screen) OR restarts the game directly. Based on the issue requirement ("return to start screen"), we should set `gameStarted` to false.

## Files to Modify
- `src/App.jsx` - All changes are contained in this single file

## Testing Considerations
- Verify timer starts at 60 when game begins
- Verify timer counts down correctly (1 second intervals)
- Verify timer stops when game is won
- Verify lose modal appears when timer hits 0
- Verify clicking "Try Again" returns to start screen
- Verify card clicks are disabled after time runs out
