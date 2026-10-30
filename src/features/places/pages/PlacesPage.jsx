import { useState } from 'react';
import { MapPin, List, Navigation as NavIcon, Radar } from 'lucide-react';
import { usePlacesStore } from '../store';
import AddPlaceForm from '../components/AddPlaceForm';
import PlaceCard from '../components/PlaceCard';
import LocationSharing from '../components/LocationSharing';
import FamilyLiveMap from '../../tracking/components/FamilyLiveMap';

var TABS = [
  { key: 'live', label: 'Live Map', icon: Radar },
  { key: 'places', label: 'Important Places', icon: List },
  { key: 'sharing', label: 'Location Sharing', icon: NavIcon },
];

export default function PlacesPage() {
  var placesState = usePlacesStore();
  var places = placesState.places;
  var activeTabState = useState('live');
  var activeTab = activeTabState[0];
  var setActiveTab = activeTabState[1];

  return (
    <div className="p-6 sm:p-10 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Places</h1>
      <p className="text-slate-500 text-sm mb-8">
        Important family-associated locations and live member tracking.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="relative overflow-hidden rounded-2xl p-5 shadow-md shadow-violet-200/50 bg-gradient-to-br from-violet-500 to-violet-700 text-white sm:col-span-3">
          <MapPin size={50} className="absolute -right-2 -bottom-2 text-white/15" />
          <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center mb-2">
            <MapPin size={16} />
          </div>
          <p className="text-2xl font-bold leading-none">{places.length}</p>
          <p className="text-xs text-violet-100 mt-1">Places recorded</p>
        </div>
      </div>

      <div className="flex overflow-x-auto gap-2 mb-5">
        {TABS.map(function (t) {
          var Icon = t.icon;
          var isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={function () { setActiveTab(t.key); }}
              className={
                isActive
                  ? 'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition bg-violet-600 text-white shadow-sm shadow-violet-200'
                  : 'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }
            >
              <Icon size={15} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {activeTab === 'live' && <FamilyLiveMap />}

      {activeTab === 'places' && (
        <div>
          <AddPlaceForm />
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">All Places</h2>
            {places.length === 0 ? (
              <p className="text-sm text-slate-400">No places added yet.</p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {places.map(function (p) {
                  return <PlaceCard key={p.id} place={p} />;
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'sharing' && <LocationSharing />}
    </div>
  );
}
