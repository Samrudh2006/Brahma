import React, { useState, useEffect } from 'react';

/**
 * EvervaultCard
 * Inspired by Aceternity UI & 21st.dev
 * Cryptographic random text decryption matrix for PQC security and sovereign vaults
 */
const CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~|}{[]:;?><,./-=';

export function EvervaultCard({
  text = 'SOVEREIGN_VAULT',
  description = 'AES-256-GCM / Kyber-1024 Quantum Shield Active',
  className = '',
  style = {}
}) {
  const [randomString, setRandomString] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let str = '';
    for (let i = 0; i < 1500; i++) {
      str += CHARS[Math.floor(Math.random() * CHARS.length)];
    }
    setRandomString(str);
  }, []);

  const handleMouseMove = () => {
    let str = '';
    for (let i = 0; i < 1500; i++) {
      str += CHARS[Math.floor(Math.random() * CHARS.length)];
    }
    setRandomString(str);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className={`brahma-evervault-card ${className}`}
      style={{
        position: 'relative',
        borderRadius: '16px',
        padding: '2rem',
        background: 'rgba(10, 14, 23, 0.95)',
        border: '1px solid rgba(212, 175, 55, 0.22)',
        overflow: 'hidden',
        minHeight: '220px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        ...style
      }}
    >
      {/* Background Matrix Scrambler Mask */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: isHovered ? 0.35 : 0.08,
          color: 'var(--accent-gold-bright, #f5d77f)',
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: '11px',
          lineHeight: '13px',
          wordBreak: 'break-all',
          userSelect: 'none',
          pointerEvents: 'none',
          transition: 'opacity 0.3s ease',
          padding: '0.5rem',
          overflow: 'hidden'
        }}
      >
        {randomString}
      </div>

      {/* Center Crystal Token */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          textAlign: 'center'
        }}
      >
        <div
          style={{
            padding: '0.75rem 1.75rem',
            borderRadius: '99px',
            background: isHovered ? 'rgba(212, 175, 55, 0.18)' : 'rgba(255, 255, 255, 0.05)',
            border: `1px solid ${isHovered ? 'var(--accent-gold, #d4af37)' : 'rgba(212, 175, 55, 0.3)'}`,
            backdropFilter: 'blur(12px)',
            color: 'var(--text-primary, #f8f6f0)',
            fontFamily: 'var(--font-mono, monospace)',
            fontWeight: 700,
            fontSize: '1.15rem',
            letterSpacing: '0.08em',
            boxShadow: isHovered ? '0 0 24px rgba(212, 175, 55, 0.35)' : 'none',
            transition: 'all 0.3s ease'
          }}
        >
          {text}
        </div>
        {description && (
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted, #7e879e)', maxWidth: '260px' }}>
            {description}
          </span>
        )}
      </div>
    </div>
  );
}
