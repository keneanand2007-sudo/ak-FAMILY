import { useState } from 'react';
import { Shield, Grid3x3, History, Sparkles, AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useFamilyStore } from '../../family/store';
import { usePermissionsStore } from '../store';
import RoleAssignment from '../components/RoleAssignment';
import PermissionMatrix from '../components/PermissionMatrix';
import AuditLogView from '../components/AuditLogView';
import { buildPermissionInsights } from '../utils/permissionEnforcement';

var TABS = [
  { key: 'roles', label: 'Role Assignment', icon: Shield },
  { key: 'matrix', label: 'Permission Matrix', icon: Grid3x3 },
  { key: 'audit', label: 'Audit Log', icon: History },
];

var SEVERITY_STYLE = {
  critical: { icon: AlertCircle, color: 'bg-red-50 text-red-700 border-red-100' },
  important: { icon: AlertTriangle, color: 'bg-amber-50 text-amber-700 border-amber-100' },
  good: { icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
};

export default function PermissionsPage() {
  var activeTabState = useState('roles');
  var activeTab = activeTabState[0];
  var setActiveTab = activeTabState[1];

  var members = useFamilyStore(function (s) { return s.members; });
  var permissionsStore = usePermissionsStore();
  var roles = permissionsStore.roles;
  var auditLog = permissionsStore.auditLog;

  var insights = buildPermissionInsights(members, roles, auditLog);

  return (
    <div className="p-6 sm:p-10 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Privacy & Permissions</h1>
      <p className="text-slate-500 text-sm mb-8">
        Control who can view and edit family information. Not every member gets access to everything.
      </p>

      {insights.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={17} className="text-slate-600" />
            <h2 className="text-sm font-semibold text-slate-900">Security Insights</h2>
          </div>
          <div className="space-y-2">
            {insights.map(function (ins) {
              var style = SEVERITY_STYLE[ins.severity];
              var Icon = style.icon;
              return (
                <div key={ins.id} className={'flex items-start gap-2 border rounded-xl p-3 ' + style.color}>
                  <Icon size={15} className="mt-0.5 shrink-0" />
                  <p className="text-sm">{ins.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex overflow-x-auto gap-2 mb-5">
        {TABS.map(function (t) {
          var Icon = t.icon;
          var isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={function () { setActiveTab(t.key); }}
              className={
                isActive
                  ? 'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition bg-slate-800 text-white shadow-sm'
                  : 'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }
            >
              <Icon size={15} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {activeTab === 'roles' && <RoleAssignment />}
      {activeTab === 'matrix' && <PermissionMatrix />}
      {activeTab === 'audit' && <AuditLogView />}
    </div>
  );
}
