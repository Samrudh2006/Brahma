import React, { useMemo } from 'react';

/**
 * Meteors Animation Component
 * Inspired by Aceternity UI & Eldora UI
 * Pure Vanilla CSS meteor trail animations falling across cards/hero backgrounds
 */
export function Meteors({ number = 20, color = '#f5d77f', className = '' }) {
  const meteors = useMemo(() => {
    return new Array(number).fill(true).map((_, idx) => ({
      id: idx,
      top: `${Math.floor(Math.random() * 100)}%`,
      left: `${Math.floor(Math.random() * 100)}%`,
      animationDelay: `${Math.random() * (0.8 - 0.2) + 0.2}s`,
      animationDuration: `${Math.floor(Math.random() * (10 - 2) + 2)}s`
    }));
  }, [number]);

  return (
    <div
      className={`brahma-meteors-container ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 1
      }}
    >
      {meteors.map((meteor) => (
        <span
          key={meteor.id}
          className="brahma-meteor"
          style={{
            position: 'absolute',
            top: meteor.top,
            left: meteor.left,
            height: '2px',
            width: '2px',
            borderRadius: '9999px',
            backgroundColor: color,
            boxShadow: `0 0 0 1px rgba(255, 255, 255, 0.1)`,
            transform: 'rotate(215deg)',
            animation: `meteorFall ${meteor.animationDuration} linear infinite`,
            animationDelay: meteor.animationDelay
          }}
        >
          {/* Meteor Tail */}
          <span
            style={{
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '60px',
              height: '1px',
              background: `linear-gradient(90deg, ${color}, transparent)`
            }}
          />
        </span>
      ))}
    </div>
  );
}
