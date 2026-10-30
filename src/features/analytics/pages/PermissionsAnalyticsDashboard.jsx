import { useNavigate } from 'react-router-dom';
import { Shield, X, ArrowLeft, History, Check, XCircle } from 'lucide-react';
import { useFamilyStore } from '../../family/store';
import { usePermissionsStore } from '../../permissions/store';

const CATEGORIES = ['Profile', 'Finance', 'Medical', 'Education', 'Location', 'Documents'];

const DEFAULT_MATRIX = {
  'Family Owner': { view: true, edit: true },
  'Admin': { view: true, edit: true },
  'Adult Member': { view: true, edit: true },
  'Student': { view: true, edit: false },
  'Child': { view: true, edit: false },
  'Emergency Contact': { view: false, edit: false },
  'Viewer': { view: true, edit: false },
};

const ROLE_COLORS = {
  'Family Owner': 'bg-blue-100 text-blue-700',
  'Admin': 'bg-violet-100 text-violet-700',
  'Adult Member': 'bg-emerald-100 text-emerald-700',
  'Student': 'bg-amber-100 text-amber-700',
  'Child': 'bg-rose-100 text-rose-700',
  'Emergency Contact': 'bg-red-100 text-red-700',
  'Viewer': 'bg-slate-100 text-slate-600',
};

function formatTimestamp(iso) {
  return new Date(iso).toLocaleString();
}

export default function PermissionsAnalyticsDashboard() {
  const navigate = useNavigate();
  const { members } = useFamilyStore();
  const { roles, auditLog, getRole } = usePermissionsStore();

  const roleCounts = {};
  members.forEach((m) => {
    const r = getRole(m.id);
    roleCounts[r] = (roleCounts[r] || 0) + 1;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-50">
      <div className="max-w-6xl mx-auto p-6 sm:p-10">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition"
          >
            <ArrowLeft size={15} /> Family Command Center
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-200 transition"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center">
            <Shield size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Family Trust Center</h1>
            <p className="text-slate-500 text-sm">Roles, permissions and audit activity</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">Member Roles</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {members.map((m) => {
              const role = getRole(m.id);
              return (
                <div key={m.id} className="flex items-center justify-between border border-slate-100 rounded-xl p-3">
                  <p className="text-sm font-medium text-slate-900">{m.name}</p>
                  <span className={'text-xs font-medium px-2.5 py-1 rounded-full ' + (ROLE_COLORS[role] || ROLE_COLORS.Viewer)}>
                    {role}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 mb-6 overflow-x-auto">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">Permission Matrix</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-2 pr-4 text-slate-500 font-medium">Role</th>
                {CATEGORIES.map((c) => (
                  <th key={c} className="text-center py-2 px-3 text-slate-500 font-medium whitespace-nowrap">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.keys(DEFAULT_MATRIX).map((role) => {
                const perm = DEFAULT_MATRIX[role];
                return (
                  <tr key={role} className="border-b border-slate-50">
                    <td className="py-2.5 pr-4 font-medium text-slate-900 whitespace-nowrap">{role}</td>
                    {CATEGORIES.map((c) => (
                      <td key={c} className="text-center py-2.5 px-3">
                        {perm.edit ? (
                          <Check size={14} className="text-emerald-600 inline" />
                        ) : perm.view ? (
                          <Check size={14} className="text-amber-500 inline" />
                        ) : (
                          <XCircle size={14} className="text-slate-300 inline" />
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <h2 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <History size={15} className="text-slate-600" /> Recent Activity
          </h2>
          {auditLog.length === 0 ? (
            <p className="text-sm text-slate-400">No activity recorded yet.</p>
          ) : (
            <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
              {auditLog.slice(0, 10).map((log) => (
                <div key={log.id} className="py-2.5">
                  <p className="text-sm text-slate-900">
                    <span className="font-medium">{log.actor}</span> {log.action}
                  </p>
                  <p className="text-xs text-slate-400">{formatTimestamp(log.timestamp)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
