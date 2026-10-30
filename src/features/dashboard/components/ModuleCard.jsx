import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ModuleCard({ icon: Icon, title, stats, alertCount, alertLabel, gradient, to, comingSoon }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => !comingSoon && navigate(to)}
      disabled={comingSoon}
      className={
        'relative overflow-hidden text-left rounded-2xl p-5 shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-lg ' +
        (comingSoon ? 'bg-slate-100 cursor-not-allowed opacity-70' : 'bg-gradient-to-br ' + gradient + ' text-white')
      }
    >
      <Icon size={70} className={comingSoon ? 'absolute -right-3 -bottom-3 text-slate-300' : 'absolute -right-3 -bottom-3 text-white/15'} />

      <div className="relative">
        <div className={'w-10 h-10 rounded-xl flex items-center justify-center mb-3 ' + (comingSoon ? 'bg-slate-200 text-slate-400' : 'bg-white/20')}>
          <Icon size={18} />
        </div>

        <p className={'font-bold text-base mb-2 ' + (comingSoon ? 'text-slate-500' : 'text-white')}>{title}</p>

        {comingSoon ? (
          <p className="text-xs text-slate-400">Coming soon</p>
        ) : (
          <div className="space-y-0.5 mb-3">
            {stats.map((s, i) => (
              <p key={i} className="text-xs text-white/90">{s}</p>
            ))}
          </div>
        )}

        {!comingSoon && (
          <div className="flex items-center justify-between mt-3">
            {alertCount > 0 ? (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/25">
                {alertCount} {alertLabel}
              </span>
            ) : (
              <span />
            )}
            <span className="flex items-center gap-0.5 text-xs font-medium text-white/90">
              Open <ChevronRight size={13} />
            </span>
          </div>
        )}
      </div>
    </button>
  );
}
