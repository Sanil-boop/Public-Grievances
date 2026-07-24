import React, { useState } from 'react';
import { motion } from 'framer-motion';

const RedactedText = ({ text, className = '' }) => {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <motion.span
      className={`redacted inline-block rounded-sm ${isRevealed ? '!bg-transparent !text-accent-primary' : ''} ${className}`}
      onHoverStart={() => setIsRevealed(true)}
      onHoverEnd={() => setIsRevealed(false)}
      onClick={() => setIsRevealed(!isRevealed)}
    >
      {text}
    </motion.span>
  );
};

export default RedactedText;
