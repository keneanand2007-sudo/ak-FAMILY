export default function HealthSection({ title, icon: Icon, action, children }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {Icon && <Icon size={17} className="text-rose-600" />}
          <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}
