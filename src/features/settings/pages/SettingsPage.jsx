import { useState } from 'react';
import { User, Home, Lock, Database } from 'lucide-react';
import AccountSettings from '../components/AccountSettings';
import FamilySettings from '../components/FamilySettings';
import SecuritySettings from '../components/SecuritySettings';
import DataPrivacySettings from '../components/DataPrivacySettings';

const TABS = [
  { key: 'account', label: 'Account', icon: User },
  { key: 'family', label: 'Family', icon: Home },
  { key: 'security', label: 'Security', icon: Lock },
  { key: 'data', label: 'Data & Privacy', icon: Database },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('account');

  return (
    <div className="p-6 sm:p-10 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Settings</h1>
      <p className="text-slate-500 text-sm mb-8">
        Manage your account, family workspace, security and data.
      </p>

      <div className="flex overflow-x-auto gap-2 mb-5">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={
              activeTab === key
                ? 'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition bg-slate-800 text-white shadow-sm'
                : 'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {activeTab === 'account' && <AccountSettings />}
      {activeTab === 'family' && <FamilySettings />}
      {activeTab === 'security' && <SecuritySettings />}
      {activeTab === 'data' && <DataPrivacySettings />}
    </div>
  );
}
