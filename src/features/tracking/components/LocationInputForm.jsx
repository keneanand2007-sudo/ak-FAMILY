import { useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import { Navigation, MapPinned, Check } from 'lucide-react';
import { useTrackingStore } from '../store';
import LocationSearchInput from './LocationSearchInput';
import MapClickHandler from './MapClickHandler';
import Button from '../../../components/Button';

var pickerIcon = new L.DivIcon({
  html: '<div style="background:#7c3aed;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 0 0 2px #7c3aed"></div>',
  className: '',
  iconSize: [16, 16],
});

var DEFAULT_CENTER = [28.6139, 77.2090];

export default function LocationInputForm({ memberId }) {
  var trackingStore = useTrackingStore();

  var pickerModeState = useState(null);
  var pickerMode = pickerModeState[0];
  var setPickerMode = pickerModeState[1];

  var pickedCurrentState = useState(null);
  var pickedCurrent = pickedCurrentState[0];
  var setPickedCurrent = pickedCurrentState[1];

  var pickedDestState = useState(null);
  var pickedDest = pickedDestState[0];
  var setPickedDest = pickedDestState[1];

  var destNameState = useState('');
  var destName = destNameState[0];
  var setDestName = destNameState[1];

  var savedState = useState(false);
  var isSaved = savedState[0];
  var setSaved = savedState[1];

  function handleCurrentSearchSelect(place) {
    setPickedCurrent({ lat: place.lat, lng: place.lng });
  }

  function handleDestSearchSelect(place) {
    setPickedDest({ lat: place.lat, lng: place.lng });
    setDestName(place.name.split(',')[0]);
  }

  function handleMapClick(lat, lng) {
    if (pickerMode === 'current') {
      setPickedCurrent({ lat: lat, lng: lng });
    } else if (pickerMode === 'destination') {
      setPickedDest({ lat: lat, lng: lng });
    }
  }

  function saveCurrentLocation() {
    if (!pickedCurrent) return;
    trackingStore.setCurrentLocation(memberId, pickedCurrent.lat, pickedCurrent.lng);
    setSaved(true);
    setTimeout(function () { setSaved(false); }, 1500);
  }

  function saveDestination() {
    if (!pickedDest) return;
    trackingStore.setDestination(memberId, pickedDest.lat, pickedDest.lng, destName || 'Destination');
    setPickedDest(null);
    setDestName('');
  }

  function handleMarkReached() {
    trackingStore.setStatus(memberId, 'Reached');
  }

  function handleClearTrip() {
    trackingStore.clearDestination(memberId);
  }

  var mapCenter = pickedCurrent ? [pickedCurrent.lat, pickedCurrent.lng] : (pickedDest ? [pickedDest.lat, pickedDest.lng] : DEFAULT_CENTER);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <Navigation size={17} className="text-violet-600" />
        <h2 className="text-sm font-semibold text-slate-900">Set Location</h2>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mb-4">
        <div>
          <p className="text-xs font-medium text-slate-600 mb-1.5">Current Location</p>
          <LocationSearchInput placeholder="Search your location..." onSelect={handleCurrentSearchSelect} />
          <button
            onClick={function () { setPickerMode(pickerMode === 'current' ? null : 'current'); }}
            className={
              pickerMode === 'current'
                ? 'flex items-center gap-1 text-xs font-medium mt-2 px-2.5 py-1 rounded-lg bg-violet-600 text-white'
                : 'flex items-center gap-1 text-xs font-medium mt-2 px-2.5 py-1 rounded-lg bg-violet-50 text-violet-700 hover:bg-violet-100 transition'
            }
          >
            <MapPinned size={12} />
            <span>{pickerMode === 'current' ? 'Click on map below...' : 'Or pick on map'}</span>
          </button>
          {pickedCurrent && (
            <Button onClick={saveCurrentLocation} className="!bg-violet-600 hover:!bg-violet-700 shadow-violet-200 w-full mt-2 flex items-center justify-center gap-1.5">
              <Check size={14} />
              <span>{isSaved ? 'Saved!' : 'Confirm Current Location'}</span>
            </Button>
          )}
        </div>

        <div>
          <p className="text-xs font-medium text-slate-600 mb-1.5">Destination</p>
          <LocationSearchInput placeholder="Search destination..." onSelect={handleDestSearchSelect} />
          <button
            onClick={function () { setPickerMode(pickerMode === 'destination' ? null : 'destination'); }}
            className={
              pickerMode === 'destination'
                ? 'flex items-center gap-1 text-xs font-medium mt-2 px-2.5 py-1 rounded-lg bg-violet-600 text-white'
                : 'flex items-center gap-1 text-xs font-medium mt-2 px-2.5 py-1 rounded-lg bg-violet-50 text-violet-700 hover:bg-violet-100 transition'
            }
          >
            <MapPinned size={12} />
            <span>{pickerMode === 'destination' ? 'Click on map below...' : 'Or pick on map'}</span>
          </button>
          {pickedDest && (
            <Button onClick={saveDestination} variant="secondary" className="w-full mt-2 flex items-center justify-center gap-1.5">
              <Check size={14} />
              <span>Start Trip to {destName || 'this point'}</span>
            </Button>
          )}
        </div>
      </div>

      {pickerMode && (
        <div className="rounded-xl overflow-hidden border border-violet-200 mb-4" style={{ height: '260px' }}>
          <MapContainer center={mapCenter} zoom={12} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapClickHandler onMapClick={handleMapClick} />
            {pickerMode === 'current' && pickedCurrent && (
              <Marker position={[pickedCurrent.lat, pickedCurrent.lng]} icon={pickerIcon} />
            )}
            {pickerMode === 'destination' && pickedDest && (
              <Marker position={[pickedDest.lat, pickedDest.lng]} icon={pickerIcon} />
            )}
          </MapContainer>
        </div>
      )}

      <div className="flex items-center gap-2">
        <button onClick={handleMarkReached} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition">
          Mark as Reached
        </button>
        <button onClick={handleClearTrip} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition">
          Clear Trip
        </button>
      </div>
    </div>
  );
}
