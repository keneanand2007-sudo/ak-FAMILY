import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Navigation } from 'lucide-react';
import { useFamilyStore } from '../../family/store';
import { useTrackingStore } from '../store';

var MEMBER_COLORS = ['#2563eb', '#059669', '#d97706', '#e11d48', '#7c3aed', '#0284c7'];

function makeIcon(color, initial) {
  return new L.DivIcon({
    html: '<div style="background:' + color + ';width:26px;height:26px;border-radius:50% 50% 50% 0;border:2px solid white;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,0.3)"><span style="transform:rotate(45deg);color:white;font-size:11px;font-weight:bold">' + initial + '</span></div>',
    className: '',
    iconSize: [26, 26],
    iconAnchor: [13, 26],
  });
}

var destIcon = new L.DivIcon({
  html: '<div style="background:#1e293b;width:12px;height:12px;border-radius:50%;border:2px solid white"></div>',
  className: '',
  iconSize: [12, 12],
});

export default function FamilyLiveMap() {
  var members = useFamilyStore(function (s) { return s.members; });
  var tracking = useTrackingStore(function (s) { return s.tracking; });

  var membersWithLocation = members
    .map(function (m) {
      var t = tracking[m.id];
      return { member: m, tracking: t };
    })
    .filter(function (entry) {
      return entry.tracking && entry.tracking.currentLat !== null && entry.tracking.currentLng !== null;
    });

  if (membersWithLocation.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 text-center">
        <Navigation size={28} className="mx-auto mb-2 text-slate-300" />
        <p className="text-sm text-slate-400">No member locations set yet. Set a location from a member's profile Places tab.</p>
      </div>
    );
  }

  var center = [membersWithLocation[0].tracking.currentLat, membersWithLocation[0].tracking.currentLng];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex items-center gap-2">
        <Navigation size={16} className="text-violet-600" />
        <p className="text-sm font-semibold text-slate-900">Family Live Map</p>
        <span className="text-xs text-slate-400">({membersWithLocation.length} member(s) sharing location)</span>
      </div>
      <div style={{ height: '360px' }}>
        <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {membersWithLocation.map(function (entry, i) {
            var m = entry.member;
            var t = entry.tracking;
            var color = MEMBER_COLORS[i % MEMBER_COLORS.length];
            var hasDest = t.destinationLat !== null && t.destinationLng !== null;
            return (
              <div key={m.id}>
                <Marker position={[t.currentLat, t.currentLng]} icon={makeIcon(color, m.name.charAt(0).toUpperCase())}>
                  <Popup>
                    {m.name} - {t.status}
                    {hasDest ? ' - Going to ' + t.destinationName : ''}
                  </Popup>
                </Marker>
                {hasDest && (
                  <Marker position={[t.destinationLat, t.destinationLng]} icon={destIcon}>
                    <Popup>{t.destinationName || 'Destination'} ({m.name})</Popup>
                  </Marker>
                )}
                {hasDest && (
                  <Polyline
                    positions={[[t.currentLat, t.currentLng], [t.destinationLat, t.destinationLng]]}
                    pathOptions={{ color: color, weight: 3, dashArray: '6 6' }}
                  />
                )}
              </div>
            );
          })}
        </MapContainer>
      </div>
      <div className="p-4 border-t border-slate-100">
        <div className="grid sm:grid-cols-2 gap-2">
          {membersWithLocation.map(function (entry, i) {
            var m = entry.member;
            var t = entry.tracking;
            var color = MEMBER_COLORS[i % MEMBER_COLORS.length];
            return (
              <div key={m.id} className="flex items-center gap-2 text-xs">
                <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: color, display: 'inline-block' }} />
                <span className="font-medium text-slate-700">{m.name}</span>
                <span className="text-slate-400">- {t.status}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
