import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Droplet, AlertTriangle, Phone, Siren } from 'lucide-react';
import { useFamilyStore } from '../../family/store';
import { useHealthStore } from '../store';

export default function EmergencyMode() {
  const navigate = useNavigate();
  const { members, family } = useFamilyStore();
  const { healthProfiles, emergencyContacts } = useHealthStore();

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-white">
      <div className="max-w-4xl mx-auto p-6 sm:p-10">
        <button
          onClick={() => navigate('/health')}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-600 mb-6 transition"
        >
          <ArrowLeft size={15} /> Exit Emergency Mode
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center animate-pulse">
            <Siren size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-red-700">Emergency Mode</h1>
            <p className="text-sm text-slate-500">{family?.name} · Critical information, at a glance</p>
          </div>
        </div>

        {members.length === 0 ? (
          <p className="text-slate-400 text-sm">No members in this family yet.</p>
        ) : (
          <div className="space-y-4">
            {members.map((m) => {
              const profile = healthProfiles[m.id];
              const contacts = emergencyContacts
                .filter((c) => c.memberId === m.id)
                .sort((a, b) => a.priority - b.priority);
              const primaryContact = contacts[0];

              return (
                <div key={m.id} className="bg-white border-2 border-red-100 rounded-2xl shadow-sm p-6">
                  <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-lg">
                        {m.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-lg font-bold text-slate-900">{m.name}</p>
                        <p className="text-sm text-slate-500">{m.relationship}</p>
                      </div>
                    </div>
                    {profile?.bloodGroup && (
                      <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-lg">
                        <Droplet size={18} /> {profile.bloodGroup}
                      </div>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                        <AlertTriangle size={12} /> Allergies
                      </p>
                      {profile?.allergies?.length ? (
                        <div className="flex flex-wrap gap-1.5">
                          {profile.allergies.map((a) => (
                            <span key={a} className="text-sm font-medium bg-red-50 text-red-700 px-2.5 py-1 rounded-full">
                              {a}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-400">None recorded</p>
                      )}
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                        <Phone size={12} /> Primary Emergency Contact
                      </p>
                      {primaryContact ? (
                        <p className="text-sm font-medium text-slate-900">
                          {primaryContact.name} <span className="text-slate-400 font-normal">({primaryContact.relation})</span>
                          <br />
                          <a href={`tel:${primaryContact.phone}`} className="text-red-600 font-semibold">
                            {primaryContact.phone}
                          </a>
                        </p>
                      ) : (
                        <p className="text-sm text-slate-400">Not set</p>
                      )}
                    </div>
                  </div>

                  {profile?.conditions?.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-red-50">
                      <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-1.5">Medical Conditions</p>
                      <p className="text-sm text-slate-700">{profile.conditions.join(', ')}</p>
                    </div>
                  )}

                  {profile?.notes && (
                    <div className="mt-3">
                      <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-1.5">Emergency Notes</p>
                      <p className="text-sm text-slate-700">{profile.notes}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
