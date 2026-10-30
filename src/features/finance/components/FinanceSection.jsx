export default function FinanceSection({ title, icon: Icon, children }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        {Icon && <Icon size={17} className="text-emerald-600" />}
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
      </div>
      {children}
    </div>
  );
}
