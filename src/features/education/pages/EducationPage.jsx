import { useNavigate } from 'react-router-dom';
import { GraduationCap, CalendarCheck, Award, ChevronRight } from 'lucide-react';
import { useFamilyStore } from '../../family/store';
import { useEducationStore } from '../store';

export default function EducationPage() {
  const navigate = useNavigate();
  const { members } = useFamilyStore();
  const { educationData } = useEducationStore();

  const studentsCount = members.filter((m) => educationData[m.id]?.profile?.institution).length;
  const totalExams = members.reduce((sum, m) => sum + (educationData[m.id]?.exams?.length || 0), 0);
  const totalCertificates = members.reduce((sum, m) => sum + (educationData[m.id]?.certificates?.length || 0), 0);

  return (
    <div className="p-6 sm:p-10 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Education</h1>
      <p className="text-slate-500 text-sm mb-8">
        Track academic performance, exams, assignments, certificates and skills.
      </p>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="relative overflow-hidden rounded-2xl p-5 shadow-md shadow-amber-200/50 bg-gradient-to-br from-amber-400 to-amber-600 text-white">
          <GraduationCap size={50} className="absolute -right-2 -bottom-2 text-white/15" />
          <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center mb-2">
            <GraduationCap size={16} />
          </div>
          <p className="text-2xl font-bold leading-none">{studentsCount}</p>
          <p className="text-xs text-amber-100 mt-1">Students</p>
        </div>
        <div className="relative overflow-hidden rounded-2xl p-5 shadow-md shadow-orange-200/50 bg-gradient-to-br from-orange-400 to-orange-600 text-white">
          <CalendarCheck size={50} className="absolute -right-2 -bottom-2 text-white/15" />
          <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center mb-2">
            <CalendarCheck size={16} />
          </div>
          <p className="text-2xl font-bold leading-none">{totalExams}</p>
          <p className="text-xs text-orange-100 mt-1">Exams</p>
        </div>
        <div className="relative overflow-hidden rounded-2xl p-5 shadow-md shadow-yellow-200/50 bg-gradient-to-br from-yellow-400 to-yellow-600 text-white">
          <Award size={50} className="absolute -right-2 -bottom-2 text-white/15" />
          <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center mb-2">
            <Award size={16} />
          </div>
          <p className="text-2xl font-bold leading-none">{totalCertificates}</p>
          <p className="text-xs text-yellow-100 mt-1">Certificates</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        <h2 className="text-sm font-semibold text-slate-900 mb-4">Member Education Records</h2>
        {members.length === 0 ? (
          <p className="text-sm text-slate-400">No members yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {members.map((m) => {
              const data = educationData[m.id];
              const institution = data?.profile?.institution;
              return (
                <button
                  key={m.id}
                  onClick={() => navigate('/education/' + m.id)}
                  className="flex items-center justify-between gap-3 border border-slate-100 rounded-xl p-3 text-left hover:border-amber-300 hover:shadow-sm transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-semibold">
                      {m.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{m.name}</p>
                      <p className="text-xs text-slate-500">
                        {institution ? institution : 'Profile incomplete'}
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
