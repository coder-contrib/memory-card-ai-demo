import React from 'react';

const Settings = ({ cardBackColor, setCardBackColor, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '10px',
        width: '300px',
      }}>
        <h2 style={{ marginTop: 0 }}>Settings</h2>
        <div>
          <h3>Card Back Color</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setCardBackColor('blue')}
              style={{
                padding: '5px 15px',
                background: cardBackColor === 'blue' ? '#667eea' : '#e0e0e0',
                border: 'none',
                borderRadius: '5px',
                color: cardBackColor === 'blue' ? 'white' : 'black',
                cursor: 'pointer',
              }}
            >
              Blue
            </button>
            <button
              onClick={() => setCardBackColor('red')}
              style={{
                padding: '5px 15px',
                background: cardBackColor === 'red' ? '#c41e3a' : '#e0e0e0',
                border: 'none',
                borderRadius: '5px',
                color: cardBackColor === 'red' ? 'white' : 'black',
                cursor: 'pointer',
              }}
            >
              Red
            </button>
          </div>
        </div>
        <div style={{ marginTop: '20px' }}>
          <h3>Difficulty</h3>
          <p>Coming soon...</p>
        </div>
        <button
          onClick={onClose}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            background: '#667eea',
            border: 'none',
            borderRadius: '5px',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Settings;