import { useState } from 'react';
import { Sparkles, Trash2 } from 'lucide-react';
import { useEducationStore } from '../store';
import Button from '../../../components/Button';
import EducationSection from './EducationSection';

const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

export default function SkillsTab({ memberId }) {
  const { getMemberEducation, addSkill, removeSkill } = useEducationStore();
  const skills = getMemberEducation(memberId).skills;
  const [form, setForm] = useState({ name: '', level: 'Beginner' });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    addSkill(memberId, form);
    setForm({ name: '', level: 'Beginner' });
  };

  const levelColor = (level) => {
    if (level === 'Expert') return 'bg-emerald-50 text-emerald-600';
    if (level === 'Advanced') return 'bg-blue-50 text-blue-600';
    if (level === 'Intermediate') return 'bg-amber-50 text-amber-600';
    return 'bg-slate-100 text-slate-500';
  };

  return (
    <EducationSection title="Skills" icon={Sparkles}>
      <form onSubmit={handleAdd} className="grid sm:grid-cols-3 gap-2 mb-5">
        <input
          type="text"
          placeholder="Skill name (Python, React...)"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        <select
          value={form.level}
          onChange={(e) => setForm({ ...form, level: e.target.value })}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          {LEVELS.map((l) => <option key={l}>{l}</option>)}
        </select>
        <Button type="submit" className="!bg-amber-600 hover:!bg-amber-700 shadow-amber-200">Add Skill</Button>
      </form>

      {skills.length === 0 ? (
        <p className="text-sm text-slate-400">No skills added yet.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {skills.map((s) => (
            <div key={s.id} className="flex items-center gap-2 border border-slate-100 rounded-full pl-3 pr-2 py-1.5">
              <span className="text-sm font-medium text-slate-900">{s.name}</span>
              <span className={'text-xs font-medium px-2 py-0.5 rounded-full ' + levelColor(s.level)}>
                {s.level}
              </span>
              <button onClick={() => removeSkill(memberId, s.id)} className="text-slate-400 hover:text-red-600 transition">
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </EducationSection>
  );
}
