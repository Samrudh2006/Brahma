import React, { useState, useEffect } from 'react';
import {
  MessageSquare, Bell, Sparkles, Briefcase, Wrench,
  Star, Calendar, Settings, ChevronRight,
  Plus, ChevronLeft, PanelLeftClose, PanelLeftOpen, Award, Image, Link2, Code, Smartphone, Shield, X, LayoutGrid
} from 'lucide-react';
import { getChatSessions } from '@utils/index';
import { useAuthStore } from '@store/index';

export default function Sidebar({
  activePage,
  setActivePage,
  unreadNotificationsCount = 3,
  onOpenSettings,
  onOpenPrivacy,
  onOpenTerms,
  onOpenFeedback,
  onNewChat,
  currentIdentity,
  mobileOpen = false,
  onMobileClose,
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    const sessions = getChatSessions().slice(0, 6);
    setChatHistory(sessions);
  }, [activePage]);

  // Lock body scroll when mobile sidebar is open (prevents iOS/Android scroll-through)
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [mobileOpen]);

  const user = useAuthStore(state => state.user);
  const isSupremeAdmin = user?.email?.toLowerCase() === 'samrudhdwivvedula12@gmail.com' || user?.isAdmin || user?.hasDotsOfficeAccess;

  // Exact 13 Sacred Sanskrit Navigation Matrix + Supreme Dots Office Canvas
  const supremeItems = isSupremeAdmin ? [
    { 
      id: 'dots-office',    
      glyph: '🏢', 
      title: 'INDRA DOTS',      
      subtitle: 'Virtual Office Canvas (13 Councils)', 
      icon: LayoutGrid,    
      badge: '👑 SUPREME', 
      hasChevron: true,
      isSupreme: true
    }
  ] : [];

  const navItems = [
    ...supremeItems,
    { id: 'chat',           glyph: '◈', title: 'SAMVĀDA',      subtitle: 'Chat',                   icon: MessageSquare, hasChevron: false },
    { id: 'app-builder',    glyph: '✦', title: 'SṚṢṬI',        subtitle: 'Full-Stack Builder',     icon: Code,          hasChevron: true },
    { id: 'image-studio',   glyph: '▧', title: 'CHITRA',       subtitle: 'AI Image Studio',        icon: Image,         hasChevron: true },
    { id: 'remote-gateway', glyph: '⌁', title: 'YANTRA',       subtitle: 'Daemon & Automations',   icon: Smartphone,    hasChevron: true },
    { id: 'board',          glyph: '◎', title: 'CHAKRAVYŪHA',  subtitle: 'Grandmaster Board',      icon: Award,         hasChevron: true },
    { id: 'tools',          glyph: '⚒', title: 'ASTRA',        subtitle: 'Tools & Silicon (52)',   icon: Wrench,        hasChevron: true },
    { id: 'skills',         glyph: '◇', title: 'VIDYĀ',        subtitle: 'Skills (30+)',           icon: Sparkles,      hasChevron: true },
    { id: 'connections',    glyph: '⛓', title: 'SETU',         subtitle: 'Connections (12)',       icon: Link2,         hasChevron: true },
    { id: 'projects',       glyph: '▣', title: 'SAṄKALPA',     subtitle: 'Projects',               icon: Briefcase,     hasChevron: true },
    { id: 'notifications',  glyph: '◉', title: 'DŪTAVĀHA',     subtitle: 'Notifications',          icon: Bell, badge: unreadNotificationsCount || 3, hasChevron: false },
    { id: 'favorites',      glyph: '☆', title: 'PRIYA',        subtitle: 'Favorites',              icon: Star,          hasChevron: true },
    { id: 'scheduled',      glyph: '◷', title: 'KĀLACAKRA',    subtitle: 'Scheduled Tasks',        icon: Calendar,      hasChevron: true },
    { id: 'governance',     glyph: '☸', title: 'DHARMA',       subtitle: 'Governance & Invariants',icon: Shield,        hasChevron: true },
  ];

  return (
    <>
      {mobileOpen && (
        <div
          className="sidebar-backdrop"
          onClick={onMobileClose}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); if (onMobileClose) onMobileClose(); }}
          aria-hidden="true"
        />
      )}
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`} style={{
        width: collapsed ? 76 : 270,
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: 'linear-gradient(180deg, #070a14 0%, #03060f 100%)',
        borderRight: '1px solid rgba(251, 191, 36, 0.18)',
        height: '100vh',
        overflowY: 'hidden',
        zIndex: 100
      }}>
        {/* 1. Brand Header with Exact Ornate Emblem */}
        <div>
          <div className="sidebar-header" onClick={() => { setActivePage('chat'); if (onMobileClose) onMobileClose(); }} style={{
            padding: '16px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            cursor: 'pointer'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="sidebar-master-avatar-wrap">
                <img src={currentIdentity.portrait} alt={currentIdentity.name} className="sidebar-master-avatar" />
              </div>
              {!collapsed && (
                <div className="sidebar-brand-info">
                  <span className="sidebar-brand-title" style={{ fontSize: '1.05rem', fontWeight: 900, color: '#f8fafc', letterSpacing: '0.04em' }}>
                    {currentIdentity.name || 'BRAHMA'}
                  </span>
                  <span style={{ fontSize: '0.66rem', color: '#fbbf24', display: 'block', letterSpacing: '0.06em', fontWeight: 800 }}>
                    {currentIdentity.badgeText || 'Universal Master'}
                  </span>
                </div>
              )}
            </div>

            {/* Collapse / Close Toggle Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {mobileOpen && (
                <button
                  className="sidebar-mobile-close-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onMobileClose) onMobileClose();
                  }}
                  title="Close menu"
                  style={{
                    background: 'rgba(251, 191, 36, 0.15)',
                    border: '1px solid rgba(251, 191, 36, 0.4)',
                    color: '#fbbf24',
                    borderRadius: 6,
                    padding: 5,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <X size={15} />
                </button>
              )}
              <button
                className="sidebar-collapse-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setCollapsed(!collapsed);
                }}
                title={collapsed ? 'Open sidebar' : 'Close sidebar'}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#94a3b8',
                  borderRadius: 6,
                  padding: 5,
                  cursor: 'pointer'
                }}
              >
                {collapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
              </button>
            </div>
          </div>

          {/* 2. Navigation Items with Sanskrit Header + Subtitle */}
          <nav className="sidebar-nav" style={{
            padding: '12px 10px',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            maxHeight: 'calc(100vh - 150px)',
            overflowY: 'auto'
          }}>
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActivePage(item.id);
                    if (onMobileClose) onMobileClose();
                  }}
                title={collapsed ? `${item.glyph} ${item.title} — ${item.subtitle}` : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: collapsed ? '10px 0' : '8px 12px',
                  borderRadius: 10,
                  border: isActive ? '1px solid #fbbf24' : (item.isSupreme ? '1px solid rgba(251, 191, 36, 0.4)' : '1px solid transparent'),
                  background: isActive ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.22), rgba(217, 119, 6, 0.15))' : (item.isSupreme ? 'rgba(251, 191, 36, 0.08)' : 'transparent'),
                  color: isActive ? '#fbbf24' : (item.isSupreme ? '#fef08a' : '#94a3b8'),
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: isActive ? '0 0 15px rgba(251, 191, 36, 0.25)' : (item.isSupreme ? '0 0 10px rgba(251, 191, 36, 0.15)' : 'none')
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    e.currentTarget.style.color = '#f8fafc';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#94a3b8';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: collapsed ? 'center' : 'flex-start', width: collapsed ? '100%' : 'auto' }}>
                  {/* Sanskrit Glyph */}
                  <span style={{
                    fontSize: '1.05rem',
                    fontWeight: 900,
                    color: isActive ? '#fbbf24' : '#cbd5e1',
                    width: 22,
                    textAlign: 'center',
                    flexShrink: 0
                  }}>
                    {item.glyph}
                  </span>

                  {!collapsed && (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{
                        fontSize: '0.82rem',
                        fontWeight: 900,
                        letterSpacing: '0.06em',
                        color: isActive ? '#fbbf24' : '#f8fafc'
                      }}>
                        {item.title}
                      </span>
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 600,
                        color: isActive ? 'rgba(251, 191, 36, 0.85)' : '#64748b'
                      }}>
                        {item.subtitle}
                      </span>
                    </div>
                  )}
                </div>

                {!collapsed && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    {item.badge > 0 && (
                      <span style={{
                        background: '#dc2626',
                        color: '#fff',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        padding: '1px 6px',
                        borderRadius: 10
                      }}>
                        {item.badge}
                      </span>
                    )}
                    {item.hasChevron && !item.badge && (
                      <ChevronRight size={13} style={{ color: isActive ? '#fbbf24' : '#475569' }} />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* 3. Bottom User Profile (Dynamic Sovereign Profile + Settings) */}
      <div className="sidebar-footer" style={{
        padding: '12px 14px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        background: '#040711'
      }}>
        {(() => {
          const { user, openAuthModal } = useAuthStore();
          const userName = user?.name || 'Samrudh';
          const userInitial = userName.charAt(0).toUpperCase();
          const userStatus = user?.isGuest ? 'Guest Explorer' : 'Online';

          return (
            <div className="user-profile-widget" onClick={() => { onOpenSettings(); if (onMobileClose) onMobileClose(); }} title="User Profile & Settings" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'space-between',
              cursor: 'pointer'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="user-avatar-circle" style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #fbbf24, #d97706)',
                  color: '#000',
                  fontWeight: 900,
                  fontSize: 14,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span>{userInitial}</span>
                </div>
                {!collapsed && (
                  <div className="user-text-info">
                    <span className="user-name" style={{ fontWeight: 800, fontSize: '0.84rem', color: '#f8fafc' }}>
                      {userName}
                    </span>
                    <span className="user-status-online" style={{ fontSize: '0.68rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span className="online-dot" /> {userStatus}
                    </span>
                  </div>
                )}
              </div>
              {!collapsed && (
                <button className="user-settings-gear" onClick={(e) => { e.stopPropagation(); onOpenSettings(); }} title="Settings" style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                  <Settings size={15} />
                </button>
              )}
            </div>
          );
        })()}
        {!collapsed && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', fontSize: '0.68rem', color: '#64748b', marginTop: '10px', justifyContent: 'center', alignItems: 'center' }}>
            <button
              onClick={() => { if (onOpenFeedback) onOpenFeedback(); if (onMobileClose) onMobileClose(); }}
              style={{ background: 'none', border: 'none', color: '#fbbf24', cursor: 'pointer', fontSize: '0.68rem', padding: 0, fontWeight: 700 }}
              onMouseEnter={(e) => { e.currentTarget.style.textDecoration = 'underline'; }}
              onMouseLeave={(e) => { e.currentTarget.style.textDecoration = 'none'; }}
            >
              🌟 Feedback
            </button>
            <span style={{ opacity: 0.4 }}>•</span>
            <button
              onClick={() => { if (onOpenPrivacy) onOpenPrivacy(); if (onMobileClose) onMobileClose(); }}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.68rem', padding: 0 }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#fbbf24'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; }}
            >
              Privacy
            </button>
            <span style={{ opacity: 0.4 }}>•</span>
            <button
              onClick={() => { if (onOpenTerms) onOpenTerms(); if (onMobileClose) onMobileClose(); }}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.68rem', padding: 0 }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#fbbf24'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; }}
            >
              Terms
            </button>
          </div>
        )}
      </div>
    </aside>
    </>
  );
}
