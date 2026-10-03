import React from 'react';
import { ShieldAlert, AlertTriangle, Terminal, CheckCircle2, XCircle, FileText, Lock } from 'lucide-react';
import { playTactileClick } from '@utils/soundEffects';

/**
 * OpenWorker-Inspired Risk Approval Modal
 * Interactive approval dialog for Tier 2 (System Execution) & Tier 3 (Destructive) Agent Actions.
 */
export default function RiskApprovalModal({ pendingAction, onApprove, onDeny }) {
  if (!pendingAction) return null;

  const { tier, action, reason, timestamp } = pendingAction;
  const isDestructive = tier.level >= 3;

  const handleApprove = () => {
    playTactileClick();
    if (onApprove) onApprove(pendingAction);
  };

  const handleDeny = () => {
    playTactileClick();
    if (onDeny) onDeny(pendingAction);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 11000,
        background: 'rgba(3, 7, 18, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          background: '#090d16',
          border: `1px solid ${tier.color}`,
          borderRadius: '16px',
          boxShadow: `0 25px 50px rgba(0,0,0,0.9), 0 0 30px ${tier.color}33`,
          overflow: 'hidden',
          color: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            background: `linear-gradient(180deg, ${tier.color}15 0%, transparent 100%)`,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          {isDestructive ? (
            <AlertTriangle size={24} color={tier.color} />
          ) : (
            <ShieldAlert size={24} color={tier.color} />
          )}
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: tier.color, margin: 0 }}>
              {tier.name}
            </h3>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              Action Approval Required (OpenWorker Risk Gate)
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>
            {reason || tier.description}
          </p>

          {/* Action Details Card */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              padding: '14px 16px',
              fontSize: '0.8rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              fontFamily: 'monospace',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
              <span>Action Type:</span>
              <span style={{ color: '#38bdf8', fontWeight: 700 }}>{action.type || 'SYSTEM_EXECUTION'}</span>
            </div>
            {action.target && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                <span>Target Resource:</span>
                <span style={{ color: '#f1f5f9' }}>{action.target}</span>
              </div>
            )}
            {action.command && (
              <div style={{ marginTop: '4px', borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '8px' }}>
                <span style={{ color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Command:</span>
                <code style={{ background: '#020617', padding: '6px 10px', borderRadius: '6px', color: '#fbbf24', display: 'block' }}>
                  $ {action.command}
                </code>
              </div>
            )}
            <div style={{ fontSize: '0.68rem', color: '#64748b', textAlign: 'right', marginTop: '4px' }}>
              Requested: {new Date(timestamp).toLocaleTimeString()}
            </div>
          </div>

          {isDestructive && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                padding: '10px 14px',
                fontSize: '0.78rem',
                color: '#fca5a5',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Lock size={16} color="#ef4444" />
              <span>Warning: This action makes destructive changes to workspace data or database state.</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(2, 6, 23, 0.5)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
          }}
        >
          <button
            type="button"
            onClick={handleDeny}
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#e2e8f0',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <XCircle size={15} />
            Deny & Block
          </button>
          <button
            type="button"
            onClick={handleApprove}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              background: isDestructive ? '#dc2626' : tier.color,
              border: 'none',
              color: '#090d16',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: `0 0 16px ${tier.color}66`,
            }}
          >
            <CheckCircle2 size={15} />
            {isDestructive ? 'Confirm Destructive Execution' : 'Approve Execution'}
          </button>
        </div>
      </div>
    </div>
  );
}
