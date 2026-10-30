import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, Clock, Maximize2, Minimize2, Route } from 'lucide-react';
import { useTrackingStore } from '../store';
import { getRoute } from '../utils/geocoding';

var currentIcon = new L.DivIcon({
  html: '<div style="background:#2563eb;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 0 0 2px #2563eb"></div>',
  className: '',
  iconSize: [16, 16],
});

var destIcon = new L.DivIcon({
  html: '<div style="background:#dc2626;width:14px;height:14px;border-radius:50% 50% 50% 0;border:2px solid white;transform:rotate(-45deg)"></div>',
  className: '',
  iconSize: [14, 14],
});

var STATUS_COLORS = {
  'At Home': 'bg-slate-100 text-slate-600',
  'On Way': 'bg-amber-100 text-amber-700',
  'Reached': 'bg-emerald-100 text-emerald-700',
};

export default function MemberLiveMap({ memberId, memberName }) {
  var trackingStore = useTrackingStore();
  var tracking = trackingStore.getMemberTracking(memberId);

  var expandedState = useState(false);
  var expanded = expandedState[0];
  var setExpanded = expandedState[1];

  var routeState = useState(null);
  var route = routeState[0];
  var setRoute = routeState[1];

  var routeLoadingState = useState(false);
  var routeLoading = routeLoadingState[0];
  var setRouteLoading = routeLoadingState[1];

  var hasCurrentLocation = tracking.currentLat !== null && tracking.currentLng !== null;
  var hasDestination = tracking.destinationLat !== null && tracking.destinationLng !== null;

  useEffect(function () {
    if (hasCurrentLocation && hasDestination) {
      setRouteLoading(true);
      getRoute(tracking.currentLat, tracking.currentLng, tracking.destinationLat, tracking.destinationLng).then(function (result) {
        setRoute(result);
        setRouteLoading(false);
      });
    } else {
      setRoute(null);
    }
  }, [tracking.currentLat, tracking.currentLng, tracking.destinationLat, tracking.destinationLng]);

  if (!hasCurrentLocation) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 text-center">
        <MapPin size={28} className="mx-auto mb-2 text-slate-300" />
        <p className="text-sm text-slate-400">No location data set for {memberName} yet.</p>
      </div>
    );
  }

  var center = [tracking.currentLat, tracking.currentLng];
  var fallbackLine = hasDestination
    ? [[tracking.currentLat, tracking.currentLng], [tracking.destinationLat, tracking.destinationLng]]
    : [];

  var containerClass = expanded
    ? 'fixed inset-4 z-50 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col'
    : 'bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden';

  return (
    <div className={containerClass}>
      <div className="flex items-center justify-between p-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Navigation size={16} className="text-violet-600" />
          <p className="text-sm font-semibold text-slate-900">Live Location</p>
          <span className={'text-xs font-medium px-2 py-0.5 rounded-full ' + (STATUS_COLORS[tracking.status] || STATUS_COLORS['At Home'])}>
            {tracking.status}
          </span>
        </div>
        <button onClick={function () { setExpanded(!expanded); }} className="text-slate-400 hover:text-violet-600 transition">
          {expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>

      <div style={{ height: expanded ? 'calc(100% - 110px)' : '220px' }}>
        <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }} scrollWheelZoom={expanded}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={center} icon={currentIcon}>
            <Popup>{memberName} - Current Location</Popup>
          </Marker>
          {hasDestination && (
            <Marker position={[tracking.destinationLat, tracking.destinationLng]} icon={destIcon}>
              <Popup>{tracking.destinationName || 'Destination'}</Popup>
            </Marker>
          )}
          {hasDestination && route && route.coordinates && (
            <Polyline positions={route.coordinates} pathOptions={{ color: '#7c3aed', weight: 4 }} />
          )}
          {hasDestination && !route && (
            <Polyline positions={fallbackLine} pathOptions={{ color: '#7c3aed', weight: 3, dashArray: '6 6' }} />
          )}
        </MapContainer>
      </div>

      {hasDestination && (
        <div className="p-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <p className="text-slate-500">
            To: <span className="font-medium text-slate-800">{tracking.destinationName || 'Destination'}</span>
          </p>
          {routeLoading && <p className="text-slate-400">Calculating route...</p>}
          {!routeLoading && route && (
            <p className="flex items-center gap-1 text-violet-600 font-medium">
              <Route size={12} />
              <span>{route.durationMin} min ({route.distanceKm} km by road)</span>
            </p>
          )}
          {!routeLoading && !route && (
            <p className="flex items-center gap-1 text-slate-400">
              <Clock size={12} />
              <span>Route unavailable</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
