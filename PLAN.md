# Plan: Add Countdown Timer (Issue #980)

## Issue Summary
Add a 60-second countdown timer to the memory card game. If the timer reaches 0, show a lose notification and return to the start screen.

## Implementation Steps

### 1. Add Timer State
Add new state variables in `src/App.jsx`:
- `timeRemaining` - integer starting at 60
- `gameLost` - boolean for lose condition

### 2. Create Timer Effect
Add a `useEffect` hook that:
- Runs an interval every 1 second when `gameStarted` is true and game is not won/lost
- Decrements `timeRemaining` by 1 each second
- When `timeRemaining` reaches 0, sets `gameLost` to true
- Cleans up the interval on unmount or when game ends

### 3. Update `initializeGame` Function
Reset timer state when starting/restarting:
- Set `timeRemaining` back to 60
- Set `gameLost` to false

### 4. Display Timer in Stats Section
Add timer display next to existing "Moves" and "Matches" stats:
- Show remaining seconds (e.g., "Time: 45s")
- Consider visual warning when time is low (e.g., red text under 10 seconds)

### 5. Create Lose Modal
Add a modal similar to the existing win modal that:
- Displays when `gameLost` is true
- Shows "Time's Up!" message
- Has a "Try Again" button that calls `initializeGame`

### 6. Block Card Clicks on Lose
Update `handleCardClick` to also return early if `gameLost` is true.

## Files to Modify
- `src/App.jsx` - All changes will be in this single file

## Estimated Code Changes
- ~5 lines: New state variables
- ~15 lines: Timer useEffect hook
- ~3 lines: initializeGame updates
- ~5 lines: Timer display in stats
- ~40 lines: Lose modal component
- ~1 line: handleCardClick guard

Total: ~70 lines of new/modified code
