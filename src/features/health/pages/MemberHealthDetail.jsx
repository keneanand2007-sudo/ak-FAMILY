import { useState } from 'react';
import { ArrowLeft, Droplet, FileHeart, Pill, CalendarClock, PhoneCall, Syringe, LineChart } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFamilyStore } from '../../family/store';
import HealthProfileTab from '../components/HealthProfileTab';
import MedicalRecordsTab from '../components/MedicalRecordsTab';
import MedicationsTab from '../components/MedicationsTab';
import AppointmentsTab from '../components/AppointmentsTab';
import EmergencyContactsTab from '../components/EmergencyContactsTab';
import VaccinationsTab from '../components/VaccinationsTab';
import MetricsTab from '../components/MetricsTab';

const TABS = [
  { key: 'profile', label: 'Health Profile', icon: Droplet },
  { key: 'records', label: 'Medical Records', icon: FileHeart },
  { key: 'medications', label: 'Medications', icon: Pill },
  { key: 'appointments', label: 'Appointments', icon: CalendarClock },
  { key: 'vaccinations', label: 'Vaccinations', icon: Syringe },
  { key: 'metrics', label: 'Health Trends', icon: LineChart },
  { key: 'contacts', label: 'Emergency Contacts', icon: PhoneCall },
];

export default function MemberHealthDetail() {
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
        onClick={() => navigate('/health')}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-rose-600 mb-6 transition"
      >
        <ArrowLeft size={15} /> Back to Health & Emergency
      </button>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 mb-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-rose-500 to-rose-700 text-white flex items-center justify-center font-bold text-xl shadow-sm">
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
                ? 'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-sm shadow-rose-200'
                : 'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && <HealthProfileTab memberId={id} />}
      {activeTab === 'records' && <MedicalRecordsTab memberId={id} />}
      {activeTab === 'medications' && <MedicationsTab memberId={id} />}
      {activeTab === 'appointments' && <AppointmentsTab memberId={id} />}
      {activeTab === 'vaccinations' && <VaccinationsTab memberId={id} />}
      {activeTab === 'metrics' && <MetricsTab memberId={id} />}
      {activeTab === 'contacts' && <EmergencyContactsTab memberId={id} />}
    </div>
  );
}
