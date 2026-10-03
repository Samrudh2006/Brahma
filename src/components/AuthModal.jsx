import React, { useState } from 'react';
import {
  Shield, Key, Mail, User, Sparkles, ArrowRight,
  CheckCircle, AlertCircle, X, Lock, Eye, EyeOff, Zap
} from 'lucide-react';
import { authLogin, authRegister, authGuest } from '@api/client';
import { useAuthStore } from '@store/index';
import { playDivineChime, playTactileClick } from '@utils/soundEffects';

export default function AuthModal({ isOpen, onClose }) {
  const { setAuth } = useAuthStore();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!email || !email.includes('@')) {
      setError('Please provide a valid sovereign email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setLoading(true);
    playTactileClick();

    try {
      if (mode === 'login') {
        const res = await authLogin(email, password);
        if (res.success && res.token) {
          playDivineChime();
          setSuccessMsg('Authentication verified. Entering Sovereign Workspace...');
          setTimeout(() => {
            setAuth(res.user, res.token);
            if (onClose) onClose();
          }, 600);
        } else {
          setError(res.error || 'Authentication failed.');
        }
      } else {
        const res = await authRegister(email, password, name);
        if (res.success && res.token) {
          playDivineChime();
          setSuccessMsg('Sovereign account created! Welcome to Brahma.');
          setTimeout(() => {
            setAuth(res.user, res.token);
            if (onClose) onClose();
          }, 600);
        } else {
          setError(res.error || 'Registration failed.');
        }
      }
    } catch (err) {
      setError(err.message || 'Connection to authentication gateway failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestAccess = async () => {
    setError(null);
    setLoading(true);
    playTactileClick();

    try {
      const res = await authGuest();
      if (res.success && res.token) {
        playDivineChime();
        setSuccessMsg('Entering as Sovereign Guest Explorer...');
        setTimeout(() => {
          setAuth(res.user, res.token);
          if (onClose) onClose();
        }, 500);
      } else {
        // Local fallback
        const guestUser = {
          id: 'usr_guest_' + Date.now().toString(36),
          email: 'guest@brahma.ai',
          name: 'Sovereign Guest',
          tier: 'Guest Explorer',
          avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=guest',
          isGuest: true
        };
        setAuth(guestUser, 'guest_tok_' + Date.now());
        if (onClose) onClose();
      }
    } catch (_) {
      // Local fallback in offline mode
      const guestUser = {
        id: 'usr_guest_' + Date.now().toString(36),
        email: 'guest@brahma.ai',
        name: 'Sovereign Guest',
        tier: 'Guest Explorer',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=guest',
        isGuest: true
      };
      setAuth(guestUser, 'guest_tok_' + Date.now());
      if (onClose) onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = () => {
    playTactileClick();
    setEmail('sovereign@brahma.ai');
    setPassword('brahma-sovereign');
    setMode('login');
    setError(null);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at center, rgba(15, 23, 42, 0.92) 0%, rgba(3, 7, 18, 0.98) 100%)',
      backdropFilter: 'blur(16px)',
      padding: '16px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: 460,
        background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(4, 7, 16, 0.98) 100%)',
        border: '1px solid rgba(251, 191, 36, 0.3)',
        borderRadius: 20,
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(251, 191, 36, 0.15)',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Top Ornate Aura Bar */}
        <div style={{
          height: 4,
          background: 'linear-gradient(90deg, #d97706, #fbbf24, #f59e0b, #d97706)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 3s ease infinite'
        }} />

        {/* Optional Close Button (if user is authenticated or guest) */}
        {onClose && (
          <button
            onClick={() => { playTactileClick(); onClose(); }}
            title="Dismiss"
            style={{
              position: 'absolute',
              top: 14,
              right: 14,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              width: 32,
              height: 32,
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#fbbf24'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'; }}
          >
            <X size={16} />
          </button>
        )}

        <div style={{ padding: '28px 28px 24px' }}>
          {/* Header Brand */}
          <div style={{ textAlign: 'center', marginBottom: 22 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 52,
              height: 52,
              borderRadius: 16,
              background: 'radial-gradient(circle, rgba(251, 191, 36, 0.2) 0%, rgba(217, 119, 6, 0.05) 100%)',
              border: '1px solid rgba(251, 191, 36, 0.4)',
              color: '#fbbf24',
              marginBottom: 10,
              boxShadow: '0 0 20px rgba(251, 191, 36, 0.2)'
            }}>
              <Shield size={26} />
            </div>
            <h2 style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '1.45rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              color: '#f8fafc',
              margin: '0 0 4px',
              textShadow: '0 2px 10px rgba(0,0,0,0.5)'
            }}>
              BRAHMA SOVEREIGN GATE
            </h2>
            <p style={{
              fontSize: '0.78rem',
              color: '#fbbf24',
              letterSpacing: '0.04em',
              margin: 0,
              fontWeight: 600,
              textTransform: 'uppercase'
            }}>
              ◈ Level 4.2 Supreme Frontier Neural Ecosystem ◈
            </p>
          </div>

          {/* Mode Switch Tabs */}
          <div style={{
            display: 'flex',
            background: 'rgba(2, 6, 23, 0.7)',
            borderRadius: 12,
            padding: 4,
            border: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: 20
          }}>
            <button
              type="button"
              onClick={() => { playTactileClick(); setMode('login'); setError(null); }}
              style={{
                flex: 1,
                padding: '9px 0',
                border: 'none',
                borderRadius: 8,
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: mode === 'login' ? 'linear-gradient(135deg, #d97706, #b45309)' : 'transparent',
                color: mode === 'login' ? '#ffffff' : '#94a3b8',
                boxShadow: mode === 'login' ? '0 2px 8px rgba(217, 119, 6, 0.3)' : 'none'
              }}
            >
              Sign In (Praveśa)
            </button>
            <button
              type="button"
              onClick={() => { playTactileClick(); setMode('register'); setError(null); }}
              style={{
                flex: 1,
                padding: '9px 0',
                border: 'none',
                borderRadius: 8,
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: mode === 'register' ? 'linear-gradient(135deg, #d97706, #b45309)' : 'transparent',
                color: mode === 'register' ? '#ffffff' : '#94a3b8',
                boxShadow: mode === 'register' ? '0 2px 8px rgba(217, 119, 6, 0.3)' : 'none'
              }}
            >
              Create Account (Sṛṣṭi)
            </button>
          </div>

          {/* Error & Success Banners */}
          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 14px',
              borderRadius: 10,
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
              fontSize: '0.78rem',
              marginBottom: 16
            }}>
              <AlertCircle size={15} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 14px',
              borderRadius: 10,
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              color: '#6ee7b7',
              fontSize: '0.78rem',
              marginBottom: 16
            }}>
              <CheckCircle size={15} style={{ flexShrink: 0 }} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>
                  Full Name / Sovereign Moniker
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(2, 6, 23, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: 10,
                  padding: '0 12px',
                  transition: 'border-color 0.2s'
                }}>
                  <User size={15} color="#94a3b8" />
                  <input
                    type="text"
                    placeholder="e.g. Samrudh / Cosmic Pioneer"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: '#f8fafc',
                      padding: '11px 10px',
                      fontSize: '0.86rem'
                    }}
                  />
                </div>
              </div>
            )}

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>
                Email Address
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(2, 6, 23, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 10,
                padding: '0 12px'
              }}>
                <Mail size={15} color="#94a3b8" />
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#f8fafc',
                    padding: '11px 10px',
                    fontSize: '0.86rem'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>
                Cryptographic Password
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(2, 6, 23, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 10,
                padding: '0 12px'
              }}>
                <Lock size={15} color="#94a3b8" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#f8fafc',
                    padding: '11px 10px',
                    fontSize: '0.86rem'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 4 }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 10,
                border: 'none',
                background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
                color: '#020617',
                fontWeight: 800,
                fontSize: '0.9rem',
                letterSpacing: '0.04em',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 4px 15px rgba(251, 191, 36, 0.25)',
                transition: 'all 0.2s',
                opacity: loading ? 0.7 : 1
              }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; }}
            >
              {loading ? (
                <>Verifying Matrix...</>
              ) : mode === 'login' ? (
                <>
                  <Key size={16} /> Enter Sovereign Workspace <ArrowRight size={16} />
                </>
              ) : (
                <>
                  <Sparkles size={16} /> Register Sovereign Account <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            margin: '18px 0 14px',
            color: '#475569',
            fontSize: '0.72rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255, 255, 255, 0.08)' }} />
            <span style={{ padding: '0 10px' }}>or instant access</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255, 255, 255, 0.08)' }} />
          </div>

          {/* 1-Click Guest & Demo Buttons */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <button
              type="button"
              onClick={handleGuestAccess}
              disabled={loading}
              style={{
                flex: 1,
                padding: '9px 12px',
                borderRadius: 9,
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#e2e8f0',
                fontSize: '0.76rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#fbbf24'; e.currentTarget.style.color = '#fbbf24'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'; e.currentTarget.style.color = '#e2e8f0'; }}
            >
              <Zap size={14} color="#fbbf24" /> Continue as Guest
            </button>

            <button
              type="button"
              onClick={handleDemoFill}
              style={{
                flex: 1,
                padding: '9px 12px',
                borderRadius: 9,
                background: 'rgba(251, 191, 36, 0.08)',
                border: '1px solid rgba(251, 191, 36, 0.2)',
                color: '#fbbf24',
                fontSize: '0.76rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(251, 191, 36, 0.15)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(251, 191, 36, 0.08)'; }}
            >
              ⚡ 1-Click Demo Fill
            </button>
          </div>

          {/* Footer Security Guarantee */}
          <div style={{
            textAlign: 'center',
            fontSize: '0.68rem',
            color: '#64748b',
            lineHeight: 1.4,
            marginTop: 10
          }}>
            🔒 100% Sovereign Cryptographic Security • Zero Cloud Lock-in • Powered by Brahma WAL Engine
          </div>
        </div>
      </div>
    </div>
  );
}
