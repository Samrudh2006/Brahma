import React, { useState, useEffect } from 'react';
import { X, Play, Moon, Sun, Key, ShieldCheck, Command, Cpu, Check, Eye, EyeOff } from 'lucide-react';

export default function SettingsModal({ 
  onClose, 
  onReplaySplash, 
  theme, 
  setTheme 
}) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [preferredModel, setPreferredModel] = useState('deepseek-r1');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const storedKey = localStorage.getItem('brahma-user-api-key') || '';
    const storedModel = localStorage.getItem('brahma-preferred-model') || 'deepseek-r1';
    setApiKey(storedKey);
    setPreferredModel(storedModel);
  }, []);

  const handleSaveApiSettings = () => {
    if (apiKey.trim()) {
      localStorage.setItem('brahma-user-api-key', apiKey.trim());
    } else {
      localStorage.removeItem('brahma-user-api-key');
    }
    localStorage.setItem('brahma-preferred-model', preferredModel);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleClearApiKey = () => {
    localStorage.removeItem('brahma-user-api-key');
    setApiKey('');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };
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

          {/* Deep Frontier Engine & API Key Manager (Plan 4) */}
          <div style={{ background: 'rgba(14,20,32,0.85)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '14px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Key size={16} color="var(--accent-gold)" />
                <h4 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)', margin: 0, fontSize: '0.95rem' }}>
                  Deep Frontier Engine & Inference Keys
                </h4>
              </div>
              <span style={{
                fontSize: '0.68rem',
                padding: '3px 8px',
                borderRadius: '12px',
                background: apiKey ? 'rgba(16, 185, 129, 0.15)' : 'rgba(212, 175, 55, 0.15)',
                color: apiKey ? '#34d399' : '#fbbf24',
                border: apiKey ? '1px solid #10b981' : '1px solid var(--accent-gold)',
                fontWeight: 700
              }}>
                {apiKey ? '⚡ Custom BYOK Active' : '🏛️ Sovereign Auto-Cascade'}
              </span>
            </div>

            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 12 }}>
              Provide a Groq API Key (<code style={{ color: '#fbbf24' }}>gsk_...</code>) or OpenRouter key for ultra-fast, uncapped neural inference across 13 Councils. Keys are strictly kept locally in browser storage.
            </p>

            {/* Input & Action */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ position: 'relative' }}>
                <input
                  type={showKey ? 'text' : 'password'}
                  placeholder="Enter Groq / OpenRouter API Key (e.g. gsk_...)"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#090d16',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    borderRadius: 8,
                    padding: '8px 36px 8px 12px',
                    fontSize: '0.8rem',
                    color: '#f8fafc',
                    fontFamily: 'monospace',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  style={{
                    position: 'absolute',
                    right: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    padding: 4
                  }}
                  title={showKey ? 'Hide key' : 'Show key'}
                >
                  {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>

              {/* Model Selection Row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Cpu size={14} color="#94a3b8" />
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Preferred Engine:</span>
                </div>
                <select
                  value={preferredModel}
                  onChange={(e) => setPreferredModel(e.target.value)}
                  style={{
                    background: '#090d16',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: 6,
                    padding: '4px 8px',
                    fontSize: '0.75rem',
                    color: '#fbbf24',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="deepseek-r1">DeepSeek R1 (Sovereign Reasoner)</option>
                  <option value="llama-3.3-70b-versatile">Llama 3.3 70B Versatile (Groq Fast)</option>
                  <option value="mixtral-8x7b-32768">Mixtral 8x7B (32k Context)</option>
                  <option value="sovereign-matrix">Sovereign Matrix Synthesizer</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
                {apiKey && (
                  <button
                    onClick={handleClearApiKey}
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#f87171',
                      borderRadius: 6,
                      padding: '6px 12px',
                      fontSize: '0.76rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Clear Key
                  </button>
                )}
                <button
                  onClick={handleSaveApiSettings}
                  style={{
                    background: savedSuccess ? '#10b981' : 'linear-gradient(135deg, #fbbf24, #d97706)',
                    border: 'none',
                    color: savedSuccess ? '#fff' : '#000',
                    borderRadius: 6,
                    padding: '6px 16px',
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'all 0.2s'
                  }}
                >
                  {savedSuccess ? (
                    <>
                      <Check size={14} /> Saved & Active!
                    </>
                  ) : (
                    'Save Settings'
                  )}
                </button>
              </div>
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
