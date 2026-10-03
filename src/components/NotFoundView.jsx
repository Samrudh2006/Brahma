import React from 'react';
import { Sparkles, ArrowLeft, RefreshCw, Home, Code, Wrench, BookOpen, Compass } from 'lucide-react';
import { playDivineChime, playTactileClick } from '@utils/soundEffects';
import { useAppStore } from '@store/index';

const THEME_404_CONFIG = {
  teal: {
    bg: '/assets/404_mayura_teal.jpg',
    color: '#2bb6bd',
    accentColor: '#5eead4',
    glowColor: 'rgba(43, 182, 189, 0.50)',
    btnBg: 'rgba(43, 182, 189, 0.15)',
    btnBorder: 'rgba(43, 182, 189, 0.65)',
    badgeText: 'MAYŪRA TEAL REALM',
    sanskritTag: '॥ मयूर वाहनं दिव्यं ज्ञान रूपं सनातनम् ॥',
    description: "The wisdom you seek is beyond this sacred path. Let's guide you back to the sovereign council.",
  },
  cyberpunk: {
    bg: '/assets/404_cyberpunk_kashi.jpg',
    color: '#ec4899',
    accentColor: '#f472b6',
    glowColor: 'rgba(236, 72, 153, 0.50)',
    btnBg: 'rgba(236, 72, 153, 0.15)',
    btnBorder: 'rgba(236, 72, 153, 0.65)',
    badgeText: 'CYBERPUNK KĀŚĪ MATRIX',
    sanskritTag: '॥ काशी विश्वेश्वरं वन्दे ज्ञान दीपं तमोहरम् ॥',
    description: "This neural route is not indexed in the Sovereign Kashi database. Reconnecting your stream to Brahma.",
  },
  surya: {
    bg: '/assets/404_surya_gold.jpg',
    color: '#f59e0b',
    accentColor: '#fbbf24',
    glowColor: 'rgba(245, 158, 11, 0.55)',
    btnBg: 'rgba(245, 158, 11, 0.15)',
    btnBorder: 'rgba(245, 158, 11, 0.65)',
    badgeText: 'SŪRYA SOLAR MANDALA',
    sanskritTag: '॥ ॐ सूर्याय नमः तेजसे ज्ञान दायिने ॥',
    description: "The knowledge you seek resonates in another dimension. Realigning your coordinates to Brahma.",
  },
  zen: {
    bg: '/assets/404_himalaya_zen.jpg',
    color: '#38bdf8',
    accentColor: '#7dd3fc',
    glowColor: 'rgba(56, 189, 248, 0.50)',
    btnBg: 'rgba(56, 189, 248, 0.15)',
    btnBorder: 'rgba(56, 189, 248, 0.65)',
    badgeText: 'HIMĀLAYA ZEN REALM',
    sanskritTag: '॥ शान्तं शिवमद्वैतं चतुर्थं मन्यन्ते ॥',
    description: "This mountain path is cloaked in Himalayan snow. Let's guide your journey back to Brahma.",
  },
  obsidian: {
    bg: '/assets/404_surya_gold.jpg',
    color: '#fbbf24',
    accentColor: '#fde047',
    glowColor: 'rgba(251, 191, 36, 0.55)',
    btnBg: 'rgba(251, 191, 36, 0.15)',
    btnBorder: 'rgba(251, 191, 36, 0.65)',
    badgeText: 'COSMIC BRAHMA OBSIDIAN',
    sanskritTag: '॥ ब्रह्म सत्यं जगन्मिथ्या जीवो ब्रह्मैव नापरः ॥',
    description: "The divine realm you are reaching for has transcended this coordinate. Let's return to the core sanctuary.",
  },
};

export default function NotFoundView({ onGoHome }) {
  const { theme, setActivePage } = useAppStore();
  const cfg = THEME_404_CONFIG[theme] || THEME_404_CONFIG.obsidian;

  const quickLinks = [
    { label: 'Samvāda (Chat)', id: 'chat', icon: Home },
    { label: 'Sṛṣṭi (Builder)', id: 'app-builder', icon: Code },
    { label: 'Astra (Tools)', id: 'tools', icon: Wrench },
    { label: 'Vidyā (Skills)', id: 'skills', icon: BookOpen },
  ];

  const handleNavigate = (pageId) => {
    playTactileClick();
    if (setActivePage) {
      setActivePage(pageId);
    } else if (onGoHome) {
      onGoHome();
    }
  };

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
        padding: '24px 16px',
        overflow: 'hidden',
        backgroundImage: `linear-gradient(180deg, rgba(6, 8, 12, 0.60) 0%, rgba(6, 8, 12, 0.38) 40%, rgba(6, 8, 12, 0.88) 100%), url('${cfg.bg}')`,
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
          background: 'rgba(6, 8, 12, 0.75)',
          backdropFilter: 'blur(12px)',
          border: `1px solid ${cfg.btnBorder}`,
          color: cfg.color,
          fontSize: '0.80rem',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          fontWeight: 700,
          boxShadow: `0 0 24px ${cfg.glowColor}`,
          marginTop: '10px',
        }}
      >
        <span>✦</span>
        <span>{cfg.badgeText}</span>
        <span>✦</span>
      </div>

      {/* Center 404 Card with Main Brahma Central Logo Emblem */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          maxWidth: '660px',
          width: '92%',
          padding: '36px 24px',
          background: 'rgba(6, 8, 14, 0.65)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '28px',
          border: `1px solid rgba(255, 255, 255, 0.12)`,
          boxShadow: `0 24px 70px rgba(0,0,0,0.85), 0 0 50px ${cfg.glowColor}`,
          margin: '20px 0',
        }}
      >
        {/* ── Main Brahma Sovereign Central Logo Emblem ── */}
        <div
          style={{
            position: 'relative',
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `radial-gradient(circle, ${cfg.glowColor} 0%, rgba(6, 8, 14, 0.95) 75%)`,
            border: `2px solid ${cfg.btnBorder}`,
            boxShadow: `0 0 35px ${cfg.glowColor}, inset 0 0 20px ${cfg.glowColor}`,
            marginBottom: '16px',
            animation: 'pulse 3s ease-in-out infinite',
          }}
        >
          {/* Inner Rotating Sacred Halo Ring */}
          <div
            style={{
              position: 'absolute',
              inset: '-6px',
              borderRadius: '50%',
              border: `1px dashed ${cfg.color}`,
              opacity: 0.6,
            }}
          />
          {/* Central Sovereign Trishula / Brahma Glyph */}
          <span
            style={{
              fontSize: '2.5rem',
              filter: `drop-shadow(0 0 12px ${cfg.color})`,
              lineHeight: 1,
            }}
          >
            🔱
          </span>
        </div>

        {/* Sovereign Nameplate */}
        <div
          style={{
            fontSize: '0.92rem',
            fontWeight: 800,
            letterSpacing: '0.24em',
            color: cfg.color,
            textTransform: 'uppercase',
            marginBottom: '6px',
          }}
        >
          BRAHMA SOVEREIGN AI
        </div>

        {/* Large 404 Number */}
        <h1
          style={{
            fontFamily: "'Cinzel', 'Cinzel Decorative', serif",
            fontSize: 'clamp(4.2rem, 11vw, 6.8rem)',
            fontWeight: 900,
            lineHeight: 0.95,
            color: cfg.color,
            margin: '4px 0 8px 0',
            letterSpacing: '0.04em',
            textShadow: `0 0 35px ${cfg.glowColor}, 0 0 70px rgba(0,0,0,0.9)`,
          }}
        >
          404
        </h1>

        {/* PATH NOT FOUND */}
        <h2
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 'clamp(1rem, 2.5vw, 1.35rem)',
            fontWeight: 800,
            letterSpacing: '0.22em',
            color: '#f8f6f0',
            textTransform: 'uppercase',
            margin: '0 0 8px 0',
            opacity: 0.95,
          }}
        >
          PATH NOT FOUND
        </h2>

        {/* Sanskrit Inscription */}
        <p
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '0.86rem',
            color: cfg.accentColor,
            letterSpacing: '0.1em',
            margin: '0 0 16px 0',
            opacity: 0.9,
          }}
        >
          {cfg.sanskritTag}
        </p>

        {/* Narrative Description */}
        <p
          style={{
            fontSize: 'clamp(0.88rem, 1.8vw, 1.02rem)',
            lineHeight: 1.6,
            color: 'rgba(248, 246, 240, 0.88)',
            margin: '0 0 24px 0',
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
            padding: '13px 36px',
            borderRadius: '14px',
            background: cfg.btnBg,
            border: `1.5px solid ${cfg.btnBorder}`,
            color: cfg.color,
            fontSize: '0.98rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
            cursor: 'pointer',
            boxShadow: `0 8px 32px ${cfg.glowColor}`,
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            backdropFilter: 'blur(10px)',
            marginBottom: '20px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
            e.currentTarget.style.boxShadow = `0 14px 44px ${cfg.glowColor}`;
            e.currentTarget.style.background = cfg.btnBorder;
            e.currentTarget.style.color = '#06080c';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = `0 8px 32px ${cfg.glowColor}`;
            e.currentTarget.style.background = cfg.btnBg;
            e.currentTarget.style.color = cfg.color;
          }}
        >
          <span>✦</span>
          <span>Return to Brahma Sanctuary</span>
        </button>

        {/* Quick Navigation Sanctuary Shortcuts */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '6px',
          }}
        >
          {quickLinks.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#e2e8f0',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.borderColor = cfg.color;
                  e.currentTarget.style.color = cfg.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.color = '#e2e8f0';
                }}
              >
                <Icon size={13} style={{ color: cfg.color }} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Sacred Footer Matrix: DIAGNOSES | DECIDES | RECOVERS | AUDITS */}
      <footer
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          fontSize: '0.76rem',
          letterSpacing: '0.20em',
          color: 'rgba(248, 246, 240, 0.65)',
          textTransform: 'uppercase',
          fontWeight: 700,
          background: 'rgba(6, 8, 12, 0.80)',
          backdropFilter: 'blur(12px)',
          padding: '8px 22px',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.10)',
          marginBottom: '6px',
        }}
      >
        <span style={{ color: cfg.color }}>✦</span>
        <span>DIAGNOSES</span>
        <span style={{ opacity: 0.35 }}>|</span>
        <span>DECIDES</span>
        <span style={{ opacity: 0.35 }}>|</span>
        <span>RECOVERS</span>
        <span style={{ opacity: 0.35 }}>|</span>
        <span>AUDITS</span>
        <span style={{ color: cfg.color }}>✦</span>
      </footer>
    </div>
  );
}

