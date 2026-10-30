import { useState, useEffect } from 'react';
import { Pill, Trash2, Bell, BellOff } from 'lucide-react';
import { useHealthStore } from '../store';
import Button from '../../../components/Button';
import HealthSection from './HealthSection';
import { requestNotificationPermission, scheduleMedicationReminder } from '../utils/notifications';

export default function MedicationsTab({ memberId }) {
  const { getMemberHealth, addMedication, removeMedication } = useHealthStore();
  const medications = getMemberHealth(memberId).medications;
  const [form, setForm] = useState({ name: '', dosage: '', frequency: '', prescribedBy: '', reminderTime: '' });
  const [notifPermission, setNotifPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'unsupported'
  );

  useEffect(() => {
    const timeouts = [];
    if (notifPermission === 'granted') {
      medications.forEach((m) => {
        if (m.reminderTime) {
          const id = scheduleMedicationReminder(m.name, m.reminderTime);
          if (id) timeouts.push(id);
        }
      });
    }
    return () => {
      timeouts.forEach((id) => clearTimeout(id));
    };
  }, [medications, notifPermission]);

  const handleEnableNotifications = () => {
    requestNotificationPermission().then((result) => {
      setNotifPermission(result);
    });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    addMedication(memberId, form);
    setForm({ name: '', dosage: '', frequency: '', prescribedBy: '', reminderTime: '' });
  };

  return (
    <HealthSection
      title="Medication Tracker"
      icon={Pill}
      action={
        notifPermission === 'granted' ? (
          <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
            <Bell size={13} /> Reminders on
          </span>
        ) : (
          <button
            onClick={handleEnableNotifications}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-rose-600 font-medium transition"
          >
            <BellOff size={13} /> Enable reminders
          </button>
        )
      }
    >
      <form onSubmit={handleAdd} className="grid sm:grid-cols-3 gap-2 mb-2">
        <input
          type="text"
          placeholder="Medicine name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
        />
        <input
          type="text"
          placeholder="Dosage (500mg)"
          value={form.dosage}
          onChange={(e) => setForm({ ...form, dosage: e.target.value })}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
        />
        <input
          type="text"
          placeholder="Frequency (2x/day)"
          value={form.frequency}
          onChange={(e) => setForm({ ...form, frequency: e.target.value })}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
        />
      </form>
      <form onSubmit={handleAdd} className="grid sm:grid-cols-3 gap-2 mb-5">
        <input
          type="text"
          placeholder="Prescribed by"
          value={form.prescribedBy}
          onChange={(e) => setForm({ ...form, prescribedBy: e.target.value })}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
        />
        <input
          type="time"
          value={form.reminderTime}
          onChange={(e) => setForm({ ...form, reminderTime: e.target.value })}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          title="Daily reminder time (optional)"
        />
        <Button type="submit" className="!bg-gradient-to-r !from-rose-500 !to-rose-600 hover:!from-rose-600 hover:!to-rose-700 shadow-rose-200">Add</Button>
      </form>

      {medications.length === 0 ? (
        <p className="text-sm text-slate-400">No medications tracked yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {medications.map((m) => (
            <div key={m.id} className="border border-slate-100 rounded-xl p-3 flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-900">{m.name}</p>
                <p className="text-xs text-slate-500">{m.dosage} - {m.frequency}</p>
                {m.prescribedBy && <p className="text-xs text-slate-400 mt-0.5">Prescribed by {m.prescribedBy}</p>}
                {m.reminderTime && (
                  <p className="text-xs text-rose-500 mt-0.5 flex items-center gap-1">
                    <Bell size={11} /> Daily at {m.reminderTime}
                  </p>
                )}
              </div>
              <button onClick={() => removeMedication(memberId, m.id)} className="text-slate-400 hover:text-red-600 transition shrink-0">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </HealthSection>
  );
}
