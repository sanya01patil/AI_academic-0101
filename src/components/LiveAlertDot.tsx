import React from 'react';

export const LiveAlertDot: React.FC = () => {
  return (
    <div className="relative flex h-3 w-3">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
      <span className="relative inline-flex rounded-full h-3 w-3 bg-brand"></span>
    </div>
  );
};
