import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Types for the store state
interface UserSession {
  id: string;
  email: string;
  role: 'breeder' | 'seeker' | 'admin';
  displayName?: string;
  avatarUrl?: string;
  isAuthenticated: boolean;
  onboardingCompleted: boolean;
}

interface UIState {
  isSidebarOpen: boolean;
  isLoadingOverlayVisible: boolean;
  loadingMessage?: string;
  activeModal?: string | null;
  toastNotifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
    duration?: number;
  }>;
}

interface AppState extends UIState {
  // User session state
  userSession: UserSession | null;

  // Actions
  setUserSession: (session: UserSession | null) => void;
  updateUserProfile: (updates: Partial<UserSession>) => void;
  clearUserSession: () => void;

  // UI state actions
  setSidebarOpen: (isOpen: boolean) => void;
  setLoadingOverlay: (isVisible: boolean, message?: string) => void;
  setActiveModal: (modal: string | null) => void;

  // Toast notifications
  addToast: (toast: Omit<UIState['toastNotifications'][0], 'id'>) => void;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
}

// Initial state
const initialState: Pick<AppState, 'userSession' | 'isSidebarOpen' | 'isLoadingOverlayVisible' | 'toastNotifications'> = {
  userSession: null,
  isSidebarOpen: false,
  isLoadingOverlayVisible: false,
  toastNotifications: [],
};

// Create the store
export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // User session actions
        setUserSession: (session) => {
          set({ userSession: session }, false, 'setUserSession');
        },

        updateUserProfile: (updates) => {
          const currentSession = get().userSession;
          if (currentSession) {
            set({
              userSession: { ...currentSession, ...updates }
            }, false, 'updateUserProfile');
          }
        },

        clearUserSession: () => {
          set({ userSession: null }, false, 'clearUserSession');
        },

        // UI state actions
        setSidebarOpen: (isOpen) => {
          set({ isSidebarOpen: isOpen }, false, 'setSidebarOpen');
        },

        setLoadingOverlay: (isVisible, message) => {
          set({
            isLoadingOverlayVisible: isVisible,
            loadingMessage: message
          }, false, 'setLoadingOverlay');
        },

        setActiveModal: (modal) => {
          set({ activeModal: modal }, false, 'setActiveModal');
        },

        // Toast notification actions
        addToast: (toast) => {
          const id = Date.now().toString();
          set({
            toastNotifications: [
              ...get().toastNotifications,
              { ...toast, id }
            ]
          }, false, 'addToast');
        },

        removeToast: (id) => {
          set({
            toastNotifications: get().toastNotifications.filter(toast => toast.id !== id)
          }, false, 'removeToast');
        },

        clearAllToasts: () => {
          set({ toastNotifications: [] }, false, 'clearAllToasts');
        },
      }),
      {
        name: 'doghouse-app-store',
        partialize: (state) => ({
          userSession: state.userSession,
          isSidebarOpen: state.isSidebarOpen,
        }),
      }
    ),
    {
      name: 'DoghouseAppStore',
    }
  )
);

// Selector hooks for better performance and reusability
export const useUserSession = () => useAppStore((state) => state.userSession);
export const useIsAuthenticated = () => useAppStore((state) => state.userSession?.isAuthenticated ?? false);
export const useUserRole = () => useAppStore((state) => state.userSession?.role);
export const useUserProfile = () => useAppStore((state) => ({
  displayName: state.userSession?.displayName,
  avatarUrl: state.userSession?.avatarUrl,
  email: state.userSession?.email,
}));

export const useUIState = () => useAppStore((state) => ({
  isSidebarOpen: state.isSidebarOpen,
  isLoadingOverlayVisible: state.isLoadingOverlayVisible,
  loadingMessage: state.loadingMessage,
  activeModal: state.activeModal,
}));

export const useToastNotifications = () => useAppStore((state) => state.toastNotifications);

// Action hooks for easier usage in components
export const useAppActions = () => useAppStore((state) => ({
  setUserSession: state.setUserSession,
  updateUserProfile: state.updateUserProfile,
  clearUserSession: state.clearUserSession,
  setSidebarOpen: state.setSidebarOpen,
  setLoadingOverlay: state.setLoadingOverlay,
  setActiveModal: state.setActiveModal,
  addToast: state.addToast,
  removeToast: state.removeToast,
  clearAllToasts: state.clearAllToasts,
}));
