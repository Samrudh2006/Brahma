import React, { useState } from 'react';
import {
  Bell, CheckCircle2, AlertTriangle, ArrowRight, Check, Trash2,
  Plus, Shield, Activity, Sparkles, Filter, Copy, CheckCheck
} from 'lucide-react';
import { IDENTITIES } from '../data/identities';

export default function NotificationsView({ notifications, onMarkAllRead }) {
  const [items, setItems] = useState(notifications || []);
  const [filter, setFilter] = useState('All');
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [copied, setCopied] = useState(false);

  const categories = ['All', 'Unread', 'AI Results', 'Task Completed', 'Scheduled Task', 'Project Activity', 'System Events'];

  const filtered = items.filter(n => {
    if (filter === 'Unread') return !n.read;
    if (filter !== 'All') return n.category === filter;
    return true;
  });

  const markItemAsRead = (id) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, read: true } : i));
  };

  const deleteItem = (id) => {
    setItems(prev => prev.filter(i => i.id !== id));
    if (selectedNotification?.id === id) setSelectedNotification(null);
  };

  const clearAll = () => {
    setItems([]);
    setSelectedNotification(null);
  };

  const triggerLiveTelemetryAlert = () => {
    const randomCouncil = IDENTITIES[Math.floor(Math.random() * IDENTITIES.length)];
    const newAlert = {
      id: 'notif_' + Date.now(),
      identityId: randomCouncil.id,
      title: `Telemetry Event: ${randomCouncil.name} Swarm Verification`,
      category: 'System Events',
      description: `Formal invariance proof completed on node #k8s-brahma-${Math.floor(Math.random() * 900 + 100)}. Zero memory leaks detected. Latency: ${(Math.random() * 4 + 0.8).toFixed(2)}ms.`,
      time: 'Just now',
      read: false,
      linkText: 'View Telemetry Spans',
      payload: {
        council: randomCouncil.id,
        timestamp: new Date().toISOString(),
        verifiedInvariance: true,
        cpu_usage: '12.4%',
        vram_allocated_gb: '18.4 GB'
      }
    };
    setItems(prev => [newAlert, ...prev]);
  };

  const handleCopyPayload = (obj) => {
    navigator.clipboard.writeText(JSON.stringify(obj, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--accent-gold-bright)', display: 'flex', alignItems: 'center', gap: 10 }}>
            NOTIFICATIONS & REAL-TIME TELEMETRY
            <span style={{ fontSize: '0.72rem', padding: '3px 10px', borderRadius: 12, background: 'rgba(234, 179, 8, 0.15)', color: '#fbbf24', border: '1px solid rgba(234, 179, 8, 0.3)' }}>
              {items.filter(i => !i.read).length} Unread
            </span>
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Real-time multi-agent alerts, formal invariant verifications, and automated task execution logs.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={triggerLiveTelemetryAlert}
            className="splash-btn"
            style={{ padding: '8px 16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 6, background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.25), rgba(59, 130, 246, 0.25))' }}
          >
            <Activity size={14} color="#fbbf24" /> Trigger Live Telemetry Event
          </button>
          <button
            onClick={() => {
              setItems(prev => prev.map(i => ({ ...i, read: true })));
              if (onMarkAllRead) onMarkAllRead();
            }}
            className="secondary-btn"
            style={{ padding: '8px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <CheckCheck size={14} /> Mark All Read
          </button>
          <button
            onClick={clearAll}
            className="secondary-btn"
            style={{ padding: '8px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 6, color: '#f87171' }}
          >
            <Trash2 size={14} /> Clear All
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`action-pill ${filter === cat ? 'active' : ''}`}
            style={{ padding: '6px 14px', borderRadius: '20px' }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(10, 15, 25, 0.5)', borderRadius: 16, border: '1px dashed rgba(234, 179, 8, 0.2)' }}>
            <Bell size={36} color="#94a3b8" style={{ marginBottom: 12 }} />
            <h3 style={{ color: '#cbd5e1', margin: '0 0 6px 0' }}>No notifications found in "{filter}"</h3>
            <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Click "Trigger Live Telemetry Event" to simulate real-time swarm broadcasts.</p>
          </div>
        ) : (
          filtered.map((item) => {
            const identity = IDENTITIES.find(i => i.id === item.identityId) || IDENTITIES[0];

            return (
              <div
                key={item.id}
                onClick={() => {
                  markItemAsRead(item.id);
                  setSelectedNotification(item);
                }}
                style={{
                  background: item.read ? 'rgba(10,15,25,0.6)' : 'rgba(212,175,55,0.08)',
                  border: `1px solid ${item.read ? 'rgba(212,175,55,0.15)' : 'var(--accent-gold)'}`,
                  borderRadius: '16px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  gap: 16
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <img
                    src={identity.portrait}
                    alt={identity.name}
                    style={{ width: 44, height: 44, borderRadius: '50%', border: '1.5px solid var(--accent-gold)', flexShrink: 0 }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--accent-gold-bright)', fontSize: '0.95rem' }}>
                        {item.title}
                      </span>
                      <span style={{ fontSize: '0.7rem', background: 'rgba(212,175,55,0.15)', color: 'var(--text-secondary)', padding: '2px 8px', borderRadius: '10px' }}>
                        {item.category}
                      </span>
                      {!item.read && (
                        <span style={{ fontSize: '0.65rem', background: '#eab308', color: '#000', padding: '1px 6px', borderRadius: '6px', fontWeight: 700 }}>
                          NEW
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: '2px 0' }}>
                      {item.description}
                    </p>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                      {item.time} · Council: {identity.name}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <button
                    className="action-pill"
                    onClick={(e) => {
                      e.stopPropagation();
                      markItemAsRead(item.id);
                      setSelectedNotification(item);
                    }}
                  >
                    Inspect <ArrowRight size={14} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteItem(item.id);
                    }}
                    style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 6 }}
                    title="Delete Notification"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Detailed Modal / Inspection Drawer */}
      {selectedNotification && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(1,2,4,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#0a0f1c', border: '1px solid rgba(234, 179, 8, 0.4)', borderRadius: 16, padding: 24, maxWidth: 600, width: '100%', position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <h3 style={{ margin: 0, color: '#fbbf24', fontSize: '1.2rem' }}>{selectedNotification.title}</h3>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{selectedNotification.category} · {selectedNotification.time}</span>
              </div>
              <button onClick={() => setSelectedNotification(null)} className="secondary-btn" style={{ padding: '4px 10px' }}>✕</button>
            </div>

            <p style={{ color: '#e2e8f0', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: 16 }}>
              {selectedNotification.description}
            </p>

            <div style={{ background: '#040711', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: 12, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1 }}>Structured Telemetry Payload</span>
                <button
                  onClick={() => handleCopyPayload(selectedNotification.payload || selectedNotification)}
                  style={{ background: 'transparent', border: 'none', color: '#fbbf24', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <Copy size={12} /> {copied ? 'Copied!' : 'Copy JSON'}
                </button>
              </div>
              <pre style={{ margin: 0, fontSize: '0.8rem', color: '#38bdf8', fontFamily: 'var(--font-mono)', maxHeight: 200, overflowY: 'auto' }}>
                {JSON.stringify(selectedNotification.payload || { id: selectedNotification.id, time: selectedNotification.time, verified: true }, null, 2)}
              </pre>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button className="primary-btn" onClick={() => setSelectedNotification(null)}>
                Dismiss & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
