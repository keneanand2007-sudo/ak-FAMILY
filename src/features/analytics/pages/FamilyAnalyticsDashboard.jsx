import { useNavigate } from 'react-router-dom';
import { Users, X, ArrowLeft, Shield } from 'lucide-react';
import { useFamilyStore } from '../../family/store';
import { useHealthStore } from '../../health/store';
import { usePermissionsStore } from '../../permissions/store';

const AVATAR_COLORS = ['bg-blue-100 text-blue-700', 'bg-emerald-100 text-emerald-700', 'bg-amber-100 text-amber-700', 'bg-rose-100 text-rose-700', 'bg-violet-100 text-violet-700', 'bg-sky-100 text-sky-700'];

export default function FamilyAnalyticsDashboard() {
  const navigate = useNavigate();
  const { family, members } = useFamilyStore();
  const { healthData } = useHealthStore();
  const { roles, getRole } = usePermissionsStore();

  const relationshipCounts = {};
  members.forEach((m) => {
    relationshipCounts[m.relationship] = (relationshipCounts[m.relationship] || 0) + 1;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      <div className="max-w-6xl mx-auto p-6 sm:p-10">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 transition"
          >
            <ArrowLeft size={15} /> Family Command Center
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-200 transition"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Family Network</h1>
            <p className="text-slate-500 text-sm">{family && family.name} - relationships, roles and responsibilities</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="relative overflow-hidden rounded-2xl p-5 shadow-md shadow-blue-200/50 bg-gradient-to-br from-blue-400 to-blue-600 text-white">
            <Users size={50} className="absolute -right-2 -bottom-2 text-white/15" />
            <p className="text-2xl font-bold leading-none">{members.length}</p>
            <p className="text-xs text-blue-100 mt-1">Total Members</p>
          </div>
          <div className="relative overflow-hidden rounded-2xl p-5 shadow-md shadow-slate-300/50 bg-gradient-to-br from-slate-500 to-slate-700 text-white">
            <Shield size={50} className="absolute -right-2 -bottom-2 text-white/15" />
            <p className="text-2xl font-bold leading-none">{Object.keys(roles).length}</p>
            <p className="text-xs text-slate-300 mt-1">Roles Assigned</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">Family Members</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {members.map((m, i) => {
              const hasHealthProfile = healthData[m.id] && healthData[m.id].profile && healthData[m.id].profile.bloodGroup;
              return (
                <div key={m.id} className="flex items-center justify-between gap-3 border border-slate-100 rounded-xl p-3">
                  <div className="flex items-center gap-3">
                    <div className={'w-10 h-10 rounded-full flex items-center justify-center font-semibold ' + AVATAR_COLORS[i % AVATAR_COLORS.length]}>
                      {m.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{m.name}</p>
                      <p className="text-xs text-slate-500">{m.relationship} - {getRole(m.id)}</p>
                    </div>
                  </div>
                  {!hasHealthProfile && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 whitespace-nowrap">
                      Incomplete profile
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">Relationship Breakdown</h2>
          <div className="flex flex-wrap gap-2">
            {Object.keys(relationshipCounts).map((rel) => (
              <span key={rel} className="text-sm font-medium px-3 py-1.5 rounded-full bg-blue-50 text-blue-700">
                {rel}: {relationshipCounts[rel]}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
