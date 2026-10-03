import React, { useState } from 'react';
import {
  Star, Trash2, RotateCcw, Download, Search, Sparkles, Copy,
  Check, ArrowRight, BookOpen, Shield
} from 'lucide-react';
import { lsGet, lsSet, timeAgo, downloadTextFile } from '@utils/index';
import { IDENTITIES } from '@data/identities';

const DEFAULT_FAVORITES = [
  {
    id: 'fav_1',
    category: 'Math Proofs',
    identity: IDENTITIES[0], // Brahma
    text: 'Formal Lean 4 verification of Paxos consensus under asynchronous network partitions. Mechanized proof guaranteed with 0 invariant violations.',
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: 'fav_2',
    category: 'Silicon Kernels',
    identity: IDENTITIES[11], // Kuvera
    text: 'BitNet 1.58-Bit Ternary GEMM Matrix Optimization: {-1, 0, +1} weight quantization eliminates FP16 floating-point multiplications, reducing memory bandwidth by 10x and energy by 8.4x.',
    timestamp: new Date(Date.now() - 3600000 * 36).toISOString()
  },
  {
    id: 'fav_3',
    category: 'Swarm Strategies',
    identity: IDENTITIES[5], // Ganesha
    text: 'Byzantine Swarm Consensus Protocol: 13 Divine Councils cross-examine AST mutations with 2/3 majority cryptographic quorum threshold.',
    timestamp: new Date(Date.now() - 3600000 * 60).toISOString()
  }
];

export default function FavoritesView({ onRerun, onSelectIdentity, setActivePage }) {
  const [favorites, setFavorites] = useState(() => {
    const saved = lsGet('brahma-favorites', []);
    return saved.length > 0 ? saved : DEFAULT_FAVORITES;
  });
  const [query, setQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Math Proofs', 'Silicon Kernels', 'Swarm Strategies'];

  const filtered = favorites.filter(f => {
    const matchQuery = !query || f.text.toLowerCase().includes(query.toLowerCase());
    const matchCat = selectedCategory === 'All' || f.category === selectedCategory;
    return matchQuery && matchCat;
  });

  const remove = (id) => {
    const updated = favorites.filter(f => f.id !== id);
    setFavorites(updated);
    lsSet('brahma-favorites', updated);
  };

  const handleCopy = (f) => {
    navigator.clipboard.writeText(f.text);
    setCopiedId(f.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleLaunch = (f) => {
    if (onSelectIdentity && f.identity) {
      onSelectIdentity(f.identity);
    }
    if (onRerun) {
      onRerun(f.text);
    }
    if (setActivePage) {
      setActivePage('chat');
    }
  };

  const exportAll = () => {
    const content = favorites.map(f =>
      `## Saved on ${new Date(f.timestamp).toLocaleString()}\n**Identity:** ${f.identity?.name || 'BRAHMA'}\n**Category:** ${f.category || 'General'}\n\n${f.text}\n\n---\n`
    ).join('\n');
    downloadTextFile(content, 'brahma-favorites.md');
  };

  return (
    <div className="page-view">
      <div className="page-view-header">
        <div>
          <h1 className="page-view-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            Saved Proofs & Starred Favorites
            <span style={{ fontSize: '0.72rem', padding: '3px 10px', borderRadius: 12, background: 'rgba(234, 179, 8, 0.15)', color: '#fbbf24', border: '1px solid rgba(234, 179, 8, 0.3)' }}>
              {favorites.length} Saved Items
            </span>
          </h1>
          <p className="page-view-subtitle">
            Curated formal proofs, silicon kernel benchmarks, and high-impact multi-agent prompt directives.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {favorites.length > 0 && (
            <button className="secondary-btn" onClick={exportAll} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Download size={14} /> Export .md
            </button>
          )}
        </div>
      </div>

      {/* Filter Chips & Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-chip ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(14,20,32,0.7)', border: '1px solid rgba(212,175,55,0.22)', borderRadius: 'var(--r-pill)', padding: '6px 14px', maxWidth: 320, flex: 1 }}>
          <Search size={14} style={{ color: 'var(--text-muted)' }} />
          <input
            placeholder="Search saved favorites..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 'var(--text-sm)', width: '100%' }}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <Star size={48} style={{ opacity: 0.2, marginBottom: 16 }} />
          <p>{favorites.length === 0 ? 'No saved responses yet. Star a message in chat to save it here.' : 'No results match your search.'}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filtered.map(f => (
            <div
              key={f.id}
              className="favorite-item"
              style={{
                background: 'rgba(12, 18, 30, 0.85)',
                border: '1px solid rgba(234, 179, 8, 0.25)',
                borderRadius: 14,
                padding: 18
              }}
            >
              <div className="favorite-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {f.identity?.portrait ? (
                    <img src={f.identity.portrait} alt={f.identity.name} style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid var(--accent-gold)' }} />
                  ) : (
                    <Star size={16} color="#fbbf24" />
                  )}
                  <span style={{ fontSize: '0.82rem', color: '#fbbf24', fontWeight: 700 }}>
                    {f.identity?.name || 'BRAHMA'} COUNCIL
                  </span>
                  {f.category && (
                    <span style={{ fontSize: '0.68rem', background: 'rgba(255,255,255,0.06)', color: '#94a3b8', padding: '2px 8px', borderRadius: 8 }}>
                      {f.category}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{timeAgo(f.timestamp)}</span>
                  <button
                    onClick={() => handleCopy(f)}
                    style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}
                    title="Copy Text"
                  >
                    {copiedId === f.id ? <Check size={14} color="#4ade80" /> : <Copy size={14} />}
                  </button>
                  <button
                    onClick={() => remove(f.id)}
                    style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}
                    title="Remove from Favorites"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="favorite-text" style={{ fontSize: '0.88rem', color: '#e2e8f0', lineHeight: 1.5, marginBottom: 12 }}>
                {f.text}
              </div>

              <button
                className="primary-btn"
                style={{ alignSelf: 'flex-start', fontSize: '0.78rem', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 6 }}
                onClick={() => handleLaunch(f)}
              >
                <RotateCcw size={12} /> Launch in Active Swarm Chat
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
