import { useState } from 'react';
import { CalendarCheck, Trash2 } from 'lucide-react';
import { useEducationStore } from '../store';
import Button from '../../../components/Button';
import EducationSection from './EducationSection';

export default function ExamsTab({ memberId }) {
  const { getMemberEducation, addExam, removeExam } = useEducationStore();
  const exams = getMemberEducation(memberId).exams
    .slice()
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  const [form, setForm] = useState({ subject: '', date: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.subject.trim()) return;
    addExam(memberId, form);
    setForm({ subject: '', date: '' });
  };

  const daysUntil = (dateStr) => {
    if (!dateStr) return null;
    const today = new Date(new Date().toDateString());
    const target = new Date(dateStr);
    const diff = Math.round((target - today) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <EducationSection title="Upcoming Exams" icon={CalendarCheck}>
      <form onSubmit={handleAdd} className="grid sm:grid-cols-3 gap-2 mb-5">
        <input
          type="text"
          placeholder="Subject"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        <Button type="submit" className="!bg-amber-600 hover:!bg-amber-700 shadow-amber-200">Add Exam</Button>
      </form>

      {exams.length === 0 ? (
        <p className="text-sm text-slate-400">No exams scheduled.</p>
      ) : (
        <div className="divide-y divide-slate-100">
          {exams.map((ex) => {
            const days = daysUntil(ex.date);
            return (
              <div key={ex.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-slate-900">{ex.subject}</p>
                  <p className="text-xs text-slate-500">{ex.date || 'No date set'}</p>
                </div>
                <div className="flex items-center gap-3">
                  {days !== null && days >= 0 && (
                    <span className={
                      days <= 3
                        ? 'text-xs font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-600'
                        : 'text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-600'
                    }>
                      {days === 0 ? 'Today' : days + ' days left'}
                    </span>
                  )}
                  <button onClick={() => removeExam(memberId, ex.id)} className="text-slate-400 hover:text-red-600 transition">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </EducationSection>
  );
}
