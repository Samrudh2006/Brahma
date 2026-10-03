import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, Sun, Moon, Settings, Clock, Palette, Check, Menu, Volume2, VolumeX, Smartphone, Music, Mic, MessageSquareHeart } from 'lucide-react';
import { toggleAmbientDrone, updateAmbientTheme, getDroneState, playTactileClick } from '@utils/soundEffects';
import { useAppStore } from '@store/index';

const LUXURY_THEMES = [
  { id: 'obsidian', name: '🌌 Cosmic Gold', color: '#fbbf24', desc: 'Obsidian & 432Hz Cosmic Pad', soundLabel: '🌌 Cosmic 432 Hz Deep Warmth' },
  { id: 'teal', name: '🦚 Mayūra Teal', color: '#2bb6bd', desc: 'Peacock & 528Hz Solfeggio', soundLabel: '🦚 Mayūra 528 Hz Healing Water' },
  { id: 'cyberpunk', name: '🌆 Cyberpunk Kashi', color: '#ec4899', desc: 'Neon Violet & Vangelis Synth', soundLabel: '🌆 Cyber Kashi Analog Synth Pad' },
  { id: 'surya', name: '🌅 Sūrya Solarized', color: '#f59e0b', desc: 'Solar Om & Sacred Tanpura', soundLabel: '🌅 Sūrya 136.1 Hz Solar Tanpura' },
  { id: 'zen', name: '❄️ Himālaya Zen', color: '#38bdf8', desc: 'Tibetan Bowl & Mountain Air', soundLabel: '❄️ Himālaya 396 Hz Tibetan Bowl' }
];

export default function Header({
  currentIdentity,
  onOpenIdentityModal,
  onOpenCommandPalette,
  onOpenSettings,
  onOpenFeedback,
  theme: propTheme,
  setTheme: propSetTheme,
  setActivePage,
  onToggleMobileSidebar,
  onOpenLiveVoice
}) {
  const storeTheme = useAppStore(state => state.theme);
  const storeSetTheme = useAppStore(state => state.setTheme);

  const theme = propTheme || storeTheme || 'obsidian';
  const setTheme = propSetTheme || storeSetTheme;

  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [isDroneActive, setIsDroneActive] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const themeMenuRef = useRef(null);

  useEffect(() => {
    // Listen for PWA installation event
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  // Close theme dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target)) {
        setShowThemeMenu(false);
      }
    };
    if (showThemeMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showThemeMenu]);

  const handleToggleDrone = () => {
    playTactileClick();
    const active = toggleAmbientDrone((state) => setIsDroneActive(state), theme);
    setIsDroneActive(active);
  };

  const handleInstallPwa = async () => {
    playTactileClick();
    if (installPrompt) {
      installPrompt.prompt();
      const choiceResult = await installPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setInstallPrompt(null);
      }
    } else {
      alert('To install BRAHMA on your phone or desktop: open your browser menu (⋮ or Share) and tap "Install App" or "Add to Home Screen"!');
    }
  };

  const handleSelectTheme = (e, themeId) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    playTactileClick();

    // 1. Store updates
    if (setTheme) {
      setTheme(themeId);
    }

    // 2. Direct DOM instant attribute updates
    if (typeof document !== 'undefined') {
      if (themeId === 'obsidian') {
        document.documentElement.setAttribute('data-theme', 'obsidian');
        document.body.setAttribute('data-theme', 'obsidian');
      } else {
        document.documentElement.setAttribute('data-theme', themeId);
        document.body.setAttribute('data-theme', themeId);
      }
    }

    // 3. LocalStorage persistence
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('brahma-theme', themeId);
      } catch (_) {}
    }

    // 4. Acoustic drone tone alignment
    try {
      updateAmbientTheme(themeId);
    } catch (_) {}

    setShowThemeMenu(false);
  };

  return (
    <header className="top-header" style={{ position: 'relative' }}>
      <div className="header-left">
        {/* Mobile Hamburger Trigger */}
        <button
          type="button"
          className="mobile-menu-trigger"
          onClick={onToggleMobileSidebar}
          title="Toggle Navigation Menu"
          aria-label="Toggle Navigation Menu"
        >
          <Menu size={20} />
        </button>

        {/* Identity Selector Dropdown Pill */}
        <div
          className="identity-switcher-pill"
          onClick={onOpenIdentityModal}
          title="Switch Active Deity Intelligence (13 Councils)"
        >
          <img
            src={currentIdentity?.portrait || '/avatars/brahma.png'}
            alt={currentIdentity?.name || 'BRAHMA'}
            className="switcher-portrait"
          />
          <span className="switcher-name">{currentIdentity?.name || 'BRAHMA'} <span className="switcher-subtext">Intelligence</span></span>
          <ChevronDown size={14} style={{ color: 'var(--accent-gold)' }} />
        </div>
      </div>

      <div className="header-right">
        {/* 1. Search / Command Palette */}
        <button
          type="button"
          className="icon-action-btn"
          onClick={onOpenCommandPalette}
          title="Search & Command Palette (Ctrl + K)"
        >
          <Search size={17} />
        </button>

        {/* 2. Direct Theme Palette Dropdown Trigger */}
        <div style={{ position: 'relative' }} ref={themeMenuRef}>
          <button
            type="button"
            className="icon-action-btn"
            onClick={(e) => {
              e.stopPropagation();
              setShowThemeMenu(!showThemeMenu);
            }}
            title={`Switch Aesthetic Theme (Current: ${theme})`}
            style={{
              background: showThemeMenu ? 'rgba(251, 191, 36, 0.2)' : 'transparent',
              borderColor: showThemeMenu ? '#fbbf24' : 'transparent',
              color: LUXURY_THEMES.find(t => t.id === theme)?.color || 'var(--accent-gold)'
            }}
          >
            <Palette size={17} />
          </button>

          {/* Theme Dropdown Popover */}
          {showThemeMenu && (
            <div style={{
              position: 'absolute',
              top: 42,
              right: 0,
              width: 230,
              background: '#090d16',
              border: '1px solid rgba(251, 191, 36, 0.35)',
              borderRadius: 12,
              padding: 10,
              boxShadow: '0 20px 50px rgba(0,0,0,0.9), 0 0 25px rgba(251, 191, 36, 0.15)',
              zIndex: 99999,
              display: 'flex',
              flexDirection: 'column',
              gap: 4
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#fbbf24', padding: '4px 8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Select Aesthetic Theme
              </div>
              {LUXURY_THEMES.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={(e) => handleSelectTheme(e, t.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: 8,
                    background: theme === t.id ? 'rgba(251, 191, 36, 0.18)' : 'rgba(255, 255, 255, 0.02)',
                    border: theme === t.id ? `1px solid ${t.color}` : '1px solid transparent',
                    color: theme === t.id ? t.color : '#e2e8f0',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    textAlign: 'left',
                    width: '100%',
                    boxSizing: 'border-box',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, pointerEvents: 'none' }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: t.color, flexShrink: 0, boxShadow: theme === t.id ? `0 0 8px ${t.color}` : 'none' }} />
                    <span>{t.name}</span>
                  </div>
                  {theme === t.id && <Check size={14} color={t.color} style={{ pointerEvents: 'none' }} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 3. Feedback & Improvement Modal Trigger */}
        <button
          type="button"
          className="icon-action-btn"
          onClick={() => {
            playTactileClick();
            if (onOpenFeedback) onOpenFeedback();
          }}
          title="Share Feedback & Report Bugs"
          style={{
            color: '#f59e0b',
            background: 'rgba(245, 158, 11, 0.12)',
            borderColor: 'rgba(245, 158, 11, 0.3)'
          }}
        >
          <MessageSquareHeart size={17} />
        </button>

        {/* 4. Settings */}
        <button
          className="icon-action-btn"
          onClick={onOpenSettings}
          title="System Settings & Model Config"
        >
          <Settings size={17} />
        </button>

        {/* Sacred Procedural Ambient Soundscape Toggle with Theme Awareness */}
        {(() => {
          const activeThemeObj = LUXURY_THEMES.find(t => t.id === theme) || LUXURY_THEMES[0];
          return (
            <button
              className="icon-action-btn"
              onClick={handleToggleDrone}
              title={isDroneActive ? `${activeThemeObj.soundLabel} • Active (Click to Mute)` : `Play ${activeThemeObj.soundLabel}`}
              style={{
                background: isDroneActive ? 'rgba(251, 191, 36, 0.2)' : 'transparent',
                borderColor: isDroneActive ? activeThemeObj.color : 'transparent',
                color: isDroneActive ? activeThemeObj.color : 'var(--text-secondary)'
              }}
            >
              {isDroneActive ? <Volume2 size={17} /> : <VolumeX size={17} />}
            </button>
          );
        })()}

        {/* Live Hands-Free Telugu Voice Mode Button */}
        <button
          className="icon-action-btn"
          onClick={() => {
            playTactileClick();
            if (onOpenLiveVoice) onOpenLiveVoice();
          }}
          title="Open Hands-Free Continuous Telugu Voice Mode (No Buttons Needed)"
          style={{
            background: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.45)',
            color: '#38bdf8'
          }}
        >
          <Mic size={17} />
        </button>

        {/* PWA Install Native App Button */}
        <button
          className="icon-action-btn"
          onClick={handleInstallPwa}
          title="Install BRAHMA Native App (PWA)"
          style={{
            color: 'var(--accent-gold)'
          }}
        >
          <Smartphone size={17} />
        </button>

        {/* 5. Scheduled Tasks / History */}
        <button
          className="icon-action-btn"
          onClick={() => setActivePage('scheduled')}
          title="Scheduled Tasks & History"
        >
          <Clock size={17} />
        </button>
      </div>
    </header>
  );
}
