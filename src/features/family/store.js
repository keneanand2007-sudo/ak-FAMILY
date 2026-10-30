import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useFamilyStore = create(
  persist(
    (set) => ({
      family: null,
      members: [],

      createFamily: (name, description, country) => {
        const newFamily = {
          id: `FAM-${Date.now()}`,
          name,
          description,
          country,
        };
        set({ family: newFamily });
      },

      addMember: (member) => {
        set((state) => ({
          members: [
            ...state.members,
            {
              id: `MEM-${Date.now()}-${state.members.length}`,
              ...member,
            },
          ],
        }));
      },

      removeMember: (id) => {
        set((state) => ({
          members: state.members.filter((m) => m.id !== id),
        }));
      },

      resetFamily: () => set({ family: null, members: [] }),
    }),
    { name: 'familyos-family-storage' }
  )
);
