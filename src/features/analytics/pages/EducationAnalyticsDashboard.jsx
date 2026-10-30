import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, CalendarCheck, Award, Sparkles, X, ArrowLeft } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { useFamilyStore } from '../../family/store';
import { useEducationStore } from '../../education/store';
import { buildEducationOverview } from '../../education/utils/aggregateEducationAnalytics';
import EducationIntelligencePanel from '../../education/components/EducationIntelligencePanel';

var LINE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6', '#0ea5e9'];

export default function EducationAnalyticsDashboard() {
  var navigate = useNavigate();
  var members = useFamilyStore(function (s) { return s.members; });
  var educationData = useEducationStore(function (s) { return s.educationData; });
  var selectedIdState = useState('all');
  var selectedId = selectedIdState[0];
  var setSelectedId = selectedIdState[1];

  var overview = buildEducationOverview(members, educationData);

  var maxSemesters = overview.students.reduce(function (max, p) { return Math.max(max, p.performance.length); }, 0);
  var chartData = [];
  for (var i = 0; i < maxSemesters; i++) {
    var point = { semester: 'Sem ' + (i + 1) };
    overview.students.forEach(function (p) {
      var perf = p.performance[i];
      if (perf) point[p.member.name.split(' ')[0]] = Number(perf.percentage);
    });
    chartData.push(point);
  }

  var studentsForIntel = overview.students.map(function (p) { return p.member; });

  var selectedMember = selectedId === 'all' ? null : members.find(function (m) { return m.id === selectedId; });
  var selectedData = selectedMember ? (educationData[selectedMember.id] || {}) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-slate-50">
      <div className="max-w-6xl mx-auto p-6 sm:p-10">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={function () { navigate('/dashboard'); }}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-amber-600 transition"
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
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <GraduationCap size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Education Analytics</h1>
              <p className="text-slate-500 text-sm">Family-wide academic intelligence, powered by your live data</p>
            </div>
          </div>

          <select
            value={selectedId}
            onChange={function (e) { setSelectedId(e.target.value); }}
            className="px-4 py-2.5 rounded-lg bg-white border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">All Students</option>
            {members.map(function (m) {
              return <option key={m.id} value={m.id}>{m.name}</option>;
            })}
          </select>
        </div>

        {selectedId === 'all' ? (
          <div>
            <EducationIntelligencePanel students={studentsForIntel} educationData={educationData} />

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="relative overflow-hidden rounded-2xl p-5 shadow-md shadow-amber-200/50 bg-gradient-to-br from-amber-400 to-amber-600 text-white">
                <GraduationCap size={40} className="absolute -right-2 -bottom-2 text-white/15" />
                <p className="text-2xl font-bold leading-none">{overview.totalStudents}</p>
                <p className="text-xs text-amber-100 mt-1">Students</p>
              </div>
              <div className="relative overflow-hidden rounded-2xl p-5 shadow-md shadow-orange-200/50 bg-gradient-to-br from-orange-400 to-orange-600 text-white">
                <CalendarCheck size={40} className="absolute -right-2 -bottom-2 text-white/15" />
                <p className="text-2xl font-bold leading-none">{overview.totalExams}</p>
                <p className="text-xs text-orange-100 mt-1">Upcoming Exams</p>
              </div>
              <div className="relative overflow-hidden rounded-2xl p-5 shadow-md shadow-yellow-200/50 bg-gradient-to-br from-yellow-400 to-yellow-600 text-white">
                <Award size={40} className="absolute -right-2 -bottom-2 text-white/15" />
                <p className="text-2xl font-bold leading-none">{overview.totalCertificates}</p>
                <p className="text-xs text-yellow-100 mt-1">Certificates</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 mb-6">
              <h2 className="text-sm font-semibold text-slate-900 mb-4">Academic Performance Trend</h2>
              {overview.students.length === 0 ? (
                <p className="text-sm text-slate-400 py-8 text-center">No students tracked yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="semester" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    {overview.students.map(function (p, i) {
                      return (
                        <Line
                          key={p.member.id}
                          type="monotone"
                          dataKey={p.member.name.split(' ')[0]}
                          stroke={LINE_COLORS[i % LINE_COLORS.length]}
                          strokeWidth={2}
                          dot={{ r: 3 }}
                        />
                      );
                    })}
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <h2 className="text-sm font-semibold text-slate-900 mb-4">Student Summary</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {overview.perMember.map(function (p) {
                  return (
                    <button
                      key={p.member.id}
                      onClick={function () { setSelectedId(p.member.id); }}
                      className="flex items-center justify-between gap-3 border border-slate-100 rounded-xl p-3 text-left hover:border-amber-300 hover:shadow-sm transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-semibold">
                          {p.member.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{p.member.name}</p>
                          <p className="text-xs text-slate-500">
                            {p.institution || 'No profile'} {p.latestPerformance !== null ? '- ' + p.latestPerformance + '%' : ''}
                          </p>
                        </div>
                      </div>
                      {p.examsCount > 0 && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 whitespace-nowrap">
                          {p.examsCount} exam(s)
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
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center font-bold text-xl">
                  {selectedMember.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{selectedMember.name}</h2>
                  <p className="text-sm text-slate-500">
                    {selectedData.profile && selectedData.profile.institution ? selectedData.profile.institution : 'No education profile'}
                  </p>
                </div>
              </div>
              <button
                onClick={function () { navigate('/education/' + selectedMember.id); }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium transition"
              >
                Manage Full Record
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 mb-6">
              <h2 className="text-sm font-semibold text-slate-900 mb-4">Performance History</h2>
              {(selectedData.performance || []).length === 0 ? (
                <p className="text-sm text-slate-400 py-8 text-center">No performance data logged.</p>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={selectedData.performance.map(function (p) { return { semester: p.semester, percentage: Number(p.percentage) }; })}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="semester" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }} />
                    <Line type="monotone" dataKey="percentage" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                <h2 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <CalendarCheck size={15} className="text-orange-600" />
                  <span>Upcoming Exams</span>
                </h2>
                {(selectedData.exams || []).length === 0 ? (
                  <p className="text-sm text-slate-400">No exams scheduled.</p>
                ) : (
                  <div className="space-y-2">
                    {selectedData.exams.map(function (e) {
                      return (
                        <div key={e.id} className="flex items-center justify-between border border-slate-100 rounded-lg p-2.5">
                          <p className="text-sm text-slate-700">{e.subject}</p>
                          <p className="text-xs text-slate-400">{e.date}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                <h2 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Sparkles size={15} className="text-amber-600" />
                  <span>Skills</span>
                </h2>
                {(selectedData.skills || []).length === 0 ? (
                  <p className="text-sm text-slate-400">No skills added.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {selectedData.skills.map(function (s) {
                      return (
                        <span key={s.id} className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-50 text-amber-700">
                          {s.name} - {s.level}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
