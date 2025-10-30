import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';

// Styles extracted to reduce inline objects
const styles = {
  container: {
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
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
    color: 'white'
  },
  title: {
    fontSize: '48px',
    margin: '0 0 10px 0',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
  },
  subtitle: {
    fontSize: '18px',
    margin: '0',
    opacity: 0.9
  },
  stats: {
    display: 'flex',
    gap: '30px',
    marginBottom: '30px',
    fontSize: '24px',
    color: 'white',
    fontWeight: 'bold'
  },
  gameBoard: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '15px',
    padding: '20px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '20px',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
  },
  resetButton: {
    marginTop: '30px',
    padding: '12px 30px',
    fontSize: '18px',
    background: 'rgba(255, 255, 255, 0.2)',
    border: '2px solid white',
    borderRadius: '50px',
    cursor: 'pointer',
    fontWeight: 'bold',
    color: 'white',
    transition: 'all 0.3s ease'
  },
  startButton: {
    padding: '20px 40px',
    fontSize: '24px',
    background: 'white',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    fontWeight: 'bold',
    color: '#667eea',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    transition: 'all 0.3s ease'
  },
  modal: {
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
  },
  modalContent: {
    background: 'white',
    padding: '40px',
    borderRadius: '20px',
    textAlign: 'center',
    boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
  },
  modalTitle: {
    fontSize: '48px',
    margin: '0 0 20px 0',
    color: '#667eea'
  },
  modalText: {
    fontSize: '24px',
    margin: '0 0 30px 0',
    color: '#333'
  },
  modalButton: {
    padding: '15px 40px',
    fontSize: '20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    fontWeight: 'bold',
    color: 'white',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    transition: 'all 0.3s ease'
  }
};

// Memoized card component to prevent unnecessary re-renders
const Card = memo(({ id, symbol, isVisible, isMatched, onClick, onHover, onLeave }) => {
  const cardStyle = {
    width: '100px',
    height: '100px',
    background: isVisible ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white',
    borderRadius: '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '48px',
    cursor: isMatched ? 'default' : 'pointer',
    transform: 'scale(1)',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    userSelect: 'none',
    opacity: isMatched ? 0.6 : 1
  };

  return (
    <div
      key={id}
      onClick={onClick}
      style={cardStyle}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {isVisible ? symbol : <span style={{ color: 'red' }}>♦️</span>}
    </div>
  );
});

const MemoryGame = () => {
  const cardSymbols = useMemo(() => ['🚀', '🛸', '⭐', '🌙', '🪐', '☄️', '🌟', '🌌'], []);
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const initializeGame = useCallback(() => {
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
  }, [cardSymbols]);

  const handleCardClick = useCallback((index) => {
    if (!gameStarted || gameWon) return;
    if (flippedIndices.length === 2) return;
    if (flippedIndices.includes(index)) return;
    if (matchedPairs.includes(cards[index].symbol)) return;

    setFlippedIndices(prev => {
      const newFlippedIndices = [...prev, index];

      if (newFlippedIndices.length === 2) {
        setMoves(m => m + 1);
        const [firstIndex, secondIndex] = newFlippedIndices;

        if (cards[firstIndex].symbol === cards[secondIndex].symbol) {
          setMatchedPairs(prev => {
            const newMatchedPairs = [...prev, cards[firstIndex].symbol];
            if (newMatchedPairs.length === cardSymbols.length) {
              setTimeout(() => setGameWon(true), 500);
            }
            return newMatchedPairs;
          });
          return [];
        } else {
          setTimeout(() => setFlippedIndices([]), 1000);
        }
      }

      return newFlippedIndices;
    });
  }, [gameStarted, gameWon, cards, flippedIndices.length, matchedPairs, cardSymbols.length]);

  const isCardVisible = useCallback((index, symbol) => {
    return flippedIndices.includes(index) || matchedPairs.includes(symbol);
  }, [flippedIndices, matchedPairs]);

  const handleCardHover = useCallback((e, card) => {
    if (!matchedPairs.includes(card.symbol) && !isCardVisible(card.id, card.symbol)) {
      e.currentTarget.style.transform = 'scale(1.05)';
    }
  }, [matchedPairs, isCardVisible]);

  const handleCardLeave = useCallback((e) => {
    e.currentTarget.style.transform = 'scale(1)';
  }, []);

  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'auto';

    return () => {
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Memory Card Game</h1>
        <p style={styles.subtitle}>Match all the pairs to win!</p>
      </div>

      {gameStarted && (
        <div style={styles.stats}>
          <div>Moves: {moves}</div>
          <div>Matches: {matchedPairs.length}/{cardSymbols.length}</div>
        </div>
      )}

      {gameStarted ? (
        <div style={styles.gameBoard}>
          {cards.map((card) => (
            <Card
              key={card.id}
              {...card}
              isVisible={isCardVisible(card.id, card.symbol)}
              isMatched={matchedPairs.includes(card.symbol)}
              onClick={() => handleCardClick(card.id)}
              onHover={(e) => handleCardHover(e, card)}
              onLeave={handleCardLeave}
            />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={initializeGame}
            style={styles.startButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
            }}
          >
            Start Game
          </button>
        </div>
      )}

      {gameStarted && (
        <button
          onClick={initializeGame}
          style={styles.resetButton}
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
      )}

      {gameWon && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalTitle}>
              🎉 You Won! 🎉
            </h2>
            <p style={styles.modalText}>
              Completed in {moves} moves!
            </p>
            <button
              onClick={initializeGame}
              style={styles.modalButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
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