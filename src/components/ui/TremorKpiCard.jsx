import React from 'react';

/**
 * TremorKpiCard
 * Inspired by Tremor & Float UI
 * High-density executive KPI metric card with animated progress, delta badges, and mini sparkline
 */
export function TremorKpiCard({
  title = 'Total Throughput',
  metric = '3.3M req/sec',
  delta = '+18.4%',
  isPositive = true,
  subtitle = 'Compared to baseline',
  progress = 85,
  progressColor = 'var(--accent-gold, #d4af37)',
  sparklineData = [20, 35, 45, 30, 55, 70, 65, 85],
  className = '',
  style = {}
}) {
  return (
    <div
      className={`brahma-tremor-kpi ${className}`}
      style={{
        borderRadius: '14px',
        padding: '1.25rem',
        background: 'rgba(14, 20, 32, 0.75)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(212, 175, 55, 0.18)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
        ...style
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.4)';
        e.currentTarget.style.boxShadow = '0 8px 24px -4px rgba(0, 0, 0, 0.5)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.18)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Top Title & Delta Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted, #7e879e)', fontWeight: 500 }}>
          {title}
        </span>
        {delta && (
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: '6px',
              background: isPositive ? 'rgba(46, 204, 113, 0.15)' : 'rgba(231, 76, 60, 0.15)',
              color: isPositive ? '#2ecc71' : '#e74c3c',
              border: `1px solid ${isPositive ? 'rgba(46, 204, 113, 0.3)' : 'rgba(231, 76, 60, 0.3)'}`,
              display: 'flex',
              alignItems: 'center',
              gap: '2px'
            }}
          >
            {isPositive ? '↑' : '↓'} {delta}
          </span>
        )}
      </div>

      {/* Main Metric & Mini Sparkline */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary, #f8f6f0)', fontFamily: 'var(--font-mono, monospace)', letterSpacing: '-0.02em' }}>
          {metric}
        </div>

        {/* Mini SVG Sparkline */}
        {sparklineData && sparklineData.length > 0 && (
          <svg width="80" height="30" style={{ overflow: 'visible' }}>
            <polyline
              fill="none"
              stroke={progressColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={sparklineData
                .map((val, idx) => {
                  const x = (idx / (sparklineData.length - 1)) * 80;
                  const y = 30 - (val / 100) * 26;
                  return `${x},${y}`;
                })
                .join(' ')}
            />
          </svg>
        )}
      </div>

      {/* Progress Bar & Subtitle */}
      <div>
        <div
          style={{
            height: '4px',
            width: '100%',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '2px',
            overflow: 'hidden',
            marginBottom: '0.4rem'
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${Math.min(100, Math.max(0, progress))}%`,
              background: progressColor,
              borderRadius: '2px',
              transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          />
        </div>
        {subtitle && (
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted, #7e879e)' }}>{subtitle}</span>
        )}
      </div>
    </div>
  );
}
