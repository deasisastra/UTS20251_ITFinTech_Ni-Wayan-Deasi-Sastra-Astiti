import React from 'react';

const CountdownTimer = ({ seconds, className }) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return (
    <span className={className}>
      {minutes > 0 && `${minutes}:`}{remainingSeconds.toString().padStart(2, '0')}
    </span>
  );
};

export default CountdownTimer;