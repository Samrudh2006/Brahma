import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowUp, Mic, Plus, Paperclip, Globe, Code,
  Brain, Calendar, Zap, X, Search, Sparkles, Languages
} from 'lucide-react';
import { IDENTITIES } from '@data/identities';
import { SUPPORTED_LANGUAGES, createSpeechRecognizer } from '@utils/speech';

const ACTION_MENU_ITEMS = [
  { id: 'file',     icon: Paperclip, label: 'Upload File',            hint: 'PDF, image, code, data' },
  { id: 'discovery',icon: Code,      label: 'DeepMind FunSearch Lab', hint: 'Mutate & discover algorithms' },
  { id: 'coconut',  icon: Brain,     label: 'CoconutMind Reasoner',   hint: 'Continuous latent manifold' },
  { id: 'genesis',  icon: Zap,       label: 'Genesis OS Swarm',       hint: 'Autonomous multi-agent kernel' },
];

export default function HeroSection({ currentIdentity, onSendPrompt, onOpenStudio, onSelectIdentity }) {
  const [inputText, setInputText] = useState('');
  const [activePills, setActivePills] = useState({ attach: false, search: false, code: false, think: false });
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [showActionMenu, setShowActionMenu] = useState(false);
  
  // @Mention Intelligence / Agent Selector State
  const [showMentionPopover, setShowMentionPopover] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionIndex, setMentionIndex] = useState(0);
  const [selectedIdentity, setSelectedIdentity] = useState(null);

  // Voice STT State
  const [selectedVoiceLang, setSelectedVoiceLang] = useState('en-US');
  const [isListening, setIsListening] = useState(false);
  const recognizerRef = useRef(null);

  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const toggleSpeechRecognition = () => {
    if (isListening) {
      if (recognizerRef.current) {
        recognizerRef.current.stop();
      }
      setIsListening(false);
    } else {
      const recognizer = createSpeechRecognizer(
        selectedVoiceLang,
        (res) => {
          if (res.text) {
            setInputText(prev => {
              const cleaned = prev.replace(/\(Listening\.\.\.\)/g, '').trim();
              return cleaned ? `${cleaned} ${res.text}` : res.text;
            });
          }
        },
        (err) => {
          console.warn('STT Error:', err);
          setIsListening(false);
        },
        () => {
          setIsListening(false);
        }
      );

      if (recognizer) {
        recognizerRef.current = recognizer;
        try {
          recognizer.start();
          setIsListening(true);
        } catch (e) {
          console.error(e);
          setIsListening(false);
        }
      } else {
        alert('Web Speech API is not supported in this browser environment.');
      }
    }
  };

  // Watch input text for '@' character
  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputText(val);

    const lastWord = val.split(/\s+/).pop();
    if (lastWord && lastWord.startsWith('@')) {
      const q = lastWord.slice(1).toLowerCase();
      setMentionQuery(q);
      setShowMentionPopover(true);
      setMentionIndex(0);
    } else {
      setShowMentionPopover(false);
    }
  };

  // Filter across the 13 Supreme Divine Intelligence Councils
  const filteredIdentities = IDENTITIES.filter((item) => {
    if (!mentionQuery) return true;
    return (
      item.name.toLowerCase().includes(mentionQuery) ||
      item.title.toLowerCase().includes(mentionQuery) ||
      item.domain.toLowerCase().includes(mentionQuery) ||
      item.underlyingModel.toLowerCase().includes(mentionQuery)
    );
  });

  const selectIdentity = (identity) => {
    setSelectedIdentity(identity);
    if (onSelectIdentity) {
      onSelectIdentity(identity);
    }
    // Replace the trailing @word with @IdentityName
    const words = inputText.split(/\s+/);
    words.pop();
    const newText = [...words, `@${identity.name}`].join(' ').trim() + ' ';
    setInputText(newText);
    setShowMentionPopover(false);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (showMentionPopover && filteredIdentities.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setMentionIndex((i) => (i + 1) % filteredIdentities.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setMentionIndex((i) => (i - 1 + filteredIdentities.length) % filteredIdentities.length);
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        selectIdentity(filteredIdentities[mentionIndex]);
        return;
      }
      if (e.key === 'Escape') {
        setShowMentionPopover(false);
        return;
      }
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const togglePill = (pill) => {
    setActivePills((p) => ({ ...p, [pill]: !p[pill] }));
  };

  const handleSend = () => {
    if (!inputText.trim() && attachedFiles.length === 0) return;
    onSendPrompt(inputText, activePills);
    setInputText('');
    setAttachedFiles([]);
    setSelectedIdentity(null);
    setActivePills({ attach: false, search: false, code: false, think: false });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    setAttachedFiles((prev) => [...prev, ...files]);
    e.target.value = '';
  };

  const removeFile = (idx) => setAttachedFiles((f) => f.filter((_, i) => i !== idx));

  return (
    <div className="hero-container" onClick={() => { setShowActionMenu(false); setShowMentionPopover(false); }}>
      <input type="file" ref={fileInputRef} style={{ display: 'none' }} multiple onChange={handleFileChange} />

      {/* 1. Ornate Central Mandala Seal (Dynamic portrait per current identity) */}
      <div
        className="brahma-central-mandala-seal animate-fade-in"
        key={currentIdentity.id}
        onClick={() => onOpenStudio && onOpenStudio('discovery')}
        title={`${currentIdentity.name} Intelligence — Click to launch Nova Discovery`}
      >
        <div className="mandala-glow-backdrop" />
        <div className="mandala-outer-ring" />
        <div className="mandala-inner-frame">
          <img src={currentIdentity.portrait} alt={currentIdentity.name} className="mandala-portrait-img" />
        </div>
      </div>

      {/* 2. Hero Titles */}
      <h1 className="hero-title">How can I help?</h1>
      <p className="hero-subtitle">Ask anything — learn, create, research, plan, build, or simply think with me.</p>

      {/* 3. Prompt Bar with @Mention Support */}
      <div className="prompt-bar-wrapper" onClick={(e) => e.stopPropagation()} style={{ position: 'relative' }}>
        
        {/* @Mention Floating Autocomplete Popover (13 Supreme Divine Councils) */}
        {showMentionPopover && filteredIdentities.length > 0 && (
          <div style={{
            position: 'absolute',
            bottom: '100%',
            left: 0,
            right: 0,
            marginBottom: 12,
            background: 'rgba(8, 14, 24, 0.96)',
            border: '1px solid rgba(212, 175, 55, 0.45)',
            backdropFilter: 'blur(22px)',
            borderRadius: 'var(--r-md)',
            boxShadow: '0 12px 48px rgba(0,0,0,0.85), 0 0 25px rgba(212,175,55,0.25)',
            zIndex: 100,
            overflow: 'hidden',
            maxHeight: 320,
            overflowY: 'auto'
          }}>
            <div style={{
              padding: '10px 16px',
              fontSize: '0.74rem',
              color: 'var(--accent-gold)',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'rgba(212,175,55,0.06)'
            }}>
              <span>⚡ SUMMON INTELLIGENCE COUNCIL ({filteredIdentities.length} IDENTITIES)</span>
              <span style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>Use ↑↓ and Enter</span>
            </div>

            {filteredIdentities.map((item, i) => (
              <div
                key={item.id}
                onClick={() => selectIdentity(item)}
                style={{
                  padding: '11px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: i === mentionIndex ? 'rgba(212, 175, 55, 0.18)' : (currentIdentity.id === item.id ? 'rgba(212,175,55,0.08)' : 'transparent'),
                  cursor: 'pointer',
                  borderBottom: '1px solid rgba(255,255,255,0.03)',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img
                    src={item.portrait}
                    alt={item.name}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      border: `1.5px solid ${item.accentColor}`,
                      objectFit: 'cover'
                    }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        @{item.name}
                      </span>
                      {/* Model Engine Badge with Provider Logo */}
                      <span style={{
                        fontSize: '0.66rem',
                        fontWeight: 700,
                        padding: '1px 8px',
                        borderRadius: '10px',
                        background: item.badgeBg || 'rgba(212,175,55,0.15)',
                        border: `1px solid ${item.badgeBorder || 'var(--accent-gold)'}`,
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4
                      }}>
                        <span>{item.providerLogo}</span> {item.underlyingModel}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                      {item.title}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.7rem', color: item.accentColor, fontWeight: 700 }}>
                    {item.badgeText}
                  </span>
                  <div style={{ fontSize: '0.64rem', color: '#4ade80', marginTop: 2 }}>
                    ⚡ {item.swarmCount} Backend Swarms
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Popover Menu */}
        {showActionMenu && (
          <div className="action-popover-menu">
            {ACTION_MENU_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  className="popover-item"
                  onClick={() => {
                    if (item.id === 'file') fileInputRef.current?.click();
                    if (item.id === 'discovery' && onOpenStudio) onOpenStudio('discovery');
                    if (item.id === 'coconut' && onOpenStudio) onOpenStudio('coconut');
                    if (item.id === 'genesis' && onOpenStudio) onOpenStudio('genesis');
                    setShowActionMenu(false);
                  }}
                >
                  <Icon size={15} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 500 }}>{item.label}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.hint}</div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Attached Files & Selected Identity Badge Row */}
        {(attachedFiles.length > 0 || selectedIdentity) && (
          <div className="attached-files-row" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {selectedIdentity && (
              <div className="attached-file-chip" style={{ background: 'rgba(212,175,55,0.2)', borderColor: 'var(--accent-gold)', color: 'var(--accent-gold)' }}>
                <span>{selectedIdentity.icon} Active Council: @{selectedIdentity.name} ({selectedIdentity.underlyingModel})</span>
                <button className="remove-chip-btn" onClick={() => setSelectedIdentity(null)}><X size={11} /></button>
              </div>
            )}
            {attachedFiles.map((file, i) => (
              <div key={i} className="attached-file-chip">
                <Paperclip size={12} />
                <span>{file.name}</span>
                <button className="remove-chip-btn" onClick={() => removeFile(i)}><X size={11} /></button>
              </div>
            ))}
          </div>
        )}

        {/* Input Area */}
        <textarea
          ref={textareaRef}
          className="prompt-input"
          placeholder={`Ask ${currentIdentity.name || 'Brahma'} anything... (Type @ to summon 13 Intelligence Councils)`}
          value={inputText}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          rows={1}
        />

        {/* Actions Row (Pills & Controls) */}
        <div className="prompt-actions-row">
          <div className="prompt-pills-left">
            <button
              className={`action-pill ${showActionMenu ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setShowActionMenu((v) => !v);
              }}
              title="Action Menu"
            >
              <Plus size={14} />
            </button>
            <button
              className={`action-pill ${activePills.attach ? 'active' : ''}`}
              onClick={() => {
                togglePill('attach');
                fileInputRef.current?.click();
              }}
            >
              <Paperclip size={14} /> Attach
            </button>
            <button
              className={`action-pill ${activePills.search ? 'active' : ''}`}
              onClick={() => togglePill('search')}
            >
              <Globe size={14} /> Search
            </button>
            <button
              className={`action-pill ${activePills.code ? 'active' : ''}`}
              onClick={() => togglePill('code')}
              title="Open NovaDiscovery Code Studio"
            >
              <Code size={14} /> Code
            </button>
            <button
              className={`action-pill ${activePills.think ? 'active' : ''}`}
              onClick={() => togglePill('think')}
              title="Open CoconutMind Latent Reasoner"
            >
              <Sparkles size={14} /> Think
            </button>

            {/* Multi-Lingual Language Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: '2px 8px' }}>
              <Languages size={12} color="#fbbf24" />
              <select
                value={selectedVoiceLang}
                onChange={(e) => setSelectedVoiceLang(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#fbbf24',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {SUPPORTED_LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code} style={{ background: '#0a0f1c', color: '#fff' }}>
                    {lang.flag} {lang.nativeName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="prompt-controls-right">
            <button
              className={`mic-btn ${isListening ? 'recording' : ''}`}
              onClick={toggleSpeechRecognition}
              title={isListening ? 'Listening... Click to Stop' : 'Click to Speak (Multi-Lingual STT)'}
            >
              {isListening ? (
                <div className="voice-waveform">
                  {[0, 1, 2, 3, 4].map((i) => <div key={i} className="voice-bar" />)}
                </div>
              ) : (
                <Mic size={18} />
              )}
            </button>
            <button className="send-btn" onClick={handleSend} title="Send query">
              <ArrowUp size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Action Cards Grid */}
      <div className="action-cards-grid">
        <button className="action-card card-purple" onClick={() => onOpenStudio && onOpenStudio('genesis')}>
          <div className="card-content-left">
            <div className="card-icon-wrapper"><Zap size={16} className="card-icon" /></div>
            <span className="card-title">Start a task</span>
          </div>
          <span className="card-arrow">›</span>
        </button>

        <button className="action-card card-blue" onClick={() => onOpenStudio && onOpenStudio('coconut')}>
          <div className="card-content-left">
            <div className="card-icon-wrapper"><Search size={16} className="card-icon" /></div>
            <span className="card-title">Search & research</span>
          </div>
          <span className="card-arrow">›</span>
        </button>

        <button className="action-card card-teal" onClick={() => onOpenStudio && onOpenStudio('discovery')}>
          <div className="card-content-left">
            <div className="card-icon-wrapper"><Sparkles size={16} className="card-icon" /></div>
            <span className="card-title">Create something</span>
          </div>
          <span className="card-arrow">›</span>
        </button>

        <button className="action-card card-amber" onClick={() => onOpenStudio && onOpenStudio('genesis')}>
          <div className="card-content-left">
            <div className="card-icon-wrapper"><Calendar size={16} className="card-icon" /></div>
            <span className="card-title">Plan & organize</span>
          </div>
          <span className="card-arrow">›</span>
        </button>
      </div>
    </div>
  );
}
