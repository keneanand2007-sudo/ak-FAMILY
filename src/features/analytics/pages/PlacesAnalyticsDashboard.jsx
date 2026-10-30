import { useNavigate } from 'react-router-dom';
import { MapPin, X, ArrowLeft, Home, GraduationCap, Building2, Cross, Users, Navigation } from 'lucide-react';
import { useFamilyStore } from '../../family/store';
import { usePlacesStore } from '../../places/store';

const TYPE_ICONS = {
  Home: Home,
  School: GraduationCap,
  College: GraduationCap,
  Office: Building2,
  Hospital: Cross,
  'Relative House': Users,
};

const TYPE_COLORS = {
  Home: 'bg-blue-100 text-blue-600',
  School: 'bg-amber-100 text-amber-600',
  College: 'bg-amber-100 text-amber-600',
  Office: 'bg-slate-100 text-slate-600',
  Hospital: 'bg-rose-100 text-rose-600',
  'Relative House': 'bg-emerald-100 text-emerald-600',
  'Emergency Center': 'bg-red-100 text-red-600',
  Property: 'bg-violet-100 text-violet-600',
  Other: 'bg-slate-100 text-slate-500',
};

export default function PlacesAnalyticsDashboard() {
  const navigate = useNavigate();
  const { members } = useFamilyStore();
  const { places, locationSharing } = usePlacesStore();

  const typeTotals = {};
  places.forEach((p) => {
    typeTotals[p.type] = (typeTotals[p.type] || 0) + 1;
  });

  const activeSharing = members.filter((m) => locationSharing[m.id] && locationSharing[m.id] !== 'OFF');

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-slate-50">
      <div className="max-w-6xl mx-auto p-6 sm:p-10">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-violet-600 transition"
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
          <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">
            <MapPin size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Places Analytics</h1>
            <p className="text-slate-500 text-sm">Family locations and privacy-conscious location sharing</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="relative overflow-hidden rounded-2xl p-5 shadow-md shadow-violet-200/50 bg-gradient-to-br from-violet-400 to-violet-600 text-white">
            <MapPin size={50} className="absolute -right-2 -bottom-2 text-white/15" />
            <p className="text-2xl font-bold leading-none">{places.length}</p>
            <p className="text-xs text-violet-100 mt-1">Places Recorded</p>
          </div>
          <div className="relative overflow-hidden rounded-2xl p-5 shadow-md shadow-blue-200/50 bg-gradient-to-br from-blue-400 to-blue-600 text-white">
            <Navigation size={50} className="absolute -right-2 -bottom-2 text-white/15" />
            <p className="text-2xl font-bold leading-none">{activeSharing.length}</p>
            <p className="text-xs text-blue-100 mt-1">Members Sharing Location</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">Places by Type</h2>
          {places.length === 0 ? (
            <p className="text-sm text-slate-400 py-8 text-center">No places added yet.</p>
          ) : (
            <div className="grid sm:grid-cols-3 gap-3">
              {Object.keys(typeTotals).map((type) => {
                const Icon = TYPE_ICONS[type] || MapPin;
                const colorClass = TYPE_COLORS[type] || TYPE_COLORS.Other;
                return (
                  <div key={type} className="flex items-center gap-3 border border-slate-100 rounded-xl p-3">
                    <div className={'w-10 h-10 rounded-lg flex items-center justify-center ' + colorClass}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{type}</p>
                      <p className="text-xs text-slate-500">{typeTotals[type]} place(s)</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">Location Sharing Status</h2>
          <div className="space-y-2">
            {members.map((m) => {
              const mode = locationSharing[m.id] || 'OFF';
              return (
                <div key={m.id} className="flex items-center justify-between border border-slate-100 rounded-xl p-3">
                  <p className="text-sm text-slate-900">{m.name}</p>
                  <span className={
                    mode === 'OFF'
                      ? 'text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500'
                      : 'text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700'
                  }>
                    {mode}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
