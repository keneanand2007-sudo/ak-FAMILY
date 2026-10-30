import { AlertTriangle, Clock, CalendarClock, CheckCircle2 } from 'lucide-react';

export default function FamilyPulseBanner({ pulse }) {
  if (pulse.total === 0) {
    return (
      <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl p-5 mb-8">
        <CheckCircle2 size={22} className="text-emerald-600 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-emerald-800">All clear for now</p>
          <p className="text-xs text-emerald-600">Nothing urgent needs your family's attention today.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 mb-8">
      <p className="text-sm font-semibold text-slate-900 mb-3">
        Your family has {pulse.total} item{pulse.total !== 1 ? 's' : ''} requiring attention
      </p>
      <div className="grid grid-cols-3 gap-3">
        <div className="flex items-center gap-2 bg-red-50 rounded-xl p-3">
          <AlertTriangle size={16} className="text-red-600 shrink-0" />
          <div>
            <p className="text-lg font-bold text-red-700 leading-none">{pulse.critical}</p>
            <p className="text-xs text-red-500">Critical</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-amber-50 rounded-xl p-3">
          <Clock size={16} className="text-amber-600 shrink-0" />
          <div>
            <p className="text-lg font-bold text-amber-700 leading-none">{pulse.important}</p>
            <p className="text-xs text-amber-500">Important</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 rounded-xl p-3">
          <CalendarClock size={16} className="text-blue-600 shrink-0" />
          <div>
            <p className="text-lg font-bold text-blue-700 leading-none">{pulse.upcoming}</p>
            <p className="text-xs text-blue-500">Upcoming</p>
          </div>
        </div>
      </div>
    </div>
  );
}
