import React from 'react';

/**
 * BentoGrid & BentoCard
 * Inspired by Magic UI / 21st.dev / Aceternity UI
 * Luxury Glassmorphic responsive layout with dynamic hover borders
 */
export function BentoGrid({ children, className = '', columns = 3, gap = '1.5rem', style = {} }) {
  return (
    <div
      className={`brahma-bento-grid ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(300px, 1fr))`,
        gap,
        width: '100%',
        ...style
      }}
    >
      {children}
    </div>
  );
}

export function BentoCard({
  title,
  subtitle,
  icon,
  badge,
  children,
  colSpan = 1,
  rowSpan = 1,
  accentColor = 'var(--accent-gold, #d4af37)',
  onClick,
  className = '',
  style = {}
}) {
  return (
    <div
      onClick={onClick}
      className={`brahma-bento-card ${className}`}
      style={{
        gridColumn: `span ${colSpan}`,
        gridRow: `span ${rowSpan}`,
        position: 'relative',
        borderRadius: '16px',
        padding: '1.5rem',
        background: 'rgba(14, 20, 32, 0.7)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(212, 175, 55, 0.18)',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        ...style
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.borderColor = accentColor;
        e.currentTarget.style.boxShadow = `0 12px 32px -4px rgba(0, 0, 0, 0.5), 0 0 20px 0 ${accentColor}22`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.18)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Background Ambient Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accentColor}33 0%, transparent 70%)`,
          pointerEvents: 'none',
          filter: 'blur(20px)'
        }}
      />

      {/* Card Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          {icon && (
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: `rgba(255, 255, 255, 0.04)`,
                border: `1px solid ${accentColor}44`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                color: accentColor
              }}
            >
              {icon}
            </div>
          )}
          {badge && (
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 600,
                padding: '3px 10px',
                borderRadius: '20px',
                background: `${accentColor}18`,
                color: accentColor,
                border: `1px solid ${accentColor}33`,
                letterSpacing: '0.04em',
                textTransform: 'uppercase'
              }}
            >
              {badge}
            </span>
          )}
        </div>

        {title && (
          <h3
            style={{
              margin: '0 0 0.35rem 0',
              fontSize: '1.15rem',
              fontWeight: 600,
              color: 'var(--text-primary, #f8f6f0)',
              fontFamily: 'var(--font-display, "Cinzel", serif)'
            }}
          >
            {title}
          </h3>
        )}

        {subtitle && (
          <p
            style={{
              margin: 0,
              fontSize: '0.85rem',
              color: 'var(--text-muted, #7e879e)',
              lineHeight: 1.5
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* Card Content */}
      <div style={{ marginTop: '1.25rem', width: '100%' }}>{children}</div>
    </div>
  );
}
