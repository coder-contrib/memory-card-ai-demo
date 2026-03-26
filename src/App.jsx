import React, { useState, useEffect } from 'react';

const MemoryGame = () => {
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [difficulty, setDifficulty] = useState(null); // 'easy', 'medium', 'hard'

  // Difficulty configurations
  const difficultyConfig = {
    easy: { grid: 4, pairs: 8, cardSize: 100, fontSize: 48, gap: 15 },
    medium: { grid: 6, pairs: 18, cardSize: 70, fontSize: 32, gap: 10 },
    hard: { grid: 8, pairs: 32, cardSize: 55, fontSize: 24, gap: 8 }
  };

  // Extended card symbols for larger grids
  const allSymbols = [
    '🚀', '🛸', '⭐', '🌙', '🪐', '☄️', '🌟', '🌌',
    '🎮', '🎯', '🎨', '🎭', '🎪', '🎢', '🎡', '🎠',
    '🦋', '🌸', '🌺', '🌻', '🌼', '🍀', '🌈', '⚡',
    '🔥', '💎', '🎵', '🎶', '❤️', '💜', '💙', '💚'
  ];

  // Get symbols based on difficulty
  const getSymbolsForDifficulty = (diff) => {
    const config = difficultyConfig[diff];
    return allSymbols.slice(0, config.pairs);
  };

  // Initialize game with selected difficulty
  const initializeGame = (selectedDifficulty) => {
    const diff = selectedDifficulty || difficulty;
    const symbols = getSymbolsForDifficulty(diff);

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
    if (selectedDifficulty) setDifficulty(selectedDifficulty);
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
        const newMatchedPairs = [...matchedPairs, cards[firstIndex].symbol];
        setMatchedPairs(newMatchedPairs);
        setFlippedIndices([]);

        // Check if game is won
        const totalPairs = difficultyConfig[difficulty].pairs;
        if (newMatchedPairs.length === totalPairs) {
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

  // Return to difficulty selection
  const changeDifficulty = () => {
    setGameStarted(false);
    setGameWon(false);
    setDifficulty(null);
  };

  // Get current config
  const currentConfig = difficulty ? difficultyConfig[difficulty] : null;

  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'auto';
  }, []);

  // Difficulty button component
  const DifficultyButton = ({ level, label, grid, pairs }) => (
    <button
      onClick={() => initializeGame(level)}
      style={{
        padding: '20px 30px',
        fontSize: '20px',
        background: 'white',
        border: 'none',
        borderRadius: '15px',
        cursor: 'pointer',
        fontWeight: 'bold',
        color: '#667eea',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        minWidth: '140px'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
      }}
    >
      <span style={{ fontSize: '24px' }}>{label}</span>
      <span style={{ fontSize: '14px', opacity: 0.7 }}>{grid}x{grid} grid</span>
      <span style={{ fontSize: '14px', opacity: 0.7 }}>{pairs} pairs</span>
    </button>
  );

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      overflow: 'auto'
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '30px',
        color: 'white'
      }}>
        <h1 style={{
          fontSize: '48px',
          margin: '0 0 10px 0',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          Memory Card Game
        </h1>
        <p style={{
          fontSize: '18px',
          margin: '0',
          opacity: 0.9
        }}>
          Match all the pairs to win!
        </p>
      </div>

      {/* Stats - show during gameplay */}
      {gameStarted && currentConfig && (
        <div style={{
          display: 'flex',
          gap: '30px',
          marginBottom: '30px',
          fontSize: '24px',
          color: 'white',
          fontWeight: 'bold',
          alignItems: 'center'
        }}>
          <div style={{
            padding: '8px 16px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '10px',
            textTransform: 'capitalize'
          }}>
            {difficulty}
          </div>
          <div>Moves: {moves}</div>
          <div>Matches: {matchedPairs.length}/{currentConfig.pairs}</div>
        </div>
      )}

      {/* Difficulty Selection */}
      {!gameStarted && !difficulty && (
        <div style={{
          textAlign: 'center'
        }}>
          <h2 style={{
            color: 'white',
            fontSize: '28px',
            marginBottom: '30px',
            fontWeight: 'normal'
          }}>
            Select Difficulty
          </h2>
          <div style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <DifficultyButton level="easy" label="Easy" grid={4} pairs={8} />
            <DifficultyButton level="medium" label="Medium" grid={6} pairs={18} />
            <DifficultyButton level="hard" label="Hard" grid={8} pairs={32} />
          </div>
        </div>
      )}

      {/* Game Board */}
      {gameStarted && currentConfig && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${currentConfig.grid}, 1fr)`,
          gap: `${currentConfig.gap}px`,
          padding: '20px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
        }}>
          {cards.map((card, index) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(index)}
              style={{
                width: `${currentConfig.cardSize}px`,
                height: `${currentConfig.cardSize}px`,
                background: isCardVisible(index, card.symbol)
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'white',
                borderRadius: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: `${currentConfig.fontSize}px`,
                cursor: matchedPairs.includes(card.symbol) ? 'default' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                userSelect: 'none',
                opacity: matchedPairs.includes(card.symbol) ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (!matchedPairs.includes(card.symbol) && !isCardVisible(index, card.symbol)) {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {isCardVisible(index, card.symbol) ? card.symbol : '?'}
            </div>
          ))}
        </div>
      )}

      {/* Game Controls */}
      {gameStarted && (
        <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
          <button
            onClick={() => initializeGame()}
            style={{
              padding: '12px 30px',
              fontSize: '18px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: '2px solid white',
              borderRadius: '50px',
              cursor: 'pointer',
              fontWeight: 'bold',
              color: 'white',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.color = '#667eea';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.color = 'white';
            }}
          >
            Reset Game
          </button>
          <button
            onClick={changeDifficulty}
            style={{
              padding: '12px 30px',
              fontSize: '18px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: '2px solid white',
              borderRadius: '50px',
              cursor: 'pointer',
              fontWeight: 'bold',
              color: 'white',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.color = '#667eea';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.color = 'white';
            }}
          >
            Change Difficulty
          </button>
        </div>
      )}

      {/* Win Modal */}
      {gameWon && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '20px',
            textAlign: 'center',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
          }}>
            <h2 style={{
              fontSize: '48px',
              margin: '0 0 20px 0',
              color: '#667eea'
            }}>
              🎉 You Won! 🎉
            </h2>
            <p style={{
              fontSize: '24px',
              margin: '0 0 10px 0',
              color: '#333'
            }}>
              Completed in {moves} moves!
            </p>
            <p style={{
              fontSize: '18px',
              margin: '0 0 30px 0',
              color: '#666',
              textTransform: 'capitalize'
            }}>
              Difficulty: {difficulty}
            </p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button
                onClick={() => initializeGame()}
                style={{
                  padding: '15px 30px',
                  fontSize: '18px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  color: 'white',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                Play Again
              </button>
              <button
                onClick={changeDifficulty}
                style={{
                  padding: '15px 30px',
                  fontSize: '18px',
                  background: 'white',
                  border: '2px solid #667eea',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  color: '#667eea',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                Change Difficulty
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryGame;
