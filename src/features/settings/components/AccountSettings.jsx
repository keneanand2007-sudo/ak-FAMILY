import { User } from 'lucide-react';
import { useAuthStore } from '../../auth/store';

export default function AccountSettings() {
  const { currentUser } = useAuthStore();

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <User size={17} className="text-slate-600" />
        <h2 className="text-sm font-semibold text-slate-900">Account</h2>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center font-bold text-2xl">
          {currentUser && currentUser.name ? currentUser.name.charAt(0).toUpperCase() : '?'}
        </div>
        <div>
          <p className="text-base font-semibold text-slate-900">{currentUser && currentUser.name}</p>
          <p className="text-sm text-slate-500">{currentUser && currentUser.email}</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-slate-50 rounded-xl p-4">
          <p className="text-xs text-slate-400 mb-0.5">Full Name</p>
          <p className="text-sm font-medium text-slate-900">{currentUser && currentUser.name}</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-4">
          <p className="text-xs text-slate-400 mb-0.5">Email</p>
          <p className="text-sm font-medium text-slate-900">{currentUser && currentUser.email}</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-4">
          <p className="text-xs text-slate-400 mb-0.5">User ID</p>
          <p className="text-sm font-medium text-slate-900">{currentUser && currentUser.id}</p>
        </div>
      </div>

      <p className="text-xs text-slate-400 mt-4">
        Editing name and email will be available once account sync is connected to a backend.
      </p>
    </div>
  );
}
