import React from 'react';

const DifficultySelector = ({ onSelectDifficulty }) => {
  const difficulties = [
    { name: 'Easy', value: 'easy' },
    { name: 'Medium', value: 'medium' },
    { name: 'Hard', value: 'hard' },
  ];

  return (
    <div className="difficulty-selector">
      <h2>Select Difficulty</h2>
      <div className="difficulty-buttons">
        {difficulties.map((difficulty) => (
          <button
            key={difficulty.value}
            onClick={() => onSelectDifficulty(difficulty.value)}
          >
            {difficulty.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DifficultySelector;