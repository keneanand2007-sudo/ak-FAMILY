import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const DUMMY_USERS = [
  { id: 'USR-001', name: 'Anand Kene', email: 'anand@example.com', password: '123456' },
];

export const useAuthStore = create(
  persist(
    (set) => ({
      currentUser: null,
      isAuthenticated: false,

      login: (email, password) => {
        const user = DUMMY_USERS.find(
          (u) => u.email === email && u.password === password
        );
        if (user) {
          set({ currentUser: user, isAuthenticated: true });
          return { success: true };
        }
        return { success: false, message: 'Invalid email or password' };
      },

      signup: (name, email, password) => {
        const newUser = { id: 'USR-' + Date.now(), name, email, password };
        DUMMY_USERS.push(newUser);
        set({ currentUser: newUser, isAuthenticated: true });
        return { success: true };
      },

      loginAsGuest: () => {
        const guestUser = { id: 'USR-GUEST-' + Date.now(), name: 'Guest User', email: 'guest@familyos.local' };
        set({ currentUser: guestUser, isAuthenticated: true });
      },

      logout: () => set({ currentUser: null, isAuthenticated: false }),
    }),
    { name: 'familyos-auth-storage' }
  )
);
