import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartPulse, CalendarClock, Pill, Syringe, PhoneCall, X, ArrowLeft, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, Legend, PieChart, Pie, Cell } from 'recharts';
import { useFamilyStore } from '../../family/store';
import { useHealthStore } from '../../health/store';
import { buildHealthOverview } from '../../health/utils/aggregateHealthAnalytics';
import { buildVaccinationCoverage, buildMedicationCountByMember, buildHealthScoreComparison, buildAppointmentTimeline } from '../../health/utils/healthDeepAnalytics';
import HealthIntelligencePanel from '../../health/components/HealthIntelligencePanel';

var LINE_COLORS = ['#e11d48', '#3b82f6', '#f59e0b', '#10b981', '#8b5cf6'];
var VAC_COLORS = ['#10b981', '#ef4444'];
var SCORE_COLORS = ['#ef4444', '#f59e0b', '#10b981'];

function scoreBarColor(score) {
  if (score >= 80) return SCORE_COLORS[2];
  if (score >= 50) return SCORE_COLORS[1];
  return SCORE_COLORS[0];
}

export default function HealthAnalyticsDashboard() {
  var navigate = useNavigate();
  var members = useFamilyStore(function (s) { return s.members; });
  var healthData = useHealthStore(function (s) { return s.healthData; });
  var selectedIdState = useState('all');
  var selectedId = selectedIdState[0];
  var setSelectedId = selectedIdState[1];

  var overview = buildHealthOverview(members, healthData);

  var apptChartData = overview.perMember
    .filter(function (p) { return p.appointmentsCount > 0 || p.medicationsCount > 0; })
    .map(function (p) {
      return { name: p.member.name.split(' ')[0], Appointments: p.appointmentsCount, Medications: p.medicationsCount };
    });

  var vaccinationCoverage = buildVaccinationCoverage(members, healthData);
  var medicationByMember = buildMedicationCountByMember(members, healthData);
  var scoreComparison = buildHealthScoreComparison(members, healthData);
  var appointmentTimeline = buildAppointmentTimeline(members, healthData);

  var selectedMember = selectedId === 'all' ? null : members.find(function (m) { return m.id === selectedId; });
  var selectedData = selectedMember ? (healthData[selectedMember.id] || {}) : null;
  var selectedMetrics = selectedData ? (selectedData.metrics || []) : [];
  var metricTypes = Array.from(new Set(selectedMetrics.map(function (m) { return m.type; })));

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-slate-50">
      <div className="max-w-6xl mx-auto p-6 sm:p-10">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={function () { navigate('/dashboard'); }}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-rose-600 transition"
          >
            <ArrowLeft size={15} />
            <span>Family Command Center</span>
          </button>
          <button
            onClick={function () { navigate('/dashboard'); }}
            className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-200 transition"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex items-start justify-between flex-wrap gap-3 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <HeartPulse size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Health & Emergency Analytics</h1>
              <p className="text-slate-500 text-sm">Family-wide health intelligence, powered by your live data</p>
            </div>
          </div>

          <select
            value={selectedId}
            onChange={function (e) { setSelectedId(e.target.value); }}
            className="px-4 py-2.5 rounded-lg bg-white border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="all">All Family Members</option>
            {members.map(function (m) {
              return <option key={m.id} value={m.id}>{m.name}</option>;
            })}
          </select>
        </div>

        {selectedId === 'all' ? (
          <div>
            <HealthIntelligencePanel members={members} healthData={healthData} />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="relative overflow-hidden rounded-2xl p-5 shadow-md shadow-rose-200/50 bg-gradient-to-br from-rose-400 to-rose-600 text-white">
                <HeartPulse size={40} className="absolute -right-2 -bottom-2 text-white/15" />
                <p className="text-2xl font-bold leading-none">{overview.profilesComplete}/{members.length}</p>
                <p className="text-xs text-rose-100 mt-1">Profiles Complete</p>
              </div>
              <div className="relative overflow-hidden rounded-2xl p-5 shadow-md shadow-amber-200/50 bg-gradient-to-br from-amber-400 to-amber-600 text-white">
                <CalendarClock size={40} className="absolute -right-2 -bottom-2 text-white/15" />
                <p className="text-2xl font-bold leading-none">{overview.totalAppointments}</p>
                <p className="text-xs text-amber-100 mt-1">Upcoming Appointments</p>
              </div>
              <div className="relative overflow-hidden rounded-2xl p-5 shadow-md shadow-sky-200/50 bg-gradient-to-br from-sky-400 to-sky-600 text-white">
                <Pill size={40} className="absolute -right-2 -bottom-2 text-white/15" />
                <p className="text-2xl font-bold leading-none">{overview.totalMedications}</p>
                <p className="text-xs text-sky-100 mt-1">Active Medications</p>
              </div>
              <div className="relative overflow-hidden rounded-2xl p-5 shadow-md shadow-violet-200/50 bg-gradient-to-br from-violet-400 to-violet-600 text-white">
                <Syringe size={40} className="absolute -right-2 -bottom-2 text-white/15" />
                <p className="text-2xl font-bold leading-none">{overview.vaccinationsDue}</p>
                <p className="text-xs text-violet-100 mt-1">Vaccinations Due Soon</p>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <BarChart3 size={16} className="text-rose-500" />
              <h2 className="text-sm font-semibold text-slate-900">Detailed Analytics</h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                <h2 className="text-sm font-semibold text-slate-900 mb-4">Health Score Comparison</h2>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={scoreComparison}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }} />
                    <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                      {scoreComparison.map(function (entry, index) {
                        return <Cell key={'cell-' + index} fill={scoreBarColor(entry.score)} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                <h2 className="text-sm font-semibold text-slate-900 mb-4">Vaccination Coverage</h2>
                {vaccinationCoverage.total === 0 ? (
                  <p className="text-sm text-slate-400 py-16 text-center">No vaccination records yet.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={vaccinationCoverage.data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={2}>
                        {vaccinationCoverage.data.map(function (entry, index) {
                          return <Cell key={'cell-' + index} fill={VAC_COLORS[index % VAC_COLORS.length]} />;
                        })}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                <h2 className="text-sm font-semibold text-slate-900 mb-4">Medications by Member</h2>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={medicationByMember}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }} />
                    <Bar dataKey="count" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                <h2 className="text-sm font-semibold text-slate-900 mb-4">Appointment History (7 months)</h2>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={appointmentTimeline}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }} />
                    <Line type="monotone" dataKey="count" stroke="#f43f5e" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 mb-6">
              <h2 className="text-sm font-semibold text-slate-900 mb-4">Appointments & Medications per Member</h2>
              {apptChartData.length === 0 ? (
                <p className="text-sm text-slate-400 py-8 text-center">No health activity recorded yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={apptChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="Appointments" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="Medications" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <h2 className="text-sm font-semibold text-slate-900 mb-4">Member Health Summary</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {overview.perMember.map(function (p) {
                  return (
                    <button
                      key={p.member.id}
                      onClick={function () { setSelectedId(p.member.id); }}
                      className="flex items-center justify-between gap-3 border border-slate-100 rounded-xl p-3 text-left hover:border-rose-300 hover:shadow-sm transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-semibold">
                          {p.member.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{p.member.name}</p>
                          <p className="text-xs text-slate-500">
                            {p.profile.bloodGroup ? p.profile.bloodGroup + ' - ' : ''}
                            {p.appointmentsCount} appt, {p.medicationsCount} meds
                          </p>
                        </div>
                      </div>
                      {!p.hasEmergencyContact && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 whitespace-nowrap">
                          No SOS contact
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 mb-6 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-rose-500 to-rose-700 text-white flex items-center justify-center font-bold text-xl">
                  {selectedMember.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{selectedMember.name}</h2>
                  <p className="text-sm text-slate-500">{selectedMember.relationship}</p>
                </div>
              </div>
              <button
                onClick={function () { navigate('/health/' + selectedMember.id); }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium transition"
              >
                Manage Full Record
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-4">
                <p className="text-xs text-slate-400">Blood Group</p>
                <p className="text-lg font-bold text-slate-900">{selectedData.profile && selectedData.profile.bloodGroup ? selectedData.profile.bloodGroup : 'Not set'}</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-4">
                <p className="text-xs text-slate-400">Allergies</p>
                <p className="text-sm font-medium text-slate-900">{selectedData.profile && selectedData.profile.allergies ? selectedData.profile.allergies : 'None'}</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-4">
                <p className="text-xs text-slate-400">Medications</p>
                <p className="text-lg font-bold text-slate-900">{(selectedData.medications || []).length}</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-4">
                <p className="text-xs text-slate-400">Emergency Contacts</p>
                <p className="text-lg font-bold text-slate-900">{(selectedData.emergencyContacts || []).length}</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 mb-6">
              <h2 className="text-sm font-semibold text-slate-900 mb-4">Health Trends</h2>
              {metricTypes.length === 0 ? (
                <p className="text-sm text-slate-400 py-8 text-center">No health metrics logged for {selectedMember.name} yet.</p>
              ) : (
                metricTypes.map(function (type, i) {
                  var points = selectedMetrics
                    .filter(function (m) { return m.type === type; })
                    .slice()
                    .sort(function (a, b) { return new Date(a.date) - new Date(b.date); })
                    .map(function (m) { return { date: m.date, value: Number(m.value) }; });
                  return (
                    <div key={type} className="mb-6 last:mb-0">
                      <p className="text-xs font-medium text-slate-600 mb-2">{type}</p>
                      <ResponsiveContainer width="100%" height={160}>
                        <LineChart data={points}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                          <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }} />
                          <Line type="monotone" dataKey="value" stroke={LINE_COLORS[i % LINE_COLORS.length]} strokeWidth={2} dot={{ r: 3 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  );
                })
              )}
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <h2 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <PhoneCall size={15} className="text-rose-600" />
                <span>Emergency Contacts</span>
              </h2>
              {(selectedData.emergencyContacts || []).length === 0 ? (
                <p className="text-sm text-slate-400">No emergency contacts set for {selectedMember.name}.</p>
              ) : (
                <div className="space-y-2">
                  {(selectedData.emergencyContacts || []).slice().sort(function (a, b) { return a.priority - b.priority; }).map(function (c) {
                    return (
                      <div key={c.id} className="flex items-center justify-between border border-slate-100 rounded-xl p-3">
                        <p className="text-sm text-slate-900">{c.name} <span className="text-slate-400">- {c.relation}</span></p>
                        <p className="text-sm text-slate-500">{c.phone}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
