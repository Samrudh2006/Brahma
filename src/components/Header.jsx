import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Sun, Moon, Settings, Clock, Palette, Check, Menu, Volume2, VolumeX, Smartphone, Music } from 'lucide-react';
import { toggleAmbientDrone, updateAmbientTheme, getDroneState, playTactileClick } from '@utils/soundEffects';

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
  theme,
  setTheme,
  setActivePage,
  onToggleMobileSidebar,
  onOpenLiveVoice
}) {

  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [isDroneActive, setIsDroneActive] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);

  useEffect(() => {
    // Listen for PWA installation event
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

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

  const handleSelectTheme = (themeId) => {
    playTactileClick();
    setTheme(themeId);
    updateAmbientTheme(themeId);
    setShowThemeMenu(false);
  };


  return (
    <header className="top-header" style={{ position: 'relative' }}>
      <div className="header-left">
        {/* Mobile Hamburger Trigger */}
        <button
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
            src={currentIdentity.portrait}
            alt={currentIdentity.name}
            className="switcher-portrait"
          />
          <span className="switcher-name">{currentIdentity.name} <span className="switcher-subtext">Intelligence</span></span>
          <ChevronDown size={14} style={{ color: 'var(--accent-gold)' }} />
        </div>
      </div>

      <div className="header-right">
        {/* 1. Search / Command Palette */}
        <button
          className="icon-action-btn"
          onClick={onOpenCommandPalette}
          title="Search & Command Palette (Ctrl + K)"
        >
          <Search size={17} />
        </button>

        {/* 2. Direct Theme Palette Dropdown Trigger */}
        <div style={{ position: 'relative' }}>
          <button
            className="icon-action-btn"
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            title={`Switch Aesthetic Theme (Current: ${theme})`}
            style={{
              background: showThemeMenu ? 'rgba(251, 191, 36, 0.2)' : 'transparent',
              borderColor: showThemeMenu ? '#fbbf24' : 'transparent'
            }}
          >
            <Palette size={17} style={{ color: 'var(--accent-gold)' }} />
          </button>

          {/* Theme Dropdown Popover */}
          {showThemeMenu && (
            <div style={{
              position: 'absolute',
              top: 42,
              right: 0,
              width: 220,
              background: '#0d1117',
              border: '1px solid rgba(251, 191, 36, 0.3)',
              borderRadius: 12,
              padding: 10,
              boxShadow: '0 16px 40px rgba(0,0,0,0.8)',
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column',
              gap: 4
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#fbbf24', padding: '4px 8px', textTransform: 'uppercase' }}>
                Select Aesthetic Theme
              </div>
              {LUXURY_THEMES.map(t => (
                <button
                  key={t.id}
                  onClick={() => handleSelectTheme(t.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: 8,
                    background: theme === t.id ? 'rgba(251, 191, 36, 0.15)' : 'transparent',
                    border: 'none',
                    color: theme === t.id ? t.color : '#e2e8f0',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: t.color }} />
                    <span>{t.name}</span>
                  </div>
                  {theme === t.id && <Check size={14} color={t.color} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 3. Settings */}
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


        {/* 4. Scheduled Tasks / History */}
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
