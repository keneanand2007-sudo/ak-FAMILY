import { LogOut, HeartPulse, Wallet, GraduationCap, FileText, MapPin, Users, CheckSquare, Calendar, Bell, Shield } from 'lucide-react';
import { useAuthStore } from '../../auth/store';
import { useFamilyStore } from '../../family/store';
import { useFinanceStore } from '../../finance/store';
import { useDocumentsStore } from '../../documents/store';
import { useHealthStore } from '../../health/store';
import { useEducationStore } from '../../education/store';
import { usePlacesStore } from '../../places/store';
import { buildFamilyPulse } from '../utils/buildFamilyPulse';
import FamilyPulseBanner from '../components/FamilyPulseBanner';
import ModuleCard from '../components/ModuleCard';

export default function Dashboard() {
  const { currentUser, logout } = useAuthStore();
  const { family, members } = useFamilyStore();
  const { getTotals } = useFinanceStore();
  const { documents } = useDocumentsStore();
  const { healthData } = useHealthStore();
  const { educationData } = useEducationStore();
  const { places } = usePlacesStore();
  const totals = getTotals();

  const pulse = buildFamilyPulse(members, healthData, educationData, documents);

  const profilesComplete = members.filter((m) => healthData[m.id] && healthData[m.id].profile && healthData[m.id].profile.bloodGroup).length;
  const totalAppointments = members.reduce((sum, m) => sum + ((healthData[m.id] && healthData[m.id].appointments) ? healthData[m.id].appointments.length : 0), 0);
  const healthAlerts = pulse.alerts.filter((a) => a.type === 'Medical').length;

  const financeLabel = totals.totalIncome === 0 && totals.totalExpense === 0 ? 'Not set up' : totals.savings >= 0 ? 'Healthy' : 'Overspending';
  const financeAlerts = 0;

  const studentsCount = members.filter((m) => educationData[m.id] && educationData[m.id].profile && educationData[m.id].profile.institution).length;
  const totalExams = members.reduce((sum, m) => sum + ((educationData[m.id] && educationData[m.id].exams) ? educationData[m.id].exams.length : 0), 0);
  const eduAlerts = pulse.alerts.filter((a) => a.type === 'Education').length;

  const expiringDocs = pulse.alerts.filter((a) => a.type === 'Documents').length;

  const totalAuditEntries = 0;

  return (
    <div className="p-6 sm:p-10 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">
            {family && family.name}
          </p>
          <h1 className="text-2xl font-bold text-slate-900">
            Good Evening, {currentUser && currentUser.name ? currentUser.name.split(' ')[0] : ''}
          </h1>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white hover:bg-slate-100 text-slate-600 text-sm font-medium border border-slate-200 shadow-sm transition"
        >
          <LogOut size={15} /> Logout
        </button>
      </div>

      <FamilyPulseBanner pulse={pulse} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <ModuleCard
          icon={HeartPulse}
          title="Health & Emergency"
          stats={[
            profilesComplete + '/' + members.length + ' profiles complete',
            totalAppointments + ' upcoming appointments',
          ]}
          alertCount={healthAlerts}
          alertLabel="health alert(s)"
          gradient="from-rose-400 to-rose-600"
          to="/analytics/health"
        />
        <ModuleCard
          icon={Wallet}
          title="Finance"
          stats={[
            'Status: ' + financeLabel,
            'Rs. ' + totals.totalExpense.toLocaleString('en-IN') + ' spent this period',
          ]}
          alertCount={financeAlerts}
          alertLabel="budget alert(s)"
          gradient="from-emerald-400 to-emerald-600"
          to="/analytics/finance"
        />
        <ModuleCard
          icon={GraduationCap}
          title="Education"
          stats={[
            studentsCount + ' students tracked',
            totalExams + ' upcoming exams',
          ]}
          alertCount={eduAlerts}
          alertLabel="deadline(s)"
          gradient="from-amber-400 to-amber-600"
          to="/analytics/education"
        />
        <ModuleCard
          icon={FileText}
          title="Documents"
          stats={[
            documents.length + ' documents stored',
            expiringDocs + ' expiring soon',
          ]}
          alertCount={expiringDocs}
          alertLabel="expiring"
          gradient="from-sky-400 to-sky-600"
          to="/analytics/documents"
        />
        <ModuleCard
          icon={MapPin}
          title="Places"
          stats={[
            places.length + ' places saved',
            'Location sharing: consent-based',
          ]}
          alertCount={0}
          alertLabel=""
          gradient="from-violet-400 to-violet-600"
          to="/analytics/places"
        />
        <ModuleCard
          icon={Users}
          title="Family & Members"
          stats={[
            members.length + ' members in workspace',
            'Family tree & relationships',
          ]}
          alertCount={0}
          alertLabel=""
          gradient="from-blue-400 to-blue-600"
          to="/analytics/family"
        />
        <ModuleCard
          icon={CheckSquare}
          title="Tasks & Responsibilities"
          stats={[]}
          alertCount={0}
          alertLabel=""
          gradient="from-teal-400 to-teal-600"
          to="/tasks"
          comingSoon
        />
        <ModuleCard
          icon={Calendar}
          title="Events & Calendar"
          stats={[]}
          alertCount={0}
          alertLabel=""
          gradient="from-pink-400 to-pink-600"
          to="/calendar"
          comingSoon
        />
        <ModuleCard
          icon={Bell}
          title="Alerts & Notifications"
          stats={[
            pulse.total + ' active alerts',
            'Auto-aggregated across modules',
          ]}
          alertCount={pulse.critical}
          alertLabel="critical"
          gradient="from-orange-400 to-orange-600"
          to="/alerts"
        />
        <ModuleCard
          icon={Shield}
          title="Permissions & Security"
          stats={[
            members.length + ' members with roles',
            'Audit log active',
          ]}
          alertCount={0}
          alertLabel=""
          gradient="from-slate-500 to-slate-700"
          to="/analytics/permissions"
        />
      </div>
    </div>
  );
}
