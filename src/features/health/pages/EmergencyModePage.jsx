import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Droplet, AlertTriangle, PhoneCall, Clock, MapPin, MessageCircle, Loader2 } from 'lucide-react';
import { useFamilyStore } from '../../family/store';
import { useHealthStore } from '../store';
import { getCurrentLocation } from '../utils/geolocation';

export default function EmergencyModePage() {
  const navigate = useNavigate();
  const { members } = useFamilyStore();
  const { healthData } = useHealthStore();
  const activatedAt = new Date().toLocaleString();
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [locating, setLocating] = useState(false);

  const handleGetLocation = () => {
    setLocating(true);
    setLocationError('');
    getCurrentLocation()
      .then(function (loc) {
        setLocation(loc);
        setLocating(false);
      })
      .catch(function (err) {
        setLocationError(err.message || 'Could not get location. Please allow location access.');
        setLocating(false);
      });
  };

  const buildWhatsAppMessage = function (member, profile) {
    var msg = 'EMERGENCY ALERT for ' + member.name + '.\n';
    msg = msg + 'Blood Group: ' + (profile.bloodGroup || 'Unknown') + '\n';
    msg = msg + 'Allergies: ' + (profile.allergies || 'None recorded') + '\n';
    if (profile.emergencyNotes) {
      msg = msg + 'Notes: ' + profile.emergencyNotes + '\n';
    }
    if (location) {
      msg = msg + 'Current location: https://www.google.com/maps?q=' + location.latitude + ',' + location.longitude + '\n';
    }
    msg = msg + 'Please respond immediately.';
    return msg;
  };

  const openWhatsApp = function (phone, member, profile) {
    var message = buildWhatsAppMessage(member, profile);
    var cleanPhone = phone.replace(/[^0-9]/g, '');
    var url = 'https://wa.me/' + cleanPhone + '?text=' + encodeURIComponent(message);
    window.open(url, '_blank');
  };

  const callNumber = function (phone) {
    window.location.href = 'tel:' + phone;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-white p-6 sm:p-10">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={function () { navigate('/health'); }}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-600 mb-6 transition"
        >
          <ArrowLeft size={15} />
          <span>Exit Emergency Mode</span>
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-600 text-white mb-3 shadow-lg shadow-red-200">
            <AlertTriangle size={26} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Emergency Mode Activated</h1>
          <p className="text-sm text-slate-500 mt-1 flex items-center justify-center gap-1.5">
            <Clock size={13} />
            <span>{activatedAt}</span>
          </p>
          <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto">
            Only pre-authorized emergency information is shown here. This access is time-limited and logged in the family audit trail.
          </p>
        </div>

        <div className="bg-white border-2 border-red-100 rounded-2xl p-5 mb-6 text-center">
          {!location && (
            <button
              onClick={handleGetLocation}
              disabled={locating}
              className="flex items-center justify-center gap-2 mx-auto px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-medium transition"
            >
              {locating ? <Loader2 size={15} className="animate-spin" /> : <MapPin size={15} />}
              <span>{locating ? 'Getting your location...' : 'Share My Current Location'}</span>
            </button>
          )}
          {location && (
            <div>
              <p className="text-sm font-medium text-emerald-700 flex items-center justify-center gap-1.5 mb-1">
                <MapPin size={14} />
                <span>Location captured (accuracy: {Math.round(location.accuracy)}m)</span>
              </p>
              <button onClick={function () { window.open("https://www.google.com/maps?q=" + location.latitude + "," + location.longitude, "_blank"); }} className="text-xs text-blue-600 hover:underline">View on Google Maps</button>
            </div>
          )}
          {locationError && <p className="text-xs text-red-500 mt-2">{locationError}</p>}
        </div>

        <div className="space-y-4">
          {members.map(function (m) {
            var data = healthData[m.id];
            var profile = data && data.profile;
            var rawContacts = (data && data.emergencyContacts) || [];
            var contacts = rawContacts.slice().sort(function (x, y) { return x.priority - y.priority; });

            return (
              <div key={m.id} className="bg-white border-2 border-red-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="bg-red-600 text-white px-5 py-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold">
                    {m.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold leading-none">{m.name}</p>
                    <p className="text-xs text-red-100">{m.relationship}</p>
                  </div>
                </div>

                <div className="p-5 grid sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <Droplet size={16} className="text-red-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-slate-400">Blood Group</p>
                      <p className="text-sm font-medium text-slate-900">
                        {profile && profile.bloodGroup ? profile.bloodGroup : 'Not set'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertTriangle size={16} className="text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-slate-400">Allergies</p>
                      <p className="text-sm font-medium text-slate-900">
                        {profile && profile.allergies ? profile.allergies : 'None recorded'}
                      </p>
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-xs text-slate-400 mb-1">Emergency Notes</p>
                    <p className="text-sm text-slate-700">
                      {profile && profile.emergencyNotes ? profile.emergencyNotes : 'No notes recorded'}
                    </p>
                  </div>

                  <div className="sm:col-span-2 border-t border-slate-100 pt-3">
                    <p className="text-xs text-slate-400 mb-2 flex items-center gap-1.5">
                      <PhoneCall size={13} />
                      <span>Emergency Contacts</span>
                    </p>
                    {contacts.length === 0 && (
                      <p className="text-sm text-slate-400">No emergency contacts on file</p>
                    )}
                    {contacts.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {contacts.map(function (c) {
                          return (
                            <div key={c.id} className="flex items-center gap-1">
                              <button
                                onClick={function () { callNumber(c.phone); }}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-sm font-medium hover:bg-red-100 transition"
                              >
                                <PhoneCall size={13} />
                                <span>{c.name}</span>
                              </button>
                              <button
                                onClick={function () { openWhatsApp(c.phone, m, profile || {}); }}
                                className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition"
                                title="Send emergency alert via WhatsApp"
                              >
                                <MessageCircle size={14} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
