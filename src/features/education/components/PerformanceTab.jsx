import { useState } from 'react';
import { BarChart3, Trash2 } from 'lucide-react';
import { useEducationStore } from '../store';
import Button from '../../../components/Button';
import EducationSection from './EducationSection';

export default function PerformanceTab({ memberId }) {
  const { getMemberEducation, addPerformance, removePerformance } = useEducationStore();
  const performance = getMemberEducation(memberId).performance;
  const [form, setForm] = useState({ semester: '', percentage: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.semester.trim() || !form.percentage) return;
    addPerformance(memberId, form);
    setForm({ semester: '', percentage: '' });
  };

  return (
    <EducationSection title="Academic Performance" icon={BarChart3}>
      <form onSubmit={handleAdd} className="grid sm:grid-cols-3 gap-2 mb-5">
        <input
          type="text"
          placeholder="Semester (Semester 1)"
          value={form.semester}
          onChange={(e) => setForm({ ...form, semester: e.target.value })}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        <input
          type="number"
          placeholder="Percentage / Score"
          value={form.percentage}
          onChange={(e) => setForm({ ...form, percentage: e.target.value })}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        <Button type="submit" className="!bg-amber-600 hover:!bg-amber-700 shadow-amber-200">Add</Button>
      </form>

      {performance.length === 0 ? (
        <p className="text-sm text-slate-400">No performance records yet.</p>
      ) : (
        <div className="space-y-3">
          {performance.map((p) => {
            const pct = Math.min(100, Number(p.percentage) || 0);
            return (
              <div key={p.id}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-slate-900">{p.semester}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-amber-600">{pct}%</span>
                    <button onClick={() => removePerformance(memberId, p.id)} className="text-slate-400 hover:text-red-600 transition">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 transition-all" style={{ width: pct + '%' }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </EducationSection>
  );
}
