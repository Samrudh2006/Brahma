import React, { useRef, useState } from 'react';

/**
 * SpotlightCard (Aceternity UI + React Bits Inspired)
 * Gives cards a dynamic radial spotlight beam that tracks mouse cursor movements
 * and applies a subtle 3D tilt perspective.
 */
export default function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(251, 191, 36, 0.18)',
  borderColor = 'rgba(251, 191, 36, 0.3)',
  style = {},
  onClick,
  ...props
}) {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const [transform, setTransform] = useState('');

  const handleMouseMove = (e) => {
    if (!divRef.current) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPosition({ x, y });

    // Subtle 3D tilt calculation
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4; // Max 4deg tilt
    const rotateY = ((x - centerX) / centerX) * 4;

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`);
  };

  const handleFocus = () => {
    setOpacity(1);
  };

  const handleBlur = () => {
    setOpacity(0);
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)');
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)');
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`spotlight-card ${className}`}
      style={{
        position: 'relative',
        borderRadius: '16px',
        border: `1px solid ${borderColor}`,
        background: 'rgba(10, 14, 23, 0.65)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        overflow: 'hidden',
        transition: 'transform 0.15s ease-out, border-color 0.3s ease, box-shadow 0.3s ease',
        transform: transform || 'none',
        ...style,
      }}
      {...props}
    >
      {/* Spotlight Radial Beam */}
      <div
        aria-hidden="true"
        style={{
          pointerEvents: 'none',
          position: 'absolute',
          inset: 0,
          opacity,
          transition: 'opacity 0.25s ease',
          background: `radial-gradient(450px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 70%)`,
          zIndex: 1,
        }}
      />
      
      {/* Content wrapper */}
      <div style={{ position: 'relative', zIndex: 2, height: '100%' }}>
        {children}
      </div>
    </div>
  );
}
