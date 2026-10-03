import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cookie, X } from 'lucide-react';
import { telemetry } from '@utils/telemetry';
import { playTactileClick } from '@utils/soundEffects';

export default function CookieConsentBanner({ onOpenPrivacy }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show if user has not yet decided
    const hasDecision = localStorage.getItem('brahma_cookie_consent');
    if (!hasDecision) {
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    playTactileClick();
    telemetry.setConsent('all');
    setIsVisible(false);
  };

  const handleEssentialOnly = () => {
    playTactileClick();
    telemetry.setConsent('essential');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Cookie and Privacy Consent Banner"
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        width: 'calc(100% - 32px)',
        maxWidth: '680px',
        background: 'rgba(10, 14, 22, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(212, 175, 55, 0.35)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(212, 175, 55, 0.15)',
        borderRadius: '16px',
        padding: '20px 24px',
        color: '#f8f6f0',
        animation: 'bannerSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(43, 182, 189, 0.2))',
            border: '1px solid rgba(212, 175, 55, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            color: '#d4af37',
          }}
        >
          <ShieldCheck size={22} />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <h4
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '1rem',
                fontWeight: 600,
                color: '#d4af37',
                letterSpacing: '0.04em',
                margin: 0,
              }}
            >
              Divine Privacy & Sovereignty Guard
            </h4>
            <button
              onClick={handleEssentialOnly}
              aria-label="Dismiss banner with essential cookies only"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.4)',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              <X size={18} />
            </button>
          </div>

          <p
            style={{
              fontSize: '0.85rem',
              lineHeight: 1.5,
              color: 'rgba(248, 246, 240, 0.78)',
              margin: '0 0 16px 0',
            }}
          >
            BRAHMA respects your digital sovereignty. We use minimal local storage for model caching, neural state persistence, and anonymized performance metrics. No personal data is ever sold or shared with third parties.
            {onOpenPrivacy && (
              <button
                onClick={() => {
                  playTactileClick();
                  onOpenPrivacy();
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#38bdf8',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  marginLeft: '6px',
                  fontSize: '0.85rem',
                  padding: 0,
                }}
              >
                Read Privacy Policy
              </button>
            )}
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={handleEssentialOnly}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: 'rgba(255, 255, 255, 0.85)',
                fontSize: '0.82rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
              }}
            >
              Essential Only
            </button>
            <button
              onClick={handleAcceptAll}
              style={{
                padding: '8px 20px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #d4af37 0%, #b89728 100%)',
                border: 'none',
                color: '#06080c',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(212, 175, 55, 0.45)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(212, 175, 55, 0.3)';
              }}
            >
              Accept Sovereign Analytics
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
