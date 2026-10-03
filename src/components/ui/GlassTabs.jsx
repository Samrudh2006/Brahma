import React from 'react';

/**
 * GlassTabs
 * Inspired by Eldora UI & Smooth UI
 * Sleek glassmorphism sliding tab switcher with dynamic aura highlights
 */
export function GlassTabs({
  tabs = [],
  activeTab,
  onTabChange,
  accentColor = 'var(--accent-gold, #d4af37)',
  className = '',
  style = {}
}) {
  return (
    <div
      className={`brahma-glass-tabs ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px',
        background: 'rgba(14, 20, 32, 0.8)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(212, 175, 55, 0.2)',
        borderRadius: '12px',
        gap: '4px',
        ...style
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === (tab.id || tab);
        const label = tab.label || tab.name || tab;
        const icon = tab.icon;

        return (
          <button
            key={tab.id || tab}
            onClick={() => onTabChange(tab.id || tab)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: isActive ? 600 : 500,
              fontFamily: 'var(--font-sans, "Inter", sans-serif)',
              color: isActive ? '#ffffff' : 'var(--text-muted, #7e879e)',
              background: isActive ? `${accentColor}25` : 'transparent',
              boxShadow: isActive ? `0 2px 8px rgba(0, 0, 0, 0.4), 0 0 12px ${accentColor}22` : 'none',
              outline: isActive ? `1px solid ${accentColor}55` : 'none',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = 'var(--text-primary, #f8f6f0)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = 'var(--text-muted, #7e879e)';
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            {icon && <span>{icon}</span>}
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
