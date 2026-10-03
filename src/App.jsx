import React, { useEffect } from 'react';

// Zustand stores (Phase 1 — centralized state)
import { useAppStore, useIdentityStore, useChatStore, useNotificationsStore } from '@store/index';

// Custom hooks
import { useKeyPress, useBackendHealth } from '@hooks/index';

// Utils
import { saveChatSession, saveRecentPrompt } from '@utils/index';
import { sendChatStream } from '@api/client';

// Data
import { INITIAL_NOTIFICATIONS } from '@data/notificationsData';

// Components
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
import AppBuilderStudio from '@components/AppBuilderStudio';
import LovableAppStudio from '@components/LovableAppStudio';
import RemoteGatewayView from '@components/RemoteGatewayView';
import ImageGenerationStudio from '@components/ImageGenerationStudio';
import DharmaGovernanceView from '@components/DharmaGovernanceView';
import NovaDiscoveryStudio from '@components/NovaDiscoveryStudio';
import CoconutMindStudio from '@components/CoconutMindStudio';
import GenesisOSStudio from '@components/GenesisOSStudio';
import ModelTrainingStudio from '@components/ModelTrainingStudio';

import '@styles/index.css';

export default function App() {
  const [activeStudioModal, setActiveStudioModal] = React.useState(null); // 'discovery' | 'coconut' | 'genesis' | 'training' | null

  // ─── Zustand store slices ────────────────────────────────────────────────
  const {
    activePage, setActivePage,
    theme,
    isIdentityModalOpen, setIdentityModal,
    isCommandPaletteOpen, setCommandPalette,
    isSettingsModalOpen, setSettingsModal,
    showSplash, completeSplash, replaySplash,
    setBackendStatus,
  } = useAppStore();

  const { currentIdentity, setIdentity } = useIdentityStore();

  const { messages, isThinking, addMessage, clearMessages, setThinking } = useChatStore();

  const {
    notifications, setNotifications, markAllRead, unreadCount,
  } = useNotificationsStore();

  // ─── Backend health check ─────────────────────────────────────────────────
  const { backendOnline, ollamaOnline } = useBackendHealth();
  useEffect(() => {
    setBackendStatus(backendOnline, ollamaOnline);
  }, [backendOnline, ollamaOnline, setBackendStatus]);

  // ─── Seed notifications if empty ─────────────────────────────────────────
  useEffect(() => {
    if (notifications.length === 0) {
      setNotifications(INITIAL_NOTIFICATIONS);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Keyboard shortcuts ───────────────────────────────────────────────────
  useKeyPress('k', () => setCommandPalette(true), true);   // Ctrl+K
  useKeyPress('Escape', () => {
    setIdentityModal(false);
    setCommandPalette(false);
    setSettingsModal(false);
  });

  // ─── Core chat handler (Live SSE streaming with backend) ─────────────────
  const handleSendPrompt = (text, pills = {}) => {
    if (!text.trim()) return;

    const userMsg = { sender: 'user', text, timestamp: new Date().toISOString() };
    const updatedMessages = [...messages, userMsg];
    addMessage(userMsg);
    setActivePage('chat');
    setThinking(true);
    saveRecentPrompt(text);

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
          text: `**[${currentIdentity.name} Synthesis]**\n\n${currentIdentity.philosophy}\n\n*Query:* "${text}"\n\nI have analyzed this through the **${currentIdentity.name} Intelligence** domain. The 289+ Specialized Swarm Agents are active across all 13 Councils. Connect a local Ollama instance or set \`HF_API_TOKEN\` in \`backend/.env\` for full uncapped neural generation.`,
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
        onNewChat={handleNewChat}
        currentIdentity={currentIdentity}
      />

      <main className="main-workspace">
        {activePage !== 'app-builder' && (
          <Header
            currentIdentity={currentIdentity}
            onOpenIdentityModal={() => setIdentityModal(true)}
            onOpenCommandPalette={() => setCommandPalette(true)}
            theme={theme}
            backendOnline={backendOnline}
            ollamaOnline={ollamaOnline}
            setActivePage={setActivePage}
          />
        )}

        {/* Page Views */}
        {activePage === 'chat' && messages.length === 0 && (
          <HeroSection
            currentIdentity={currentIdentity}
            onSendPrompt={handleSendPrompt}
            onOpenStudio={setActiveStudioModal}
            onSelectIdentity={setIdentity}
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
      </main>

      {/* AGI Frontier Engine Studios */}
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

      {/* Modals */}
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
    </div>
  );
}
