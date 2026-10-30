import { useState } from 'react';
import { PhoneCall, Trash2 } from 'lucide-react';
import { useHealthStore } from '../store';
import Button from '../../../components/Button';
import HealthSection from './HealthSection';

export default function EmergencyContactsTab({ memberId }) {
  const { getMemberHealth, addEmergencyContact, removeEmergencyContact } = useHealthStore();
  const contacts = getMemberHealth(memberId).emergencyContacts
    .slice()
    .sort((a, b) => a.priority - b.priority);
  const [form, setForm] = useState({ name: '', relation: '', phone: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;
    addEmergencyContact(memberId, { ...form, priority: contacts.length + 1 });
    setForm({ name: '', relation: '', phone: '' });
  };

  return (
    <HealthSection title="Emergency Contacts" icon={PhoneCall}>
      <form onSubmit={handleAdd} className="grid sm:grid-cols-4 gap-2 mb-5">
        <input
          type="text" placeholder="Name" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
        />
        <input
          type="text" placeholder="Relation" value={form.relation}
          onChange={(e) => setForm({ ...form, relation: e.target.value })}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
        />
        <input
          type="tel" placeholder="Phone number" value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
        />
        <Button type="submit" className="!bg-gradient-to-r !from-rose-500 !to-rose-600 hover:!from-rose-600 hover:!to-rose-700 shadow-rose-200">Add Contact</Button>
      </form>

      {contacts.length === 0 ? (
        <p className="text-sm text-slate-400">No emergency contacts added. Add at least one — this powers Emergency Mode.</p>
      ) : (
        <div className="space-y-2">
          {contacts.map((c, i) => (
            <div key={c.id} className="flex items-center justify-between border border-slate-100 rounded-xl p-3">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 text-xs font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-medium text-slate-900">{c.name} {c.relation && <span className="text-slate-400 font-normal">· {c.relation}</span>}</p>
                  <p className="text-xs text-slate-500">{c.phone}</p>
                </div>
              </div>
              <button onClick={() => removeEmergencyContact(memberId, c.id)} className="text-slate-400 hover:text-red-600 transition">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </HealthSection>
  );
}
