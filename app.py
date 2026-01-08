"""
Memory Card Game - Flask Application

A simple memory matching game built with Flask.
Migrated from React/Vite to Python/Flask.
"""

from flask import Flask, render_template, jsonify, session
import random
import os

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')

# Card emojis for the game
CARD_SYMBOLS = ['🚀', '🛸', '⭐', '🌙', '🪐', '☄️', '🌟', '🌌']


def create_shuffled_cards():
    """Create a shuffled deck of card pairs."""
    cards = []
    symbols = CARD_SYMBOLS * 2  # Create pairs
    random.shuffle(symbols)
    
    for index, symbol in enumerate(symbols):
        cards.append({
            'id': index,
            'symbol': symbol,
            'isFlipped': False,
            'isMatched': False
        })
    
    return cards


def initialize_game_state():
    """Initialize or reset the game state."""
    return {
        'cards': create_shuffled_cards(),
        'flippedIndices': [],
        'matchedPairs': [],
        'moves': 0,
        'gameStarted': True,
        'gameWon': False,
        'totalPairs': len(CARD_SYMBOLS)
    }


@app.route('/')
def index():
    """Render the main game page."""
    return render_template('index.html')


@app.route('/api/start', methods=['POST'])
def start_game():
    """Start a new game and return initial state."""
    session['game'] = initialize_game_state()
    return jsonify(session['game'])


@app.route('/api/state', methods=['GET'])
def get_state():
    """Get the current game state."""
    if 'game' not in session:
        return jsonify({'gameStarted': False})
    return jsonify(session['game'])


@app.route('/api/flip/<int:index>', methods=['POST'])
def flip_card(index):
    """Handle flipping a card."""
    if 'game' not in session:
        return jsonify({'error': 'Game not started'}), 400
    
    game = session['game']
    
    # Validation checks
    if not game['gameStarted'] or game['gameWon']:
        return jsonify(game)
    
    if len(game['flippedIndices']) >= 2:
        return jsonify(game)
    
    if index in game['flippedIndices']:
        return jsonify(game)
    
    card_symbol = game['cards'][index]['symbol']
    if card_symbol in game['matchedPairs']:
        return jsonify(game)
    
    # Flip the card
    game['flippedIndices'].append(index)
    
    # Check for match if two cards are flipped
    if len(game['flippedIndices']) == 2:
        game['moves'] += 1
        first_index, second_index = game['flippedIndices']
        first_symbol = game['cards'][first_index]['symbol']
        second_symbol = game['cards'][second_index]['symbol']
        
        if first_symbol == second_symbol:
            # Match found
            game['matchedPairs'].append(first_symbol)
            game['cards'][first_index]['isMatched'] = True
            game['cards'][second_index]['isMatched'] = True
            game['flippedIndices'] = []
            
            # Check for win
            if len(game['matchedPairs']) == game['totalPairs']:
                game['gameWon'] = True
    
    session['game'] = game
    session.modified = True
    return jsonify(game)


@app.route('/api/reset-flip', methods=['POST'])
def reset_flip():
    """Reset flipped cards (called after no-match timeout)."""
    if 'game' not in session:
        return jsonify({'error': 'Game not started'}), 400
    
    game = session['game']
    game['flippedIndices'] = []
    session['game'] = game
    session.modified = True
    return jsonify(game)


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', 'true').lower() == 'true'
    app.run(host='0.0.0.0', port=port, debug=debug)
