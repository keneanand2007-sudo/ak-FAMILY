import { useState, useEffect } from 'react';
import { Droplet, Save } from 'lucide-react';
import { useHealthStore } from '../store';
import Button from '../../../components/Button';
import HealthSection from './HealthSection';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];

export default function HealthProfileTab({ memberId }) {
  const { getMemberHealth, updateProfile } = useHealthStore();
  const stored = getMemberHealth(memberId).profile;
  const [form, setForm] = useState(stored);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm(stored);
  }, [memberId]);

  const handleSave = () => {
    updateProfile(memberId, form);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <HealthSection title="Health Profile" icon={Droplet}>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-slate-700 mb-1.5 block">Blood Group</label>
          <select
            value={form.bloodGroup}
            onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition"
          >
            <option value="">Select</option>
            {BLOOD_GROUPS.map((bg) => (
              <option key={bg}>{bg}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 mb-1.5 block">Allergies</label>
          <input
            type="text"
            value={form.allergies}
            onChange={(e) => setForm({ ...form, allergies: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition"
            placeholder="Peanuts, Penicillin..."
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-sm font-medium text-slate-700 mb-1.5 block">Medical Conditions</label>
          <input
            type="text"
            value={form.conditions}
            onChange={(e) => setForm({ ...form, conditions: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition"
            placeholder="Diabetes, Asthma..."
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-sm font-medium text-slate-700 mb-1.5 block">Emergency Notes</label>
          <textarea
            value={form.emergencyNotes}
            onChange={(e) => setForm({ ...form, emergencyNotes: e.target.value })}
            rows={3}
            className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition resize-none"
            placeholder="Anything a paramedic should know immediately"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 mt-5">
        <Button onClick={handleSave} className="!bg-gradient-to-r !from-rose-500 !to-rose-600 hover:!from-rose-600 hover:!to-rose-700 shadow-rose-200 flex items-center gap-1.5">
          <Save size={15} /> Save Profile
        </Button>
        {saved && <span className="text-sm text-emerald-600 font-medium">Saved ✓</span>}
      </div>
    </HealthSection>
  );
}
