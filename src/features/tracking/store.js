import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const emptyTrackingState = function () {
  return {
    currentLat: null,
    currentLng: null,
    destinationLat: null,
    destinationLng: null,
    destinationName: '',
    status: 'At Home',
    lastUpdated: null,
  };
};

export const useTrackingStore = create(
  persist(
    function (set, get) {
      return {
        tracking: {},

        setCurrentLocation: function (memberId, lat, lng) {
          set(function (state) {
            var existing = state.tracking[memberId] || emptyTrackingState();
            var updated = {};
            updated[memberId] = Object.assign({}, existing, {
              currentLat: lat,
              currentLng: lng,
              lastUpdated: Date.now(),
            });
            return { tracking: Object.assign({}, state.tracking, updated) };
          });
        },

        setDestination: function (memberId, lat, lng, name) {
          set(function (state) {
            var existing = state.tracking[memberId] || emptyTrackingState();
            var updated = {};
            updated[memberId] = Object.assign({}, existing, {
              destinationLat: lat,
              destinationLng: lng,
              destinationName: name,
              status: 'On Way',
              lastUpdated: Date.now(),
            });
            return { tracking: Object.assign({}, state.tracking, updated) };
          });
        },

        setStatus: function (memberId, status) {
          set(function (state) {
            var existing = state.tracking[memberId] || emptyTrackingState();
            var updated = {};
            updated[memberId] = Object.assign({}, existing, {
              status: status,
              lastUpdated: Date.now(),
            });
            return { tracking: Object.assign({}, state.tracking, updated) };
          });
        },

        clearDestination: function (memberId) {
          set(function (state) {
            var existing = state.tracking[memberId] || emptyTrackingState();
            var updated = {};
            updated[memberId] = Object.assign({}, existing, {
              destinationLat: null,
              destinationLng: null,
              destinationName: '',
              status: 'At Home',
            });
            return { tracking: Object.assign({}, state.tracking, updated) };
          });
        },

        getMemberTracking: function (memberId) {
          return get().tracking[memberId] || emptyTrackingState();
        },
      };
    },
    { name: 'familyos-tracking-storage' }
  )
);
