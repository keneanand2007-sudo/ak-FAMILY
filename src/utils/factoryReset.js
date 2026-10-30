export function factoryReset() {
  const keys = [
    'familyos-auth-storage',
    'familyos-family-storage',
    'familyos-health-storage',
    'familyos-finance-storage',
    'familyos-education-storage',
    'familyos-documents-storage',
    'familyos-places-storage',
    'familyos-permissions-storage',
    'familyos-alerts-storage',
  ];
  keys.forEach((k) => localStorage.removeItem(k));
  window.location.href = '/auth';
}
