import React from 'react';

/**
 * BorderBeam (Magic UI Inspired)
 * A laser/plasma beam running along the border of an element or container.
 */
export default function BorderBeam({
  size = 200,
  duration = 8,
  delay = 0,
  colorFrom = '#fbbf24',
  colorTo = '#ec4899',
  borderWidth = 1.5,
  className = '',
  style = {},
}) {
  return (
    <div
      aria-hidden="true"
      className={`border-beam-container ${className}`}
      style={{
        pointerEvents: 'none',
        position: 'absolute',
        inset: 0,
        borderRadius: 'inherit',
        border: `${borderWidth}px solid transparent`,
        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        maskComposite: 'exclude',
        WebkitMaskComposite: 'xor',
        padding: `${borderWidth}px`,
        overflow: 'hidden',
        zIndex: 3,
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          aspectRatio: '1/1',
          width: `${size}px`,
          backgroundImage: `radial-gradient(circle, ${colorFrom} 10%, ${colorTo} 50%, transparent 80%)`,
          animation: `borderBeamOrbit ${duration}s linear infinite`,
          animationDelay: `${delay}s`,
          transformOrigin: 'center center',
          offsetPath: 'rect(0 auto auto 0 round inherit)',
        }}
      />
    </div>
  );
}
