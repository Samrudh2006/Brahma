import React from 'react';
import { X, ShieldCheck, Lock, EyeOff, Cpu, Database, Award } from 'lucide-react';
import { playTactileClick } from '@utils/soundEffects';

export default function PrivacyPolicyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: 'rgba(4, 6, 10, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.25s ease',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          playTactileClick();
          onClose();
        }
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '820px',
          maxHeight: '85vh',
          background: '#090d14',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          borderRadius: '20px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 40px rgba(212, 175, 55, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          color: '#f8f6f0',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '24px 28px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(180deg, rgba(212, 175, 55, 0.06) 0%, transparent 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'rgba(212, 175, 55, 0.15)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#d4af37',
              }}
            >
              <ShieldCheck size={22} />
            </div>
            <div>
              <h2
                id="privacy-modal-title"
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: '#d4af37',
                  margin: 0,
                  letterSpacing: '0.04em',
                }}
              >
                BRAHMA Privacy Policy & Sovereign Data Guarantee
              </h2>
              <span style={{ fontSize: '0.78rem', color: 'rgba(248, 246, 240, 0.5)' }}>
                Effective Date: September 2026 • Compliant with GDPR, CCPA & DPDP
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              playTactileClick();
              onClose();
            }}
            aria-label="Close Privacy Policy"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '8px',
              color: 'rgba(255, 255, 255, 0.7)',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div
          style={{
            padding: '28px',
            overflowY: 'auto',
            fontSize: '0.9rem',
            lineHeight: 1.68,
            color: 'rgba(248, 246, 240, 0.85)',
          }}
        >
          <div
            style={{
              padding: '16px 20px',
              borderRadius: '12px',
              background: 'rgba(43, 182, 189, 0.08)',
              border: '1px solid rgba(43, 182, 189, 0.25)',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
            }}
          >
            <Lock size={28} style={{ color: '#2bb6bd', flexShrink: 0 }} />
            <div>
              <strong style={{ color: '#2bb6bd', display: 'block', fontSize: '0.95rem' }}>
                Zero Telemetry Sovereign Isolation Architecture
              </strong>
              <p style={{ margin: 0, fontSize: '0.84rem', color: 'rgba(248, 246, 240, 0.75)' }}>
                When running local models via Ollama or WebGPU BitBLAS, zero tokens leave your machine. Your prompts, reasoning trees, and vector embeddings remain strictly local and immutable.
              </p>
            </div>
          </div>

          <h3 style={{ color: '#d4af37', fontFamily: "'Cinzel', serif", fontSize: '1rem', marginTop: '20px', marginBottom: '8px' }}>
            1. Data We Do Not Collect
          </h3>
          <p>
            BRAHMA does not harvest personal profiling data, keystroke logging, private cryptographic keys, or biometric signatures. We do not sell, rent, or monetize your interactions with any third-party advertisers.
          </p>

          <h3 style={{ color: '#d4af37', fontFamily: "'Cinzel', serif", fontSize: '1rem', marginTop: '20px', marginBottom: '8px' }}>
            2. Local Browser Storage & Cookies
          </h3>
          <p>
            BRAHMA utilizes client-side storage technologies (IndexedDB, Web Crypto API, and localStorage) solely to preserve:
          </p>
          <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
            <li>Active divine identity selections and custom user persona prompts</li>
            <li>Dark mode visual themes and ambient acoustic drone preferences</li>
            <li>Encrypted chat history and scheduled autonomous swarm workflows</li>
            <li>Client-side vector indexes for local document RAG</li>
          </ul>

          <h3 style={{ color: '#d4af37', fontFamily: "'Cinzel', serif", fontSize: '1rem', marginTop: '20px', marginBottom: '8px' }}>
            3. Third-Party Frontier AI APIs
          </h3>
          <p>
            If you explicitly connect external frontier cloud providers (e.g. Anthropic Claude, OpenAI, Google Gemini, DeepSeek), prompts submitted to those specific models are transmitted directly via encrypted HTTPS tunnels in accordance with their respective API data policies.
          </p>

          <h3 style={{ color: '#d4af37', fontFamily: "'Cinzel', serif", fontSize: '1rem', marginTop: '20px', marginBottom: '8px' }}>
            4. User Rights & Data Deletion
          </h3>
          <p>
            You hold complete sovereign ownership of your data. You may wipe all local workspace data, conversation transcripts, and cached vectors instantly via the <strong>Settings &gt; Storage & Data Wiping</strong> menu or by clearing your browser cache.
          </p>

          <h3 style={{ color: '#d4af37', fontFamily: "'Cinzel', serif", fontSize: '1rem', marginTop: '20px', marginBottom: '8px' }}>
            5. Contact & Privacy Governance
          </h3>
          <p>
            For inquiries regarding privacy, Dharma governance verification, or security assessments, contact the Sovereign Intelligence Labs governance board at <code style={{ color: '#38bdf8' }}>governance@brahma.ai</code>.
          </p>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 28px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            background: 'rgba(0, 0, 0, 0.3)',
          }}
        >
          <button
            onClick={() => {
              playTactileClick();
              onClose();
            }}
            style={{
              padding: '9px 24px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #d4af37 0%, #b89728 100%)',
              border: 'none',
              color: '#06080c',
              fontSize: '0.86rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            I Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
}
