# Plan for Issue #980: Add a Countdown Timer

## Issue Summary

Add a 60-second countdown timer to the memory card game. When the timer reaches 0, display a "game over" notification and return to the start screen.

## Current State

The game (`src/App.jsx`) currently has:
- `gameStarted` state to track if the game is active
- `gameWon` state with a modal displayed when all pairs are matched
- `initializeGame()` function that resets all state and starts a new game
- Stats display showing moves and matches during gameplay

## Implementation Plan

### Step 1: Add Timer State

Add new state variables in `MemoryGame` component:
- `timeRemaining` (number): Initialize to 60 when game starts
- `gameLost` (boolean): Track if player ran out of time

### Step 2: Implement Timer Logic

Add a `useEffect` hook that:
- Runs an interval every 1 second when `gameStarted` is true and game is not won/lost
- Decrements `timeRemaining` by 1 each second
- Sets `gameLost` to true when `timeRemaining` reaches 0
- Cleans up the interval when game ends or component unmounts

### Step 3: Update `initializeGame()` Function

Reset the timer state when starting/resetting:
- Set `timeRemaining` to 60
- Set `gameLost` to false

### Step 4: Update `handleCardClick()` Function

Add check to prevent card clicks when `gameLost` is true (similar to existing `gameWon` check).

### Step 5: Display Timer in Stats Section

Add timer display next to existing "Moves" and "Matches" stats:
- Show as `Time: {timeRemaining}s`
- Style consistently with other stats

### Step 6: Add "Game Over" Modal

Create a modal similar to the existing "Win" modal:
- Trigger when `gameLost` is true
- Display message: "Time's Up!" or similar
- Show a "Try Again" button that calls `initializeGame()`
- Return user to start screen (set `gameStarted` to false, or let them restart immediately)

## Files to Modify

- `src/App.jsx` - All changes will be in this single file

## Acceptance Criteria

1. Timer starts at 60 seconds when game begins
2. Timer counts down every second during gameplay
3. Timer is visible in the stats area
4. When timer reaches 0:
   - Game stops (no more card interactions)
   - "Game Over" modal appears with appropriate message
   - User can start a new game from the modal
5. Timer resets to 60 on game restart
6. Timer pauses/stops when game is won (optional but good UX)
