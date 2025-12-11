import React, { useState, useEffect } from 'react';
import './App.css';

const MemoryGame = () => {
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  // Card emojis for the game - using 80s themed icons
  const cardSymbols = ['🎮', '📼', '🕹️', '📺', '📟', '💾', '📻', '🪩'];

  // Initialize game
  const initializeGame = () => {
    const shuffledCards = [...cardSymbols, ...cardSymbols]
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
        if (matchedPairs.length + 1 === cardSymbols.length) {
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

  useEffect(() => {
    // Load VT323 font for 80s look
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=VT323&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'auto';

    // Cleanup
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className="grid-background" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(45deg, #0a0a1f, #1a1a3f)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: "'VT323', monospace",
      overflow: 'auto'
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '30px',
        color: 'var(--neon-blue)'
      }}>
        <h1 className="neon-text" style={{
          fontSize: '64px',
          margin: '0 0 10px 0',
          textShadow: '0 0 10px var(--neon-blue)'
        }}>
          R E T R O  M E M O R Y
        </h1>
        <p style={{
          fontSize: '22px',
          margin: '0',
          opacity: 0.9,
          color: 'var(--neon-pink)'
        }}>
          Match all the pairs to win!
        </p>
      </div>

      {/* Stats */}
      {gameStarted && (
        <div style={{
          display: 'flex',
          gap: '30px',
          marginBottom: '30px',
          fontSize: '28px',
          color: 'var(--neon-green)',
          fontWeight: 'bold',
          textShadow: '0 0 5px var(--neon-green)'
        }}>
          <div>Moves: {moves}</div>
          <div>Matches: {matchedPairs.length}/{cardSymbols.length}</div>
        </div>
      )}

      {/* Game Board */}
      {gameStarted ? (
        <div className="card" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '15px',
          padding: '20px',
          borderRadius: '20px',
          boxShadow: '0 0 20px var(--neon-purple)'
        }}>
          {cards.map((card, index) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(index)}
              style={{
                width: '100px',
                height: '100px',
                background: isCardVisible(index, card.symbol)
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(0, 0, 0, 0.5)',
                borderRadius: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                cursor: matchedPairs.includes(card.symbol) ? 'default' : 'pointer',
                transform: isCardVisible(index, card.symbol) ? 'rotateY(180deg)' : 'rotateY(0deg)',
                transition: 'all 0.5s ease',
                transformStyle: 'preserve-3d',
                boxShadow: isCardVisible(index, card.symbol)
                  ? '0 0 15px var(--neon-blue)'
                  : '0 0 10px var(--neon-purple)',
                border: isCardVisible(index, card.symbol)
                  ? '2px solid var(--neon-blue)'
                  : '2px solid var(--neon-purple)',
                userSelect: 'none',
                opacity: matchedPairs.includes(card.symbol) ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (!matchedPairs.includes(card.symbol) && !isCardVisible(index, card.symbol)) {
                  e.currentTarget.style.boxShadow = '0 0 20px var(--neon-pink)';
                  e.currentTarget.style.transform = 'scale(1.05) rotateY(0deg)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isCardVisible(index, card.symbol)) {
                  e.currentTarget.style.boxShadow = '0 0 10px var(--neon-purple)';
                  e.currentTarget.style.transform = 'scale(1) rotateY(0deg)';
                }
              }}
            >
              {isCardVisible(index, card.symbol) ? card.symbol : '?'}
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
              padding: '20px 40px',
              fontSize: '28px',
              background: 'transparent',
              border: '2px solid var(--neon-green)',
              borderRadius: '50px',
              cursor: 'pointer',
              fontWeight: 'bold',
              color: 'var(--neon-green)',
              boxShadow: '0 0 15px var(--neon-green)',
              textShadow: '0 0 5px var(--neon-green)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 0 25px var(--neon-green)';
              e.currentTarget.style.textShadow = '0 0 10px var(--neon-green)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 0 15px var(--neon-green)';
              e.currentTarget.style.textShadow = '0 0 5px var(--neon-green)';
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
            marginTop: '30px',
            padding: '12px 30px',
            fontSize: '22px',
            background: 'transparent',
            border: '2px solid var(--neon-yellow)',
            borderRadius: '50px',
            cursor: 'pointer',
            fontWeight: 'bold',
            color: 'var(--neon-yellow)',
            boxShadow: '0 0 10px var(--neon-yellow)',
            textShadow: '0 0 5px var(--neon-yellow)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--neon-yellow)';
            e.currentTarget.style.color = '#0a0a1f';
            e.currentTarget.style.textShadow = 'none';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--neon-yellow)';
            e.currentTarget.style.textShadow = '0 0 5px var(--neon-yellow)';
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
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(5px)'
        }}>
          <div className="card" style={{
            background: 'rgba(10, 10, 31, 0.8)',
            padding: '40px',
            borderRadius: '20px',
            textAlign: 'center',
            boxShadow: '0 0 30px var(--neon-pink)',
            border: '2px solid var(--neon-pink)'
          }}>
            <h2 className="neon-text" style={{
              fontSize: '48px',
              margin: '0 0 20px 0',
              color: 'var(--neon-pink)'
            }}>
              YOU WIN!
            </h2>
            <p style={{
              fontSize: '28px',
              margin: '0 0 30px 0',
              color: 'var(--neon-blue)'
            }}>
              Completed in {moves} moves!
            </p>
            <button
              onClick={initializeGame}
              style={{
                padding: '15px 40px',
                fontSize: '24px',
                background: 'transparent',
                border: '2px solid var(--neon-green)',
                borderRadius: '50px',
                cursor: 'pointer',
                fontWeight: 'bold',
                color: 'var(--neon-green)',
                boxShadow: '0 0 15px var(--neon-green)',
                textShadow: '0 0 5px var(--neon-green)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--neon-green)';
                e.currentTarget.style.color = '#0a0a1f';
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.textShadow = 'none';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--neon-green)';
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.textShadow = '0 0 5px var(--neon-green)';
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