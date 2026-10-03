import React, { useState, useEffect } from 'react';
import { Search, X, MessageSquare, Sparkles, Briefcase, Wrench, Link2, Calendar } from 'lucide-react';
import { IDENTITIES } from '../data/identities';

export default function CommandPaletteModal({ 
  onClose, 
  setActivePage, 
  onSelectIdentity 
}) {
  const [query, setQuery] = useState('');

  const actions = [
    { label: 'Start New Chat', icon: MessageSquare, action: () => setActivePage('chat') },
    { label: 'Manage Connections (GitHub, Anytype, Drive)', icon: Link2, action: () => setActivePage('connections') },
    { label: 'Browse Skills Catalog', icon: Sparkles, action: () => setActivePage('skills') },
    { label: 'View Active Projects', icon: Briefcase, action: () => setActivePage('projects') },
    { label: 'Open Tools Sandbox', icon: Wrench, action: () => setActivePage('tools') },
    { label: 'Check Scheduled Automations', icon: Calendar, action: () => setActivePage('scheduled') },
  ];

  const filteredActions = actions.filter(a => a.label.toLowerCase().includes(query.toLowerCase()));
  const filteredIdentities = IDENTITIES.filter(i => 
    i.name.toLowerCase().includes(query.toLowerCase()) || 
    i.domain.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="identity-modal" 
        style={{ maxWidth: '640px', padding: '0' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(212,175,55,0.2)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Search size={20} style={{ color: 'var(--accent-gold)' }} />
          <input
            type="text"
            placeholder="Type a command, search identities or jump to page... (Press Esc to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#fff',
              fontSize: '1rem',
              fontFamily: 'var(--font-sans)'
            }}
          />
          <button className="close-modal-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <div style={{ padding: '16px 20px', maxHeight: '380px', overflowY: 'auto' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Quick Actions
          </div>
          {filteredActions.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div
                key={idx}
                onClick={() => { item.action(); onClose(); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  transition: 'all 0.2s',
                  marginBottom: '4px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(212,175,55,0.15)';
                  e.currentTarget.style.color = 'var(--accent-gold-bright)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                <IconComp size={16} />
                <span style={{ fontSize: '0.9rem' }}>{item.label}</span>
              </div>
            );
          })}

          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '16px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Switch Divine Identity Mode
          </div>
          {filteredIdentities.slice(0, 5).map((identity) => (
            <div
              key={identity.id}
              onClick={() => { onSelectIdentity(identity); onClose(); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '8px 14px',
                borderRadius: '10px',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                transition: 'all 0.2s',
                marginBottom: '4px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(212,175,55,0.15)';
                e.currentTarget.style.color = 'var(--accent-gold-bright)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              <img src={identity.portrait} alt={identity.name} style={{ width: 24, height: 24, borderRadius: '50%', border: '1px solid var(--accent-gold)' }} />
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{identity.name}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>{identity.badgeText}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
