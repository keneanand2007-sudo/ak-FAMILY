import { Bell, Mail, Smartphone, MessageSquare, Calendar, GraduationCap, FileText, Wallet, X, Clock, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useFamilyStore } from '../../family/store';
import { useHealthStore } from '../../health/store';
import { useEducationStore } from '../../education/store';
import { useDocumentsStore } from '../../documents/store';
import { useFinanceStore } from '../../finance/store';
import { useAlertsStore } from '../store';
import { buildAlerts } from '../utils/aggregateAlerts';

var TYPE_ICON = {
  Medical: Calendar,
  Education: GraduationCap,
  Documents: FileText,
  Finance: Wallet,
};

var COLOR_CLASSES = {
  rose: 'bg-rose-50 text-rose-600 border-rose-100',
  amber: 'bg-amber-50 text-amber-600 border-amber-100',
  sky: 'bg-sky-50 text-sky-600 border-sky-100',
  emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
};

function getPriority(daysLeft) {
  if (daysLeft <= 2) return 'critical';
  if (daysLeft <= 7) return 'important';
  return 'info';
}

var PRIORITY_CONFIG = {
  critical: { label: 'Critical', icon: AlertCircle, color: 'text-red-600' },
  important: { label: 'Important', icon: AlertTriangle, color: 'text-amber-600' },
  info: { label: 'Upcoming', icon: Info, color: 'text-blue-600' },
};

export default function AlertsPage() {
  var members = useFamilyStore(function (s) { return s.members; });
  var healthData = useHealthStore(function (s) { return s.healthData; });
  var educationData = useEducationStore(function (s) { return s.educationData; });
  var documents = useDocumentsStore(function (s) { return s.documents; });
  var financeStore = useFinanceStore();
  var alertsStore = useAlertsStore();
  var preferences = alertsStore.preferences;

  var financeData = { budget: financeStore.budget, expenses: financeStore.expenses };
  var allAlerts = buildAlerts(members, healthData, educationData, documents, financeData);
  var activeAlerts = allAlerts.filter(function (a) { return alertsStore.isActive(a.id); });

  var grouped = { critical: [], important: [], info: [] };
  activeAlerts.forEach(function (a) {
    var priority = getPriority(a.daysLeft);
    grouped[priority].push(a);
  });

  function renderGroup(priorityKey) {
    var config = PRIORITY_CONFIG[priorityKey];
    var Icon = config.icon;
    var items = grouped[priorityKey];
    if (items.length === 0) return null;

    return (
      <div key={priorityKey} className="mb-5">
        <p className={'text-xs font-semibold uppercase tracking-wide mb-2 flex items-center gap-1.5 ' + config.color}>
          <Icon size={13} />
          <span>{config.label} ({items.length})</span>
        </p>
        <div className="space-y-2">
          {items.map(function (a) {
            var TypeIcon = TYPE_ICON[a.type] || Bell;
            var colorClass = COLOR_CLASSES[a.color] || COLOR_CLASSES.sky;
            return (
              <div key={a.id} className={'flex items-center justify-between border rounded-xl p-3 ' + colorClass}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/60 flex items-center justify-center shrink-0">
                    <TypeIcon size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{a.title}</p>
                    {a.date && <p className="text-xs text-slate-500">{a.date}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold whitespace-nowrap">
                    {a.daysLeft === 0 ? 'Today' : a.daysLeft + ' days left'}
                  </span>
                  <button
                    onClick={function () { alertsStore.snoozeAlert(a.id, 24); }}
                    className="p-1.5 rounded-lg hover:bg-white/60 transition"
                    title="Snooze for 24 hours"
                  >
                    <Clock size={13} />
                  </button>
                  <button
                    onClick={function () { alertsStore.dismissAlert(a.id); }}
                    className="p-1.5 rounded-lg hover:bg-white/60 transition"
                    title="Dismiss"
                  >
                    <X size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-10 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Alerts Center</h1>
      <p className="text-slate-500 text-sm mb-8">
        Everything important coming up, gathered from Health, Education, Documents and Finance.
      </p>

      <div className="relative overflow-hidden rounded-2xl p-5 shadow-md shadow-orange-200/50 bg-gradient-to-br from-orange-500 to-orange-700 text-white mb-8">
        <Bell size={50} className="absolute -right-2 -bottom-2 text-white/15" />
        <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center mb-2">
          <Bell size={16} />
        </div>
        <p className="text-2xl font-bold leading-none">{activeAlerts.length} Active Alerts</p>
        <p className="text-xs text-orange-100 mt-1">{grouped.critical.length} critical - {grouped.important.length} important - {grouped.info.length} upcoming</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 mb-6">
        <h2 className="text-sm font-semibold text-slate-900 mb-4">By Priority</h2>
        {activeAlerts.length === 0 ? (
          <p className="text-sm text-slate-400">No alerts right now. Everything looks under control.</p>
        ) : (
          <div>
            {renderGroup('critical')}
            {renderGroup('important')}
            {renderGroup('info')}
          </div>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        <h2 className="text-sm font-semibold text-slate-900 mb-4">Notification Channels</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell size={16} className="text-slate-500" />
              <span className="text-sm text-slate-700">In-app notifications</span>
            </div>
            <input
              type="checkbox"
              checked={preferences.inApp}
              onChange={function (e) { alertsStore.setPreference('inApp', e.target.checked); }}
              className="w-4 h-4 accent-orange-600"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-slate-500" />
              <span className="text-sm text-slate-700">Email</span>
            </div>
            <input
              type="checkbox"
              checked={preferences.email}
              onChange={function (e) { alertsStore.setPreference('email', e.target.checked); }}
              className="w-4 h-4 accent-orange-600"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone size={16} className="text-slate-500" />
              <span className="text-sm text-slate-700">Push notifications</span>
            </div>
            <input
              type="checkbox"
              checked={preferences.push}
              onChange={function (e) { alertsStore.setPreference('push', e.target.checked); }}
              className="w-4 h-4 accent-orange-600"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare size={16} className="text-slate-500" />
              <span className="text-sm text-slate-700">SMS (critical only)</span>
            </div>
            <input
              type="checkbox"
              checked={preferences.sms}
              onChange={function (e) { alertsStore.setPreference('sms', e.target.checked); }}
              className="w-4 h-4 accent-orange-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
