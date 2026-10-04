import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Smartphone, Monitor, Apple, CheckCircle2, Download, Sparkles, ExternalLink, ArrowRight, Share2, PlusSquare } from 'lucide-react';
import { playTactileClick, playDivineChime } from '@utils/soundEffects';

export function PwaInstallBadgeSvg({ size = 20, glow = true }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ verticalAlign: 'middle', flexShrink: 0 }}>
      <defs>
        <linearGradient id="pwaGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="pwaCyanGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#2dd4bf" />
        </linearGradient>
        {glow && (
          <filter id="pwaGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        )}
      </defs>
      
      {/* Outer Golden Shield Frame */}
      <rect x="3" y="3" width="26" height="26" rx="7" fill="rgba(15, 23, 42, 0.85)" stroke="url(#pwaGoldGrad)" strokeWidth="1.8" filter={glow ? "url(#pwaGlow)" : undefined} />
      
      {/* Device Silhouette Matrix */}
      <rect x="8" y="6" width="16" height="20" rx="3.5" stroke="url(#pwaCyanGrad)" strokeWidth="1.4" fill="rgba(3, 7, 18, 0.6)" />
      
      {/* Speaker Bar & Home Indicator */}
      <line x1="13" y1="8.5" x2="19" y2="8.5" stroke="#fbbf24" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
      <circle cx="16" cy="23.5" r="1" fill="#fbbf24" />
      
      {/* Central Animated Download Arrow */}
      <path d="M16 11V18M16 18L13 15M16 18L19 15" stroke="url(#pwaGoldGrad)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="12" y1="20" x2="20" y2="20" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export default function PwaInstallModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('android'); // 'android' | 'ios' | 'desktop'
  const [promptObj, setPromptObj] = useState(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.__brahmaPwaPrompt) {
      setPromptObj(window.__brahmaPwaPrompt);
    }
    const handlePwaReady = (e) => {
      if (e?.detail) setPromptObj(e.detail);
    };
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      window.__brahmaPwaPrompt = e;
      setPromptObj(e);
    };
    const handlePwaInstalled = () => {
      setInstalled(true);
      setPromptObj(null);
    };

    window.addEventListener('brahma:pwa-ready', handlePwaReady);
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('brahma:pwa-installed', handlePwaInstalled);

    return () => {
      window.removeEventListener('brahma:pwa-ready', handlePwaReady);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('brahma:pwa-installed', handlePwaInstalled);
    };
  }, []);

  // Detect platform automatically on open
  useEffect(() => {
    if (isOpen) {
      const ua = navigator.userAgent || '';
      if (/iPhone|iPad|iPod/i.test(ua)) {
        setActiveTab('ios');
      } else if (/Android/i.test(ua)) {
        setActiveTab('android');
      } else {
        setActiveTab('desktop');
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;

  const handleInstantInstall = async () => {
    playTactileClick();
    if (promptObj) {
      try {
        promptObj.prompt();
        const { outcome } = await promptObj.userChoice;
        if (outcome === 'accepted') {
          playDivineChime();
          setInstalled(true);
          setPromptObj(null);
          setTimeout(() => {
            onClose();
          }, 1500);
        }
      } catch (err) {
        console.warn('PWA prompt invocation error:', err);
      }
    }
  };

  const modalContent = (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(2, 6, 18, 0.88)',
        backdropFilter: 'blur(20px)',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        boxSizing: 'border-box'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          background: 'linear-gradient(180deg, #0a0f1d 0%, #050811 100%)',
          borderRadius: '16px',
          border: '1px solid rgba(251, 191, 36, 0.45)',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.95), 0 0 45px rgba(251, 191, 36, 0.25)',
          overflow: 'hidden',
          position: 'relative',
          boxSizing: 'border-box'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(90deg, rgba(251, 191, 36, 0.14), transparent)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <PwaInstallBadgeSvg size={32} />
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: '0.02em' }}>
                Install BRAHMA Sovereign App
              </h2>
              <p style={{ fontSize: '0.75rem', color: '#fbbf24', margin: 0, fontWeight: 600 }}>
                100% Offline Capable · Native Full-Screen · Instant Launcher
              </p>
            </div>
          </div>
          <button
            onClick={() => { playTactileClick(); onClose(); }}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
              color: '#94a3b8',
              padding: '6px',
              cursor: 'pointer',
              display: 'flex'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px' }}>
          {/* 1-Click Native Install Banner if prompt available */}
          {promptObj && !installed && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(217, 119, 6, 0.15))',
              border: '1px solid #fbbf24',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}>
              <div>
                <div style={{ color: '#fbbf24', fontWeight: 800, fontSize: '0.92rem' }}>
                  ⚡ Ready for 1-Click Native Install
                </div>
                <div style={{ color: '#cbd5e1', fontSize: '0.78rem', marginTop: '2px' }}>
                  Your browser supports direct installation. Click to install immediately!
                </div>
              </div>
              <button
                onClick={handleInstantInstall}
                style={{
                  background: 'linear-gradient(135deg, #fbbf24, #d97706)',
                  color: '#090d16',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 18px',
                  fontWeight: 800,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  boxShadow: '0 0 15px rgba(251, 191, 36, 0.4)',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Download size={15} /> Install Now
              </button>
            </div>
          )}

          {installed && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid #10b981',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '20px',
              textAlign: 'center',
              color: '#34d399'
            }}>
              <CheckCircle2 size={28} style={{ margin: '0 auto 6px' }} />
              <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>BRAHMA Successfully Installed!</div>
              <div style={{ fontSize: '0.8rem', color: '#a7f3d0' }}>You can now launch BRAHMA from your home screen or application menu.</div>
            </div>
          )}

          {/* Platform Tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            {[
              { id: 'android', label: 'Android / Chrome', icon: Smartphone },
              { id: 'ios', label: 'iOS / Safari', icon: Apple },
              { id: 'desktop', label: 'Windows / Mac / PC', icon: Monitor }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { playTactileClick(); setActiveTab(tab.id); }}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '10px',
                    borderRadius: '8px',
                    border: isActive ? '1px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.08)',
                    background: isActive ? 'rgba(251, 191, 36, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    color: isActive ? '#fbbf24' : '#94a3b8',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Icon size={15} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Instructions */}
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)', padding: '18px' }}>
            {activeTab === 'android' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.78rem', flexShrink: 0 }}>1</div>
                  <div style={{ color: '#e2e8f0', fontSize: '0.84rem' }}>
                    Open Chrome, Edge, or Brave browser on your Android device.
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.78rem', flexShrink: 0 }}>2</div>
                  <div style={{ color: '#e2e8f0', fontSize: '0.84rem' }}>
                    Tap the <strong>three dots menu (⋮)</strong> in the top-right corner.
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.78rem', flexShrink: 0 }}>3</div>
                  <div style={{ color: '#e2e8f0', fontSize: '0.84rem' }}>
                    Select <strong>"Install App"</strong> or <strong>"Add to Home Screen"</strong>.
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ios' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.78rem', flexShrink: 0 }}>1</div>
                  <div style={{ color: '#e2e8f0', fontSize: '0.84rem' }}>
                    Open Safari on your iPhone or iPad and navigate to BRAHMA.
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.78rem', flexShrink: 0 }}>2</div>
                  <div style={{ color: '#e2e8f0', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    Tap the <strong>Share Button</strong> <Share2 size={15} color="#38bdf8" /> in the bottom bar.
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.78rem', flexShrink: 0 }}>3</div>
                  <div style={{ color: '#e2e8f0', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    Scroll down and tap <strong>"Add to Home Screen"</strong> <PlusSquare size={15} color="#fbbf24" />.
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'desktop' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.78rem', flexShrink: 0 }}>1</div>
                  <div style={{ color: '#e2e8f0', fontSize: '0.84rem' }}>
                    Look at the right side of your browser's address bar (URL bar).
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.78rem', flexShrink: 0 }}>2</div>
                  <div style={{ color: '#e2e8f0', fontSize: '0.84rem' }}>
                    Click the <strong>Install icon (🖥️ / ⊕)</strong> in Chrome, Edge, or Brave.
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.78rem', flexShrink: 0 }}>3</div>
                  <div style={{ color: '#e2e8f0', fontSize: '0.84rem' }}>
                    Click <strong>Install</strong> to get a standalone desktop window with GPU hardware acceleration.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(0, 0, 0, 0.4)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
            🔱 BRAHMA Sovereign PWA v4.8
          </span>
          <button
            onClick={() => { playTactileClick(); onClose(); }}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#f8fafc',
              padding: '6px 16px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
