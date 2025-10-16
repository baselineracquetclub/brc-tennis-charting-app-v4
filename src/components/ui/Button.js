
import React, { useState } from 'react';

export const Button = ({ children, onClick, className = '', active = false }) => {
  const [isPressed, setIsPressed] = useState(false);
  const pressed = isPressed || active;
  const cls = (className + ' ' + (pressed ? 'pressed' : '')).trim();

  return (
    <button
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onClick={onClick}
      className={cls + ' big-btn'}
    >
      {children}
    </button>
  );
};
