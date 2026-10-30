export function searchPlaces(query) {
  if (!query || query.trim().length < 3) {
    return Promise.resolve([]);
  }
  var url = 'https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(query) + '&limit=5';
  return fetch(url, { headers: { 'Accept-Language': 'en' } })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      return data.map(function (item) {
        return {
          name: item.display_name,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
        };
      });
    })
    .catch(function () {
      return [];
    });
}

export function getRoute(startLat, startLng, endLat, endLng) {
  var url = 'https://router.project-osrm.org/route/v1/driving/' +
    startLng + ',' + startLat + ';' + endLng + ',' + endLat +
    '?overview=full&geometries=geojson';
  return fetch(url)
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (!data.routes || data.routes.length === 0) return null;
      var route = data.routes[0];
      var coords = route.geometry.coordinates.map(function (c) {
        return [c[1], c[0]];
      });
      return {
        coordinates: coords,
        distanceKm: Math.round((route.distance / 1000) * 10) / 10,
        durationMin: Math.round(route.duration / 60),
      };
    })
    .catch(function () {
      return null;
    });
}
