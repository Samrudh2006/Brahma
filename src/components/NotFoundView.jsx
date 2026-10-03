import React from 'react';
import { Sparkles, ArrowLeft, RefreshCw } from 'lucide-react';
import { playDivineChime, playTactileClick } from '@utils/soundEffects';
import { useAppStore } from '@store/index';

const THEME_404_CONFIG = {
  teal: {
    bg: '/assets/404_mayura_teal.jpg',
    color: '#2bb6bd',
    glowColor: 'rgba(43, 182, 189, 0.45)',
    btnBg: 'rgba(43, 182, 189, 0.12)',
    btnBorder: 'rgba(43, 182, 189, 0.55)',
    description: "The wisdom you seek is beyond this path. Let's return you to the right one.",
  },
  cyberpunk: {
    bg: '/assets/404_cyberpunk_kashi.jpg',
    color: '#ec4899',
    glowColor: 'rgba(236, 72, 153, 0.45)',
    btnBg: 'rgba(236, 72, 153, 0.12)',
    btnBorder: 'rgba(236, 72, 153, 0.55)',
    description: "This route is not in our database. Let's get you back on track.",
  },
  surya: {
    bg: '/assets/404_surya_gold.jpg',
    color: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.50)',
    btnBg: 'rgba(245, 158, 11, 0.12)',
    btnBorder: 'rgba(245, 158, 11, 0.55)',
    description: "The knowledge you seek is in another dimension. Let's redirect you to the right realm.",
  },
  zen: {
    bg: '/assets/404_himalaya_zen.jpg',
    color: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.45)',
    btnBg: 'rgba(56, 189, 248, 0.12)',
    btnBorder: 'rgba(56, 189, 248, 0.55)',
    description: "This path is lost in the Himalayas. Let's guide you back to Brahma.",
  },
  obsidian: {
    bg: '/assets/404_surya_gold.jpg',
    color: '#d4af37',
    glowColor: 'rgba(212, 175, 55, 0.50)',
    btnBg: 'rgba(212, 175, 55, 0.12)',
    btnBorder: 'rgba(212, 175, 55, 0.55)',
    description: "The knowledge you seek is in another dimension. Let's redirect you to the right realm.",
  },
};

export default function NotFoundView({ onGoHome }) {
  const { theme } = useAppStore();
  const cfg = THEME_404_CONFIG[theme] || THEME_404_CONFIG.obsidian;

  return (
    <div
      style={{
        position: 'relative',
        minHeight: 'calc(100vh - 64px)',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '30px 20px',
        overflow: 'hidden',
        backgroundImage: `linear-gradient(180deg, rgba(6, 8, 12, 0.45) 0%, rgba(6, 8, 12, 0.35) 50%, rgba(6, 8, 12, 0.85) 100%), url('${cfg.bg}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'background-image 0.5s ease',
      }}
    >
      {/* Top Header Identity Pill */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 20px',
          borderRadius: '30px',
          background: 'rgba(6, 8, 12, 0.65)',
          backdropFilter: 'blur(12px)',
          border: `1px solid ${cfg.btnBorder}`,
          color: cfg.color,
          fontSize: '0.82rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          fontWeight: 600,
          boxShadow: `0 0 20px ${cfg.glowColor}`,
          marginTop: '20px',
        }}
      >
        <span>✦</span>
        <span>BRAHMA INTELLIGENCE</span>
        <span>✦</span>
      </div>

      {/* Center 404 Hero Container */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          maxWidth: '680px',
          padding: '30px 20px',
          background: 'rgba(6, 8, 12, 0.45)',
          backdropFilter: 'blur(16px)',
          borderRadius: '24px',
          border: `1px solid rgba(255, 255, 255, 0.08)`,
          boxShadow: `0 20px 60px rgba(0,0,0,0.8), 0 0 40px ${cfg.glowColor}`,
        }}
      >
        {/* Large 404 Number */}
        <h1
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 'clamp(4.5rem, 12vw, 7.5rem)',
            fontWeight: 800,
            lineHeight: 0.95,
            color: cfg.color,
            margin: '0 0 10px 0',
            letterSpacing: '0.04em',
            textShadow: `0 0 40px ${cfg.glowColor}, 0 0 80px rgba(0,0,0,0.9)`,
          }}
        >
          404
        </h1>

        {/* PATH NOT FOUND */}
        <h2
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 'clamp(1rem, 2.8vw, 1.4rem)',
            fontWeight: 700,
            letterSpacing: '0.22em',
            color: '#f8f6f0',
            textTransform: 'uppercase',
            margin: '0 0 18px 0',
            opacity: 0.95,
          }}
        >
          PATH NOT FOUND
        </h2>

        {/* Narrative Description */}
        <p
          style={{
            fontSize: 'clamp(0.9rem, 2vw, 1.05rem)',
            lineHeight: 1.6,
            color: 'rgba(248, 246, 240, 0.85)',
            margin: '0 0 28px 0',
            maxWidth: '520px',
          }}
        >
          {cfg.description}
        </p>

        {/* Return to Brahma Action Button */}
        <button
          onClick={() => {
            playDivineChime();
            if (onGoHome) onGoHome();
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 32px',
            borderRadius: '12px',
            background: cfg.btnBg,
            border: `1.5px solid ${cfg.btnBorder}`,
            color: cfg.color,
            fontSize: '0.96rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            cursor: 'pointer',
            boxShadow: `0 8px 30px ${cfg.glowColor}`,
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            backdropFilter: 'blur(8px)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
            e.currentTarget.style.boxShadow = `0 12px 40px ${cfg.glowColor}`;
            e.currentTarget.style.background = cfg.btnBorder;
            e.currentTarget.style.color = '#06080c';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = `0 8px 30px ${cfg.glowColor}`;
            e.currentTarget.style.background = cfg.btnBg;
            e.currentTarget.style.color = cfg.color;
          }}
        >
          <span>✦</span>
          <span>Return to Brahma</span>
        </button>
      </div>

      {/* Bottom Sacred Footer Matrix: DIAGNOSES | DECIDES | RECOVERS | AUDITS */}
      <footer
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          fontSize: '0.78rem',
          letterSpacing: '0.22em',
          color: 'rgba(248, 246, 240, 0.6)',
          textTransform: 'uppercase',
          fontWeight: 600,
          background: 'rgba(6, 8, 12, 0.75)',
          backdropFilter: 'blur(10px)',
          padding: '8px 24px',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          marginBottom: '10px',
        }}
      >
        <span style={{ color: cfg.color }}>✦</span>
        <span>DIAGNOSES</span>
        <span style={{ opacity: 0.4 }}>|</span>
        <span>DECIDES</span>
        <span style={{ opacity: 0.4 }}>|</span>
        <span>RECOVERS</span>
        <span style={{ opacity: 0.4 }}>|</span>
        <span>AUDITS</span>
        <span style={{ color: cfg.color }}>✦</span>
      </footer>
    </div>
  );
}
