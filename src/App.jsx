import React, { useState, useEffect } from 'react';

// Theme definitions
const themes = {
  space: {
    name: 'Space',
    emojis: ['🚀', '🛸', '⭐', '🌙', '🪐', '☄️', '🌟', '🌌', '🌍', '🌠', '👨‍🚀', '🛰️', '🌎', '🌏', '🌑', '🌒',
             '🌓', '🌔', '🌕', '🌖', '🌗', '🌘', '☀️', '🌞', '🌚', '🌛', '🌜', '🌝', '⭐', '✨', '💫', '⚡']
  },
  animals: {
    name: 'Animals',
    emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔',
             '🦄', '🦒', '🦓', '🦊', '🦁', '🐯', '🐴', '🦝', '🦔', '🐿️', '🦎', '🐢', '🦕', '🦖', '🐉', '🐋']
  },
  food: {
    name: 'Food',
    emojis: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍒', '🍑', '🥝', '🍍', '🥥', '🥑', '🍆',
             '🥨', '🥐', '🧀', '🍖', '🍗', '🥩', '🥓', '🍔', '🍟', '🍕', '🌭', '🥪', '🌮', '🌯', '🍣', '🍡']
  },
  flags: {
    name: 'Flags',
    emojis: ['🏳️', '🏴', '🏁', '🚩', '🏳️‍🌈', '🏳️‍⚧️', '🇦🇫', '🇦🇽', '🇦🇱', '🇩🇿', '🇦🇸', '🇦🇩', '🇦🇴', '🇦🇮', '🇦🇶', '🇦🇬',
             '🇦🇷', '🇦🇲', '🇦🇼', '🇦🇺', '🇦🇹', '🇦🇿', '🇧🇸', '🇧🇭', '🇧🇩', '🇧🇧', '🇧🇾', '🇧🇪', '🇧🇿', '🇧🇯', '🇧🇲', '🇧🇹']
  }
};

const MemoryGame = () => {
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'space';
  });

  // Get card symbols based on theme and difficulty
  const getCardSymbols = () => {
    const themeEmojis = themes[theme].emojis;
    const count = Math.floor(themeEmojis.length / 2);
    return themeEmojis.slice(0, count);
  };
  // Initialize game
  const initializeGame = () => {
    const symbols = getCardSymbols();
    const shuffledCards = [...symbols, ...symbols]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({
        id: index,
        symbol,
        isFlipped: false,
        isMatched: false
      }));

    setCards(shuffledCards);
    setFlippedIndices([]);
    setMatchedPairs([]);
    setMoves(0);
    setGameStarted(true);
    setGameWon(false);
  };

  // Handle card click
  const handleCardClick = (index) => {
    if (!gameStarted || gameWon) return;
    if (flippedIndices.length === 2) return;
    if (flippedIndices.includes(index)) return;
    if (matchedPairs.includes(cards[index].symbol)) return;

    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);

    if (newFlippedIndices.length === 2) {
      setMoves(moves + 1);
      const [firstIndex, secondIndex] = newFlippedIndices;

      if (cards[firstIndex].symbol === cards[secondIndex].symbol) {
        // Match found
        setMatchedPairs([...matchedPairs, cards[firstIndex].symbol]);
        setFlippedIndices([]);

        // Check if game is won
        if (matchedPairs.length + 1 === getCardSymbols().length) {
          setTimeout(() => setGameWon(true), 500);
        }
      } else {
        // No match, flip back after delay
        setTimeout(() => {
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  // Check if card should be shown
  const isCardVisible = (index, symbol) => {
    return flippedIndices.includes(index) || matchedPairs.includes(symbol);
  };

  // Persist theme selection
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'auto';
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: '#F5F5F5',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      overflow: 'auto'
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '30px',
        color: '#3A3A3A'
      }}>
        <h1 style={{
          fontSize: '36px',
          fontWeight: '600',
          margin: '0 0 10px 0',
          letterSpacing: '-0.5px'
        }}>
          Memory Card Game
        </h1>
        <p style={{
          fontSize: '16px',
          margin: '0',
          opacity: 0.8
        }}>
          Match all the pairs to win!
        </p>
      </div>

      {/* Theme Selector */}
      {!gameStarted && (
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '20px'
        }}>
          {Object.entries(themes).map(([key, value]) => (
            <button
              key={key}
              onClick={() => setTheme(key)}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                background: theme === key ? '#4A90E2' : '#FFFFFF',
                border: '1px solid #4A90E2',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '500',
                color: theme === key ? '#FFFFFF' : '#4A90E2',
                transition: 'all 0.3s ease'
              }}
            >
              {value.name}
            </button>
          ))}
        </div>
      )}

      {/* Stats */}
      {gameStarted && (
        <div style={{
          display: 'flex',
          gap: '20px',
          marginBottom: '20px',
          fontSize: '16px',
          color: '#3A3A3A',
          fontWeight: '500'
        }}>
          <div>Moves: {moves}</div>
          <div>Matches: {matchedPairs.length}/{getCardSymbols().length}</div>
          <div>Theme: {themes[theme].name}</div>
        </div>
      )}

      {/* Game Board */}
      {gameStarted ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
          padding: '20px',
          background: '#FFFFFF',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          {cards.map((card, index) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(index)}
              style={{
                width: '80px',
                height: '80px',
                background: isCardVisible(index, card.symbol)
                  ? '#4A90E2'
                  : '#FFFFFF',
                border: '1px solid #E0E0E0',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                cursor: matchedPairs.includes(card.symbol) ? 'default' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: isCardVisible(index, card.symbol) ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none',
                userSelect: 'none',
                opacity: matchedPairs.includes(card.symbol) ? 0.6 : 1,
                transform: isCardVisible(index, card.symbol) ? 'rotateY(180deg)' : 'rotateY(0deg)'
              }}
              onMouseEnter={(e) => {
                if (!matchedPairs.includes(card.symbol) && !isCardVisible(index, card.symbol)) {
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(74, 144, 226, 0.2)';
                  e.currentTarget.style.borderColor = '#4A90E2';
                }
              }}
              onMouseLeave={(e) => {
                if (!matchedPairs.includes(card.symbol) && !isCardVisible(index, card.symbol)) {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = '#E0E0E0';
                }
              }}
            >
              {isCardVisible(index, card.symbol) ? card.symbol : ''}
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          textAlign: 'center'
        }}>
          <button
            onClick={initializeGame}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              background: '#4A90E2',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '500',
              color: '#FFFFFF',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#3A7BC8';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#4A90E2';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Start Game
          </button>
        </div>
      )}

      {/* Reset Button */}
      {gameStarted && (
        <button
          onClick={initializeGame}
          style={{
            marginTop: '20px',
            padding: '8px 16px',
            fontSize: '14px',
            background: '#FFFFFF',
            border: '1px solid #4A90E2',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500',
            color: '#4A90E2',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#4A90E2';
            e.currentTarget.style.color = '#FFFFFF';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#FFFFFF';
            e.currentTarget.style.color = '#4A90E2';
          }}
        >
          Reset Game
        </button>
      )}

      {/* Win Modal */}
      {gameWon && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#FFFFFF',
            padding: '40px',
            borderRadius: '8px',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              margin: '0 0 20px 0',
              color: '#3A3A3A'
            }}>
              Congratulations!
            </h2>
            <p style={{
              fontSize: '16px',
              margin: '0 0 30px 0',
              color: '#3A3A3A'
            }}>
              You won in {moves} moves!
            </p>
            <button
              onClick={initializeGame}
              style={{
                padding: '12px 24px',
                fontSize: '16px',
                background: '#4A90E2',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '500',
                color: '#FFFFFF',
                transition: 'all 0.3s ease'
              }}
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryGame;