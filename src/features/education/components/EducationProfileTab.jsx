import { useState, useEffect } from 'react';
import { GraduationCap, Save } from 'lucide-react';
import { useEducationStore } from '../store';
import Button from '../../../components/Button';
import EducationSection from './EducationSection';

export default function EducationProfileTab({ memberId }) {
  const { getMemberEducation, updateProfile } = useEducationStore();
  const stored = getMemberEducation(memberId).profile;
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
    <EducationSection title="Education Profile" icon={GraduationCap}>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-slate-700 mb-1.5 block">Institution</label>
          <input
            type="text"
            value={form.institution}
            onChange={(e) => setForm({ ...form, institution: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
            placeholder="ABC College of Engineering"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 mb-1.5 block">Course</label>
          <input
            type="text"
            value={form.course}
            onChange={(e) => setForm({ ...form, course: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
            placeholder="B.Tech Computer Science"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 mb-1.5 block">Year / Semester</label>
          <input
            type="text"
            value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
            placeholder="3rd Year, Semester 5"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 mb-1.5 block">Roll / Student ID</label>
          <input
            type="text"
            value={form.rollNumber}
            onChange={(e) => setForm({ ...form, rollNumber: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
            placeholder="21CS045"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 mt-5">
        <Button onClick={handleSave} className="!bg-amber-600 hover:!bg-amber-700 shadow-amber-200 flex items-center gap-1.5">
          <Save size={15} /> Save Profile
        </Button>
        {saved && <span className="text-sm text-emerald-600 font-medium">Saved. Confirmed</span>}
      </div>
    </EducationSection>
  );
}
