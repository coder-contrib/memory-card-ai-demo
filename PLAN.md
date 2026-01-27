# Plan: Add Countdown Timer (Issue #5)

**Issue:** https://github.com/coder-contrib/memory-card-ai-demo/issues/5

## Requirements

- Add a countdown timer starting at 60 seconds
- If timer reaches 0, trigger lose detection
- Notify user they did not complete the game in time
- Return to start screen after losing

## Implementation Steps

### 1. Add Timer State
Add new state variables in `src/App.jsx`:
- `timeRemaining` - tracks seconds left (initialized to 60)
- `gameLost` - boolean to track lose condition

### 2. Create Timer Effect
Add a `useEffect` hook that:
- Starts an interval when `gameStarted` is true and game is not won/lost
- Decrements `timeRemaining` every second
- Triggers lose condition when `timeRemaining` reaches 0
- Clears interval on cleanup and when game ends

### 3. Handle Lose Condition
When timer reaches 0:
- Set `gameLost` to true
- Stop the timer
- Display lose modal

### 4. Update Game Reset
Modify `initializeGame` function to:
- Reset `timeRemaining` to 60
- Reset `gameLost` to false

### 5. Display Timer in Stats
Add timer display in the stats section (alongside Moves and Matches):
- Show remaining seconds
- Style to match existing stats

### 6. Create Lose Modal
Add a modal similar to the win modal that:
- Displays "Time's Up!" message
- Shows how many matches were completed
- Provides "Try Again" button that returns to start screen (calls `resetToStart`)

### 7. Add Reset to Start Function
Create `resetToStart` function that:
- Sets `gameStarted` to false
- Resets all game state
- Returns user to the initial start screen

## Files to Modify

- `src/App.jsx` - All changes are in this single file

## Estimated Changes

~50-70 lines of code additions/modifications
