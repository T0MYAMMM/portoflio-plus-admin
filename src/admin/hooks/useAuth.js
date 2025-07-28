import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // Auth state
      isAuthenticated: false,
      user: null,
      lastLogin: null,
      sessionExpiry: null,

      // Actions
      login: (password) => {
        const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD;
        
        if (!correctPassword) {
          console.error('Admin password not configured in environment variables');
          return { 
            success: false, 
            error: 'Admin password not configured. Please check environment setup.' 
          };
        }

        if (password === correctPassword) {
          const now = new Date();
          const expiry = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours
          
          set({ 
            isAuthenticated: true,
            user: {
              id: 'admin',
              username: 'admin',
              role: 'administrator'
            },
            lastLogin: now.toISOString(),
            sessionExpiry: expiry.toISOString()
          });

          return { success: true };
        }
        
        return { 
          success: false, 
          error: 'Invalid password. Please try again.' 
        };
      },

      logout: () => {
        set({ 
          isAuthenticated: false,
          user: null,
          lastLogin: null,
          sessionExpiry: null
        });
      },

      // Check if session is still valid
      checkSession: () => {
        const state = get();
        if (!state.isAuthenticated || !state.sessionExpiry) {
          return false;
        }

        const now = new Date();
        const expiry = new Date(state.sessionExpiry);
        
        if (now > expiry) {
          // Session expired, logout
          get().logout();
          return false;
        }

        return true;
      },

      // Extend session (called on activity)
      extendSession: () => {
        const state = get();
        if (state.isAuthenticated) {
          const now = new Date();
          const newExpiry = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Extend by 24 hours
          
          set({
            sessionExpiry: newExpiry.toISOString()
          });
        }
      }
    }),
    {
      name: 'admin-auth-storage',
      version: 1,
      // Only persist certain fields
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        lastLogin: state.lastLogin,
        sessionExpiry: state.sessionExpiry
      })
    }
  )
);

// Custom hook for easier usage
export const useAuth = () => {
  const { 
    isAuthenticated, 
    user, 
    lastLogin,
    login, 
    logout, 
    checkSession, 
    extendSession 
  } = useAuthStore();

  // Auto-check session on hook usage
  const isSessionValid = checkSession();

  return { 
    isAuthenticated: isAuthenticated && isSessionValid,
    user, 
    lastLogin,
    login, 
    logout, 
    checkSession,
    extendSession
  };
};

export default useAuthStore; 