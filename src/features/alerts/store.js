import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAlertsStore = create(
  persist(
    function (set, get) {
      return {
        preferences: {
          inApp: true,
          email: false,
          push: false,
          sms: false,
        },
        dismissedIds: [],
        snoozedUntil: {},

        setPreference: function (key, value) {
          set(function (state) {
            var updated = Object.assign({}, state.preferences);
            updated[key] = value;
            return { preferences: updated };
          });
        },

        dismissAlert: function (id) {
          set(function (state) {
            return { dismissedIds: state.dismissedIds.concat([id]) };
          });
        },

        snoozeAlert: function (id, hours) {
          set(function (state) {
            var until = Date.now() + (hours || 24) * 60 * 60 * 1000;
            var updated = Object.assign({}, state.snoozedUntil);
            updated[id] = until;
            return { snoozedUntil: updated };
          });
        },

        isActive: function (id) {
          var state = get();
          if (state.dismissedIds.indexOf(id) !== -1) return false;
          var snoozeTime = state.snoozedUntil[id];
          if (snoozeTime && snoozeTime > Date.now()) return false;
          return true;
        },
      };
    },
    { name: 'familyos-alerts-storage' }
  )
);
