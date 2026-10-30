import { useState } from 'react';
import { ClipboardList, Trash2 } from 'lucide-react';
import { useEducationStore } from '../store';
import Button from '../../../components/Button';
import EducationSection from './EducationSection';

const STATUSES = ['Pending', 'In Progress', 'Submitted'];

export default function AssignmentsTab({ memberId }) {
  const { getMemberEducation, addAssignment, removeAssignment } = useEducationStore();
  const assignments = getMemberEducation(memberId).assignments;
  const [form, setForm] = useState({ subject: '', title: '', deadline: '', status: 'Pending' });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    addAssignment(memberId, form);
    setForm({ subject: '', title: '', deadline: '', status: 'Pending' });
  };

  const statusColor = (status) => {
    if (status === 'Submitted') return 'bg-emerald-50 text-emerald-600';
    if (status === 'In Progress') return 'bg-amber-50 text-amber-600';
    return 'bg-slate-100 text-slate-500';
  };

  return (
    <EducationSection title="Assignments & Tasks" icon={ClipboardList}>
      <form onSubmit={handleAdd} className="grid sm:grid-cols-5 gap-2 mb-5">
        <input
          type="text"
          placeholder="Subject"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        <input
          type="date"
          value={form.deadline}
          onChange={(e) => setForm({ ...form, deadline: e.target.value })}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <Button type="submit" className="!bg-amber-600 hover:!bg-amber-700 shadow-amber-200">Add</Button>
      </form>

      {assignments.length === 0 ? (
        <p className="text-sm text-slate-400">No assignments tracked yet.</p>
      ) : (
        <div className="divide-y divide-slate-100">
          {assignments.map((a) => (
            <div key={a.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {a.title} {a.subject ? '- ' + a.subject : ''}
                </p>
                <p className="text-xs text-slate-500">{a.deadline || 'No deadline'}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={'text-xs font-medium px-2 py-0.5 rounded-full ' + statusColor(a.status)}>
                  {a.status}
                </span>
                <button onClick={() => removeAssignment(memberId, a.id)} className="text-slate-400 hover:text-red-600 transition">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </EducationSection>
  );
}
