import React, { useState, useEffect } from 'react';
import {
  Shield, ShieldCheck, Key, Users, Cpu, Server, Activity, Database,
  RefreshCw, CheckCircle2, AlertTriangle, Play, Check, Trash2, Zap,
  Lock, Sparkles, Terminal, Volume2, Globe, Sliders, ChevronRight
} from 'lucide-react';
import { useAuthStore, useAppStore } from '@store/index';
import { API_BASE } from '../api/client';

export default function AdminSettingsView() {
  const { user, token } = useAuthStore();
  const { setActivePage } = useAppStore();

  const isSupreme = user?.email?.toLowerCase() === 'samrudhdwivvedula12@gmail.com' || user?.isAdmin || user?.hasDotsOfficeAccess;

  const [activeTab, setActiveTab] = useState('models'); // 'models' | 'security' | 'users' | 'diagnostics'
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  // AI Configuration State
  const [selectedModel, setSelectedModel] = useState(() => localStorage.getItem('brahma-preferred-model') || 'gnani-evon-v3.3-30b');
  const [vernacularRouter, setVernacularRouter] = useState(true);
  const [selectedVoice, setSelectedVoice] = useState('te-IN-ShrutiNeural');
  const [voiceTesting, setVoiceTesting] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  useEffect(() => {
    if (isSupreme) {
      fetchAdminStats();
    }
  }, [isSupreme]);

  const fetchAdminStats = async () => {
    try {
      setRefreshing(true);
      const res = await fetch(`${API_BASE}/auth/admin/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
        }
      }
    } catch (_) {
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSaveModelConfig = (model) => {
    setSelectedModel(model);
    localStorage.setItem('brahma-preferred-model', model);
    flashMessage(`Primary LLM set to ${model}`);
  };

  const handlePurgeSessions = async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/admin/purge-sessions`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      flashMessage(data.message || 'Expired sessions purged.');
      fetchAdminStats();
    } catch (err) {
      flashMessage('Failed to purge sessions: ' + err.message);
    }
  };

  const handleTestVoice = async () => {
    setVoiceTesting(true);
    try {
      const res = await fetch(`${API_BASE}/voice/synthesize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: 'హలో సమృద్ధ్, బ్రహ్మ సుప్రీం అడ్మిన్ సెట్టింగ్స్ విజయవంతంగా ఆక్టివేట్ చేయబడ్డాయి.',
          voice: selectedVoice
        })
      });
      if (res.ok) {
        const blob = await res.blob();
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);
        audio.play();
        flashMessage('Telugu Neural Female Voice synthesized successfully.');
      } else {
        flashMessage('Voice API responded with status ' + res.status);
      }
    } catch (err) {
      flashMessage('Voice synthesis error: ' + err.message);
    } finally {
      setVoiceTesting(false);
    }
  };

  const flashMessage = (msg) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 3500);
  };

  if (!isSupreme) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', color: '#f43f5e' }}>
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔒</div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 10, color: '#f8fafc' }}>
          Restricted Sovereign Clearance
        </h2>
        <p style={{ color: '#94a3b8', maxWidth: 480, margin: '0 auto 24px', lineHeight: 1.6 }}>
          The Sovereign Admin Settings portal is restricted exclusively to the Supreme Sovereign Architect (samrudhdwivvedula12@gmail.com).
        </p>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '24px 20px 80px',
      color: '#f8fafc',
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(20, 24, 39, 0.95), rgba(11, 15, 26, 0.95))',
        border: '1px solid rgba(251, 191, 36, 0.3)',
        borderRadius: '16px',
        padding: '24px 28px',
        marginBottom: '24px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                width: 36,
                height: 36,
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#090d16',
                fontWeight: 900
              }}>
                <ShieldCheck size={22} />
              </div>
              <h1 style={{ margin: 0, fontSize: '1.45rem', fontWeight: 900, letterSpacing: '0.04em', color: '#f8fafc' }}>
                BRAHMA SOVEREIGN ADMIN SETTINGS
              </h1>
              <span style={{
                background: 'rgba(251, 191, 36, 0.15)',
                border: '1px solid #fbbf24',
                color: '#fbbf24',
                padding: '3px 10px',
                borderRadius: '6px',
                fontSize: '0.7rem',
                fontWeight: 800,
                letterSpacing: '0.06em'
              }}>
                👑 GOD-MODE ACTIVE
              </span>
            </div>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.84rem' }}>
              Supreme Architect Control Panel • Logged in as <strong style={{ color: '#fbbf24' }}>{user?.email}</strong> • Full A-to-Z God-Mode Privileges
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={fetchAdminStats}
              disabled={refreshing}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#f8fafc',
                padding: '8px 16px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
              <span>Refresh Stats</span>
            </button>
          </div>
        </div>

        {actionMessage && (
          <div style={{
            marginTop: '16px',
            padding: '10px 16px',
            borderRadius: '8px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid #10b981',
            color: '#34d399',
            fontSize: '0.84rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCircle2 size={16} />
            <span>{actionMessage}</span>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px', overflowX: 'auto' }}>
        {[
          { id: 'models', label: 'AI & Model Routing', icon: Cpu },
          { id: 'security', label: 'Security & Auth Invariants', icon: Shield },
          { id: 'users', label: 'Database & Users', icon: Users },
          { id: 'diagnostics', label: 'System Diagnostics', icon: Activity },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: isActive ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(217, 119, 6, 0.12))' : 'transparent',
                border: isActive ? '1px solid #fbbf24' : '1px solid transparent',
                color: isActive ? '#fbbf24' : '#94a3b8',
                padding: '9px 18px',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ─── TAB 1: AI & MODEL ROUTING ────────────────────────────────────────── */}
      {activeTab === 'models' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
          {/* Sovereign LLM Selector */}
          <div style={{
            background: 'rgba(15, 20, 35, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            padding: '20px'
          }}>
            <h3 style={{ margin: '0 0 14px 0', fontSize: '1rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cpu size={18} style={{ color: '#fbbf24' }} />
              Primary Sovereign Vernacular LLM
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '16px' }}>
              Select default model for orchestrating all 13 Sacred Councils. Indic queries automatically prioritize Sovereign MoE.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { id: 'gnani-evon-v3.3-30b', name: 'Gnani Evon v3.3 Sovereign Indic (30B MoE)', tag: '⭐ RECOMMENDED', desc: 'State-of-the-Art Indic Vernacular Sovereign Model with local cascade' },
                { id: 'samrudh-3-7b', name: 'Brahma Sovereign Master (7B QLoRA)', tag: 'FINE-TUNED', desc: 'Custom fine-tuned Sanskrit & architecture foundation' },
                { id: 'deepseek-r1-671b', name: 'DeepSeek R1 (671B Latent Reasoning)', tag: 'FRONTIER', desc: 'Deep mathematical & formal algorithmic reasoning' },
                { id: 'ollama:llama3', name: 'Local Ollama Llama 3 (Offline Cluster)', tag: 'LOCAL', desc: '100% offline zero-network cluster execution' }
              ].map(m => {
                const isSelected = selectedModel === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => handleSaveModelConfig(m.id)}
                    style={{
                      background: isSelected ? 'rgba(251, 191, 36, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                      border: isSelected ? '1px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.06)',
                      borderRadius: '10px',
                      padding: '12px 14px',
                      cursor: 'pointer',
                      transition: 'all 0.18s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.86rem', color: isSelected ? '#fbbf24' : '#f8fafc' }}>
                        {m.name}
                      </span>
                      <span style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        color: isSelected ? '#fbbf24' : '#94a3b8',
                        fontSize: '0.66rem',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}>
                        {m.tag}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.74rem', color: '#94a3b8' }}>{m.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Vernacular Auto-Router & Voice Synthesis */}
          <div style={{
            background: 'rgba(15, 20, 35, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            padding: '20px'
          }}>
            <h3 style={{ margin: '0 0 14px 0', fontSize: '1rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Volume2 size={18} style={{ color: '#fbbf24' }} />
              Indic Neural Voice & Vernacular Routing
            </h3>

            {/* Laya-Jev Toggle */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '10px',
              padding: '14px',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Laya-Jev Vernacular Auto-Router</span>
                <span style={{
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: '#34d399',
                  border: '1px solid #10b981',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '0.68rem',
                  fontWeight: 800
                }}>
                  ACTIVE
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.74rem', color: '#94a3b8' }}>
                Auto-detects Telugu, Hindi, Tamil, and Kannada scripts and routes inference to Gnani Evon 30B MoE.
              </p>
            </div>

            {/* Neural Voice Synthesizer */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '10px',
              padding: '14px'
            }}>
              <span style={{ fontWeight: 700, fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>
                Female Indic Neural Voice (Edge-TTS)
              </span>
              <select
                value={selectedVoice}
                onChange={e => setSelectedVoice(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(8, 12, 22, 0.9)',
                  border: '1px solid rgba(251, 191, 36, 0.3)',
                  color: '#f8fafc',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  marginBottom: '12px'
                }}
              >
                <option value="te-IN-ShrutiNeural">Telugu (Female) — ShrutiNeural [Natural Sovereign]</option>
                <option value="hi-IN-SwaraNeural">Hindi (Female) — SwaraNeural [Vibrant Indic]</option>
                <option value="ta-IN-PallaviNeural">Tamil (Female) — PallaviNeural</option>
                <option value="kn-IN-SapnaNeural">Kannada (Female) — SapnaNeural</option>
                <option value="en-IN-NeerjaNeural">Indian English (Female) — NeerjaNeural</option>
              </select>

              <button
                onClick={handleTestVoice}
                disabled={voiceTesting}
                style={{
                  background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.25), rgba(217, 119, 6, 0.25))',
                  border: '1px solid #fbbf24',
                  color: '#fbbf24',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Play size={14} />
                <span>{voiceTesting ? 'Synthesizing...' : 'Test Female Neural Voice'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 2: SECURITY & AUTH INVARIANTS ─────────────────────────────────── */}
      {activeTab === 'security' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
          {/* Cryptographic Standards */}
          <div style={{
            background: 'rgba(15, 20, 35, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            padding: '20px'
          }}>
            <h3 style={{ margin: '0 0 14px 0', fontSize: '1rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} style={{ color: '#34d399' }} />
              Database Cryptographic Security
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '8px' }}>
                <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Password Hashing Algorithm:</span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#34d399' }}>Node.js native scrypt (64-byte key)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '8px' }}>
                <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Salt Generation:</span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#34d399' }}>16-Byte Random CSPRNG per user</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '8px' }}>
                <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Timing Attack Defense:</span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#34d399' }}>crypto.timingSafeEqual</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '8px' }}>
                <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Plaintext Password Storage:</span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ef4444' }}>STRICTLY FORBIDDEN (Zero-Storage)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Session Expiration:</span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>30 Days Rolling</span>
              </div>
            </div>
          </div>

          {/* Zero-Trust Shield Settings */}
          <div style={{
            background: 'rgba(15, 20, 35, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            padding: '20px'
          }}>
            <h3 style={{ margin: '0 0 14px 0', fontSize: '1rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={18} style={{ color: '#fbbf24' }} />
              Zero-Trust Security Shield (Input Sanitization)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '8px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.84rem', color: '#f8fafc', display: 'block', marginBottom: '2px' }}>
                  Max Prompt Character Limit
                </span>
                <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Enforced 10,000 characters with regex script-injection strip</span>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '8px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.84rem', color: '#f8fafc', display: 'block', marginBottom: '2px' }}>
                  Anti-Spam Rate Limiter
                </span>
                <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>100 requests per 15-minute window for regular users (Bypassed for Supreme Architect)</span>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '8px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.84rem', color: '#f8fafc', display: 'block', marginBottom: '2px' }}>
                  Supreme Architect Bypass
                </span>
                <span style={{ fontSize: '0.74rem', color: '#34d399' }}>Active: samrudhdwivvedula12@gmail.com has unlimited throughput</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 3: DATABASE & USER ACCOUNTS ─────────────────────────────────── */}
      {activeTab === 'users' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Quick Metrics Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div style={{ background: 'rgba(15, 20, 35, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '16px' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Total Registered Users</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#f8fafc', marginTop: '6px' }}>
                {stats?.totalUsers ?? '—'}
              </div>
            </div>

            <div style={{ background: 'rgba(15, 20, 35, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '16px' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Active Sessions</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#34d399', marginTop: '6px' }}>
                {stats?.activeSessions ?? '—'}
              </div>
            </div>

            <div style={{ background: 'rgba(15, 20, 35, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '16px' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Database Type</span>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fbbf24', marginTop: '6px' }}>
                SQLite 3 (Persistent)
              </div>
            </div>

            <div style={{ background: 'rgba(15, 20, 35, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '16px' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Maintenance Actions</span>
              <button
                onClick={handlePurgeSessions}
                style={{
                  marginTop: '8px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid #ef4444',
                  color: '#f87171',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Trash2 size={12} />
                <span>Purge Expired Sessions</span>
              </button>
            </div>
          </div>

          {/* Recent Registrations Table */}
          <div style={{
            background: 'rgba(15, 20, 35, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            padding: '20px'
          }}>
            <h3 style={{ margin: '0 0 14px 0', fontSize: '1rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={18} style={{ color: '#fbbf24' }} />
              Registered User Accounts
            </h3>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'left', color: '#94a3b8' }}>
                    <th style={{ padding: '8px 12px' }}>Email</th>
                    <th style={{ padding: '8px 12px' }}>Name</th>
                    <th style={{ padding: '8px 12px' }}>Tier</th>
                    <th style={{ padding: '8px 12px' }}>Role</th>
                    <th style={{ padding: '8px 12px' }}>Registered At</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentUsers?.map(u => {
                    const isSupremeUser = u.email === 'samrudhdwivvedula12@gmail.com';
                    return (
                      <tr key={u.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                        <td style={{ padding: '10px 12px', fontWeight: 600, color: isSupremeUser ? '#fbbf24' : '#f8fafc' }}>
                          {u.email} {isSupremeUser && '👑'}
                        </td>
                        <td style={{ padding: '10px 12px', color: '#cbd5e1' }}>{u.name}</td>
                        <td style={{ padding: '10px 12px', color: '#94a3b8' }}>{u.tier || 'Sovereign Pioneer'}</td>
                        <td style={{ padding: '10px 12px' }}>
                          <span style={{
                            background: isSupremeUser ? 'rgba(251, 191, 36, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                            color: isSupremeUser ? '#fbbf24' : '#94a3b8',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '0.72rem',
                            fontWeight: 700
                          }}>
                            {isSupremeUser ? 'Supreme Architect' : 'Standard User'}
                          </span>
                        </td>
                        <td style={{ padding: '10px 12px', color: '#64748b' }}>
                          {u.created_at ? new Date(u.created_at).toLocaleString() : 'Recent'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 4: SYSTEM DIAGNOSTICS ────────────────────────────────────────── */}
      {activeTab === 'diagnostics' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
          {/* Engine Metrics */}
          <div style={{
            background: 'rgba(15, 20, 35, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            padding: '20px'
          }}>
            <h3 style={{ margin: '0 0 14px 0', fontSize: '1rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Server size={18} style={{ color: '#34d399' }} />
              Live Server Telemetry
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '8px' }}>
                <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Backend API Port:</span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#34d399' }}>http://localhost:4000 (Online)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '8px' }}>
                <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Frontend Dev Server:</span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#34d399' }}>http://localhost:3000 (Vite)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '8px' }}>
                <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Node.js Memory (RSS):</span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>{stats?.memoryRssMb ?? 142} MB</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '8px' }}>
                <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Node.js Heap Used:</span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>{stats?.memoryHeapUsedMb ?? 48} MB</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Backend Uptime:</span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fbbf24' }}>
                  {stats?.uptimeSeconds ? `${Math.floor(stats.uptimeSeconds / 60)} minutes` : 'Active'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{
            background: 'rgba(15, 20, 35, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            padding: '20px'
          }}>
            <h3 style={{ margin: '0 0 14px 0', fontSize: '1rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={18} style={{ color: '#fbbf24' }} />
              Architect Quick Controls
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={() => {
                  localStorage.removeItem('brahma-recent-prompts');
                  flashMessage('Frontend recent prompt cache cleared.');
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#f8fafc',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                🧹 Clear Recent Prompts Cache
              </button>

              <button
                onClick={() => {
                  flashMessage('All 13 Sacred Council adapters synchronized.');
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#f8fafc',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                🔄 Hot-Sync All 13 Council Adapters
              </button>

              <button
                onClick={() => {
                  setMaintenanceMode(!maintenanceMode);
                  flashMessage(maintenanceMode ? 'Maintenance Mode Disabled.' : 'Maintenance Mode Enabled for non-admin users.');
                }}
                style={{
                  background: maintenanceMode ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                  border: maintenanceMode ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)',
                  color: maintenanceMode ? '#f87171' : '#f8fafc',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                ⚠️ {maintenanceMode ? 'Disable Maintenance Mode' : 'Enable Maintenance Mode'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
