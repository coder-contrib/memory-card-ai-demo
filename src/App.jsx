import React, { useState, useEffect } from 'react';

const MemoryGame = () => {
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameLost, setGameLost] = useState(false);
  const [bestScore, setBestScore] = useState(localStorage.getItem('bestScore') ? parseInt(localStorage.getItem('bestScore')) : Infinity);
  const [gamesPlayed, setGamesPlayed] = useState(localStorage.getItem('gamesPlayed') ? parseInt(localStorage.getItem('gamesPlayed')) : 0);
  const [selectedTheme, setSelectedTheme] = useState(localStorage.getItem('selectedTheme') || 'emoji');

  // Theme options
  const themes = {
    emoji: ['🚀', '🛸', '⭐', '🌙', '🪐', '☄️', '🌟', '🌌'],
    animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'],
    flags: ['🇺🇸', '🇬🇧', '🇫🇷', '🇩🇪', '🇯🇵', '🇧🇷', '🇨🇦', '🇦🇺'],
  };

  // Card symbols for the game
  const cardSymbols = themes[selectedTheme];

  // Get theme-specific styles
  const getThemeStyles = () => {
    switch(selectedTheme) {
      case 'animals':
        return {
          background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
          cardBack: '#e8f5e9'
        };
      case 'flags':
        return {
          background: 'linear-gradient(135deg, #3F51B5 0%, #1A237E 100%)',
          cardBack: '#e8eaf6'
        };
      default: // emoji
        return {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          cardBack: 'white'
        };
    }
  };

  const themeStyles = getThemeStyles();

  const handleThemeChange = (theme) => {
    setSelectedTheme(theme);
    localStorage.setItem('selectedTheme', theme);
  };

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
    setGameLost(false);
    setTimeLeft(60);
    const newGamesPlayed = gamesPlayed + 1;
    setGamesPlayed(newGamesPlayed);
    localStorage.setItem('gamesPlayed', newGamesPlayed.toString());
  };

  // Handle card click
  const handleCardClick = (index) => {
    if (!gameStarted || gameWon || gameLost) return;
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
          setTimeout(() => {
            // Update best score if current score is better
            if (moves + 1 < bestScore) {
              setBestScore(moves + 1);
              localStorage.setItem('bestScore', (moves + 1).toString());
            }
            setGameWon(true);
          }, 500);
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
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'auto';
  }, []);

  useEffect(() => {
    let timer;
    if (gameStarted && !gameWon && !gameLost && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setGameLost(true);
    }
    return () => clearInterval(timer);
  }, [gameStarted, gameWon, gameLost, timeLeft]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: themeStyles.background,
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

      {/* Stats */}
      {gameStarted && (
        <div style={{
          display: 'flex',
          gap: '30px',
          marginBottom: '30px',
          fontSize: '24px',
          color: 'white',
          fontWeight: 'bold'
        }}>
          <div>Moves: {moves}</div>
          <div>Matches: {matchedPairs.length}/{cardSymbols.length}</div>
          <div>Time Left: {timeLeft}s</div>
          {bestScore !== Infinity && <div>Best: {bestScore} moves</div>}
          <div>Games: {gamesPlayed}</div>
        </div>
      )}

      {/* Game Board */}
      {gameStarted ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '15px',
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
                width: '100px',
                height: '100px',
                background: isCardVisible(index, card.symbol)
                  ? themeStyles.background
                  : themeStyles.cardBack,
                borderRadius: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                cursor: matchedPairs.includes(card.symbol) ? 'default' : 'pointer',
                transform: isCardVisible(index, card.symbol) ? 'scale(1)' : 'scale(1)',
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
                            {isCardVisible(index, card.symbol) ? (
                card.symbol
              ) : (
                <span style={{ color: '#e74c3c', fontSize: '60px' }}>♦</span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          textAlign: 'center'
        }}>
          <div style={{
            marginBottom: '30px',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            alignItems: 'center'
          }}>
            <h2 style={{
              color: 'white',
              margin: '0',
              fontSize: '24px'
            }}>
              Select Theme
            </h2>
            <div style={{
              display: 'flex',
              gap: '15px'
            }}>
              {Object.keys(themes).map(theme => (
                <button
                  key={theme}
                  onClick={() => handleThemeChange(theme)}
                  style={{
                    padding: '15px 30px',
                    fontSize: '18px',
                    background: selectedTheme === theme ? 'white' : 'rgba(255, 255, 255, 0.2)',
                    border: '2px solid white',
                    borderRadius: '50px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    color: selectedTheme === theme ? '#667eea' : 'white',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedTheme !== theme) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedTheme !== theme) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                    }
                  }}
                >
                  {theme.charAt(0).toUpperCase() + theme.slice(1)}
                </button>
              ))}
            </div>
            <div style={{
              display: 'flex',
              gap: '10px',
              marginTop: '10px'
            }}>
              {themes[selectedTheme].map((symbol, index) => (
                <span key={index} style={{ fontSize: '24px' }}>{symbol}</span>
              ))}
            </div>
          </div>
          <button
            onClick={initializeGame}
            style={{
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
      )}

      {/* Time's Up Modal */}
      {gameLost && (
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
              color: '#e74c3c'
            }}>
              ⏰ Time's Up! ⏰
            </h2>
            <p style={{
              fontSize: '24px',
              margin: '0 0 30px 0',
              color: '#333'
            }}>
              Better luck next time!
            </p>
            <button
              onClick={() => {
                setGameStarted(false);
                setGameLost(false);
              }}
              style={{
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
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Return to Start
            </button>
          </div>
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
              margin: '0 0 30px 0',
              color: '#333'
            }}>
              Completed in {moves} moves!
              {moves === bestScore && (
                <span style={{
                  display: 'block',
                  color: '#e74c3c',
                  marginTop: '10px',
                  fontSize: '20px'
                }}>
                  🏆 New Best Score! 🏆
                </span>
              )}
            </p>
            <button
              onClick={() => {
                setGameStarted(false);
                setGameWon(false);
              }}
              style={{
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
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Return to Start
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryGame;