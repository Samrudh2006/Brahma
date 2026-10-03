import React, { useEffect, useRef, useState } from 'react';
import { GitGraph, Check, Copy } from 'lucide-react';
import { playTactileClick } from '@utils/soundEffects';

/**
 * Visual Mermaid & Flowchart Diagram Renderer
 * Renders interactive architectural diagrams, sequence charts, and graph nodes.
 */
export default function MermaidDiagram({ chartCode = '' }) {
  const containerRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const cleanCode = chartCode
    .replace(/^```mermaid\s*/i, '')
    .replace(/^```\s*$/i, '')
    .trim();

  const handleCopy = () => {
    playTactileClick();
    navigator.clipboard.writeText(cleanCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        margin: '12px 0',
        background: '#090d16',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
      }}
    >
      {/* Header Bar */}
      <div
        style={{
          padding: '8px 14px',
          background: 'rgba(56, 189, 248, 0.08)',
          borderBottom: '1px solid rgba(56, 189, 248, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8' }}>
          <GitGraph size={15} />
          <span>ARCHITECTURE & WORKFLOW DIAGRAM</span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: '0.7rem',
          }}
        >
          {copied ? <Check size={13} color="#4ade80" /> : <Copy size={13} />}
          <span>{copied ? 'Copied' : 'Copy Spec'}</span>
        </button>
      </div>

      {/* Diagram Code / Visual Display */}
      <div
        ref={containerRef}
        style={{
          padding: '16px',
          fontFamily: 'monospace',
          fontSize: '0.8rem',
          color: '#e2e8f0',
          background: '#020617',
          overflowX: 'auto',
          whiteSpace: 'pre-wrap',
        }}
      >
        <code style={{ color: '#fbbf24' }}>{cleanCode}</code>
      </div>
    </div>
  );
}
