import React from 'react';

/**
 * ShimmerText (Magic UI + Aceternity Inspired)
 * Elegant shimmering light beam that sweeps across text.
 */
export default function ShimmerText({
  children,
  className = '',
  shimmerColor = '#fef08a',
  textColor = '#f8fafc',
  fontSize = '1rem',
  duration = '4s',
  style = {},
  ...props
}) {
  return (
    <span
      className={`shimmer-text ${className}`}
      style={{
        display: 'inline-block',
        fontSize,
        fontWeight: 700,
        letterSpacing: '0.08em',
        background: `linear-gradient(90deg, ${textColor} 0%, ${textColor} 40%, ${shimmerColor} 50%, ${textColor} 60%, ${textColor} 100%)`,
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        animation: `shimmerTextAnimation ${duration} infinite linear`,
        ...style,
      }}
      {...props}
    >
      {children}
    </span>
  );
}
