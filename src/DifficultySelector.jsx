import React from 'react';

const DifficultySelector = ({ onSelectDifficulty }) => {
  const difficulties = [
    { name: 'Easy', gridSize: 4 },
    { name: 'Medium', gridSize: 6 },
    { name: 'Hard', gridSize: 8 },
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '15px',
      marginBottom: '30px',
    }}>
      <h2 style={{ color: 'white', fontSize: '24px', margin: '0' }}>Select Difficulty</h2>
      <div style={{ display: 'flex', gap: '15px' }}>
        {difficulties.map((difficulty) => (
          <button
            key={difficulty.name}
            onClick={() => onSelectDifficulty(difficulty.gridSize)}
            style={{
              padding: '12px 24px',
              fontSize: '18px',
              background: 'white',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              fontWeight: 'bold',
              color: '#667eea',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {difficulty.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DifficultySelector;