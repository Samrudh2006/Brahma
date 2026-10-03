import React from 'react';

/**
 * ShimmerButton
 * Inspired by Magic UI & React Bits
 * Sweeping radiant shimmer border with spring physics click feedback
 */
export function ShimmerButton({
  children,
  onClick,
  disabled = false,
  shimmerColor = '#f5d77f',
  shimmerSize = '0.1em',
  borderRadius = '100px',
  shimmerDuration = '2.5s',
  background = 'rgba(14, 20, 32, 0.95)',
  className = '',
  style = {}
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`brahma-shimmer-btn ${className}`}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        padding: '0.75rem 1.75rem',
        borderRadius,
        background,
        border: '1px solid rgba(212, 175, 55, 0.28)',
        color: 'var(--text-primary, #f8f6f0)',
        fontSize: '0.95rem',
        fontWeight: 600,
        fontFamily: 'var(--font-sans, "Inter", sans-serif)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
        transition: 'transform 0.15s ease, box-shadow 0.2s ease, opacity 0.2s ease',
        opacity: disabled ? 0.6 : 1,
        ...style
      }}
      onMouseDown={(e) => {
        if (!disabled) e.currentTarget.style.transform = 'scale(0.97)';
      }}
      onMouseUp={(e) => {
        if (!disabled) e.currentTarget.style.transform = 'scale(1)';
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.borderColor = shimmerColor;
          e.currentTarget.style.boxShadow = `0 6px 24px -2px rgba(0, 0, 0, 0.6), 0 0 16px 0 ${shimmerColor}33`;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.28)';
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.4)';
          e.currentTarget.style.transform = 'scale(1)';
        }
      }}
    >
      {/* Sweeping Shimmer Beam */}
      <span
        style={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: `linear-gradient(90deg, transparent, ${shimmerColor}33, transparent)`,
          animation: `shimmerSweep ${shimmerDuration} infinite`,
          pointerEvents: 'none'
        }}
      />

      {/* Button Content */}
      <span style={{ position: 'relative', zIndex: 2, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
        {children}
      </span>
    </button>
  );
}
