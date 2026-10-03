import React from 'react';

/**
 * AnimatedVoiceWaveform
 * Inspired by Cult UI & Motion Prim
 * Live sound-reactive acoustic waveform visualizer for VoxCPM telephony & deity audio feedback
 */
export function AnimatedVoiceWaveform({
  isActive = true,
  barCount = 16,
  color = '#f5d77f',
  height = 36,
  className = '',
  style = {}
}) {
  const bars = Array.from({ length: barCount }, (_, i) => i);

  return (
    <div
      className={`brahma-voice-waveform ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '3px',
        height: `${height}px`,
        padding: '0 8px',
        background: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '20px',
        border: '1px solid rgba(212, 175, 55, 0.2)',
        ...style
      }}
    >
      {bars.map((barIndex) => {
        // Natural sine-wave staggered height animation
        const delay = (barIndex * 0.08).toFixed(2);
        const duration = (0.5 + (barIndex % 4) * 0.15).toFixed(2);

        return (
          <span
            key={barIndex}
            style={{
              display: 'inline-block',
              width: '3px',
              borderRadius: '99px',
              backgroundColor: color,
              height: isActive ? `${Math.min(height, 8 + (barIndex % 5) * 6)}px` : '4px',
              animation: isActive ? `voiceWaveBar ${duration}s ease-in-out infinite alternate` : 'none',
              animationDelay: `${delay}s`,
              transition: 'height 0.2s ease',
              opacity: isActive ? 0.95 : 0.4
            }}
          />
        );
      })}
    </div>
  );
}
