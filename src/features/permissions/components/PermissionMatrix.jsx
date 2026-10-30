import { Check, X, Grid3x3 } from 'lucide-react';

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

export default function PermissionMatrix() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
      <div className="flex items-center gap-2 mb-1">
        <Grid3x3 size={17} className="text-slate-600" />
        <h2 className="text-sm font-semibold text-slate-900">Permission Matrix</h2>
      </div>
      <p className="text-xs text-slate-400 mb-4">
        Default view/edit access per role. Field-level overrides can be added per member in future.
      </p>

      <div className="overflow-x-auto">
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
                        <span className="inline-flex items-center gap-1 text-emerald-600">
                          <Check size={14} />
                        </span>
                      ) : perm.view ? (
                        <span className="inline-flex items-center gap-1 text-amber-500">
                          <Check size={14} />
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-300">
                          <X size={14} />
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-4 mt-4 text-xs text-slate-500">
        <span className="flex items-center gap-1"><Check size={12} className="text-emerald-600" /> View + Edit</span>
        <span className="flex items-center gap-1"><Check size={12} className="text-amber-500" /> View only</span>
        <span className="flex items-center gap-1"><X size={12} className="text-slate-300" /> No access</span>
      </div>
    </div>
  );
}
