import { useMapEvents } from 'react-leaflet';

export default function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: function (e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}
