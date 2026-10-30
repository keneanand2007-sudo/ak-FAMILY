import { useNavigate } from 'react-router-dom';
import { HeartPulse, CalendarClock, Pill, Siren, ChevronRight } from 'lucide-react';
import { useFamilyStore } from '../../family/store';
import { useHealthStore } from '../store';

export default function HealthPage() {
  const navigate = useNavigate();
  const { members } = useFamilyStore();
  const { healthData } = useHealthStore();

  const profilesComplete = members.filter((m) => healthData[m.id] && healthData[m.id].profile && healthData[m.id].profile.bloodGroup).length;
  const totalUpcomingAppointments = members.reduce(
    (sum, m) => sum + ((healthData[m.id] && healthData[m.id].appointments) ? healthData[m.id].appointments.length : 0),
    0
  );
  const totalMedications = members.reduce(
    (sum, m) => sum + ((healthData[m.id] && healthData[m.id].medications) ? healthData[m.id].medications.length : 0),
    0
  );

  return (
    <div className="p-6 sm:p-10 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-slate-900">Health & Emergency</h1>
      </div>
      <p className="text-slate-500 text-sm mb-8">
        Family health records, medications, appointments and emergency information.
      </p>

      <button
        onClick={() => navigate('/emergency')}
        className="w-full flex items-center justify-between bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-2xl p-5 mb-8 shadow-md shadow-red-200 hover:shadow-lg transition"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center animate-pulse">
            <Siren size={22} />
          </div>
          <div className="text-left">
            <p className="font-bold">Emergency Mode</p>
            <p className="text-sm text-red-100">Tap for instant access to critical info - blood group, allergies, emergency contacts</p>
          </div>
        </div>
        <ChevronRight size={20} className="text-red-100" />
      </button>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="relative overflow-hidden rounded-2xl p-5 shadow-md shadow-rose-200/50 bg-gradient-to-br from-rose-400 to-rose-600 text-white">
          <HeartPulse size={50} className="absolute -right-2 -bottom-2 text-white/15" />
          <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center mb-2">
            <HeartPulse size={16} />
          </div>
          <p className="text-2xl font-bold leading-none">{profilesComplete}/{members.length}</p>
          <p className="text-xs text-rose-100 mt-1">Profiles Complete</p>
        </div>
        <div className="relative overflow-hidden rounded-2xl p-5 shadow-md shadow-amber-200/50 bg-gradient-to-br from-amber-400 to-amber-600 text-white">
          <CalendarClock size={50} className="absolute -right-2 -bottom-2 text-white/15" />
          <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center mb-2">
            <CalendarClock size={16} />
          </div>
          <p className="text-2xl font-bold leading-none">{totalUpcomingAppointments}</p>
          <p className="text-xs text-amber-100 mt-1">Appointments</p>
        </div>
        <div className="relative overflow-hidden rounded-2xl p-5 shadow-md shadow-sky-200/50 bg-gradient-to-br from-sky-400 to-sky-600 text-white">
          <Pill size={50} className="absolute -right-2 -bottom-2 text-white/15" />
          <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center mb-2">
            <Pill size={16} />
          </div>
          <p className="text-2xl font-bold leading-none">{totalMedications}</p>
          <p className="text-xs text-sky-100 mt-1">Active Medications</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        <h2 className="text-sm font-semibold text-slate-900 mb-4">Member Health Records</h2>
        {members.length === 0 ? (
          <p className="text-sm text-slate-400">No members yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {members.map((m, i) => {
              const data = healthData[m.id];
              const bg = data && data.profile ? data.profile.bloodGroup : '';
              const avatarColors = ['bg-rose-100 text-rose-700', 'bg-amber-100 text-amber-700', 'bg-sky-100 text-sky-700', 'bg-violet-100 text-violet-700', 'bg-emerald-100 text-emerald-700'];
              return (
                <button
                  key={m.id}
                  onClick={() => navigate('/health/' + m.id)}
                  className="flex items-center justify-between gap-3 border border-slate-100 rounded-xl p-3 text-left hover:border-rose-300 hover:shadow-sm transition"
                >
                  <div className="flex items-center gap-3">
                    <div className={'w-10 h-10 rounded-full flex items-center justify-center font-semibold ' + avatarColors[i % avatarColors.length]}>
                      {m.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{m.name}</p>
                      <p className="text-xs text-slate-500">
                        {bg ? 'Blood Group: ' + bg : 'Profile incomplete'}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-300" />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
