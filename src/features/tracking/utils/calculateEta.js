export function calculateDistanceKm(lat1, lng1, lat2, lng2) {
  var R = 6371;
  var dLat = (lat2 - lat1) * Math.PI / 180;
  var dLng = (lng2 - lng1) * Math.PI / 180;
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function calculateEta(currentLat, currentLng, destLat, destLng) {
  if (currentLat === null || currentLng === null || destLat === null || destLng === null) {
    return null;
  }
  var assumedSpeedKmh = 30;
  var distanceKm = calculateDistanceKm(currentLat, currentLng, destLat, destLng);
  var etaMinutes = Math.round((distanceKm / assumedSpeedKmh) * 60);
  return {
    distanceKm: Math.round(distanceKm * 10) / 10,
    etaMinutes: etaMinutes,
  };
}
