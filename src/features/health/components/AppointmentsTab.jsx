import { useState } from 'react';
import { CalendarClock, Trash2, List, Calendar } from 'lucide-react';
import { useHealthStore } from '../store';
import Button from '../../../components/Button';
import HealthSection from './HealthSection';
import AppointmentCalendar from './AppointmentCalendar';

export default function AppointmentsTab({ memberId }) {
  const { getMemberHealth, addAppointment, removeAppointment } = useHealthStore();
  const appointments = getMemberHealth(memberId).appointments
    .slice()
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  const [form, setForm] = useState({ doctor: '', hospital: '', date: '', time: '', purpose: '' });
  const [view, setView] = useState('list');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.doctor.trim()) return;
    addAppointment(memberId, form);
    setForm({ doctor: '', hospital: '', date: '', time: '', purpose: '' });
  };

  const isUpcoming = (date) => date && new Date(date) >= new Date(new Date().toDateString());

  return (
    <HealthSection
      title="Appointments"
      icon={CalendarClock}
      action={
        <div className="flex gap-1 bg-slate-100 rounded-lg p-0.5">
          <button
            onClick={() => setView('list')}
            className={
              view === 'list'
                ? 'flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-white text-rose-600 shadow-sm'
                : 'flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-slate-500'
            }
          >
            <List size={12} /> List
          </button>
          <button
            onClick={() => setView('calendar')}
            className={
              view === 'calendar'
                ? 'flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-white text-rose-600 shadow-sm'
                : 'flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-slate-500'
            }
          >
            <Calendar size={12} /> Calendar
          </button>
        </div>
      }
    >
      <form onSubmit={handleAdd} className="grid sm:grid-cols-3 gap-2 mb-3">
        <input
          type="text" placeholder="Doctor" value={form.doctor}
          onChange={(e) => setForm({ ...form, doctor: e.target.value })}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
        />
        <input
          type="text" placeholder="Hospital" value={form.hospital}
          onChange={(e) => setForm({ ...form, hospital: e.target.value })}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
        />
        <input
          type="text" placeholder="Purpose" value={form.purpose}
          onChange={(e) => setForm({ ...form, purpose: e.target.value })}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
        />
      </form>
      <form onSubmit={handleAdd} className="grid sm:grid-cols-3 gap-2 mb-5">
        <input
          type="date" value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
        />
        <input
          type="time" value={form.time}
          onChange={(e) => setForm({ ...form, time: e.target.value })}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
        />
        <Button type="submit" className="!bg-gradient-to-r !from-rose-500 !to-rose-600 hover:!from-rose-600 hover:!to-rose-700 shadow-rose-200">Add Appointment</Button>
      </form>

      {view === 'calendar' ? (
        <AppointmentCalendar appointments={appointments} />
      ) : appointments.length === 0 ? (
        <p className="text-sm text-slate-400">No appointments scheduled.</p>
      ) : (
        <div className="divide-y divide-slate-100">
          {appointments.map((a) => (
            <div key={a.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {a.doctor} {a.hospital ? '- ' + a.hospital : ''}
                </p>
                <p className="text-xs text-slate-500">
                  {a.date || 'No date'} {a.time ? 'at ' + a.time : ''} {a.purpose ? '- ' + a.purpose : ''}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {isUpcoming(a.date) && (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">Upcoming</span>
                )}
                <button onClick={() => removeAppointment(memberId, a.id)} className="text-slate-400 hover:text-red-600 transition">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </HealthSection>
  );
}
