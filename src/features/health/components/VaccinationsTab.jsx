import { useState } from 'react';
import { Syringe, Trash2, CheckCircle2 } from 'lucide-react';
import { useHealthStore } from '../store';
import Button from '../../../components/Button';
import HealthSection from './HealthSection';

export default function VaccinationsTab({ memberId }) {
  const { getMemberHealth, addVaccination, removeVaccination } = useHealthStore();
  const vaccinations = getMemberHealth(memberId).vaccinations
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  const [form, setForm] = useState({ name: '', date: '', nextDue: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    addVaccination(memberId, form);
    setForm({ name: '', date: '', nextDue: '' });
  };

  const isDueSoon = (nextDue) => {
    if (!nextDue) return false;
    const today = new Date(new Date().toDateString());
    const due = new Date(nextDue);
    const diffDays = Math.round((due - today) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 30;
  };

  return (
    <HealthSection title="Vaccination Tracker" icon={Syringe}>
      <form onSubmit={handleAdd} className="grid sm:grid-cols-4 gap-2 mb-5">
        <input
          type="text"
          placeholder="Vaccine name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
        />
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          title="Date given"
        />
        <input
          type="date"
          value={form.nextDue}
          onChange={(e) => setForm({ ...form, nextDue: e.target.value })}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          title="Next dose due (optional)"
        />
        <Button type="submit" className="!bg-gradient-to-r !from-rose-500 !to-rose-600 hover:!from-rose-600 hover:!to-rose-700 shadow-rose-200">Add</Button>
      </form>

      {vaccinations.length === 0 ? (
        <p className="text-sm text-slate-400">No vaccinations recorded yet.</p>
      ) : (
        <div className="divide-y divide-slate-100">
          {vaccinations.map((v) => (
            <div key={v.id} className="flex items-center justify-between py-3">
              <div className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-slate-900">{v.name}</p>
                  <p className="text-xs text-slate-500">
                    Given {v.date || 'no date'}
                    {v.nextDue ? ' - Next dose: ' + v.nextDue : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {isDueSoon(v.nextDue) && (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">
                    Due soon
                  </span>
                )}
                <button onClick={() => removeVaccination(memberId, v.id)} className="text-slate-400 hover:text-red-600 transition">
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
