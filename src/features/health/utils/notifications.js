export function requestNotificationPermission() {
  if (!('Notification' in window)) return Promise.resolve('unsupported');
  if (Notification.permission === 'granted') return Promise.resolve('granted');
  if (Notification.permission === 'denied') return Promise.resolve('denied');
  return Notification.requestPermission();
}

export function scheduleMedicationReminder(medName, reminderTime) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return null;
  if (!reminderTime) return null;

  const now = new Date();
  const parts = reminderTime.split(':');
  const target = new Date();
  target.setHours(Number(parts[0]), Number(parts[1]), 0, 0);

  if (target <= now) {
    target.setDate(target.getDate() + 1);
  }

  const delay = target.getTime() - now.getTime();

  const timeoutId = setTimeout(() => {
    new Notification('Medication Reminder', {
      body: 'Time to take: ' + medName,
    });
  }, delay);

  return timeoutId;
}
