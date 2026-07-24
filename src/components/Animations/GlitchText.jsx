import React from 'react';

const GlitchText = ({ text, className = '', as: Component = 'span' }) => {
  return (
    <span className={`glitch-wrapper ${className}`}>
      <Component className="glitch-text font-bold" data-text={text}>
        {text}
      </Component>
    </span>
  );
};

export default GlitchText;
