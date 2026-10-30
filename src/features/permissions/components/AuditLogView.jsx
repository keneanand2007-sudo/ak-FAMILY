import { History, Trash2 } from 'lucide-react';
import { usePermissionsStore } from '../store';
import Button from '../../../components/Button';

function formatTimestamp(iso) {
  const d = new Date(iso);
  return d.toLocaleString();
}

const CATEGORY_COLORS = {
  Permissions: 'bg-slate-100 text-slate-600',
  Health: 'bg-rose-50 text-rose-600',
  Finance: 'bg-emerald-50 text-emerald-600',
  Education: 'bg-amber-50 text-amber-600',
  Documents: 'bg-sky-50 text-sky-600',
  Family: 'bg-blue-50 text-blue-600',
};

export default function AuditLogView() {
  const { auditLog, clearAuditLog } = usePermissionsStore();

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History size={17} className="text-slate-600" />
          <h2 className="text-sm font-semibold text-slate-900">Audit Log</h2>
        </div>
        {auditLog.length > 0 && (
          <Button variant="ghost" onClick={clearAuditLog} className="!px-3 !py-1.5 text-xs flex items-center gap-1">
            <Trash2 size={13} /> Clear Log
          </Button>
        )}
      </div>

      {auditLog.length === 0 ? (
        <p className="text-sm text-slate-400">No activity recorded yet. Actions like role changes will appear here.</p>
      ) : (
        <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
          {auditLog.map((log) => (
            <div key={log.id} className="py-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-slate-900">
                  <span className="font-medium">{log.actor}</span> {log.action}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{formatTimestamp(log.timestamp)}</p>
              </div>
              <span className={'text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ' + (CATEGORY_COLORS[log.category] || CATEGORY_COLORS.Permissions)}>
                {log.category}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
