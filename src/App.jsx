import React, { useState, useEffect } from 'react';
import MemoryGame from './MemoryGame.jsx';
import ColorPicker from './ColorPicker.jsx';

const App = () => {
  const [page, setPage] = useState(window.location.hash === '#/color-picker' ? 'color-picker' : 'game');

  useEffect(() => {
    const handleHashChange = () => {
      setPage(window.location.hash === '#/color-picker' ? 'color-picker' : 'game');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <>
      {/* Navigation */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        display: 'flex',
        gap: '0',
        background: 'rgba(10, 10, 30, 0.95)',
        backdropFilter: 'blur(8px)',
        padding: '8px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }} aria-label="Main navigation">
        <a
          href="#/"
          onClick={() => setPage('game')}
          style={{
            padding: '8px 16px',
            fontSize: '14px',
            color: page === 'game' ? '#fff' : '#888',
            textDecoration: 'none',
            borderBottom: page === 'game' ? '2px solid #667eea' : '2px solid transparent',
            fontWeight: page === 'game' ? 600 : 400
          }}
          aria-current={page === 'game' ? 'page' : undefined}
        >
          Memory Game
        </a>
        <a
          href="#/color-picker"
          onClick={() => setPage('color-picker')}
          style={{
            padding: '8px 16px',
            fontSize: '14px',
            color: page === 'color-picker' ? '#fff' : '#888',
            textDecoration: 'none',
            borderBottom: page === 'color-picker' ? '2px solid #667eea' : '2px solid transparent',
            fontWeight: page === 'color-picker' ? 600 : 400
          }}
          aria-current={page === 'color-picker' ? 'page' : undefined}
        >
          Color Picker
        </a>
      </nav>

      {/* Page Content */}
      <div style={{ paddingTop: '44px' }}>
        {page === 'game' ? <MemoryGame /> : <ColorPicker />}
      </div>
    </>
  );
};

export default App;
