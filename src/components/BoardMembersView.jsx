import React, { useState } from 'react';
import { GRANDMASTER_BOARD } from '@data/boardMembers';
import { Search, Award, Shield, Cpu, BookOpen, Quote, ChevronRight, Sparkles, ExternalLink } from 'lucide-react';
import { IDENTITIES } from '@data/identities';

export default function BoardMembersView({ onSelectIdentity, onSendPrompt, setActivePage }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedMember, setSelectedMember] = useState(null);

  const filters = [
    { id: 'all', label: 'All Grandmasters (17)' },
    { id: 'turing', label: 'Turing Award Winners' },
    { id: 'nobel', label: 'Nobel Laureates' },
    { id: 'ai', label: 'AI & Deep Learning Pioneers' },
    { id: 'systems', label: 'Systems & Silicon Architects' },
    { id: 'math', label: 'Formal Math & Type Theory' }
  ];

  const filteredMembers = GRANDMASTER_BOARD.filter(m => {
    const matchesSearch = 
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.doctrine.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.country.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedFilter === 'turing') return m.awards.includes('Turing Award');
    if (selectedFilter === 'nobel') return m.awards.includes('Nobel Prize');
    if (selectedFilter === 'ai') return ['hinton', 'lecun', 'bengio', 'sutskever', 'karpathy', 'hassabis'].includes(m.id);
    if (selectedFilter === 'systems') return ['von-neumann', 'huang', 'torvalds', 'dean', 'lamport'].includes(m.id);
    if (selectedFilter === 'math') return ['turing', 'tao', 'knuth', 'shannon', 'liskov'].includes(m.id);

    return true;
  });

  const handleEngageGrandmaster = (member) => {
    const councilIdentity = IDENTITIES.find(i => i.id === member.council) || IDENTITIES[0];
    if (onSelectIdentity) {
      onSelectIdentity(councilIdentity);
    }
    const directivePrompt = `Synthesize an engineering architecture conforming strictly to the doctrine of ${member.name}: "${member.engineeringPrinciple}".\n\nDoctrine: ${member.doctrine}\nDomain: ${member.specialty}`;
    if (onSendPrompt) {
      onSendPrompt(directivePrompt);
    }
    if (setActivePage) {
      setActivePage('chat');
    }
  };

  return (
    <div className="view-container">
      {/* Header Banner */}
      <div className="view-header-banner">
        <div className="view-header-title-row">
          <div className="view-header-icon" style={{ background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.25), rgba(168, 85, 247, 0.25))', border: '1px solid rgba(234, 179, 8, 0.4)' }}>
            <Award size={26} color="#fbbf24" />
          </div>
          <div>
            <h1 className="view-page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              Supreme Grandmaster Advisory Board
              <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '12px', background: 'rgba(234, 179, 8, 0.15)', color: '#fbbf24', border: '1px solid rgba(234, 179, 8, 0.3)', fontWeight: 600 }}>
                17 World Luminaries · Top 0.1% Standards
              </span>
            </h1>
            <p className="view-page-subtitle">
              Engineering commandments, first-principles architectures, and formal invariant doctrines from the greatest minds in computer science, physics, mathematics, and artificial intelligence.
            </p>
          </div>
        </div>
      </div>

      {/* Controls: Search & Category Chips */}
      <div className="tools-controls-bar" style={{ marginTop: '1rem', marginBottom: '1.25rem' }}>
        <div className="tools-search-wrap">
          <Search size={16} className="tools-search-icon" />
          <input
            type="text"
            className="tools-search-input"
            placeholder="Search by Grandmaster name, doctrine, award, country, or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="tools-category-chips">
          {filters.map(f => (
            <button
              key={f.id}
              className={`tool-filter-chip ${selectedFilter === f.id ? 'active' : ''}`}
              onClick={() => setSelectedFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grandmasters Grid */}
      <div className="tools-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.25rem' }}>
        {filteredMembers.map((member) => {
          const councilObj = IDENTITIES.find(i => i.id === member.council);
          return (
            <div
              key={member.id}
              className="tool-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '1px solid rgba(234, 179, 8, 0.25)',
                background: 'linear-gradient(180deg, rgba(20, 24, 38, 0.85) 0%, rgba(13, 16, 27, 0.95) 100%)',
                padding: '1.25rem',
                borderRadius: '16px',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Top Accent Stripe */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #fbbf24, #f59e0b, #a855f7)' }} />

              <div>
                {/* Header Row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      background: 'rgba(234, 179, 8, 0.15)',
                      border: '1px solid rgba(234, 179, 8, 0.35)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.4rem'
                    }}>
                      {member.avatar}
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#fef3c7' }}>
                        {member.name}
                      </h3>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                        {member.country}
                      </div>
                    </div>
                  </div>

                  <span style={{
                    fontSize: '0.65rem',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '8px',
                    background: 'rgba(234, 179, 8, 0.12)',
                    color: '#fbbf24',
                    border: '1px solid rgba(234, 179, 8, 0.3)',
                    fontWeight: 600,
                    whiteSpace: 'nowrap'
                  }}>
                    {councilObj ? `${councilObj.name} Council` : 'Supreme'}
                  </span>
                </div>

                {/* Subtitle / Role */}
                <div style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 500, marginBottom: '0.5rem' }}>
                  {member.title}
                </div>

                {/* Honors & Awards */}
                <div style={{
                  fontSize: '0.72rem',
                  color: '#fbbf24',
                  background: 'rgba(234, 179, 8, 0.08)',
                  padding: '0.35rem 0.6rem',
                  borderRadius: '6px',
                  marginBottom: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}>
                  <Award size={13} style={{ flexShrink: 0 }} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {member.awards}
                  </span>
                </div>

                {/* Doctrine Quote */}
                <div style={{
                  padding: '0.75rem',
                  borderRadius: '10px',
                  background: 'rgba(15, 23, 42, 0.65)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  marginBottom: '0.85rem',
                  position: 'relative'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#93c5fd', fontSize: '0.72rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                    <BookOpen size={12} />
                    <span>ENGINEERING PRINCIPLE</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.77rem', color: '#e2e8f0', fontStyle: 'italic', lineHeight: '1.45' }}>
                    "{member.engineeringPrinciple}"
                  </p>
                </div>

                {/* Specialty / Invariance */}
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
                  <strong style={{ color: '#cbd5e1' }}>Specialty:</strong> {member.specialty}
                </div>
              </div>

              {/* Action Button */}
              <button
                className="tool-action-btn"
                style={{
                  width: '100%',
                  marginTop: '0.5rem',
                  padding: '0.6rem 1rem',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.2), rgba(168, 85, 247, 0.2))',
                  border: '1px solid rgba(234, 179, 8, 0.35)',
                  color: '#fbbf24',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => handleEngageGrandmaster(member)}
              >
                <Sparkles size={14} />
                <span>Apply Grandmaster Doctrine</span>
                <ChevronRight size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
