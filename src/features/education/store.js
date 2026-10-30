import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const emptyMemberEducation = () => ({
  profile: {
    institution: '',
    course: '',
    year: '',
    rollNumber: '',
  },
  performance: [],
  exams: [],
  assignments: [],
  certificates: [],
  skills: [],
});

export const useEducationStore = create(
  persist(
    (set, get) => ({
      educationData: {},

      ensureMember: (memberId) => {
        const data = get().educationData;
        if (!data[memberId]) {
          set({ educationData: { ...data, [memberId]: emptyMemberEducation() } });
        }
      },

      updateProfile: (memberId, profile) => {
        set((state) => ({
          educationData: {
            ...state.educationData,
            [memberId]: {
              ...(state.educationData[memberId] || emptyMemberEducation()),
              profile,
            },
          },
        }));
      },

      addPerformance: (memberId, item) => {
        set((state) => {
          const member = state.educationData[memberId] || emptyMemberEducation();
          return {
            educationData: {
              ...state.educationData,
              [memberId]: {
                ...member,
                performance: [...member.performance, { id: 'PERF-' + Date.now(), ...item }],
              },
            },
          };
        });
      },
      removePerformance: (memberId, id) => {
        set((state) => {
          const member = state.educationData[memberId];
          if (!member) return state;
          return {
            educationData: {
              ...state.educationData,
              [memberId]: { ...member, performance: member.performance.filter((p) => p.id !== id) },
            },
          };
        });
      },

      addExam: (memberId, item) => {
        set((state) => {
          const member = state.educationData[memberId] || emptyMemberEducation();
          return {
            educationData: {
              ...state.educationData,
              [memberId]: {
                ...member,
                exams: [...member.exams, { id: 'EXM-' + Date.now(), ...item }],
              },
            },
          };
        });
      },
      removeExam: (memberId, id) => {
        set((state) => {
          const member = state.educationData[memberId];
          if (!member) return state;
          return {
            educationData: {
              ...state.educationData,
              [memberId]: { ...member, exams: member.exams.filter((e) => e.id !== id) },
            },
          };
        });
      },

      addAssignment: (memberId, item) => {
        set((state) => {
          const member = state.educationData[memberId] || emptyMemberEducation();
          return {
            educationData: {
              ...state.educationData,
              [memberId]: {
                ...member,
                assignments: [...member.assignments, { id: 'ASG-' + Date.now(), ...item }],
              },
            },
          };
        });
      },
      removeAssignment: (memberId, id) => {
        set((state) => {
          const member = state.educationData[memberId];
          if (!member) return state;
          return {
            educationData: {
              ...state.educationData,
              [memberId]: { ...member, assignments: member.assignments.filter((a) => a.id !== id) },
            },
          };
        });
      },

      addCertificate: (memberId, item) => {
        set((state) => {
          const member = state.educationData[memberId] || emptyMemberEducation();
          return {
            educationData: {
              ...state.educationData,
              [memberId]: {
                ...member,
                certificates: [...member.certificates, { id: 'CERT-' + Date.now(), ...item }],
              },
            },
          };
        });
      },
      removeCertificate: (memberId, id) => {
        set((state) => {
          const member = state.educationData[memberId];
          if (!member) return state;
          return {
            educationData: {
              ...state.educationData,
              [memberId]: { ...member, certificates: member.certificates.filter((c) => c.id !== id) },
            },
          };
        });
      },

      addSkill: (memberId, item) => {
        set((state) => {
          const member = state.educationData[memberId] || emptyMemberEducation();
          return {
            educationData: {
              ...state.educationData,
              [memberId]: {
                ...member,
                skills: [...member.skills, { id: 'SKL-' + Date.now(), ...item }],
              },
            },
          };
        });
      },
      removeSkill: (memberId, id) => {
        set((state) => {
          const member = state.educationData[memberId];
          if (!member) return state;
          return {
            educationData: {
              ...state.educationData,
              [memberId]: { ...member, skills: member.skills.filter((s) => s.id !== id) },
            },
          };
        });
      },

      getMemberEducation: (memberId) => {
        return get().educationData[memberId] || emptyMemberEducation();
      },
    }),
    { name: 'familyos-education-storage' }
  )
);
