import { useState } from 'react';
import { useFamilyStore } from '../store';
import Button from '../../../components/Button';

const RELATIONSHIPS = [
  'Father', 'Mother', 'Son', 'Daughter', 'Brother', 'Sister',
  'Grandfather', 'Grandmother', 'Uncle', 'Aunt', 'Cousin', 'Spouse', 'Guardian', 'Other',
];

export default function AddMembers({ onDone }) {
  const { members, addMember, removeMember, family } = useFamilyStore();
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('Father');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    addMember({ name, relationship });
    setName('');
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="w-full max-w-xl mx-auto">
        <div className="text-center mb-6">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2">Step 2 of 2</p>
          <h1 className="text-2xl font-bold text-slate-900">Add Family Members</h1>
          <p className="text-slate-500 text-sm mt-1">{family?.name} — add as many members as you like</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 mb-4">
          <form onSubmit={handleAdd} className="flex gap-2 flex-wrap sm:flex-nowrap">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 min-w-[140px] px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Member name"
            />
            <select
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              {RELATIONSHIPS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
            <Button type="submit">Add</Button>
          </form>
        </div>

        {members.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm divide-y divide-slate-100 mb-6">
            {members.map((m) => (
              <div key={m.id} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm">
                    {m.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{m.name}</p>
                    <p className="text-xs text-slate-500">{m.relationship}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeMember(m.id)}
                  className="text-slate-400 hover:text-red-600 text-sm transition"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        <Button onClick={onDone} className="w-full">
          {members.length > 0 ? 'Go to Dashboard →' : 'Skip for now →'}
        </Button>
      </div>
    </div>
  );
}
