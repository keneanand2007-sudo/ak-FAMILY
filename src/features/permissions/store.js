import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const ROLES = ['Family Owner', 'Admin', 'Adult Member', 'Student', 'Child', 'Emergency Contact', 'Viewer'];

export const usePermissionsStore = create(
  persist(
    (set, get) => ({
      roles: {},
      auditLog: [],

      setRole: (memberId, role) => {
        set((state) => ({
          roles: { ...state.roles, [memberId]: role },
        }));
      },

      getRole: (memberId) => {
        return get().roles[memberId] || 'Viewer';
      },

      logAction: (actor, action, category) => {
        set((state) => ({
          auditLog: [
            {
              id: 'LOG-' + Date.now(),
              timestamp: new Date().toISOString(),
              actor,
              action,
              category,
            },
            ...state.auditLog,
          ].slice(0, 200),
        }));
      },

      clearAuditLog: () => set({ auditLog: [] }),
    }),
    { name: 'familyos-permissions-storage' }
  )
);
