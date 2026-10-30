import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { searchPlaces } from '../utils/geocoding';

export default function LocationSearchInput({ placeholder, onSelect }) {
  var queryState = useState('');
  var query = queryState[0];
  var setQuery = queryState[1];

  var resultsState = useState([]);
  var results = resultsState[0];
  var setResults = resultsState[1];

  var loadingState = useState(false);
  var loading = loadingState[0];
  var setLoading = loadingState[1];

  var openState = useState(false);
  var open = openState[0];
  var setOpen = openState[1];

  var debounceRef = useRef(null);

  useEffect(function () {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length < 3) {
      setResults([]);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(function () {
      searchPlaces(query).then(function (places) {
        setResults(places);
        setLoading(false);
        setOpen(true);
      });
    }, 500);
    return function () {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  function handleSelect(place) {
    onSelect(place);
    setQuery(place.name.split(',')[0]);
    setOpen(false);
    setResults([]);
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={function (e) { setQuery(e.target.value); }}
          onFocus={function () { if (results.length > 0) setOpen(true); }}
          placeholder={placeholder || 'Search a place...'}
          className="w-full pl-9 pr-8 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        {loading && <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 animate-spin" />}
      </div>

      {open && results.length > 0 && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-56 overflow-y-auto">
          {results.map(function (place, i) {
            return (
              <button
                key={i}
                onClick={function () { handleSelect(place); }}
                className="w-full flex items-start gap-2 px-3 py-2 text-left text-xs hover:bg-violet-50 transition border-b border-slate-50 last:border-0"
              >
                <MapPin size={12} className="text-violet-500 mt-0.5 shrink-0" />
                <span className="text-slate-700">{place.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
