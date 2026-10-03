import React from 'react';

/**
 * GlowingBadge
 * Inspired by Hero UI & Base CN
 * Subtle status badge with luxury pulsating beacon
 */
export function GlowingBadge({
  children,
  variant = 'gold', // 'gold' | 'emerald' | 'crimson' | 'cyan'
  pulse = true,
  className = '',
  style = {}
}) {
  const colorMap = {
    gold: { text: '#f5d77f', bg: 'rgba(212, 175, 55, 0.12)', border: 'rgba(212, 175, 55, 0.3)', dot: '#f5d77f' },
    emerald: { text: '#2ecc71', bg: 'rgba(46, 204, 113, 0.12)', border: 'rgba(46, 204, 113, 0.3)', dot: '#2ecc71' },
    crimson: { text: '#e74c3c', bg: 'rgba(231, 76, 60, 0.12)', border: 'rgba(231, 76, 60, 0.3)', dot: '#e74c3c' },
    cyan: { text: '#00d2d3', bg: 'rgba(0, 210, 211, 0.12)', border: 'rgba(0, 210, 211, 0.3)', dot: '#00d2d3' }
  };

  const theme = colorMap[variant] || colorMap.gold;

  return (
    <span
      className={`brahma-glowing-badge ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '3px 10px',
        borderRadius: '99px',
        fontSize: '0.75rem',
        fontWeight: 600,
        letterSpacing: '0.03em',
        background: theme.bg,
        border: `1px solid ${theme.border}`,
        color: theme.text,
        ...style
      }}
    >
      {pulse && (
        <span style={{ position: 'relative', display: 'flex', height: '6px', width: '6px' }}>
          <span
            style={{
              position: 'absolute',
              height: '100%',
              width: '100%',
              borderRadius: '9999px',
              backgroundColor: theme.dot,
              opacity: 0.75,
              animation: 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }}
          />
          <span
            style={{
              position: 'relative',
              borderRadius: '9999px',
              height: '6px',
              width: '6px',
              backgroundColor: theme.dot
            }}
          />
        </span>
      )}
      {children}
    </span>
  );
}
