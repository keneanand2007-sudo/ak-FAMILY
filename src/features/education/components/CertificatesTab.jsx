import { useState } from 'react';
import { Award, Trash2 } from 'lucide-react';
import { useEducationStore } from '../store';
import Button from '../../../components/Button';
import EducationSection from './EducationSection';

const TYPES = ['Course', 'Hackathon', 'Internship', 'Competition', 'Workshop', 'Other'];

export default function CertificatesTab({ memberId }) {
  const { getMemberEducation, addCertificate, removeCertificate } = useEducationStore();
  const certificates = getMemberEducation(memberId).certificates;
  const [form, setForm] = useState({ title: '', type: 'Course', issuer: '', date: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    addCertificate(memberId, form);
    setForm({ title: '', type: 'Course', issuer: '', date: '' });
  };

  return (
    <EducationSection title="Certificates" icon={Award}>
      <form onSubmit={handleAdd} className="grid sm:grid-cols-5 gap-2 mb-5">
        <input
          type="text"
          placeholder="Certificate title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          {TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
        <input
          type="text"
          placeholder="Issuer"
          value={form.issuer}
          onChange={(e) => setForm({ ...form, issuer: e.target.value })}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        <Button type="submit" className="!bg-amber-600 hover:!bg-amber-700 shadow-amber-200">Add</Button>
      </form>

      {certificates.length === 0 ? (
        <p className="text-sm text-slate-400">No certificates added yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {certificates.map((c) => (
            <div key={c.id} className="border border-slate-100 rounded-xl p-3 flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <Award size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{c.title}</p>
                  <p className="text-xs text-slate-500">
                    {c.type} {c.issuer ? '- ' + c.issuer : ''}
                  </p>
                  {c.date && <p className="text-xs text-slate-400 mt-0.5">{c.date}</p>}
                </div>
              </div>
              <button onClick={() => removeCertificate(memberId, c.id)} className="text-slate-400 hover:text-red-600 transition shrink-0">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </EducationSection>
  );
}
