/**
 * BRAHMA — Global App Store (Zustand)
 * Single source of truth for all app state.
 * Replaces scattered useState calls across components.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IDENTITIES } from '@data/identities';

// ─── App State (not persisted) ───────────────────────────────────────────────
export const useAppStore = create((set, get) => ({
  // Navigation
  activePage: 'chat',
  setActivePage: (page) => set({ activePage: page }),

  // Theme Engine (4 Luxury Themes: Sūrya, Mayūra, Cyberpunk, Himālaya)
  theme: typeof window !== 'undefined'
    ? ((localStorage.getItem('brahma-theme') === 'obsidian' ? 'surya' : localStorage.getItem('brahma-theme')) || 'surya')
    : 'surya',
  setTheme: (theme) => {
    const finalTheme = (theme === 'obsidian' || !theme) ? 'surya' : theme;
    if (typeof window !== 'undefined') {
      localStorage.setItem('brahma-theme', finalTheme);
      document.documentElement.setAttribute('data-theme', finalTheme);
      document.body.setAttribute('data-theme', finalTheme);
    }
    set({ theme: finalTheme });
  },

  // Modals
  isIdentityModalOpen: false,
  isCommandPaletteOpen: false,
  isSettingsModalOpen: false,
  setIdentityModal: (open) => set({ isIdentityModalOpen: open }),
  setCommandPalette: (open) => set({ isCommandPaletteOpen: open }),
  setSettingsModal: (open) => set({ isSettingsModalOpen: open }),

  // Splash screen
  showSplash: !sessionStorage.getItem('hasSeenBrahmaSplash'),
  completeSplash: () => {
    sessionStorage.setItem('hasSeenBrahmaSplash', 'true');
    set({ showSplash: false });
  },
  replaySplash: () => set({ showSplash: true }),

  // AI model source
  modelSource: 'auto', // 'auto' | 'local' | 'cloud'
  setModelSource: (src) => set({ modelSource: src }),

  // Backend connection status
  backendOnline: false,
  ollamaOnline: false,
  setBackendStatus: (backendOnline, ollamaOnline) =>
    set({ backendOnline, ollamaOnline }),
}));

// ─── Identity Store (persisted to localStorage) ───────────────────────────────
export const useIdentityStore = create(
  persist(
    (set, get) => ({
      currentIdentity: IDENTITIES[0], // BRAHMA default
      setIdentity: (identity) => {
        // Apply identity accent color as CSS variable
        document.documentElement.style.setProperty(
          '--identity-accent',
          identity.accentColor
        );
        document.documentElement.style.setProperty(
          '--identity-glow',
          `${identity.accentColor}40`
        );
        set({ currentIdentity: identity });
      },
    }),
    {
      name: 'brahma-identity', // localStorage key
      partialize: (state) => ({ currentIdentity: state.currentIdentity }),
    }
  )
);

// ─── Chat Store (session state, not persisted) ─────────────────────────────────
export const useChatStore = create((set, get) => ({
  messages: [],
  isThinking: false,
  streamingText: '',

  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  clearMessages: () => set({ messages: [], streamingText: '' }),
  setThinking: (val) => set({ isThinking: val }),
  setStreamingText: (text) => set({ streamingText: text }),
  appendStreamingText: (chunk) =>
    set((state) => ({ streamingText: state.streamingText + chunk })),
}));

// ─── Notifications Store (persisted) ─────────────────────────────────────────
export const useNotificationsStore = create(
  persist(
    (set, get) => ({
      notifications: [],
      setNotifications: (notifications) => set({ notifications }),
      markAllRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),
      markRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),
      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            { ...notification, id: Date.now(), read: false, createdAt: new Date().toISOString() },
            ...state.notifications,
          ],
        })),
      unreadCount: () => get().notifications.filter((n) => !n.read).length,
    }),
    { name: 'brahma-notifications' }
  )
);
