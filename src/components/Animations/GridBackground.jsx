import React from 'react';

const GridBackground = ({ children }) => {
  return (
    <div className="ufo-grid-bg min-h-screen w-full">
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default GridBackground;
