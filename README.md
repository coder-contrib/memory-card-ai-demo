Memory Card Game - AI Agent Workshop

A fun, interactive memory card matching game built with React. Perfect for learning how to work with AI coding agents through GitHub issues!
🎮 Game Features

    Match Pairs: Flip cards to find matching emoji pairs
    Move Counter: Track how many moves you take
    Win Detection: Celebration modal when you complete the game
    Responsive Design: Beautiful gradient UI that works on all screens
    Smooth Animations: Hover effects and transitions

🚀 Quick Start
Prerequisites

    Node.js (v14 or higher)
    npm or yarn
    Git

Installation

    Clone the repository:

bash

git clone https://github.com/yourusername/memory-card-game.git
cd memory-card-game

    Install dependencies:

bash

npm install

    Start the development server:

bash

npm run dev

    Open your browser to http://localhost:5173

Vite Configuration

For cloud development environments, update your vite.config.js:
javascript

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    strictPort: false,
    allowedHosts: 'all', // For development only!
  }
})

📁 Project Structure

memory-card-game/
├── src/
│   ├── App.jsx           # Main game component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles (optional)
├── public/
├── vite.config.js        # Vite configuration
├── package.json
└── README.md

🎯 Workshop Guide

This game is designed for workshops where participants use AI coding agents (like Coder, Cursor, or GitHub Copilot) to implement features via GitHub issues.
Workshop Structure (90 minutes)

Phase 1: Introduction (15 min)

    Demo the base game
    Explain the codebase structure
    Show how to run locally
    Introduce AI coding agents

Phase 2: Issue Assignment (10 min)

    Each participant (or team) gets 1-2 GitHub issues
    Issues range from easy to hard
    Explain acceptance criteria

Phase 3: Development (45 min)

    Participants use AI agents to implement features
    Workshop facilitators provide support
    Encourage experimentation

Phase 4: Demo & Merge (20 min)

    Each participant demos their feature
    Create pull requests
    Merge successful implementations
    Play the enhanced game together!

📝 GitHub Issues for Workshop

Below are ready-to-use GitHub issues categorized by difficulty. Copy these directly into your repository's Issues tab.
🟢 Easy Issues (5-15 minutes)
Issue #1: Add Timer

Description: Add a timer that shows how long the player has been playing.

Acceptance Criteria:

    Timer starts when game begins
    Timer displays in format "Time: XXs"
    Timer resets when "Reset Game" is clicked
    Timer stops when game is won

Hints: Use useState and useEffect with setInterval
Issue #2: Change Color Scheme

Description: Change the game's color scheme to a different gradient.

Acceptance Criteria:

    Replace current purple gradient with a new color scheme
    Update button colors to match
    Maintain good contrast and readability

Hints: Modify the background style properties
Issue #3: Add Card Flip Sound

Description: Play a sound effect when a card is flipped.

Acceptance Criteria:

    Sound plays when card is clicked
    Sound doesn't play for already matched cards
    Use a simple beep or click sound

Hints: Use HTML5 Audio API or embed audio files
Issue #4: Show Best Score

Description: Track and display the best score (lowest number of moves).

Acceptance Criteria:

    Display "Best: X moves" alongside current moves
    Best score persists across game resets
    Update only when player beats previous best

Hints: Use localStorage to persist the score
🟡 Medium Issues (15-30 minutes)
Issue #5: Add Difficulty Levels

Description: Add Easy (3x2), Medium (4x4), and Hard (6x4) difficulty options.

Acceptance Criteria:

    Buttons to select difficulty before starting
    Easy: 6 pairs, Medium: 8 pairs, Hard: 12 pairs
    Grid layout adjusts to fit cards
    Current difficulty is displayed

Hints: Modify cardSymbols array and grid CSS based on selection
Issue #6: Add Card Flip Animation

Description: Add a 3D flip animation when cards are clicked.

Acceptance Criteria:

    Cards should flip with a rotation animation
    Animation duration: ~300ms
    Use CSS transforms for smooth effect

Hints: Use CSS transform: rotateY() and transition
Issue #7: Add Theme Selector

Description: Allow players to choose between different emoji themes.

Acceptance Criteria:

    At least 3 themes: Space (current), Animals, Food
    Theme selector before game starts
    All cards update to match selected theme

Example Themes:

    Animals: 🐶🐱🐭🐹🐰🦊🐻🐼
    Food: 🍕🍔🍟🌭🍿🥐🥨🥯

Issue #8: Add Combo Counter

Description: Track consecutive matches and show a combo multiplier.

Acceptance Criteria:

    Display "Combo: X" when player makes consecutive matches
    Combo resets to 0 when player misses
    Show encouraging message for combos (3+, 5+)

🔴 Hard Issues (30-60 minutes)
Issue #9: Add Two-Player Mode

Description: Implement a turn-based two-player mode.

Acceptance Criteria:

    Option to start 1-player or 2-player game
    Display current player's turn
    Track each player's score separately
    Declare winner at end based on matches

Hints: Add player state, alternate turns, track matches per player
Issue #10: Add Leaderboard

Description: Create a leaderboard that saves top 5 scores.

Acceptance Criteria:

    Ask for player name when game is won
    Save score with name and timestamp
    Display top 5 scores in a modal
    Persist leaderboard using localStorage
    Button to view leaderboard

Issue #11: Add Power-Ups

Description: Add special power-up cards that provide advantages.

Acceptance Criteria:

    2 power-up cards hidden in the deck
    Peek: Reveals all cards for 2 seconds
    Hint: Highlights one matching pair
    Power-ups appear as different colored cards

Issue #12: Add Online Multiplayer

Description: Implement real-time multiplayer using WebSockets or Firebase.

Acceptance Criteria:

    Create/join game rooms
    Sync game state between players
    Show opponent's moves in real-time
    Handle disconnections gracefully

Note: This is a stretch goal for advanced participants
🎨 Customization Ideas

Beyond the issues above, participants can also explore:

    Add particle effects on match
    Implement card shuffle animation at start
    Add background music with mute toggle
    Create custom card designs with CSS
    Add achievements/badges system
    Implement undo last move feature
    Add statistics dashboard
    Create mobile touch gestures

🛠️ Development Commands
bash

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

📚 Learning Objectives

By working on this project, participants will learn:

    React Fundamentals: State management, hooks, component lifecycle
    Event Handling: Click events, timers, animations
    CSS Styling: Flexbox, Grid, gradients, transitions
    Data Structures: Arrays, objects, state manipulation
    Local Storage: Persisting data in the browser
    AI Collaboration: Working with AI coding assistants
    Git Workflow: Branching, PRs, code review

🤖 Tips for Using AI Agents

    Be Specific: Provide clear requirements and acceptance criteria
    Test Incrementally: Run the code after each change
    Ask Questions: If you don't understand the AI's code, ask for explanation
    Iterate: It's okay to refine the prompt if first attempt isn't perfect
    Review Code: Always review AI-generated code before committing

🐛 Troubleshooting
Game doesn't start

    Check browser console for errors
    Ensure all dependencies are installed: npm install
    Try clearing browser cache

Cards don't flip

    Check if handleCardClick function is being called
    Verify state is updating correctly with React DevTools

Styling looks broken

    Ensure inline styles are correctly applied
    Check for CSS conflicts
    Try hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

📄 License

MIT License - Feel free to use for your workshops and modify as needed!
🙏 Acknowledgments

Created for developer workshops focusing on AI-assisted coding with tools like Coder, Cursor, and GitHub Copilot.
Workshop Facilitator Notes
Pre-Workshop Setup

    Create repository with base game code
    Create all GitHub issues in advance
    Test the game thoroughly
    Prepare demo environment
    Have backup solutions ready

During Workshop

    Start with easier issues to build confidence
    Encourage collaboration between participants
    Have a working version ready for each issue
    Celebrate successful implementations
    Be ready to debug common issues

Post-Workshop

    Collect feedback from participants
    Share final enhanced game
    Provide resources for continued learning
    Encourage participants to add their own features

Suggested Issue Distribution

    2-3 easy issues per person (warm-up)
    1 medium issue per person (main challenge)
    1 hard issue per team (optional stretch goal)

Happy coding! 🚀
