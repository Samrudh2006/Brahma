import React, { useState, useEffect, useRef } from 'react';
import { X, Mic, MicOff, Volume2, Sparkles, Brain, Radio } from 'lucide-react';
import { createContinuousVoiceAgent, speakText, stopSpeaking } from '@utils/speech';
import { playDivineChime, playTactileClick } from '@utils/soundEffects';

export default function LiveVoiceOrbModal({
  isOpen,
  onClose,
  currentIdentity,
  onSendPrompt
}) {
  const [voiceState, setVoiceState] = useState('idle'); // 'listening', 'user_speaking', 'thinking', 'speaking'
  const [userTranscript, setUserTranscript] = useState('');
  const [assistantText, setAssistantText] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const agentRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      if (agentRef.current) {
        agentRef.current.stop();
      }
      stopSpeaking();
      setVoiceState('idle');
      return;
    }

    playDivineChime();
    setUserTranscript('');
    setAssistantText(`నమస్కారం! నేను ${currentIdentity?.name || 'బ్రహ్మ'}. మీరు తెలుగులో ఏదైనా అడగండి, నేను వింటున్నాను...`);

    // Greet the user in natural Telugu upon opening
    speakText(`నమస్కారం! నేను ${currentIdentity?.name || 'బ్రహ్మ'}. మీరు మాట్లాడండి, నేను వింటున్నాను.`, 'te-IN', () => {
      setVoiceState('speaking');
    }, () => {
      setVoiceState('listening');
    });

    const agent = createContinuousVoiceAgent({
      langCode: 'te-IN',
      silenceTimeoutMs: 1200, // 1.2s silence triggers auto-send
      onUserSpeakingStart: () => {
        setVoiceState('user_speaking');
      },
      onUserTranscript: ({ text }) => {
        setUserTranscript(text);
      },
      onUserSilenceDetected: (finalPrompt) => {
        if (!finalPrompt.trim()) return;
        setVoiceState('thinking');
        setUserTranscript(finalPrompt);

        // Dispatch prompt to Brahma backend
        if (onSendPrompt) {
          onSendPrompt(finalPrompt, {
            onChunk: (chunk) => {
              if (!chunk.startsWith('__THOUGHT__')) {
                setAssistantText(prev => prev + chunk);
              }
            },
            onComplete: (fullResponse) => {
              const textToSpeak = fullResponse || "నేను మీ ప్రశ్నకు సమాధానం సిద్ధం చేశాను.";
              setAssistantText(textToSpeak);
              setVoiceState('speaking');

              // Play natural Telugu audio
              speakText(textToSpeak, 'te-IN', () => {
                setVoiceState('speaking');
              }, () => {
                // Resume hands-free listening automatically!
                setVoiceState('listening');
                setUserTranscript('');
              });
            }
          });
        }
      },
      onStateChange: (state) => {
        setVoiceState(state);
      }
    });

    if (agent) {
      agentRef.current = agent;
      agent.start();
    }

    return () => {
      if (agent) agent.stop();
      stopSpeaking();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'radial-gradient(circle at 50% 40%, rgba(12, 18, 32, 0.96) 0%, rgba(4, 6, 10, 0.98) 100%)',
        backdropFilter: 'blur(30px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '30px 20px',
      }}
    >
      {/* Top Header */}
      <div
        style={{
          width: '100%',
          maxWidth: '700px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.15), rgba(168, 85, 247, 0.15))',
              border: '1px solid rgba(56, 189, 248, 0.45)',
              color: '#38bdf8',
              fontSize: '0.82rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Radio size={14} className="animate-pulse" />
            <span>OPENWHISPER NEURAL STT • LIVE TELUGU VAD</span>
          </div>
        </div>

        <button
          onClick={() => {
            playTactileClick();
            onClose();
          }}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#cbd5e1',
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Center Holographic Pulsing Neural Orb */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          margin: 'auto 0',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: voiceState === 'user_speaking'
              ? 'radial-gradient(circle, #38bdf8 0%, #0369a1 50%, rgba(3, 105, 161, 0.1) 80%)'
              : (voiceState === 'thinking'
                ? 'radial-gradient(circle, #ec4899 0%, #be185d 50%, rgba(190, 24, 93, 0.1) 80%)'
                : 'radial-gradient(circle, #fbbf24 0%, #d97706 50%, rgba(217, 119, 6, 0.1) 80%)'),
            boxShadow: voiceState === 'user_speaking'
              ? '0 0 80px rgba(56, 189, 248, 0.7), inset 0 0 40px #38bdf8'
              : (voiceState === 'thinking'
                ? '0 0 80px rgba(236, 72, 153, 0.7), inset 0 0 40px #ec4899'
                : '0 0 80px rgba(251, 191, 36, 0.7), inset 0 0 40px #fbbf24'),
            transition: 'all 0.4s ease',
            animation: 'pulse 2.5s ease-in-out infinite',
          }}
        >
          {/* Inner Rotating Aura Rings */}
          <div
            style={{
              position: 'absolute',
              inset: '-15px',
              borderRadius: '50%',
              border: '2px dashed rgba(255, 255, 255, 0.4)',
              animation: 'spin 12s linear infinite',
            }}
          />

          <img
            src={currentIdentity?.portrait || '/assets/identities/brahma.png'}
            alt={currentIdentity?.name}
            style={{
              width: '130px',
              height: '130px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid rgba(255, 255, 255, 0.8)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
            }}
          />
        </div>

        {/* Live Status Indicator */}
        <div style={{ marginTop: '28px' }}>
          <div
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '1.3rem',
              fontWeight: 800,
              color: voiceState === 'user_speaking' ? '#38bdf8' : (voiceState === 'thinking' ? '#ec4899' : '#fbbf24'),
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            {voiceState === 'user_speaking' && '🎙️ మీరు మాట్లాడుతున్నారు...'}
            {voiceState === 'thinking' && '⚡ బ్రహ్మ ఆలోచిస్తున్నాడు...'}
            {voiceState === 'speaking' && '🗣️ బ్రహ్మ సమాధానం ఇస్తున్నాడు...'}
            {voiceState === 'listening' && '👂 మీరు మాట్లాడండి (వింటున్నాను)...'}
          </div>

          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '6px' }}>
            No buttons to click • Just speak naturally in Telugu • Auto-interruptible
          </p>
        </div>
      </div>

      {/* Subtitle / Live Transcript Card */}
      <div
        style={{
          width: '100%',
          maxWidth: '720px',
          background: 'rgba(8, 14, 26, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '20px',
          padding: '18px 24px',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 16px 40px rgba(0,0,0,0.8)',
          textAlign: 'center',
          marginBottom: '10px'
        }}
      >
        {userTranscript && (
          <div style={{ fontSize: '0.92rem', color: '#38bdf8', marginBottom: '8px', fontWeight: 600 }}>
            <span style={{ opacity: 0.6 }}>మీరు:</span> "{userTranscript}"
          </div>
        )}
        <div style={{ fontSize: '1rem', color: '#f8fafc', lineHeight: 1.5, fontWeight: 500 }}>
          {assistantText ? assistantText.slice(0, 240) + (assistantText.length > 240 ? '...' : '') : 'మీరు మాట్లాడగానే బ్రహ్మ ప్రత్యుత్తరం ఇస్తాడు.'}
        </div>
      </div>
    </div>
  );
}
