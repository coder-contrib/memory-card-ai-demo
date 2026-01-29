# Plan: Add Countdown Timer (Issue #980)

## Issue Summary

Add a 60-second countdown timer to the memory card game. If the timer reaches 0, detect a loss, notify the user they did not complete the game in time, and return to the start screen.

## Current State

The game (`src/App.jsx`) currently has:
- `gameStarted` state to track if game is active
- `gameWon` state and win modal for victory detection
- `initializeGame()` function that resets state and starts the game
- Stats display showing moves and matches

## Implementation Plan

### Step 1: Add Timer State

Add a new state variable to track the remaining time:

```jsx
const [timeRemaining, setTimeRemaining] = useState(60);
const [gameLost, setGameLost] = useState(false);
```

### Step 2: Initialize Timer on Game Start

Modify `initializeGame()` to reset the timer and loss state:

```jsx
setTimeRemaining(60);
setGameLost(false);
```

### Step 3: Add Timer Effect

Create a `useEffect` hook that decrements the timer every second while the game is active and not won/lost:

```jsx
useEffect(() => {
  if (!gameStarted || gameWon || gameLost) return;

  if (timeRemaining <= 0) {
    setGameLost(true);
    return;
  }

  const interval = setInterval(() => {
    setTimeRemaining(prev => prev - 1);
  }, 1000);

  return () => clearInterval(interval);
}, [gameStarted, gameWon, gameLost, timeRemaining]);
```

### Step 4: Display Timer in Stats

Add timer display to the stats section next to moves and matches:

```jsx
<div>Time: {timeRemaining}s</div>
```

Consider adding visual urgency when time is low (e.g., red color when < 10 seconds).

### Step 5: Add Loss Modal

Create a loss modal similar to the win modal that:
- Displays a "Time's Up!" message
- Shows how many matches were completed
- Provides a "Try Again" button that calls `initializeGame()`

### Step 6: Block Card Interactions on Loss

Update `handleCardClick()` to also return early if `gameLost` is true:

```jsx
if (!gameStarted || gameWon || gameLost) return;
```

## Files to Modify

- `src/App.jsx` - All changes will be in this single file

## Testing Considerations

- Timer should start at 60 when game begins
- Timer should count down every second
- Timer should stop when game is won
- Timer should stop when time reaches 0
- Loss modal should appear when timer hits 0
- "Try Again" button should restart game with fresh 60-second timer
- Cards should not be clickable after time expires
