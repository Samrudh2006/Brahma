import React, { useState, useEffect } from 'react';
import { Star, X, Check, Sparkles, AlertTriangle, MessageSquare, Lightbulb, Shield, Send, CheckCircle2, ChevronRight, ThumbsUp } from 'lucide-react';
import { playTactileClick, playDivineChime } from '@utils/soundEffects';

const IMPROVEMENT_REGIONS = [
  { id: 'ui_themes', label: '🎨 UI / UX & Themes', desc: 'Theme switcher, aesthetics, glassmorphism' },
  { id: 'voice_stt', label: '🎙️ Voice & Telugu STT', desc: 'Continuous speech recognition, Telugu voice' },
  { id: 'speed_latency', label: '⚡ Speed & Token Latency', desc: 'Streaming speed, model response time' },
  { id: 'morning_digest', label: '📰 8AM Executive Digest', desc: 'Morning podcast, news summarization' },
  { id: 'coding_sandbox', label: '💻 Coding & AST Sandbox', desc: 'Syntax highlighting, code execution, diffs' },
  { id: 'react_engine', label: '🔍 ReAct Autonomous Agent', desc: 'Tool calling, multi-step search reasoning' },
  { id: 'market_feeds', label: '📈 Real-time Market Feeds', desc: 'Nifty, crypto, stock alpha data' },
  { id: 'mobile_pwa', label: '📱 Mobile & PWA Experience', desc: 'Mobile navigation, touch gestures, layout' },
  { id: 'governance_risk', label: '🔒 Governance & Risk Gate', desc: 'Action verification, zero-trust shield' }
];

const COMMON_BUGS = [
  { id: 'theme_glitch', label: 'Header Theme Button Glitch' },
  { id: 'voice_disconnect', label: 'Voice Audio Latency / Disconnect' },
  { id: 'model_timeout', label: 'Model Generation Timeout' },
  { id: 'mobile_overflow', label: 'Mobile Sidebar / Header Cutoff' },
  { id: 'copy_code_bug', label: 'Copy Code / Markdown Render Issue' },
  { id: 'slow_initial_load', label: 'Slow Studio Initial Load' }
];

const SUGGESTION_CHIPS = [
  '+ WhatsApp Assistant Bot',
  '+ Local Ollama Vision Models',
  '+ Instant PDF / Word Export',
  '+ Hindi & Tamil Native Voice',
  '+ Custom Sanskrit Soundscapes',
  '+ Full Dark OLED Obsidian Theme'
];

const RATING_DESCRIPTIONS = {
  1: { title: '🔴 Critical Issues', desc: 'Significant bugs encountered, needs immediate fixes.' },
  2: { title: '🟠 Needs Substantial Polish', desc: 'Functionality is partially working, but UX has friction.' },
  3: { title: '🟡 Decent & Functional', desc: 'Good foundation, but several features need refining.' },
  4: { title: '🟢 Great & Impressive', desc: 'Smooth performance, very useful daily AI system!' },
  5: { title: '🌟 Supreme & Sovereign', desc: 'Mindblowing 10/10 frontier AI ecosystem and UX!' }
};

export default function FeedbackModal({ isOpen, onClose, sessionDurationSec = 300 }) {
  const [stars, setStars] = useState(5);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedBugs, setSelectedBugs] = useState([]);
  const [bugDescription, setBugDescription] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [userContact, setUserContact] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        handleDismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting]);

  if (!isOpen) return null;

  const handleDismiss = () => {
    playTactileClick();
    sessionStorage.setItem('brahma-feedback-snoozed', 'true');
    onClose();
  };

  const handleToggleRegion = (regionId) => {
    playTactileClick();
    setSelectedRegions(prev => 
      prev.includes(regionId) ? prev.filter(id => id !== regionId) : [...prev, regionId]
    );
  };

  const handleToggleBug = (bugLabel) => {
    playTactileClick();
    setSelectedBugs(prev =>
      prev.includes(bugLabel) ? prev.filter(b => b !== bugLabel) : [...prev, bugLabel]
    );
  };

  const handleAddSuggestionChip = (chipText) => {
    playTactileClick();
    setSuggestions(prev => {
      if (prev.includes(chipText)) return prev;
      return prev ? `${prev}, ${chipText}` : chipText;
    });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    playTactileClick();
    setIsSubmitting(true);

    const activeRatingDesc = RATING_DESCRIPTIONS[stars]?.title || 'Standard Rating';

    const feedbackPayload = {
      stars,
      rating_label: activeRatingDesc,
      improve_regions: selectedRegions,
      broken_issues: selectedBugs,
      bug_description: bugDescription.trim(),
      suggestions: suggestions.trim(),
      user_contact: userContact.trim(),
      session_duration_sec: sessionDurationSec,
      user_agent: navigator.userAgent
    };

    try {
      // Save locally
      localStorage.setItem('brahma-feedback-submitted', JSON.stringify({
        timestamp: new Date().toISOString(),
        stars,
        regions: selectedRegions
      }));

      // POST to backend API
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      await fetch(`${API_BASE}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackPayload)
      }).catch(err => console.warn('Offline or fallback mode for feedback:', err));

      playDivineChime();
      setIsSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 2500);
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setIsSubmitted(true);
      setTimeout(() => onClose(), 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentDisplayStar = hoveredStar || stars;
  const ratingInfo = RATING_DESCRIPTIONS[currentDisplayStar] || RATING_DESCRIPTIONS[5];
  const minutesUsed = Math.max(1, Math.round(sessionDurationSec / 60));

  return (
    <div 
      className="feedback-modal-backdrop" 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(3, 7, 18, 0.85)',
        backdropFilter: 'blur(16px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.25s ease-out'
      }}
    >
      <div 
        className="feedback-modal-content"
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          backgroundColor: '#080d1a',
          backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(212, 175, 55, 0.12) 0%, rgba(8, 13, 26, 0.98) 75%)',
          border: '1px solid rgba(212, 175, 55, 0.35)',
          borderRadius: '20px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 40px rgba(212, 175, 55, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* Top Ornate Header */}
        <div style={{
          padding: '20px 24px 16px 24px',
          borderBottom: '1px solid rgba(212, 175, 55, 0.18)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(15, 23, 42, 0.6)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(245, 215, 127, 0.05))',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f5d77f'
            }}>
              <Sparkles size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{
                  margin: 0,
                  fontSize: '1.15rem',
                  fontFamily: "'Cinzel', serif",
                  fontWeight: 700,
                  color: '#f8f6f0',
                  letterSpacing: '0.04em'
                }}>
                  BRAHMA Experience & Feedback
                </h3>
                <span style={{
                  fontSize: '0.68rem',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  background: 'rgba(212, 175, 55, 0.15)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  color: '#f5d77f',
                  fontWeight: 600
                }}>
                  ⏱️ {minutesUsed}m Session
                </span>
              </div>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>
                Help shape the sovereign frontier AI ecosystem with your candid review.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s'
            }}
            title="Dismiss for now"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        {isSubmitted ? (
          <div style={{
            padding: '48px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px'
          }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'rgba(34, 197, 94, 0.15)',
              border: '2px solid rgba(34, 197, 94, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#4ade80'
            }}>
              <CheckCircle2 size={36} />
            </div>
            <h4 style={{
              margin: 0,
              fontSize: '1.4rem',
              fontFamily: "'Cinzel', serif",
              color: '#f5d77f'
            }}>
              Dhanyavadah! 🙏
            </h4>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#cbd5e1', maxWidth: '440px', lineHeight: 1.5 }}>
              Your feedback has been securely inscribed into the sovereign ledger. Our engineers and AI architects will review your suggestions immediately!
            </p>
            <div style={{
              marginTop: '12px',
              fontSize: '0.75rem',
              color: '#94a3b8'
            }}>
              Closing automatically...
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
            
            {/* 1. Star Rating Section */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.45)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              borderRadius: '14px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f5d77f', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                1. How was your experience overall?
              </div>

              {/* Interactive Stars */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', margin: '10px 0' }}>
                {[1, 2, 3, 4, 5].map((starNum) => {
                  const isFilled = (hoveredStar || stars) >= starNum;
                  return (
                    <button
                      key={starNum}
                      type="button"
                      onMouseEnter={() => setHoveredStar(starNum)}
                      onMouseLeave={() => setHoveredStar(0)}
                      onClick={() => {
                        playTactileClick();
                        setStars(starNum);
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        transform: (hoveredStar === starNum || stars === starNum) ? 'scale(1.2)' : 'scale(1)',
                        transition: 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)'
                      }}
                    >
                      <Star
                        size={32}
                        fill={isFilled ? '#fbbf24' : 'transparent'}
                        color={isFilled ? '#f59e0b' : '#64748b'}
                        style={{
                          filter: isFilled ? 'drop-shadow(0 0 10px rgba(251, 191, 36, 0.6))' : 'none',
                          transition: 'all 0.15s'
                        }}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Label */}
              <div style={{ marginTop: '6px' }}>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f8fafc' }}>
                  {ratingInfo.title}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>
                  {ratingInfo.desc}
                </div>
              </div>
            </div>

            {/* 2. Improvement Regions Selection */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Lightbulb size={16} color="#fbbf24" />
                <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#f8fafc' }}>
                  2. Which region or feature needs the most improvement?
                </label>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: '8px'
              }}>
                {IMPROVEMENT_REGIONS.map(region => {
                  const isSelected = selectedRegions.includes(region.id);
                  return (
                    <button
                      key={region.id}
                      type="button"
                      onClick={() => handleToggleRegion(region.id)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        padding: '9px 12px',
                        borderRadius: '10px',
                        background: isSelected ? 'rgba(212, 175, 55, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                        border: isSelected ? '1px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.08)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: isSelected ? '#f5d77f' : '#e2e8f0'
                      }}>
                        <span>{region.label}</span>
                        {isSelected && <Check size={14} color="#fbbf24" />}
                      </div>
                      <span style={{ fontSize: '0.66rem', color: '#94a3b8', marginTop: '3px' }}>
                        {region.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Bug Reporting & What is not working */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <AlertTriangle size={16} color="#f87171" />
                <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#f8fafc' }}>
                  3. What is not working / Bugs encountered?
                </label>
              </div>

              {/* Quick Bug Toggle Chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                {COMMON_BUGS.map(bug => {
                  const isChecked = selectedBugs.includes(bug.label);
                  return (
                    <button
                      key={bug.id}
                      type="button"
                      onClick={() => handleToggleBug(bug.label)}
                      style={{
                        fontSize: '0.73rem',
                        padding: '5px 10px',
                        borderRadius: '16px',
                        background: isChecked ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                        border: isChecked ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.08)',
                        color: isChecked ? '#fca5a5' : '#cbd5e1',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        transition: 'all 0.15s'
                      }}
                    >
                      {isChecked ? '✕' : '+'} {bug.label}
                    </button>
                  );
                })}
              </div>

              <textarea
                value={bugDescription}
                onChange={(e) => setBugDescription(e.target.value)}
                placeholder="Describe any specific glitch, error message, or buttons that didn't respond (e.g. Header themes, audio latency, model output)..."
                rows={2}
                style={{
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.35)',
                  border: '1px solid rgba(212, 175, 55, 0.25)',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  color: '#f8fafc',
                  fontSize: '0.8rem',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* 4. Suggestions & Feature Requests */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <MessageSquare size={16} color="#38bdf8" />
                <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#f8fafc' }}>
                  4. Any suggestions, features, or deity identities you want?
                </label>
              </div>

              {/* Suggestion Chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                {SUGGESTION_CHIPS.map(chip => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => handleAddSuggestionChip(chip)}
                    style={{
                      fontSize: '0.72rem',
                      padding: '4px 10px',
                      borderRadius: '14px',
                      background: suggestions.includes(chip) ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                      border: suggestions.includes(chip) ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                      color: suggestions.includes(chip) ? '#7dd3fc' : '#cbd5e1',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                  >
                    {chip}
                  </button>
                ))}
              </div>

              <textarea
                value={suggestions}
                onChange={(e) => setSuggestions(e.target.value)}
                placeholder="Share your ideas for tools, workflows, soundscapes, or sovereign features..."
                rows={2}
                style={{
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.35)',
                  border: '1px solid rgba(212, 175, 55, 0.25)',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  color: '#f8fafc',
                  fontSize: '0.8rem',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* 5. Contact info (Optional) */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <input
                type="text"
                value={userContact}
                onChange={(e) => setUserContact(e.target.value)}
                placeholder="Your email or Discord handle (optional, for follow-up)"
                style={{
                  flex: 1,
                  background: 'rgba(0, 0, 0, 0.35)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  padding: '9px 12px',
                  color: '#f8fafc',
                  fontSize: '0.78rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Bottom Actions */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '8px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <button
                type="button"
                onClick={handleDismiss}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  padding: '8px 12px'
                }}
              >
                Maybe Later
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  border: '1px solid #fbbf24',
                  borderRadius: '10px',
                  padding: '9px 24px',
                  color: '#080d1a',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  fontFamily: "'Cinzel', serif",
                  cursor: isSubmitting ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 15px rgba(245, 158, 11, 0.35)',
                  transition: 'all 0.15s'
                }}
              >
                <Send size={16} />
                {isSubmitting ? 'Submitting...' : 'Submit Sovereign Feedback'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
