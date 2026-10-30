import { Navigation } from 'lucide-react';
import { useFamilyStore } from '../../family/store';
import { usePlacesStore } from '../store';

const MODES = ['OFF', 'Share Temporarily', 'Share With Family', 'Emergency Only'];

const MODE_COLORS = {
  'OFF': 'bg-slate-100 text-slate-500',
  'Share Temporarily': 'bg-amber-100 text-amber-700',
  'Share With Family': 'bg-emerald-100 text-emerald-700',
  'Emergency Only': 'bg-red-100 text-red-700',
};

export default function LocationSharing() {
  const { members } = useFamilyStore();
  const { locationSharing, setLocationSharing } = usePlacesStore();

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
      <div className="flex items-center gap-2 mb-1">
        <Navigation size={17} className="text-violet-600" />
        <h2 className="text-sm font-semibold text-slate-900">Member Location Sharing</h2>
      </div>
      <p className="text-xs text-slate-400 mb-4">
        Off by default. Location sharing is always consent-based and can be turned off anytime.
      </p>

      {members.length === 0 ? (
        <p className="text-sm text-slate-400">No members yet.</p>
      ) : (
        <div className="space-y-2">
          {members.map((m) => {
            const mode = locationSharing[m.id] || 'OFF';
            return (
              <div key={m.id} className="flex items-center justify-between border border-slate-100 rounded-xl p-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-semibold text-sm">
                    {m.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{m.name}</p>
                    <span className={'text-xs font-medium px-2 py-0.5 rounded-full ' + (MODE_COLORS[mode] || MODE_COLORS.OFF)}>
                      {mode}
                    </span>
                  </div>
                </div>
                <select
                  value={mode}
                  onChange={(e) => setLocationSharing(m.id, e.target.value)}
                  className="px-2 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  {MODES.map((mo) => <option key={mo}>{mo}</option>)}
                </select>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
