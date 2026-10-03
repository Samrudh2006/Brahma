import React, { useEffect, useState } from 'react';

/**
 * TextReveal
 * Inspired by Magic UI & Motion Prim
 * Character-by-character fluid progressive spring reveal for high-impact titles and stream responses
 */
export function TextReveal({
  text = '',
  speedMs = 25,
  delayMs = 0,
  className = '',
  style = {},
  onComplete
}) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let index = 0;
    setDisplayedText('');
    setIsComplete(false);

    const startTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (index < text.length) {
          setDisplayedText((prev) => prev + text.charAt(index));
          index++;
        } else {
          clearInterval(interval);
          setIsComplete(true);
          if (onComplete) onComplete();
        }
      }, speedMs);

      return () => clearInterval(interval);
    }, delayMs);

    return () => clearTimeout(startTimeout);
  }, [text, speedMs, delayMs]);

  return (
    <span
      className={`brahma-text-reveal ${className}`}
      style={{
        display: 'inline',
        fontFamily: 'inherit',
        ...style
      }}
    >
      {displayedText}
      {!isComplete && (
        <span
          style={{
            display: 'inline-block',
            width: '2px',
            height: '1em',
            verticalAlign: 'middle',
            marginLeft: '2px',
            background: 'var(--accent-gold, #d4af37)',
            animation: 'pulseGlow 0.8s infinite'
          }}
        />
      )}
    </span>
  );
}
