import React from 'react';
import { X, Play, Moon, Sun, Key, ShieldCheck, Command } from 'lucide-react';

export default function SettingsModal({ 
  onClose, 
  onReplaySplash, 
  theme, 
  setTheme 
}) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="identity-modal" style={{ maxWidth: '580px', padding: '24px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header" style={{ padding: '0 0 16px 0' }}>
          <div>
            <h2 className="modal-title">BRAHMA APPLICATION SETTINGS</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Configure visual theme, video splash intro, identity defaults, and keyboard shortcuts.
            </p>
          </div>
          <button className="close-modal-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', margin: '16px 0' }}>
          {/* Replay Splash Screen Video Button (Rule #1) */}
          <div style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid var(--accent-gold)', borderRadius: '14px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h4 style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-gold-bright)', marginBottom: 2 }}>
                Ceremonial Video Splash Screen
              </h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Replay the original BRAHMA intro video (`watermark-removed-usethislogoandregenrateth.mp4`).
              </p>
            </div>
            <button className="splash-btn" onClick={() => { onClose(); onReplaySplash(); }}>
              <Play size={14} /> Replay Splash
            </button>
          </div>

          {/* Theme Palette Chooser */}
          <div style={{ background: 'rgba(14,20,32,0.7)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '14px', padding: '16px' }}>
            <div style={{ marginBottom: 12 }}>
              <h4 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 2 }}>
                Visual Design & Sanskrit Aesthetic Themes (5 Themes)
              </h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Select your luxury ambient palette with instant live propagation.
              </p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
              {[
                { id: 'obsidian', name: '🌌 Cosmic Gold', color: '#fbbf24', desc: 'Obsidian & Gold' },
                { id: 'teal', name: '🦚 Mayūra Teal', color: '#2bb6bd', desc: 'Peacock & Emerald' },
                { id: 'cyberpunk', name: '🌆 Cyberpunk Kashi', color: '#ec4899', desc: 'Neon Violet & Cyan' },
                { id: 'surya', name: '🌅 Sūrya Solarized', color: '#f59e0b', desc: 'Crimson Amber' },
                { id: 'zen', name: '❄️ Himālaya Zen', color: '#38bdf8', desc: 'Frost & Midnight' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  style={{
                    background: theme === t.id ? 'rgba(251, 191, 36, 0.15)' : 'rgba(255,255,255,0.04)',
                    border: theme === t.id ? `1px solid ${t.color}` : '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 8,
                    padding: '10px 8px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                    textAlign: 'center'
                  }}
                >
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: t.color }} />
                  <span style={{ fontSize: '0.76rem', fontWeight: 800, color: theme === t.id ? t.color : '#fff' }}>{t.name}</span>
                  <span style={{ fontSize: '0.64rem', color: '#94a3b8' }}>{t.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Keyboard Shortcuts List */}
          <div style={{ background: 'rgba(14,20,32,0.7)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '14px', padding: '16px' }}>
            <h4 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 10 }}>
              Keyboard Shortcuts & Accessibility
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <div><kbd style={{ background: '#000', padding: '2px 6px', borderRadius: 4, color: 'var(--accent-gold)' }}>Ctrl + K</kbd> Command Palette</div>
              <div><kbd style={{ background: '#000', padding: '2px 6px', borderRadius: 4, color: 'var(--accent-gold)' }}>Esc</kbd> Close Modals</div>
              <div><kbd style={{ background: '#000', padding: '2px 6px', borderRadius: 4, color: 'var(--accent-gold)' }}>Enter</kbd> Send Message</div>
              <div><kbd style={{ background: '#000', padding: '2px 6px', borderRadius: 4, color: 'var(--accent-gold)' }}>Shift + Enter</kbd> Multi-line Prompt</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
