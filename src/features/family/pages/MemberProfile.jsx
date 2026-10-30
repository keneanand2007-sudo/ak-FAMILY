import { useState } from 'react';
import { ArrowLeft, User, Wallet, HeartPulse, GraduationCap, MapPin, FileText, Activity, ExternalLink, Eye, Paperclip, TrendingUp, TrendingDown, CalendarCheck, Award, Droplet, Pill, PhoneCall, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFamilyStore } from '../store';
import { useDocumentsStore } from '../../documents/store';
import { useFinanceStore } from '../../finance/store';
import { useEducationStore } from '../../education/store';
import { useHealthStore } from '../../health/store';
import MemberLiveMap from '../../tracking/components/MemberLiveMap';
import LocationInputForm from '../../tracking/components/LocationInputForm';

var TABS = [
  { key: 'Overview', icon: User },
  { key: 'Health', icon: HeartPulse },
  { key: 'Education', icon: GraduationCap },
  { key: 'Finance', icon: Wallet },
  { key: 'Places', icon: MapPin },
  { key: 'Documents', icon: FileText },
  { key: 'Activity', icon: Activity },
];

var TAB_COLORS = {
  Overview: 'text-blue-600 border-blue-600',
  Health: 'text-rose-600 border-rose-600',
  Education: 'text-amber-600 border-amber-600',
  Finance: 'text-emerald-600 border-emerald-600',
  Places: 'text-violet-600 border-violet-600',
  Documents: 'text-sky-600 border-sky-600',
  Activity: 'text-slate-600 border-slate-600',
};

var CATEGORY_COLORS = {
  Identity: 'bg-blue-50 text-blue-600',
  Financial: 'bg-emerald-50 text-emerald-600',
  Medical: 'bg-rose-50 text-rose-600',
  Education: 'bg-amber-50 text-amber-600',
  Property: 'bg-violet-50 text-violet-600',
  Insurance: 'bg-indigo-50 text-indigo-600',
  Legal: 'bg-slate-100 text-slate-600',
  Certificates: 'bg-yellow-50 text-yellow-600',
  Other: 'bg-slate-100 text-slate-500',
};

export default function MemberProfile({ memberId, onBack }) {
  var members = useFamilyStore(function (s) { return s.members; });
  var documents = useDocumentsStore(function (s) { return s.documents; });
  var financeStore = useFinanceStore();
  var income = financeStore.income;
  var expenses = financeStore.expenses;
  var educationData = useEducationStore(function (s) { return s.educationData; });
  var healthData = useHealthStore(function (s) { return s.healthData; });
  var navigate = useNavigate();
  var activeTabState = useState('Overview');
  var activeTab = activeTabState[0];
  var setActiveTab = activeTabState[1];

  var member = members.find(function (m) { return m.id === memberId; });

  if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500">Member not found.</p>
      </div>
    );
  }

  var memberDocs = documents.filter(function (d) { return d.owner === member.name; });
  var memberIncome = income.filter(function (i) { return i.member === member.name; });
  var memberExpenses = expenses.filter(function (e) { return e.member === member.name; });
  var totalMemberIncome = memberIncome.reduce(function (sum, i) { return sum + Number(i.amount || 0); }, 0);
  var totalMemberExpense = memberExpenses.reduce(function (sum, e) { return sum + Number(e.amount || 0); }, 0);

  var memberEdu = educationData[member.id] || {};
  var eduProfile = memberEdu.profile || {};
  var eduPerformance = memberEdu.performance || [];
  var eduExams = memberEdu.exams || [];
  var eduCertificates = memberEdu.certificates || [];
  var eduSkills = memberEdu.skills || [];
  var latestPerformance = eduPerformance.length > 0 ? eduPerformance[eduPerformance.length - 1].percentage : null;

  var memberHealth = healthData[member.id] || {};
  var healthProfile = memberHealth.profile || {};
  var healthMedications = memberHealth.medications || [];
  var healthAppointments = memberHealth.appointments || [];
  var healthEmergencyContacts = memberHealth.emergencyContacts || [];
  var upcomingAppointments = healthAppointments.filter(function (a) {
    if (!a.date) return false;
    return new Date(a.date) >= new Date(new Date().toDateString());
  });

  function openAttachment(att) {
    var win = window.open();
    if (win) {
      if (att.fileType && att.fileType.indexOf('image') === 0) {
        win.document.write('<img src="' + att.dataUrl + '" style="max-width:100%" />');
      } else {
        win.document.write('<iframe src="' + att.dataUrl + '" style="width:100%;height:100vh;border:none"></iframe>');
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/60 via-slate-50 to-slate-50">
      <div className="max-w-4xl mx-auto p-6 sm:p-10">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 mb-6 transition"
        >
          <ArrowLeft size={15} />
          <span>Back to Dashboard</span>
        </button>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 mb-6 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center font-bold text-2xl shadow-sm">
            {member.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{member.name}</h1>
            <span className="inline-block mt-1 text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600">
              {member.relationship}
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex overflow-x-auto border-b border-slate-100">
            {TABS.map(function (t) {
              var Icon = t.icon;
              var isActive = activeTab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={function () { setActiveTab(t.key); }}
                  className={
                    isActive
                      ? 'flex items-center gap-1.5 px-5 py-3 text-sm font-medium whitespace-nowrap transition border-b-2 ' + TAB_COLORS[t.key]
                      : 'flex items-center gap-1.5 px-5 py-3 text-sm font-medium whitespace-nowrap transition border-b-2 text-slate-500 border-transparent hover:text-slate-800'
                  }
                >
                  <Icon size={15} />
                  <span>{t.key}</span>
                </button>
              );
            })}
          </div>

          <div className="p-6">
            {activeTab === 'Overview' && (
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-slate-400 mb-0.5">Name</p>
                  <p className="text-slate-900 font-medium">{member.name}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-slate-400 mb-0.5">Relationship</p>
                  <p className="text-slate-900 font-medium">{member.relationship}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-slate-400 mb-0.5">Member ID</p>
                  <p className="text-slate-900 font-medium">{member.id}</p>
                </div>
              </div>
            )}

            {activeTab === 'Health' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-semibold text-slate-900">{member.name}'s Health</p>
                  <button
                    onClick={function () { navigate('/health/' + member.id); }}
                    className="text-xs font-medium text-rose-600 hover:text-rose-700 flex items-center gap-1"
                  >
                    <span>Manage full record</span>
                    <ExternalLink size={12} />
                  </button>
                </div>

                {!healthProfile.bloodGroup && healthEmergencyContacts.length === 0 ? (
                  <div className="text-center py-8">
                    <HeartPulse size={28} className="mx-auto mb-3 text-rose-200" />
                    <p className="text-sm text-slate-400">No health profile set for {member.name} yet.</p>
                    <button
                      onClick={function () { navigate('/health/' + member.id); }}
                      className="mt-3 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium transition"
                    >
                      Set Up Health Profile
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      <div className="bg-rose-50 rounded-xl p-4 flex items-start gap-2">
                        <Droplet size={16} className="text-rose-500 mt-0.5" />
                        <div>
                          <p className="text-xs text-rose-600">Blood Group</p>
                          <p className="text-sm font-semibold text-slate-900">{healthProfile.bloodGroup || 'Not set'}</p>
                        </div>
                      </div>
                      <div className="bg-amber-50 rounded-xl p-4 flex items-start gap-2">
                        <AlertTriangle size={16} className="text-amber-500 mt-0.5" />
                        <div>
                          <p className="text-xs text-amber-600">Allergies</p>
                          <p className="text-sm font-semibold text-slate-900">{healthProfile.allergies || 'None recorded'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="border border-slate-100 rounded-xl p-4">
                        <p className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                          <Pill size={13} className="text-sky-500" />
                          <span>Medications ({healthMedications.length})</span>
                        </p>
                        {healthMedications.length === 0 ? (
                          <p className="text-xs text-slate-400">No medications tracked.</p>
                        ) : (
                          <div className="space-y-1.5">
                            {healthMedications.map(function (m) {
                              return (
                                <p key={m.id} className="text-xs text-slate-700">{m.name} - {m.dosage}</p>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      <div className="border border-slate-100 rounded-xl p-4">
                        <p className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                          <PhoneCall size={13} className="text-rose-500" />
                          <span>Emergency Contacts ({healthEmergencyContacts.length})</span>
                        </p>
                        {healthEmergencyContacts.length === 0 ? (
                          <p className="text-xs text-slate-400">No emergency contacts set.</p>
                        ) : (
                          <div className="space-y-1.5">
                            {healthEmergencyContacts.map(function (c) {
                              return (
                                <p key={c.id} className="text-xs text-slate-700">{c.name} - {c.phone}</p>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    {upcomingAppointments.length > 0 && (
                      <div className="mt-4 bg-amber-50 border border-amber-100 rounded-xl p-3">
                        <p className="text-xs font-semibold text-amber-700 mb-1">Upcoming Appointments</p>
                        {upcomingAppointments.map(function (a) {
                          return (
                            <p key={a.id} className="text-xs text-amber-700">{a.doctor} - {a.date}</p>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Education' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-semibold text-slate-900">{member.name}'s Education</p>
                  <button
                    onClick={function () { navigate('/education/' + member.id); }}
                    className="text-xs font-medium text-amber-600 hover:text-amber-700 flex items-center gap-1"
                  >
                    <span>Manage full record</span>
                    <ExternalLink size={12} />
                  </button>
                </div>

                {!eduProfile.institution ? (
                  <div className="text-center py-8">
                    <GraduationCap size={28} className="mx-auto mb-3 text-amber-200" />
                    <p className="text-sm text-slate-400">No education profile set for {member.name} yet.</p>
                    <button
                      onClick={function () { navigate('/education/' + member.id); }}
                      className="mt-3 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium transition"
                    >
                      Set Up Education Profile
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      <div className="bg-amber-50 rounded-xl p-4">
                        <p className="text-xs text-amber-600 mb-1">Institution</p>
                        <p className="text-sm font-semibold text-slate-900">{eduProfile.institution}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{eduProfile.course}</p>
                      </div>
                      <div className="bg-emerald-50 rounded-xl p-4">
                        <p className="text-xs text-emerald-600 mb-1">Latest Performance</p>
                        <p className="text-lg font-bold text-emerald-700">{latestPerformance !== null ? latestPerformance + '%' : 'N/A'}</p>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="border border-slate-100 rounded-xl p-4">
                        <p className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                          <CalendarCheck size={13} className="text-orange-500" />
                          <span>Upcoming Exams</span>
                        </p>
                        {eduExams.length === 0 ? (
                          <p className="text-xs text-slate-400">No exams scheduled.</p>
                        ) : (
                          <div className="space-y-1.5">
                            {eduExams.map(function (ex) {
                              return (
                                <div key={ex.id} className="flex items-center justify-between text-xs">
                                  <span className="text-slate-700">{ex.subject}</span>
                                  <span className="text-slate-400">{ex.date}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      <div className="border border-slate-100 rounded-xl p-4">
                        <p className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                          <Award size={13} className="text-yellow-500" />
                          <span>Certificates</span>
                        </p>
                        {eduCertificates.length === 0 ? (
                          <p className="text-xs text-slate-400">No certificates yet.</p>
                        ) : (
                          <div className="space-y-1.5">
                            {eduCertificates.map(function (c) {
                              return (
                                <p key={c.id} className="text-xs text-slate-700">{c.title}</p>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    {eduSkills.length > 0 && (
                      <div className="mt-4">
                        <p className="text-xs font-semibold text-slate-700 mb-2">Skills</p>
                        <div className="flex flex-wrap gap-1.5">
                          {eduSkills.map(function (s) {
                            return (
                              <span key={s.id} className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                                {s.name}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Finance' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-semibold text-slate-900">{member.name}'s Finance</p>
                  <button
                    onClick={function () { navigate('/finance'); }}
                    className="text-xs font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                  >
                    <span>Manage family finance</span>
                    <ExternalLink size={12} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="bg-emerald-50 rounded-xl p-4">
                    <div className="flex items-center gap-1.5 text-emerald-600 mb-1">
                      <TrendingUp size={14} />
                      <span className="text-xs font-medium">Income</span>
                    </div>
                    <p className="text-lg font-bold text-emerald-700">Rs. {totalMemberIncome.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="bg-rose-50 rounded-xl p-4">
                    <div className="flex items-center gap-1.5 text-rose-600 mb-1">
                      <TrendingDown size={14} />
                      <span className="text-xs font-medium">Expenses</span>
                    </div>
                    <p className="text-lg font-bold text-rose-700">Rs. {totalMemberExpense.toLocaleString('en-IN')}</p>
                  </div>
                </div>

                {memberIncome.length === 0 && memberExpenses.length === 0 ? (
                  <div className="text-center py-8">
                    <Wallet size={28} className="mx-auto mb-3 text-emerald-200" />
                    <p className="text-sm text-slate-400">No transactions linked to {member.name} yet.</p>
                    <button
                      onClick={function () { navigate('/finance'); }}
                      className="mt-3 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition"
                    >
                      Add a Transaction
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {memberIncome.map(function (i) {
                      return (
                        <div key={i.id} className="flex items-center justify-between py-2.5">
                          <p className="text-sm text-slate-700">{i.source} <span className="text-slate-400">({i.frequency})</span></p>
                          <p className="text-sm font-semibold text-emerald-600">+ Rs. {Number(i.amount).toLocaleString('en-IN')}</p>
                        </div>
                      );
                    })}
                    {memberExpenses.map(function (e) {
                      return (
                        <div key={e.id} className="flex items-center justify-between py-2.5">
                          <p className="text-sm text-slate-700">{e.category} <span className="text-slate-400">{e.date ? '(' + e.date + ')' : ''}</span></p>
                          <p className="text-sm font-semibold text-rose-500">- Rs. {Number(e.amount).toLocaleString('en-IN')}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Places' && (
              <div className="space-y-4">
                <MemberLiveMap memberId={member.id} memberName={member.name} />
                <LocationInputForm memberId={member.id} />
              </div>
            )}

            {activeTab === 'Documents' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-semibold text-slate-900">{member.name}'s Documents ({memberDocs.length})</p>
                  <button
                    onClick={function () { navigate('/documents'); }}
                    className="text-xs font-medium text-sky-600 hover:text-sky-700 flex items-center gap-1"
                  >
                    <span>Manage all documents</span>
                    <ExternalLink size={12} />
                  </button>
                </div>

                {memberDocs.length === 0 ? (
                  <div className="text-center py-10">
                    <FileText size={28} className="mx-auto mb-3 text-sky-200" />
                    <p className="text-sm text-slate-400">No documents linked to {member.name} yet.</p>
                    <button
                      onClick={function () { navigate('/documents'); }}
                      className="mt-3 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium transition"
                    >
                      Add a Document
                    </button>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {memberDocs.map(function (doc) {
                      var attachments = doc.attachments || (doc.attachment ? [doc.attachment] : []);
                      var catColor = CATEGORY_COLORS[doc.category] || CATEGORY_COLORS.Other;
                      return (
                        <div key={doc.id} className="border border-slate-100 rounded-xl p-3">
                          <p className="text-sm font-medium text-slate-900">{doc.name}</p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className={'text-xs font-medium px-2 py-0.5 rounded-full ' + catColor}>
                              {doc.category}
                            </span>
                            {doc.expiryDate && (
                              <span className="text-xs text-slate-400">{doc.expiryDate}</span>
                            )}
                          </div>
                          {attachments.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {attachments.map(function (att, i) {
                                return (
                                  <button
                                    key={i}
                                    onClick={function () { openAttachment(att); }}
                                    className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 transition"
                                  >
                                    <Eye size={11} />
                                    <span>View</span>
                                  </button>
                                );
                              })}
                              <span className="flex items-center gap-1 text-xs text-slate-400">
                                <Paperclip size={11} />
                                <span>{attachments.length}</span>
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Activity' && (
              <div className="text-center py-16">
                <Activity size={28} className="mx-auto mb-3 text-slate-300" />
                <p className="text-slate-400 text-sm">Per-member activity timeline coming in a future phase.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
