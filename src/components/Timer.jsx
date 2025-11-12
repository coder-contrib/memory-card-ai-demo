import React, { useState, useEffect } from 'react';

const Timer = ({ initialTime, onTimeout, isPaused }) => {
  const [time, setTime] = useState(initialTime);

  // Reset timer when game is reset
  useEffect(() => {
    setTime(initialTime);
  }, [initialTime]);

  useEffect(() => {
    if (!isPaused && time > 0) {
      const timer = setTimeout(() => setTime(time - 1), 1000);
      return () => clearTimeout(timer);
    } else if (time === 0) {
      onTimeout();
    }
  }, [time, onTimeout, isPaused]);

  return (
    <div className="timer" style={{ color: time <= 10 ? '#ff4444' : 'white' }}>
      Time: {time}s
    </div>
  );
};

export default Timer;