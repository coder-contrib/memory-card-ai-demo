# Plan: Add Countdown Timer (Issue #973)

## Issue Summary
Add a 60-second countdown timer to the memory card game. If the timer reaches 0, the player loses and is returned to the start screen with a notification.

## Current State
- `src/App.jsx` contains the entire game in a single `MemoryGame` component
- Game has states: `gameStarted`, `gameWon`, `moves`, `matchedPairs`, `flippedIndices`, `cards`
- Win detection already exists (displays modal when all pairs matched)
- No timer or lose detection currently exists

## Implementation Plan

### Step 1: Add Timer State
Add new state variables in `App.jsx`:
- `timeRemaining` - tracks seconds left (starts at 60)
- `gameLost` - boolean to track lose condition

### Step 2: Initialize Timer on Game Start
Modify `initializeGame()` function to:
- Set `timeRemaining` to 60
- Set `gameLost` to false

### Step 3: Create Timer Effect
Add a `useEffect` hook that:
- Runs an interval every 1 second when `gameStarted` is true and game is not won/lost
- Decrements `timeRemaining` by 1 each second
- Triggers lose condition when `timeRemaining` reaches 0
- Cleans up interval on unmount or when game ends

### Step 4: Display Timer in Stats Bar
Add timer display next to existing "Moves" and "Matches" stats:
- Show `Time: {timeRemaining}s`
- Consider visual warning (red color) when time is low (e.g., < 10 seconds)

### Step 5: Implement Lose Detection
When timer reaches 0:
- Set `gameLost` to true
- Stop the timer
- Prevent further card interactions

### Step 6: Create Lose Modal
Add a lose modal (similar to win modal) that:
- Displays "Time's Up!" message
- Shows how many matches were made
- Includes "Try Again" button that calls `initializeGame()`
- Returns user to start screen (or restarts game)

### Step 7: Update Card Click Handler
Modify `handleCardClick()` to also check `gameLost` state and prevent clicks when lost.

## Files to Modify
- `src/App.jsx` - All changes in this single file

## Estimated Changes
- ~50-70 lines of code additions/modifications
- No new dependencies required
