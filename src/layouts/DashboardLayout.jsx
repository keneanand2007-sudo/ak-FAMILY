import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, Wallet, HeartPulse, GraduationCap,
  MapPin, FileText, Bell, Bot, Shield, Settings, LogOut,
} from 'lucide-react';
import { useAuthStore } from '../features/auth/store';
import { useFamilyStore } from '../features/family/store';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-blue-400', activeBorder: 'bg-blue-500' },
  { to: '/members', label: 'Members', icon: Users, color: 'text-blue-400', activeBorder: 'bg-blue-500' },
  { to: '/finance', label: 'Finance', icon: Wallet, color: 'text-emerald-400', activeBorder: 'bg-emerald-500' },
  { to: '/health', label: 'Health & Emergency', icon: HeartPulse, color: 'text-rose-400', activeBorder: 'bg-rose-500' },
  { to: '/education', label: 'Education', icon: GraduationCap, color: 'text-amber-400', activeBorder: 'bg-amber-500' },
  { to: '/places', label: 'Places', icon: MapPin, color: 'text-violet-400', activeBorder: 'bg-violet-500' },
  { to: '/documents', label: 'Documents', icon: FileText, color: 'text-sky-400', activeBorder: 'bg-sky-500' },
  { to: '/alerts', label: 'Alerts', icon: Bell, color: 'text-orange-400', activeBorder: 'bg-orange-500' },
  { to: '/ai', label: 'Family AI', icon: Bot, color: 'text-indigo-400', activeBorder: 'bg-indigo-500' },
  { to: '/permissions', label: 'Privacy & Permissions', icon: Shield, color: 'text-slate-400', activeBorder: 'bg-slate-400' },
  { to: '/settings', label: 'Settings', icon: Settings, color: 'text-slate-400', activeBorder: 'bg-slate-400' },
];

function getTheme(pathname) {
  if (pathname.indexOf('/finance') === 0) return { bg: 'from-emerald-100 via-emerald-50/60 to-slate-50', blob: 'bg-emerald-300/40' };
  if (pathname.indexOf('/health') === 0 || pathname.indexOf('/member') === 0) return { bg: 'from-rose-100 via-rose-50/60 to-slate-50', blob: 'bg-rose-300/40' };
  if (pathname.indexOf('/education') === 0) return { bg: 'from-amber-100 via-amber-50/60 to-slate-50', blob: 'bg-amber-300/40' };
  if (pathname.indexOf('/places') === 0) return { bg: 'from-violet-100 via-violet-50/60 to-slate-50', blob: 'bg-violet-300/40' };
  if (pathname.indexOf('/documents') === 0) return { bg: 'from-sky-100 via-sky-50/60 to-slate-50', blob: 'bg-sky-300/40' };
  if (pathname.indexOf('/alerts') === 0) return { bg: 'from-orange-100 via-orange-50/60 to-slate-50', blob: 'bg-orange-300/40' };
  if (pathname.indexOf('/ai') === 0) return { bg: 'from-indigo-100 via-indigo-50/60 to-slate-50', blob: 'bg-indigo-300/40' };
  if (pathname.indexOf('/permissions') === 0 || pathname.indexOf('/settings') === 0) return { bg: 'from-slate-200 via-slate-100/60 to-slate-50', blob: 'bg-slate-300/40' };
  return { bg: 'from-blue-100 via-blue-50/60 to-slate-50', blob: 'bg-blue-300/40' };
}

export default function DashboardLayout({ children }) {
  const { currentUser, logout } = useAuthStore();
  const { family } = useFamilyStore();
  const location = useLocation();
  const theme = getTheme(location.pathname);

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col shrink-0 hidden md:flex">
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 text-white font-bold flex items-center justify-center shadow-sm shadow-blue-900">
              F
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-none">FAMILY OS</p>
              <p className="text-xs text-slate-400 mt-0.5">{family && family.name}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {NAV_ITEMS.map(({ to, label, icon: Icon, color, activeBorder }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                isActive
                  ? 'relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 bg-white/10 text-white'
                  : 'relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 text-slate-300 hover:bg-white/5 hover:text-white hover:translate-x-0.5'
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className={'absolute left-0 top-1.5 bottom-1.5 w-1 rounded-full ' + activeBorder} />
                  )}
                  <Icon size={17} className={color} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-2.5 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-xs font-semibold">
              {currentUser && currentUser.name ? currentUser.name.charAt(0).toUpperCase() : '?'}
            </div>
            <p className="text-sm font-medium text-slate-200 truncate">{currentUser && currentUser.name}</p>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-150"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      <main className={'relative flex-1 overflow-y-auto animate-fadein bg-gradient-to-br ' + theme.bg}>
        <div className={'pointer-events-none fixed top-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full blur-3xl ' + theme.blob} />
        <div className="relative">{children}</div>
      </main>
    </div>
  );
}
