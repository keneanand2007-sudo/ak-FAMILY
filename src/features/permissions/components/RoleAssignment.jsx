import { Shield } from 'lucide-react';
import { useFamilyStore } from '../../family/store';
import { usePermissionsStore, ROLES } from '../store';

const ROLE_COLORS = {
  'Family Owner': 'bg-blue-100 text-blue-700',
  'Admin': 'bg-violet-100 text-violet-700',
  'Adult Member': 'bg-emerald-100 text-emerald-700',
  'Student': 'bg-amber-100 text-amber-700',
  'Child': 'bg-rose-100 text-rose-700',
  'Emergency Contact': 'bg-red-100 text-red-700',
  'Viewer': 'bg-slate-100 text-slate-600',
};

export default function RoleAssignment() {
  const { members } = useFamilyStore();
  const { roles, setRole, getRole, logAction } = usePermissionsStore();

  const handleChange = (member, newRole) => {
    setRole(member.id, newRole);
    logAction(member.name, 'Role changed to ' + newRole, 'Permissions');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <Shield size={17} className="text-slate-600" />
        <h2 className="text-sm font-semibold text-slate-900">Role Assignment</h2>
      </div>

      {members.length === 0 ? (
        <p className="text-sm text-slate-400">No members yet.</p>
      ) : (
        <div className="space-y-2">
          {members.map((m) => {
            const currentRole = getRole(m.id);
            return (
              <div key={m.id} className="flex items-center justify-between border border-slate-100 rounded-xl p-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-semibold text-sm">
                    {m.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{m.name}</p>
                    <p className="text-xs text-slate-500">{m.relationship}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={'text-xs font-medium px-2.5 py-1 rounded-full ' + (ROLE_COLORS[currentRole] || ROLE_COLORS.Viewer)}>
                    {currentRole}
                  </span>
                  <select
                    value={currentRole}
                    onChange={(e) => handleChange(m, e.target.value)}
                    className="px-2 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-slate-400"
                  >
                    {ROLES.map((r) => <option key={r}>{r}</option>)}
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
