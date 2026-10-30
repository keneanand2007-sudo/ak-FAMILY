import { MapPin, Trash2, Home, GraduationCap, Building2, Cross, Users } from 'lucide-react';
import { usePlacesStore } from '../store';

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

export default function PlaceCard({ place }) {
  const removePlace = usePlacesStore((s) => s.removePlace);
  const Icon = TYPE_ICONS[place.type] || MapPin;
  const colorClass = TYPE_COLORS[place.type] || TYPE_COLORS.Other;

  return (
    <div className="border border-slate-100 rounded-xl p-4 flex items-start justify-between hover:shadow-sm transition">
      <div className="flex items-start gap-3">
        <div className={'w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ' + colorClass}>
          <Icon size={18} />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-900">{place.name}</p>
          <p className="text-xs text-slate-500">{place.type}</p>
          {place.address && <p className="text-xs text-slate-400 mt-0.5">{place.address}</p>}
          {place.notes && <p className="text-xs text-slate-400 mt-0.5 italic">{place.notes}</p>}
        </div>
      </div>
      <button onClick={() => removePlace(place.id)} className="text-slate-400 hover:text-red-600 transition shrink-0">
        <Trash2 size={15} />
      </button>
    </div>
  );
}
