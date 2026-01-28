# Plan: Add Countdown Timer (Issue #5)

## Issue Summary
Add a 60-second countdown timer to the memory card game. If the timer reaches 0, the player loses and is returned to the start screen with a notification.

## Current State
- The game has a start screen with a "Start Game" button
- Game tracks `gameStarted`, `gameWon`, `moves`, and `matchedPairs` state
- Win detection exists via `gameWon` state with a modal overlay
- No timer or lose condition currently exists

## Implementation Plan

### Step 1: Add Timer State
Add new state variables in `App.jsx`:
- `timeRemaining` - tracks seconds left (starts at 60)
- `gameLost` - boolean to track lose condition

### Step 2: Create Timer Effect
Add a `useEffect` hook that:
- Runs only when `gameStarted` is true and `gameWon`/`gameLost` are false
- Decrements `timeRemaining` every second using `setInterval`
- When `timeRemaining` reaches 0, sets `gameLost` to true
- Cleans up interval on unmount or when game ends

### Step 3: Update `initializeGame` Function
Reset timer state when starting/restarting:
- Set `timeRemaining` to 60
- Set `gameLost` to false

### Step 4: Display Timer in Stats Section
Add timer display next to existing "Moves" and "Matches" stats:
- Show remaining seconds
- Consider visual warning (color change) when time is low (e.g., < 10 seconds)

### Step 5: Create Lose Modal
Add a modal similar to the win modal that:
- Displays when `gameLost` is true
- Shows "Time's Up!" message
- Has a "Try Again" button that calls `initializeGame`

### Step 6: Block Card Clicks on Lose
Update `handleCardClick` to return early if `gameLost` is true (similar to `gameWon` check).

## Files to Modify
- `src/App.jsx` - All changes are contained in this single file

## Estimated Changes
- ~30-40 lines of new code
- Minor modifications to 2-3 existing lines
