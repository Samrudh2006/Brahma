import React, { useRef, useState } from 'react';

/**
 * CardTilt3D
 * Inspired by React Bits & Aceternity UI
 * Interactive 3D mouse parallax tilt with dynamic specular glare reflection
 */
export function CardTilt3D({
  children,
  tiltMaxAngleX = 12,
  tiltMaxAngleY = 12,
  perspective = 1000,
  glare = true,
  className = '',
  style = {}
}) {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -tiltMaxAngleX;
    const rY = ((x - centerX) / centerX) * tiltMaxAngleY;

    setRotateX(rX);
    setRotateY(rY);

    if (glare) {
      setGlarePos({
        x: (x / rect.width) * 100,
        y: (y / rect.height) * 100,
        opacity: 0.25
      });
    }
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePos({ x: 50, y: 50, opacity: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`brahma-3d-tilt-card ${className}`}
      style={{
        position: 'relative',
        transformStyle: 'preserve-3d',
        transform: `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: 'transform 0.15s ease-out',
        borderRadius: '16px',
        overflow: 'hidden',
        ...style
      }}
    >
      {/* Specular Glare Overlay */}
      {glare && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 10,
            borderRadius: 'inherit',
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.45) 0%, transparent 60%)`,
            opacity: glarePos.opacity,
            transition: 'opacity 0.25s ease'
          }}
        />
      )}

      {children}
    </div>
  );
}
