import React, { useState, useEffect, useRef } from 'react';
import {
  Search, ChevronDown, Settings, Palette, Check, Menu,
  Volume2, VolumeX, Smartphone, Mic, MessageSquareHeart,
  MoreVertical, Sparkles, Sliders
} from 'lucide-react';
import { toggleAmbientDrone, updateAmbientTheme, getDroneState, playTactileClick } from '@utils/soundEffects';
import { useAppStore } from '@store/index';

const LUXURY_THEMES = [
  { id: 'surya', name: '🌅 Sūrya Solarized', color: '#f59e0b', desc: 'Solar Om & Sacred Tanpura', soundLabel: '🌅 Sūrya 136.1 Hz Tanpura' },
  { id: 'teal', name: '🦚 Mayūra Teal', color: '#2bb6bd', desc: 'Peacock & 528Hz Solfeggio', soundLabel: '🦚 Mayūra 528 Hz Water' },
  { id: 'cyberpunk', name: '🌆 Cyberpunk Kashi', color: '#ec4899', desc: 'Neon Violet & Vangelis Synth', soundLabel: '🌆 Cyber Kashi Synth' },
  { id: 'zen', name: '❄️ Himālaya Zen', color: '#38bdf8', desc: 'Tibetan Bowl & Mountain Air', soundLabel: '❄️ Himālaya 396 Hz Bowl' }
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

  const rawTheme = propTheme || storeTheme || 'surya';
  const theme = rawTheme === 'obsidian' ? 'surya' : rawTheme;
  const setTheme = propSetTheme || storeSetTheme;

  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isDroneActive, setIsDroneActive] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);

  const themeMenuRef = useRef(null);
  const moreMenuRef = useRef(null);

  useEffect(() => {
    // Listen for PWA installation event
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target)) {
        setShowThemeMenu(false);
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
        setShowMoreMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleDrone = (e) => {
    if (e) e.stopPropagation();
    playTactileClick();
    const active = toggleAmbientDrone((state) => setIsDroneActive(state), theme);
    setIsDroneActive(active);
  };

  const handleInstallPwa = async (e) => {
    if (e) e.stopPropagation();
    playTactileClick();
    setShowMoreMenu(false);
    if (installPrompt) {
      installPrompt.prompt();
      const choiceResult = await installPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setInstallPrompt(null);
      }
    } else {
      alert('To install BRAHMA on your device: open your browser menu (⋮ or Share) and tap "Install App" or "Add to Home Screen"!');
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

    // 2. Direct DOM updates
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', themeId);
      document.body.setAttribute('data-theme', themeId);
    }

    // 3. LocalStorage persistence
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('brahma-theme', themeId);
      } catch (_) {}
    }

    // 4. Ambient Drone update
    try {
      updateAmbientTheme(themeId);
    } catch (_) {}

    setShowThemeMenu(false);
  };

  const activeThemeObj = LUXURY_THEMES.find(t => t.id === theme) || LUXURY_THEMES[0];

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

      <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        
        {/* 1. Search / Command Palette Pill */}
        <button
          type="button"
          className="icon-action-btn"
          onClick={onOpenCommandPalette}
          title="Search & Command Palette (Ctrl + K)"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 10px' }}
        >
          <Search size={16} />
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, display: 'none' }} className="search-hotkey-label">
            ⌘K
          </span>
        </button>

        {/* 2. Live Hands-Free Telugu Voice Mode Button (Prominent Action) */}
        <button
          type="button"
          className="icon-action-btn"
          onClick={() => {
            playTactileClick();
            if (onOpenLiveVoice) onOpenLiveVoice();
          }}
          title="Open Hands-Free Continuous Telugu Voice Mode"
          style={{
            background: 'rgba(56, 189, 248, 0.12)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            color: '#38bdf8',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Mic size={16} />
        </button>

        {/* 3. Aesthetic Theme Palette Dropdown */}
        <div style={{ position: 'relative' }} ref={themeMenuRef}>
          <button
            type="button"
            className="icon-action-btn"
            onClick={(e) => {
              e.stopPropagation();
              setShowThemeMenu(!showThemeMenu);
              setShowMoreMenu(false);
            }}
            title={`Aesthetic Theme: ${activeThemeObj.name}`}
            style={{
              background: showThemeMenu ? 'rgba(251, 191, 36, 0.18)' : 'transparent',
              borderColor: showThemeMenu ? activeThemeObj.color : 'transparent',
              color: activeThemeObj.color
            }}
          >
            <Palette size={16} />
          </button>

          {/* Theme Dropdown Popover */}
          {showThemeMenu && (
            <div style={{
              position: 'absolute',
              top: 42,
              right: 0,
              width: 220,
              background: '#090d16',
              border: '1px solid rgba(251, 191, 36, 0.35)',
              borderRadius: 12,
              padding: 8,
              boxShadow: '0 20px 50px rgba(0,0,0,0.95), 0 0 25px rgba(251, 191, 36, 0.15)',
              zIndex: 99999,
              display: 'flex',
              flexDirection: 'column',
              gap: 3
            }}>
              <div style={{ fontSize: '0.70rem', fontWeight: 800, color: '#fbbf24', padding: '4px 8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Select Visual Theme
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
                    padding: '7px 10px',
                    borderRadius: 8,
                    background: theme === t.id ? 'rgba(251, 191, 36, 0.18)' : 'transparent',
                    border: theme === t.id ? `1px solid ${t.color}` : '1px solid transparent',
                    color: theme === t.id ? t.color : '#e2e8f0',
                    cursor: 'pointer',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    textAlign: 'left',
                    width: '100%',
                    boxSizing: 'border-box',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, pointerEvents: 'none' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: t.color, flexShrink: 0, boxShadow: theme === t.id ? `0 0 8px ${t.color}` : 'none' }} />
                    <span>{t.name}</span>
                  </div>
                  {theme === t.id && <Check size={13} color={t.color} style={{ pointerEvents: 'none' }} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 4. Consolidated Quick Actions Menu (⋯ More / Settings) */}
        <div style={{ position: 'relative' }} ref={moreMenuRef}>
          <button
            type="button"
            className="icon-action-btn"
            onClick={(e) => {
              e.stopPropagation();
              setShowMoreMenu(!showMoreMenu);
              setShowThemeMenu(false);
            }}
            title="More Options & System Settings"
            style={{
              background: showMoreMenu ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
              borderColor: showMoreMenu ? 'rgba(255, 255, 255, 0.25)' : 'transparent'
            }}
          >
            <Sliders size={16} />
          </button>

          {/* Quick Actions Dropdown */}
          {showMoreMenu && (
            <div style={{
              position: 'absolute',
              top: 42,
              right: 0,
              width: 220,
              background: '#090d16',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: 12,
              padding: 6,
              boxShadow: '0 20px 50px rgba(0,0,0,0.95), 0 0 20px rgba(0,0,0,0.8)',
              zIndex: 99999,
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}>
              {/* Soundscape Ambient Audio Toggle */}
              <button
                type="button"
                onClick={handleToggleDrone}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  borderRadius: 8,
                  background: isDroneActive ? 'rgba(251, 191, 36, 0.15)' : 'transparent',
                  border: 'none',
                  color: isDroneActive ? '#fbbf24' : '#e2e8f0',
                  cursor: 'pointer',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  textAlign: 'left',
                  width: '100%'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {isDroneActive ? <Volume2 size={15} color="#fbbf24" /> : <VolumeX size={15} color="#94a3b8" />}
                  <span>Ambient Drone</span>
                </div>
                <span style={{ fontSize: '0.68rem', color: isDroneActive ? '#4ade80' : '#94a3b8' }}>
                  {isDroneActive ? 'ON' : 'OFF'}
                </span>
              </button>

              {/* Share Feedback */}
              <button
                type="button"
                onClick={() => {
                  playTactileClick();
                  setShowMoreMenu(false);
                  if (onOpenFeedback) onOpenFeedback();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 10px',
                  borderRadius: 8,
                  background: 'transparent',
                  border: 'none',
                  color: '#e2e8f0',
                  cursor: 'pointer',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  textAlign: 'left',
                  width: '100%'
                }}
              >
                <MessageSquareHeart size={15} color="#f59e0b" />
                <span>Share Feedback</span>
              </button>

              {/* PWA Install */}
              <button
                type="button"
                onClick={handleInstallPwa}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 10px',
                  borderRadius: 8,
                  background: 'transparent',
                  border: 'none',
                  color: '#e2e8f0',
                  cursor: 'pointer',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  textAlign: 'left',
                  width: '100%'
                }}
              >
                <Smartphone size={15} color="#38bdf8" />
                <span>Install Native App</span>
              </button>

              <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '4px 0' }} />

              {/* Full Settings */}
              <button
                type="button"
                onClick={() => {
                  playTactileClick();
                  setShowMoreMenu(false);
                  if (onOpenSettings) onOpenSettings();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 10px',
                  borderRadius: 8,
                  background: 'transparent',
                  border: 'none',
                  color: '#f8fafc',
                  cursor: 'pointer',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  textAlign: 'left',
                  width: '100%'
                }}
              >
                <Settings size={15} color="#d4af37" />
                <span>System Settings</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
