import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowUp, Mic, Plus, Paperclip, Globe, Code, Brain,
  Check, Copy, Trash2, RefreshCw, ThumbsUp, ThumbsDown, X, Clock,
  Volume2, VolumeX, Star, Sparkles, Languages, Download, Printer, FileDown
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark.css';
import { useAutoScroll } from '@hooks/index';
import { IDENTITIES } from '@data/identities';
import { lsGet, lsSet } from '@utils/index';
import { SUPPORTED_LANGUAGES, speakText, stopSpeaking, createSpeechRecognizer } from '@utils/speech';

// ─── Thought Block ────────────────────────────────────────────────────────────
function ThoughtBlock({ text }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className={`thought-block${expanded ? '' : ' collapsed'}`} onClick={() => setExpanded((v) => !v)}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: expanded ? 6 : 0 }}>
        <Brain size={12} style={{ color: 'var(--identity-accent)', flexShrink: 0 }} />
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--accent-gold)', fontStyle: 'normal', fontWeight: 500 }}>
          {expanded ? 'Hide reasoning' : 'Show reasoning'}
        </span>
      </div>
      <div className="thought-content" style={{ marginTop: 4 }}>{text}</div>
    </div>
  );
}

// ─── Code block with header ───────────────────────────────────────────────────
function CodeBlock({ lang = 'code', children }) {
  const [copied, setCopied] = useState(false);
  const code = String(children).trim();
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="code-block-wrapper">
      <div className="code-block-header">
        <span className="code-lang-badge">{lang}</span>
        <button className="code-copy-btn" onClick={handleCopy}>
          {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
        </button>
      </div>
      <pre className="hljs-code"><code>{code}</code></pre>
    </div>
  );
}

// ─── Thinking Indicator ───────────────────────────────────────────────────────
function ThinkingIndicator({ identity }) {
  return (
    <div className="chat-msg assistant">
      <img src={identity.portrait} alt={identity.name} className="chat-msg-avatar" />
      <div className="chat-msg-bubble" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Brain size={15} style={{ color: 'var(--identity-accent)', animation: 'spin 2s linear infinite' }} />
        <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', fontStyle: 'italic' }}>
          {identity.name} is synthesizing across 13 Councils...
        </span>
        <div className="thinking-dots">
          <div className="thinking-dot" /><div className="thinking-dot" /><div className="thinking-dot" />
        </div>
      </div>
    </div>
  );
}

// ─── Single Message ───────────────────────────────────────────────────────────
function ChatMessage({ msg, identity, onCopy, onRerun, onFavorite, onSpeak, isSpeakingThis, onLayaTransform, onJeevTransform }) {
  const isUser = msg.sender === 'user';
  const avatarSrc = isUser ? '/assets/identities/brahma.png' : (msg.identity?.portrait || identity.portrait);
  const senderName = isUser ? 'You' : (msg.identity?.name || identity.name);

  return (
    <div className={`chat-msg${isUser ? ' user' : ''}`}>
      <img src={avatarSrc} alt={senderName} className="chat-msg-avatar"
        onError={(e) => { e.target.src = '/assets/identities/brahma.png'; }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxWidth: 700, width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-display)', color: 'var(--accent-gold-bright)' }}>
            {senderName}
          </span>
          {msg.mode === 'laya' && (
            <span style={{
              fontSize: '0.62rem',
              fontWeight: 700,
              padding: '1px 7px',
              borderRadius: '10px',
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              color: '#38bdf8',
              letterSpacing: '0.04em'
            }}>
              🌀 LAYA DISTILLED
            </span>
          )}
          {msg.mode === 'jeev' && (
            <span style={{
              fontSize: '0.62rem',
              fontWeight: 700,
              padding: '1px 7px',
              borderRadius: '10px',
              background: 'rgba(236, 72, 153, 0.15)',
              border: '1px solid rgba(236, 72, 153, 0.4)',
              color: '#ec4899',
              letterSpacing: '0.04em'
            }}>
              ⚡ JĪVA CONSCIOUSNESS
            </span>
          )}
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <div className="chat-msg-bubble">
          {msg.thought && <ThoughtBlock text={msg.thought} />}

          {msg.codeOutput
            ? (
              <>
                <div className="md-content" style={{ marginBottom: 10 }}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                    {msg.text}
                  </ReactMarkdown>
                </div>
                <CodeBlock lang="javascript">{msg.codeOutput}</CodeBlock>
              </>
            )
            : (
              <div className="md-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                  {msg.text}
                </ReactMarkdown>
              </div>
            )
          }

          {/* Message actions */}
          {!isUser && (
            <div className="msg-actions" style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
              {/* Integrated Laya & Jiva Quick Message Transformers */}
              <button
                className="msg-action-btn"
                onClick={() => onLayaTransform && onLayaTransform(msg)}
                title="लय (Laya): Distill this synthesis to its pure core essence & sutras"
                style={{ color: '#38bdf8', background: 'rgba(56, 189, 248, 0.08)', borderColor: 'rgba(56, 189, 248, 0.3)' }}
              >
                🌀 Laya (Distill)
              </button>
              <button
                className="msg-action-btn"
                onClick={() => onJeevTransform && onJeevTransform(msg)}
                title="जीव (Jīva): Enliven with full vitality, actionable blueprints & living consciousness"
                style={{ color: '#ec4899', background: 'rgba(236, 72, 153, 0.08)', borderColor: 'rgba(236, 72, 153, 0.3)' }}
              >
                ⚡ Jīva (Enliven)
              </button>

              <button
                className="msg-action-btn"
                onClick={() => onSpeak(msg)}
                title={isSpeakingThis ? "Stop Voice Playback" : "Read Aloud (TTS)"}
                style={{ color: isSpeakingThis ? '#fbbf24' : undefined, fontWeight: isSpeakingThis ? 700 : undefined }}
              >
                {isSpeakingThis ? <><VolumeX size={12} /> Stop</> : <><Volume2 size={12} /> Read Aloud</>}
              </button>
              <button className="msg-action-btn" onClick={() => onCopy(msg.text)} title="Copy">
                <Copy size={12} /> Copy
              </button>
              <button className="msg-action-btn" onClick={() => onRerun(msg)} title="Regenerate">
                <RefreshCw size={12} /> Regenerate
              </button>
              <button className="msg-action-btn" onClick={() => onFavorite(msg)} title="Favorite">
                <Star size={12} /> Save
              </button>
              <button className="msg-action-btn" title="Helpful"><ThumbsUp size={12} /></button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


// ─── Main ChatView ────────────────────────────────────────────────────────────
export default function ChatView({ currentIdentity, messages, onSendMessage, isThinking, onNewChat, onSelectIdentity }) {
  const [inputText, setInputText] = useState('');
  const [activePills, setActivePills] = useState({ search: false, code: false, think: false, laya: false, jeev: false });
  const [showMentionPopover, setShowMentionPopover] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionIndex, setMentionIndex] = useState(0);

  // Voice STT / TTS state
  const [selectedVoiceLang, setSelectedVoiceLang] = useState('en-US');
  const [isListening, setIsListening] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState(null);
  const recognizerRef = useRef(null);

  const scrollRef = useAutoScroll([messages, isThinking]);
  
  const togglePill = (p) => {
    setActivePills((prev) => {
      if (p === 'laya') {
        return { ...prev, laya: !prev.laya, jeev: false };
      }
      if (p === 'jeev') {
        return { ...prev, jeev: !prev.jeev, laya: false };
      }
      return { ...prev, [p]: !prev[p] };
    });
  };

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

  const filteredIdentities = IDENTITIES.filter((a) => {
    if (!mentionQuery) return true;
    return (
      a.name.toLowerCase().includes(mentionQuery) ||
      a.title.toLowerCase().includes(mentionQuery) ||
      a.domain.toLowerCase().includes(mentionQuery) ||
      a.underlyingModel.toLowerCase().includes(mentionQuery)
    );
  });

  const selectMentionIdentity = (identity) => {
    if (onSelectIdentity) {
      onSelectIdentity(identity);
    }
    const words = inputText.split(/\s+/);
    words.pop();
    const newText = [...words, `@${identity.name}`].join(' ').trim() + ' ';
    setInputText(newText);
    setShowMentionPopover(false);
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
        selectMentionIdentity(filteredIdentities[mentionIndex]);
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

  const handleSend = () => {
    if (!inputText.trim()) return;
    stopSpeaking();
    setSpeakingMsgId(null);

    let query = inputText.trim();
    let pillsToSend = { ...activePills };

    // Auto slash-command detection inside chat
    if (query.startsWith('/laya')) {
      pillsToSend.laya = true;
      pillsToSend.jeev = false;
      query = query.replace(/^\/laya\s*/i, '').trim() || 'Distill current thread context to pure essence.';
    } else if (query.startsWith('/jev') || query.startsWith('/jeev')) {
      pillsToSend.jeev = true;
      pillsToSend.laya = false;
      query = query.replace(/^\/(jev|jeev)\s*/i, '').trim() || 'Enliven current thread with active living consciousness.';
    }

    onSendMessage(query, pillsToSend);
    setInputText('');
    setShowMentionPopover(false);
  };

  const handleLayaTransform = (msg) => {
    stopSpeaking();
    setSpeakingMsgId(null);
    onSendMessage(`[LAYA / लय]: Distill the essence of this synthesis into pure aphoristic sutras:\n\n"${msg.text.slice(0, 600)}"`, { laya: true });
  };

  const handleJeevTransform = (msg) => {
    stopSpeaking();
    setSpeakingMsgId(null);
    onSendMessage(`[JĪVA / जीव]: Enliven this synthesis with profound living consciousness, proactive reasoning, and actionable execution blueprints:\n\n"${msg.text.slice(0, 600)}"`, { jeev: true });
  };


  // TTS Reader
  const handleToggleSpeak = (msg) => {
    if (speakingMsgId === msg.timestamp) {
      stopSpeaking();
      setSpeakingMsgId(null);
    } else {
      stopSpeaking();
      setSpeakingMsgId(msg.timestamp);
      speakText(
        msg.text,
        selectedVoiceLang,
        () => setSpeakingMsgId(msg.timestamp),
        () => setSpeakingMsgId(null)
      );
    }
  };

  // STT Microphone Toggle
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

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleRerun = (msg) => {
    onSendMessage(msg.text, activePills);
  };

  const handleFavorite = (msg) => {
    const existing = lsGet('brahma-favorites', []);
    const favItem = {
      id: 'fav_' + Date.now(),
      text: msg.text,
      identity: msg.identity || currentIdentity,
      timestamp: new Date().toISOString()
    };
    lsSet('brahma-favorites', [favItem, ...existing]);
    alert('Message saved to Favorites!');
  };

  const handleExportMarkdown = () => {
    let md = `# BRAHMA Sovereign Intelligence Matrix — Conversation\n\n`;
    md += `*Generated:* ${new Date().toLocaleString('en-IN')}\n`;
    md += `*Primary Intelligence:* ${currentIdentity.name} (${currentIdentity.title || 'Supreme Council'})\n\n`;
    md += `---\n\n`;

    messages.forEach((m, idx) => {
      const sender = m.sender === 'user' ? 'User' : (m.identity?.name || currentIdentity.name);
      md += `### ${idx + 1}. [${sender}] (${new Date(m.timestamp).toLocaleTimeString()})\n\n`;
      if (m.thought) {
        md += `> **[Reasoning Path]**\n> ${m.thought.replace(/\n/g, '\n> ')}\n\n`;
      }
      md += `${m.text}\n\n`;
      md += `---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `brahma-session-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrintChat = () => {
    window.print();
  };

  const handleCopyFullChat = () => {
    let text = `BRAHMA Intelligence Session (${new Date().toLocaleDateString()}):\n\n`;
    messages.forEach((m) => {
      const sender = m.sender === 'user' ? 'User' : (m.identity?.name || currentIdentity.name);
      text += `[${sender}]:\n${m.text}\n\n`;
    });
    navigator.clipboard.writeText(text);
    alert('Full chat session copied to clipboard as clean Markdown!');
  };

  return (
    <div className="chat-view-container animate-fade-in">
      {/* Session Export & Metadata Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 16px',
        borderBottom: '1px solid rgba(212, 175, 55, 0.15)',
        background: 'rgba(8, 12, 20, 0.65)',
        backdropFilter: 'blur(10px)',
        fontSize: '0.78rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>
            {currentIdentity.name} Council
          </span>
          <span style={{ color: 'var(--text-muted)' }}>• {messages.length} messages</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            onClick={handleCopyFullChat}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: 'var(--text-secondary)',
              borderRadius: 6,
              padding: '4px 8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: '0.72rem'
            }}
            title="Copy entire conversation to clipboard"
          >
            <Copy size={12} /> Copy
          </button>

          <button
            onClick={handleExportMarkdown}
            style={{
              background: 'rgba(212, 175, 55, 0.12)',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              color: 'var(--accent-gold-bright)',
              borderRadius: 6,
              padding: '4px 10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: '0.72rem',
              fontWeight: 600
            }}
            title="Download complete session as .md document"
          >
            <Download size={12} /> Export .MD
          </button>

          <button
            onClick={handlePrintChat}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: 'var(--text-secondary)',
              borderRadius: 6,
              padding: '4px 8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: '0.72rem'
            }}
            title="Print or Save as PDF"
          >
            <Printer size={12} /> Print/PDF
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div className="chat-messages-scroll" ref={scrollRef}>
        {messages.map((m, i) => (
          <ChatMessage
            key={i}
            msg={m}
            identity={currentIdentity}
            onCopy={handleCopy}
            onRerun={handleRerun}
            onFavorite={handleFavorite}
            onSpeak={handleToggleSpeak}
            isSpeakingThis={speakingMsgId === m.timestamp}
            onLayaTransform={handleLayaTransform}
            onJeevTransform={handleJeevTransform}
          />
        ))}
        {isThinking && <ThinkingIndicator identity={currentIdentity} />}

      </div>

      {/* Floating Mention Autocomplete Popover */}
      <div className="chat-input-area" style={{ position: 'relative' }}>
        {showMentionPopover && filteredIdentities.length > 0 && (
          <div style={{
            position: 'absolute',
            bottom: '100%',
            left: 16,
            right: 16,
            marginBottom: 10,
            background: 'rgba(8, 14, 24, 0.96)',
            border: '1px solid rgba(212, 175, 55, 0.45)',
            backdropFilter: 'blur(20px)',
            borderRadius: 'var(--r-md)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.8), 0 0 20px rgba(212,175,55,0.2)',
            zIndex: 100,
            overflow: 'hidden',
            maxHeight: 260,
            overflowY: 'auto'
          }}>
            <div style={{
              padding: '8px 14px',
              fontSize: '0.72rem',
              color: 'var(--accent-gold)',
              fontWeight: 700,
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'rgba(212,175,55,0.06)'
            }}>
              <span>⚡ SUMMON INTELLIGENCE COUNCIL ({filteredIdentities.length} IDENTITIES)</span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Use ↑↓ and Enter</span>
            </div>
            {filteredIdentities.map((item, i) => (
              <div
                key={item.id}
                onClick={() => selectMentionIdentity(item)}
                style={{
                  padding: '9px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: i === mentionIndex ? 'rgba(212, 175, 55, 0.18)' : 'transparent',
                  cursor: 'pointer',
                  borderBottom: '1px solid rgba(255,255,255,0.03)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <img src={item.portrait} alt={item.name} style={{ width: 28, height: 28, borderRadius: '50%', border: `1px solid ${item.accentColor}` }} />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)' }}>@{item.name}</span>
                      <span style={{
                        fontSize: '0.62rem',
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: '10px',
                        background: item.badgeBg || 'rgba(212,175,55,0.15)',
                        border: `1px solid ${item.badgeBorder || 'var(--accent-gold)'}`,
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3
                      }}>
                        <span>{item.providerLogo}</span> {item.underlyingModel}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', marginTop: 2 }}>{item.title}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.68rem', color: item.accentColor, fontWeight: 700 }}>{item.badgeText}</span>
                  <div style={{ fontSize: '0.62rem', color: '#4ade80' }}>⚡ {item.swarmCount} Swarms</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="prompt-bar-wrapper" style={{ marginBottom: 0 }}>
          <textarea
            className="prompt-input"
            placeholder={`Message ${currentIdentity.name}... (Type /laya to distill, /jev to enliven, @ for councils)`}
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            rows={1}
            style={{ maxHeight: 160, overflowY: 'auto' }}
          />
          <div className="prompt-actions-row">
            <div className="prompt-pills-left" style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              {/* Sacred Laya & Jiva Integrated Cognitive Pills */}
              <button
                className={`action-pill ${activePills.laya ? 'active' : ''}`}
                onClick={() => togglePill('laya')}
                title="लय (Laya Mode): Pure concentrated essence, zero fluff, sutra-level clarity"
                style={{
                  borderColor: activePills.laya ? '#38bdf8' : undefined,
                  color: activePills.laya ? '#38bdf8' : undefined,
                  background: activePills.laya ? 'rgba(56, 189, 248, 0.18)' : undefined,
                  boxShadow: activePills.laya ? '0 0 12px rgba(56, 189, 248, 0.4)' : undefined
                }}
              >
                🌀 Laya (लय)
              </button>

              <button
                className={`action-pill ${activePills.jeev ? 'active' : ''}`}
                onClick={() => togglePill('jeev')}
                title="जीव (Jīva Mode): Living consciousness, proactive foresight, actionable vitality"
                style={{
                  borderColor: activePills.jeev ? '#ec4899' : undefined,
                  color: activePills.jeev ? '#ec4899' : undefined,
                  background: activePills.jeev ? 'rgba(236, 72, 153, 0.18)' : undefined,
                  boxShadow: activePills.jeev ? '0 0 12px rgba(236, 72, 153, 0.4)' : undefined
                }}
              >
                ⚡ Jīva (जीव)
              </button>

              <button className={`action-pill ${activePills.search ? 'active' : ''}`} onClick={() => togglePill('search')}>
                <Globe size={14} /> Search
              </button>
              <button className={`action-pill ${activePills.code ? 'active' : ''}`} onClick={() => togglePill('code')}>
                <Code size={14} /> Code
              </button>
              <button className={`action-pill ${activePills.think ? 'active' : ''}`} onClick={() => togglePill('think')}>
                <Brain size={14} /> Think
              </button>


              {/* Multi-Lingual STT/TTS Selector */}
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
                  <div className="voice-waveform">{[0,1,2,3,4].map(i=><div key={i} className="voice-bar"/>)}</div>
                ) : (
                  <Mic size={18} />
                )}
              </button>
              <button className="send-btn" onClick={handleSend}><ArrowUp size={20} /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
