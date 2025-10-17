import React, { useEffect, useState } from 'react';

const Button = ({ label, onClick, resetTrigger }) => {
  const [active, setActive] = useState(false);

  const handleClick = () => {
    setActive(true);
    onClick(label);
  };

  // Reset button highlight when resetTrigger changes
  useEffect(() => {
    setActive(false);
  }, [resetTrigger]);

  return (
    <Button
      onClick={handleClick}
      style={{
        backgroundColor: active ? '#004d00' : '#007BFF',
        color: '#fff',
        border: active ? '2px solid #00FF00' : '2px solid transparent',
        padding: '12px 20px',
        borderRadius: '8px',
        fontSize: '15px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
    >
      {label}
    </button>
  );
};

export default Button;
