import React from 'react';

const ThemeSelector = ({ currentTheme, onThemeChange }) => {
  const themes = [
    { name: 'Space', emoji: '🚀' },
    { name: 'Animals', emoji: '🦁' },
    { name: 'Food', emoji: '🍕' },
  ];

  return (
    <div style={{
      display: 'flex',
      gap: '10px',
      marginBottom: '20px',
    }}>
      {themes.map((theme) => (
        <button
          key={theme.name}
          onClick={() => onThemeChange(theme.name)}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            background: currentTheme === theme.name ? '#764ba2' : 'white',
            color: currentTheme === theme.name ? 'white' : '#667eea',
            border: 'none',
            borderRadius: '25px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
          }}
        >
          {theme.emoji} {theme.name}
        </button>
      ))}
    </div>
  );
};

export default ThemeSelector;