import React from 'react';
import { X, Check } from 'lucide-react';
import { IDENTITIES } from '../data/identities';

export default function IdentitySelectorModal({ 
  currentIdentity, 
  onSelectIdentity, 
  onClose 
}) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="identity-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">13 DIVINE AI IDENTITIES</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Select an intelligence persona mode for specialized framing, tone, and analytical focus.
            </p>
          </div>
          <button className="close-modal-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="identities-grid">
          {IDENTITIES.map((identity) => {
            const isSelected = currentIdentity.id === identity.id;

            return (
              <div
                key={identity.id}
                className={`identity-card ${isSelected ? 'selected' : ''}`}
                onClick={() => {
                  onSelectIdentity(identity);
                  onClose();
                }}
              >
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <img 
                    src={identity.portrait} 
                    alt={identity.name} 
                    className="identity-card-portrait"
                  />
                  {isSelected && (
                    <span style={{
                      position: 'absolute', bottom: 0, right: 0,
                      background: 'var(--accent-gold)', borderRadius: '50%',
                      width: 18, height: 18, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', border: '2px solid #0a0f19'
                    }}>
                      <Check size={10} style={{ color: '#080a0f' }} />
                    </span>
                  )}
                </div>
                <div className="identity-card-info">
                  <span className="identity-card-name">{identity.name}</span>
                  <span className="identity-card-badge">{identity.badgeText}</span>
                  <span className="identity-card-domain">{identity.domain}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
