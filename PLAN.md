# Plan: Add Countdown Timer (Issue #980)

## Summary

Add a 60-second countdown timer to the memory card game. When the timer reaches 0, display a "Game Over" notification and return the user to the start screen.

## Requirements (from issue)

1. Start a countdown timer at 60 seconds when the game begins
2. Display the timer visibly during gameplay
3. When timer reaches 0:
   - Trigger lose detection
   - Notify the user they did not complete the game in time
   - Return to the start screen

## Implementation Steps

### Step 1: Add Timer State
Add a new state variable `timeRemaining` initialized to 60 seconds in `App.jsx`.

```jsx
const [timeRemaining, setTimeRemaining] = useState(60);
```

### Step 2: Add Game Lost State
Add a new state variable `gameLost` to track when the player loses due to timeout.

```jsx
const [gameLost, setGameLost] = useState(false);
```

### Step 3: Create Timer Effect
Add a `useEffect` hook that:
- Runs when `gameStarted` is true and `gameWon` is false
- Decrements `timeRemaining` every second using `setInterval`
- Clears the interval when the game ends (win or lose)
- Sets `gameLost` to true when `timeRemaining` reaches 0

### Step 4: Update `initializeGame` Function
Reset the timer state when starting/restarting the game:
- Set `timeRemaining` back to 60
- Set `gameLost` to false

### Step 5: Display Timer in Stats Section
Add the timer display next to the existing "Moves" and "Matches" stats:

```jsx
<div>Time: {timeRemaining}s</div>
```

Consider styling the timer red when time is running low (e.g., under 10 seconds).

### Step 6: Create "Game Over" Modal
Create a modal similar to the existing "Win Modal" that:
- Displays when `gameLost` is true
- Shows a "Time's Up!" or "Game Over" message
- Includes a button to return to the start screen (calls a function that sets `gameStarted` to false)

### Step 7: Block Card Clicks When Game Lost
Update `handleCardClick` to return early if `gameLost` is true, preventing interaction after timeout.

## Files to Modify

- `src/App.jsx` - All changes will be in this single file

## Testing Considerations

- Verify timer starts at 60 and counts down each second
- Verify timer stops when game is won
- Verify "Game Over" modal appears at 0 seconds
- Verify clicking "Return to Start" properly resets state
- Verify cards cannot be clicked after time expires

---

**Waiting for feedback before implementation.**
