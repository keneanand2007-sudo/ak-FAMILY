import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const emptyMemberHealth = () => ({
  profile: {
    bloodGroup: '',
    allergies: '',
    conditions: '',
    emergencyNotes: '',
  },
  records: [],
  medications: [],
  appointments: [],
  emergencyContacts: [],
  vaccinations: [],
  metrics: [],
});

export const useHealthStore = create(
  persist(
    (set, get) => ({
      healthData: {},

      ensureMember: (memberId) => {
        const { healthData } = get();
        if (!healthData[memberId]) {
          set({ healthData: { ...healthData, [memberId]: emptyMemberHealth() } });
        }
      },

      updateProfile: (memberId, profile) => {
        set((state) => ({
          healthData: {
            ...state.healthData,
            [memberId]: {
              ...(state.healthData[memberId] || emptyMemberHealth()),
              profile,
            },
          },
        }));
      },

      addRecord: (memberId, record) => {
        set((state) => {
          const member = state.healthData[memberId] || emptyMemberHealth();
          return {
            healthData: {
              ...state.healthData,
              [memberId]: {
                ...member,
                records: [...member.records, { id: 'REC-' + Date.now(), ...record }],
              },
            },
          };
        });
      },
      removeRecord: (memberId, id) => {
        set((state) => {
          const member = state.healthData[memberId];
          if (!member) return state;
          return {
            healthData: {
              ...state.healthData,
              [memberId]: { ...member, records: member.records.filter((r) => r.id !== id) },
            },
          };
        });
      },

      addMedication: (memberId, med) => {
        set((state) => {
          const member = state.healthData[memberId] || emptyMemberHealth();
          return {
            healthData: {
              ...state.healthData,
              [memberId]: {
                ...member,
                medications: [...member.medications, { id: 'MED-' + Date.now(), ...med }],
              },
            },
          };
        });
      },
      removeMedication: (memberId, id) => {
        set((state) => {
          const member = state.healthData[memberId];
          if (!member) return state;
          return {
            healthData: {
              ...state.healthData,
              [memberId]: { ...member, medications: member.medications.filter((m) => m.id !== id) },
            },
          };
        });
      },

      addAppointment: (memberId, appt) => {
        set((state) => {
          const member = state.healthData[memberId] || emptyMemberHealth();
          return {
            healthData: {
              ...state.healthData,
              [memberId]: {
                ...member,
                appointments: [...member.appointments, { id: 'APT-' + Date.now(), ...appt }],
              },
            },
          };
        });
      },
      removeAppointment: (memberId, id) => {
        set((state) => {
          const member = state.healthData[memberId];
          if (!member) return state;
          return {
            healthData: {
              ...state.healthData,
              [memberId]: { ...member, appointments: member.appointments.filter((a) => a.id !== id) },
            },
          };
        });
      },

      addEmergencyContact: (memberId, contact) => {
        set((state) => {
          const member = state.healthData[memberId] || emptyMemberHealth();
          return {
            healthData: {
              ...state.healthData,
              [memberId]: {
                ...member,
                emergencyContacts: [
                  ...member.emergencyContacts,
                  { id: 'EC-' + Date.now(), ...contact },
                ],
              },
            },
          };
        });
      },
      removeEmergencyContact: (memberId, id) => {
        set((state) => {
          const member = state.healthData[memberId];
          if (!member) return state;
          return {
            healthData: {
              ...state.healthData,
              [memberId]: {
                ...member,
                emergencyContacts: member.emergencyContacts.filter((c) => c.id !== id),
              },
            },
          };
        });
      },

      addVaccination: (memberId, vac) => {
        set((state) => {
          const member = state.healthData[memberId] || emptyMemberHealth();
          return {
            healthData: {
              ...state.healthData,
              [memberId]: {
                ...member,
                vaccinations: [...member.vaccinations, { id: 'VAC-' + Date.now(), ...vac }],
              },
            },
          };
        });
      },
      removeVaccination: (memberId, id) => {
        set((state) => {
          const member = state.healthData[memberId];
          if (!member) return state;
          return {
            healthData: {
              ...state.healthData,
              [memberId]: { ...member, vaccinations: member.vaccinations.filter((v) => v.id !== id) },
            },
          };
        });
      },

      addMetric: (memberId, metric) => {
        set((state) => {
          const member = state.healthData[memberId] || emptyMemberHealth();
          return {
            healthData: {
              ...state.healthData,
              [memberId]: {
                ...member,
                metrics: [...member.metrics, { id: 'MTR-' + Date.now(), ...metric }],
              },
            },
          };
        });
      },
      removeMetric: (memberId, id) => {
        set((state) => {
          const member = state.healthData[memberId];
          if (!member) return state;
          return {
            healthData: {
              ...state.healthData,
              [memberId]: { ...member, metrics: member.metrics.filter((m) => m.id !== id) },
            },
          };
        });
      },

      getMemberHealth: (memberId) => {
        const data = get().healthData[memberId];
        if (!data) return emptyMemberHealth();
        return {
          ...emptyMemberHealth(),
          ...data,
        };
      },
    }),
    { name: 'familyos-health-storage' }
  )
);
