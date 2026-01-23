# Implementation Plan: Add Countdown Timer (Issue #5)

## Issue Summary
Add a 60-second countdown timer to the memory card game. When the timer reaches 0, the user loses, is notified, and returns to the start screen.

## Current State Analysis
The game is implemented in `src/App.jsx` as a single component with the following existing state:
- `gameStarted` - tracks whether game is active
- `gameWon` - tracks win condition
- `moves` - tracks number of moves
- `matchedPairs` - tracks matched card pairs

## Implementation Steps

### 1. Add Timer State
Add new state variables in `App.jsx`:
- `timeRemaining` (number) - countdown from 60
- `gameLost` (boolean) - tracks lose condition

### 2. Implement Timer Logic
Add a `useEffect` hook that:
- Starts a 1-second interval when `gameStarted` is true and `!gameWon` and `!gameLost`
- Decrements `timeRemaining` each second
- Sets `gameLost = true` when `timeRemaining` reaches 0
- Clears interval on cleanup or when game ends

### 3. Update `initializeGame` Function
Reset timer state when game starts:
- Set `timeRemaining` to 60
- Set `gameLost` to false

### 4. Display Timer in Stats Section
Add timer display next to existing "Moves" and "Matches" stats:
- Show remaining seconds (e.g., "Time: 45s")
- Consider visual warning when time is low (e.g., red color under 10 seconds)

### 5. Block Gameplay When Time Expires
Update `handleCardClick` to also check `gameLost`:
- Return early if `gameLost` is true (same pattern as `gameWon`)

### 6. Create Lose Modal
Add a modal similar to the existing win modal:
- Display "Time's Up!" message
- Show how many matches were made before losing
- Include "Try Again" button that calls `initializeGame`

## Files to Modify
- `src/App.jsx` - All changes in this single file

## Estimated Code Changes
- ~5 lines: New state declarations
- ~15 lines: Timer useEffect hook
- ~3 lines: initializeGame updates
- ~5 lines: Timer display in stats
- ~1 line: handleCardClick guard
- ~40 lines: Lose modal component

## Testing Considerations
- Timer should start only when game starts (not on initial load)
- Timer should stop when game is won
- Timer should stop when game is lost
- Reset button should restart timer to 60
- Timer should be visible and accurate
