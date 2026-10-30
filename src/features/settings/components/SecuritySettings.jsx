import { Lock, ShieldCheck, Smartphone } from 'lucide-react';

export default function SecuritySettings() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <Lock size={17} className="text-slate-600" />
        <h2 className="text-sm font-semibold text-slate-900">Security</h2>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between border border-slate-100 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center">
              <ShieldCheck size={16} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">Multi-Factor Authentication</p>
              <p className="text-xs text-slate-500">Add an extra layer of security to your account</p>
            </div>
          </div>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">
            Coming Soon
          </span>
        </div>

        <div className="flex items-center justify-between border border-slate-100 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center">
              <Smartphone size={16} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">Active Sessions</p>
              <p className="text-xs text-slate-500">Manage devices signed in to your account</p>
            </div>
          </div>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">
            Coming Soon
          </span>
        </div>
      </div>

      <p className="text-xs text-slate-400 mt-4">
        These features require a backend and will be enabled in a future phase.
      </p>
    </div>
  );
}
