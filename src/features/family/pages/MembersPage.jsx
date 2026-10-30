import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, ChevronRight, Trash2 } from 'lucide-react';
import { useFamilyStore } from '../store';
import Button from '../../../components/Button';

const RELATIONSHIPS = [
  'Father', 'Mother', 'Son', 'Daughter', 'Brother', 'Sister',
  'Grandfather', 'Grandmother', 'Uncle', 'Aunt', 'Cousin', 'Spouse', 'Guardian', 'Other',
];

const AVATAR_COLORS = [
  'bg-blue-100 text-blue-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-violet-100 text-violet-700',
  'bg-sky-100 text-sky-700',
];

function avatarColor(index) {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

export default function MembersPage() {
  const navigate = useNavigate();
  const { family, members, addMember, removeMember } = useFamilyStore();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('Father');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    addMember({ name, relationship });
    setName('');
    setShowForm(false);
  };

  return (
    <div className="p-6 sm:p-10 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-slate-900">Members</h1>
        <Button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1.5">
          <UserPlus size={15} /> Add Member
        </Button>
      </div>
      <p className="text-slate-500 text-sm mb-8">
        {family && family.name} - {members.length} members in this family workspace.
      </p>

      {showForm && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 mb-6">
          <form onSubmit={handleAdd} className="flex gap-2 flex-wrap sm:flex-nowrap">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 min-w-[140px] px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Member name"
              autoFocus
            />
            <select
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              {RELATIONSHIPS.map((r) => <option key={r}>{r}</option>)}
            </select>
            <Button type="submit">Add</Button>
          </form>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        <h2 className="text-sm font-semibold text-slate-900 mb-4">Family Tree</h2>
        {members.length === 0 ? (
          <p className="text-sm text-slate-400">No members added yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {members.map((m, i) => (
              <div
                key={m.id}
                className="flex items-center justify-between gap-3 border border-slate-100 rounded-xl p-3 hover:border-blue-300 hover:shadow-sm transition"
              >
                <button
                  onClick={() => navigate('/member/' + m.id)}
                  className="flex items-center gap-3 flex-1 text-left"
                >
                  <div className={'w-10 h-10 rounded-full flex items-center justify-center font-semibold ' + avatarColor(i)}>
                    {m.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{m.name}</p>
                    <p className="text-xs text-slate-500">{m.relationship}</p>
                  </div>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate('/member/' + m.id)}
                    className="text-slate-300 hover:text-blue-500 transition"
                  >
                    <ChevronRight size={16} />
                  </button>
                  <button
                    onClick={() => removeMember(m.id)}
                    className="text-slate-300 hover:text-red-500 transition"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
