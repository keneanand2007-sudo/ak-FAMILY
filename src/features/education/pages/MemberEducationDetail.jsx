import { useState } from 'react';
import { ArrowLeft, GraduationCap, BarChart3, CalendarCheck, ClipboardList, Award, Sparkles } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFamilyStore } from '../../family/store';
import EducationProfileTab from '../components/EducationProfileTab';
import PerformanceTab from '../components/PerformanceTab';
import ExamsTab from '../components/ExamsTab';
import AssignmentsTab from '../components/AssignmentsTab';
import CertificatesTab from '../components/CertificatesTab';
import SkillsTab from '../components/SkillsTab';

const TABS = [
  { key: 'profile', label: 'Profile', icon: GraduationCap },
  { key: 'performance', label: 'Performance', icon: BarChart3 },
  { key: 'exams', label: 'Exams', icon: CalendarCheck },
  { key: 'assignments', label: 'Assignments', icon: ClipboardList },
  { key: 'certificates', label: 'Certificates', icon: Award },
  { key: 'skills', label: 'Skills', icon: Sparkles },
];

export default function MemberEducationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { members } = useFamilyStore();
  const [activeTab, setActiveTab] = useState('profile');

  const member = members.find((m) => m.id === id);

  if (!member) {
    return <div className="p-10 text-slate-500">Member not found.</div>;
  }

  return (
    <div className="p-6 sm:p-10 max-w-4xl mx-auto">
      <button
        onClick={() => navigate('/education')}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-amber-600 mb-6 transition"
      >
        <ArrowLeft size={15} /> Back to Education
      </button>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 mb-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center font-bold text-xl shadow-sm">
          {member.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">{member.name}</h1>
          <p className="text-sm text-slate-500">{member.relationship}</p>
        </div>
      </div>

      <div className="flex overflow-x-auto gap-2 mb-5">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={
              activeTab === key
                ? 'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition bg-amber-600 text-white shadow-sm shadow-amber-200'
                : 'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && <EducationProfileTab memberId={id} />}
      {activeTab === 'performance' && <PerformanceTab memberId={id} />}
      {activeTab === 'exams' && <ExamsTab memberId={id} />}
      {activeTab === 'assignments' && <AssignmentsTab memberId={id} />}
      {activeTab === 'certificates' && <CertificatesTab memberId={id} />}
      {activeTab === 'skills' && <SkillsTab memberId={id} />}
    </div>
  );
}
