import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const usePlacesStore = create(
  persist(
    (set) => ({
      places: [],
      locationSharing: {},

      addPlace: (place) => {
        set((state) => ({
          places: [...state.places, { id: 'PLC-' + Date.now(), ...place }],
        }));
      },

      removePlace: (id) => {
        set((state) => ({
          places: state.places.filter((p) => p.id !== id),
        }));
      },

      setLocationSharing: (memberId, mode) => {
        set((state) => ({
          locationSharing: { ...state.locationSharing, [memberId]: mode },
        }));
      },

      getLocationSharing: (memberId) => {
        return (state) => state.locationSharing[memberId] || 'OFF';
      },
    }),
    { name: 'familyos-places-storage' }
  )
);
