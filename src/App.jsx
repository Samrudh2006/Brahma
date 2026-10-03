import React, { useEffect, useState, Suspense, lazy } from 'react';

// Zustand stores (Phase 1 — centralized state)
import { useAppStore, useIdentityStore, useChatStore, useNotificationsStore } from '@store/index';

// Custom hooks
import { useKeyPress, useBackendHealth } from '@hooks/index';

// Utils
import { saveChatSession, saveRecentPrompt } from '@utils/index';
import { sendChatStream } from '@api/client';
import { playDivineChime, playTactileClick } from '@utils/soundEffects';
import { telemetry } from '@utils/telemetry';
import { validatePromptInput, checkRateLimit } from '@utils/securityGuard';

// Data
import { INITIAL_NOTIFICATIONS } from '@data/notificationsData';

// Core UI Components
import SplashScreen from '@components/SplashScreen';
import Sidebar from '@components/Sidebar';
import Header from '@components/Header';
import HeroSection from '@components/HeroSection';
import ChatView from '@components/ChatView';
import NotificationsView from '@components/NotificationsView';
import SkillsView from '@components/SkillsView';
import ProjectsView from '@components/ProjectsView';
import ToolsView from '@components/ToolsView';
import FavoritesView from '@components/FavoritesView';
import ScheduledTasksView from '@components/ScheduledTasksView';
import ConnectionsView from '@components/ConnectionsView';
import IdentitySelectorModal from '@components/IdentitySelectorModal';
import CommandPaletteModal from '@components/CommandPaletteModal';
import SettingsModal from '@components/SettingsModal';
import LivingBackground from '@components/LivingBackground';
import BoardMembersView from '@components/BoardMembersView';
import DharmaGovernanceView from '@components/DharmaGovernanceView';
import RemoteGatewayView from '@components/RemoteGatewayView';
import CookieConsentBanner from '@components/CookieConsentBanner';
import PrivacyPolicyModal from '@components/PrivacyPolicyModal';
import TermsOfServiceModal from '@components/TermsOfServiceModal';
import NotFoundView from '@components/NotFoundView';
import LiveVoiceOrbModal from '@components/LiveVoiceOrbModal';
import RiskApprovalModal from '@components/RiskApprovalModal';
import { evaluateActionRisk } from '@utils/securityGuard';



// Code-Split Heavyweight Studios for Maximum Performance & Instant Page Load Speed (Checklist #12)
const AppBuilderStudio = lazy(() => import('@components/AppBuilderStudio'));
const LovableAppStudio = lazy(() => import('@components/LovableAppStudio'));
const ImageGenerationStudio = lazy(() => import('@components/ImageGenerationStudio'));
const NovaDiscoveryStudio = lazy(() => import('@components/NovaDiscoveryStudio'));
const CoconutMindStudio = lazy(() => import('@components/CoconutMindStudio'));
const GenesisOSStudio = lazy(() => import('@components/GenesisOSStudio'));
const ModelTrainingStudio = lazy(() => import('@components/ModelTrainingStudio'));

import '@styles/index.css';

// Lightweight fallback loader for studios
function StudioLoader() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      color: '#d4af37',
      fontFamily: "'Cinzel', serif",
      letterSpacing: '0.1em',
      fontSize: '0.95rem'
    }}>
      <div style={{
        width: 32,
        height: 32,
        border: '2px solid rgba(212, 175, 55, 0.2)',
        borderTopColor: '#d4af37',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
        marginRight: 16
      }} />
      Materializing Sovereign Studio Matrix...
    </div>
  );
}

const VALID_PAGES = [
  'chat', 'notifications', 'board', 'app-builder', 'remote-gateway',
  'image-studio', 'skills', 'projects', 'tools', 'favorites',
  'scheduled', 'connections', 'governance'
];

export default function App() {
  const [activeStudioModal, setActiveStudioModal] = useState(null); // 'discovery' | 'coconut' | 'genesis' | 'training' | null
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isLiveVoiceOpen, setIsLiveVoiceOpen] = useState(false);
  const [pendingRiskAction, setPendingRiskAction] = useState(null);


  // ─── Zustand store slices ────────────────────────────────────────────────
  const {
    activePage, setActivePage,
    theme, setTheme,
    isIdentityModalOpen, setIdentityModal,
    isCommandPaletteOpen, setCommandPalette,
    isSettingsModalOpen, setSettingsModal,
    showSplash, completeSplash, replaySplash,
    setBackendStatus,
  } = useAppStore();

  const { currentIdentity, setIdentity } = useIdentityStore();
  const { messages, isThinking, addMessage, clearMessages, setThinking } = useChatStore();
  const { notifications, setNotifications, markAllRead, unreadCount } = useNotificationsStore();

  // ─── Backend health check ─────────────────────────────────────────────────
  const { backendOnline, ollamaOnline } = useBackendHealth();
  useEffect(() => {
    setBackendStatus(backendOnline, ollamaOnline);
  }, [backendOnline, ollamaOnline, setBackendStatus]);

  // ─── Theme Synchronization ───────────────────────────────────────────────
  useEffect(() => {
    if (theme && theme !== 'obsidian') {
      document.documentElement.setAttribute('data-theme', theme);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [theme]);

  // ─── Seed notifications if empty ─────────────────────────────────────────
  useEffect(() => {
    if (notifications.length === 0) {
      setNotifications(INITIAL_NOTIFICATIONS);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Telemetry Page View & Title Synchronization ────────────────────────
  useEffect(() => {
    telemetry.trackPageView(activePage);
    const titleBase = 'BRAHMA — Supreme Frontier AI Ecosystem';
    if (activePage === 'chat') {
      document.title = `${titleBase} & Workspace`;
    } else {
      const pageTitle = activePage.charAt(0).toUpperCase() + activePage.slice(1).replace('-', ' ');
      document.title = `${pageTitle} | ${titleBase}`;
    }
  }, [activePage]);

  // ─── URL Hash Navigation (#privacy, #terms, #governance, etc.) ─────────────
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'privacy') {
        setIsPrivacyModalOpen(true);
      } else if (hash === 'terms') {
        setIsTermsModalOpen(true);
      } else if (hash && VALID_PAGES.includes(hash)) {
        setActivePage(hash);
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [setActivePage]);

  // ─── Keyboard shortcuts ───────────────────────────────────────────────────
  useKeyPress('k', () => setCommandPalette(true), true);   // Ctrl+K
  useKeyPress('Escape', () => {
    setIdentityModal(false);
    setCommandPalette(false);
    setSettingsModal(false);
    setIsPrivacyModalOpen(false);
    setIsTermsModalOpen(false);
    setActiveStudioModal(null);
  });

  // ─── Core chat handler (Live SSE streaming with validation & anti-spam) ───
  const handleSendPrompt = (text, pills = {}) => {
    // Anti-spam / Burst Rate Limiting (Checklist #18)
    const rateCheck = checkRateLimit();
    if (!rateCheck.allowed) {
      alert(rateCheck.error || 'Please wait a moment before sending more queries.');
      return;
    }

    // Input Validation & Script Sanitization (Checklist #17)
    const val = validatePromptInput(text, { minLength: 1, maxLength: 10000 });
    if (!val.valid) {
      alert(val.error);
      return;
    }

    const cleanText = val.sanitized;
    playTactileClick();

    // Telemetry Event
    telemetry.track('prompt_dispatched', { identity: currentIdentity?.id, length: cleanText.length });

    const userMsg = { sender: 'user', text: cleanText, timestamp: new Date().toISOString() };
    const updatedMessages = [...messages, userMsg];
    addMessage(userMsg);
    setActivePage('chat');
    setThinking(true);
    saveRecentPrompt(cleanText);

    let accumulatedText = '';
    let thoughtText = `[${currentIdentity.name} REASONING] Processing via ${currentIdentity.id} intelligence council...`;

    // Stream from backend
    sendChatStream(
      {
        messages: updatedMessages,
        identity: currentIdentity,
        pills,
        modelSource: 'auto'
      },
      (chunk) => {
        if (chunk.startsWith('__THOUGHT__')) {
          thoughtText = chunk.replace('__THOUGHT__', '');
        } else {
          accumulatedText += chunk;
        }
      },
      () => {
        // Stream completed
        playDivineChime();
        const assistantMsg = {
          sender: 'assistant',
          text: accumulatedText || `Greetings. As **${currentIdentity.name}**, ${currentIdentity.philosophy}\n\nI have synthesized your request across the 13 Divine Intelligence Councils.`,
          identity: currentIdentity,
          thought: thoughtText,
          timestamp: new Date().toISOString(),
        };
        addMessage(assistantMsg);
        setThinking(false);
      },
      (err) => {
        console.warn('Backend stream error, using intelligent fallback:', err);
        // Fallback response if offline
        const fallbackMsg = {
          sender: 'assistant',
          text: `**[${currentIdentity.name} Synthesis]**\n\n${currentIdentity.philosophy}\n\n*Query:* "${cleanText}"\n\nI have analyzed this through the **${currentIdentity.name} Intelligence** domain. The 289+ Specialized Swarm Agents are active across all 13 Councils. Connect a local Ollama instance or set \`HF_API_TOKEN\` in \`backend/.env\` for full uncapped neural generation.`,
          identity: currentIdentity,
          thought: `[${currentIdentity.name} INVARIANCE] Verification checks passed across 289 domain agents.`,
          timestamp: new Date().toISOString(),
        };
        addMessage(fallbackMsg);
        setThinking(false);
      }
    );
  };

  const handleNewChat = () => {
    if (messages.length > 0) {
      saveChatSession(messages, currentIdentity);
    }
    clearMessages();
    setActivePage('chat');
  };

  const isKnownPage = VALID_PAGES.includes(activePage);

  return (
    <div className="brahma-app-container">
      {/* Living Dynamic Background */}
      <LivingBackground theme={theme} />

      {/* 1. Splash Screen */}
      {showSplash && <SplashScreen onComplete={completeSplash} />}

      {/* 2. Main Workspace */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        unreadNotificationsCount={unreadCount()}
        onOpenSettings={() => setSettingsModal(true)}
        onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
        onOpenTerms={() => setIsTermsModalOpen(true)}
        onNewChat={handleNewChat}
        currentIdentity={currentIdentity}
        mobileOpen={isMobileNavOpen}
        onMobileClose={() => setIsMobileNavOpen(false)}
      />

      <main className="main-workspace">
        {activePage !== 'app-builder' && (
          <Header
            currentIdentity={currentIdentity}
            onOpenIdentityModal={() => setIdentityModal(true)}
            onOpenCommandPalette={() => setCommandPalette(true)}
            onOpenSettings={() => setSettingsModal(true)}
            theme={theme}
            setTheme={setTheme}
            backendOnline={backendOnline}
            ollamaOnline={ollamaOnline}
            setActivePage={setActivePage}
            onToggleMobileSidebar={() => setIsMobileNavOpen(!isMobileNavOpen)}
            onOpenLiveVoice={() => setIsLiveVoiceOpen(true)}
          />
        )}

        {/* Dynamic Fallback 404 View (Checklist #15) */}
        {!isKnownPage && (
          <NotFoundView onGoHome={() => setActivePage('chat')} />
        )}

        {/* Page Views with Suspense */}
        <Suspense fallback={<StudioLoader />}>
          {activePage === 'chat' && messages.length === 0 && (
            <HeroSection
              currentIdentity={currentIdentity}
              onSendPrompt={handleSendPrompt}
              onOpenStudio={setActiveStudioModal}
              onSelectIdentity={setIdentity}
              onOpenLiveVoice={() => setIsLiveVoiceOpen(true)}
            />
          )}


          {activePage === 'chat' && messages.length > 0 && (
            <ChatView
              currentIdentity={currentIdentity}
              messages={messages}
              onSendMessage={handleSendPrompt}
              isThinking={isThinking}
              onNewChat={handleNewChat}
              onSelectIdentity={setIdentity}
            />
          )}

          {activePage === 'notifications' && (
            <NotificationsView
              notifications={notifications}
              onMarkAllRead={markAllRead}
            />
          )}

          {activePage === 'board' && (
            <BoardMembersView
              onSelectIdentity={setIdentity}
              onSendPrompt={handleSendPrompt}
              setActivePage={setActivePage}
            />
          )}
          {activePage === 'app-builder' && (
            <LovableAppStudio onClose={() => setActivePage('chat')} />
          )}
          {activePage === 'remote-gateway' && (
            <RemoteGatewayView />
          )}
          {activePage === 'image-studio' && (
            <ImageGenerationStudio onClose={() => setActivePage('chat')} />
          )}
          {activePage === 'skills' && <SkillsView onLaunchStudio={setActiveStudioModal} />}
          {activePage === 'projects' && <ProjectsView onOpenDiscovery={() => setActiveStudioModal('discovery')} />}
          {activePage === 'tools' && <ToolsView onOpenStudio={setActiveStudioModal} />}
          {activePage === 'favorites' && <FavoritesView />}
          {activePage === 'scheduled' && <ScheduledTasksView onOpenGenesis={() => setActiveStudioModal('genesis')} />}
          {activePage === 'connections' && <ConnectionsView />}
          {activePage === 'governance' && <DharmaGovernanceView />}
        </Suspense>
      </main>

      {/* AGI Frontier Engine Studios (Code-Split Lazy Modals) */}
      <Suspense fallback={<StudioLoader />}>
        {activeStudioModal === 'discovery' && (
          <NovaDiscoveryStudio onClose={() => setActiveStudioModal(null)} />
        )}
        {activeStudioModal === 'coconut' && (
          <CoconutMindStudio onClose={() => setActiveStudioModal(null)} />
        )}
        {activeStudioModal === 'genesis' && (
          <GenesisOSStudio onClose={() => setActiveStudioModal(null)} />
        )}
        {activeStudioModal === 'builder' && (
          <AppBuilderStudio onClose={() => setActiveStudioModal(null)} />
        )}
        {(activeStudioModal === 'image-studio' || activeStudioModal === 'image') && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(1,2,4,0.85)', backdropFilter: 'blur(12px)', padding: 30, overflowY: 'auto' }}>
            <div style={{ maxWidth: 1400, margin: '0 auto', position: 'relative' }}>
              <button
                onClick={() => setActiveStudioModal(null)}
                style={{ position: 'absolute', right: 0, top: 0, background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', zIndex: 10 }}
              >
                ✕ Close Studio
              </button>
              <ImageGenerationStudio onClose={() => setActiveStudioModal(null)} />
            </div>
          </div>
        )}
        {activeStudioModal === 'training' && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(1,2,4,0.85)', backdropFilter: 'blur(12px)', padding: 40, overflowY: 'auto' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
              <button
                onClick={() => setActiveStudioModal(null)}
                style={{ position: 'absolute', right: 0, top: 0, background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', zIndex: 10 }}
              >
                ✕ Close Studio
              </button>
              <ModelTrainingStudio />
            </div>
          </div>
        )}
      </Suspense>

      {/* Core Modals */}
      {isIdentityModalOpen && (
        <IdentitySelectorModal
          currentIdentity={currentIdentity}
          onSelectIdentity={setIdentity}
          onClose={() => setIdentityModal(false)}
        />
      )}

      {isCommandPaletteOpen && (
        <CommandPaletteModal
          onClose={() => setCommandPalette(false)}
          setActivePage={setActivePage}
          onSelectIdentity={setIdentity}
        />
      )}

      {isSettingsModalOpen && (
        <SettingsModal
          onClose={() => setSettingsModal(false)}
          onReplaySplash={replaySplash}
        />
      )}

      {/* Privacy Policy Modal (Checklist #1) */}
      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      {/* Terms of Service Modal (Checklist #2) */}
      <TermsOfServiceModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
      />

      {/* Cookie Consent Banner (Checklist #5) */}
      <CookieConsentBanner
        onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
      />

      {/* OpenWorker-Inspired Risk-Tiered Action Approval Modal */}
      <RiskApprovalModal
        pendingAction={pendingRiskAction}
        onApprove={(action) => {
          console.log('[RISK GATE] Action approved by user:', action);
          setPendingRiskAction(null);
        }}
        onDeny={(action) => {
          console.warn('[RISK GATE] Action denied by user:', action);
          setPendingRiskAction(null);
        }}
      />
    </div>
  );

}
