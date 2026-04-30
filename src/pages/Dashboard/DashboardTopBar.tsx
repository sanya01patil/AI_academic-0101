import React from 'react';
import { 
  Bell, ChevronDown, LogOut, User, Settings, HelpCircle, 
  Database, Moon, Sun, Shield
} from 'lucide-react';
import { useViewStore } from '../../store/view';
import { useAlertStore } from '../../store/alerts';
import { useAuthStore } from '../../store/auth';
import { ViewToggle } from '../../components/ViewToggle';
import { LiveAlertDot } from '../../components/LiveAlertDot';
import { StudentAvatar } from '../../components/StudentAvatar';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';

export const DashboardTopBar = () => {
  const navigate = useNavigate();
  const { dashboardView, setDashboardView } = useViewStore();
  const { unreadCount } = useAlertStore();
  const { user, logout } = useAuthStore();
  const [isDark, setIsDark] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 border-b-0.5 border-border bg-surface px-8 flex items-center justify-between z-50 shrink-0">
      {/* Left: Logo & Course Selector */}
      <div className="flex items-center gap-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-white">
            <Shield size={18} strokeWidth={2} />
          </div>
          <span className="text-xl font-bold text-text-primary tracking-tight">IntegriGuard</span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-light border-0.5 border-border rounded-md cursor-pointer hover:bg-surface-border/20 transition-all">
          <span className="text-xs font-bold text-text-primary">CS301 — Advanced Algorithms</span>
          <ChevronDown size={14} className="text-text-muted" />
        </div>
      </div>

      {/* Center: View Toggle */}
      <div className="flex-1 flex justify-center px-4">
        <ViewToggle 
          view={dashboardView} 
          onChange={setDashboardView} 
        />
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 border-r-0.5 border-border pr-6">
          <button 
            onClick={() => setIsDark(!isDark)}
            className="p-2 text-text-muted hover:text-brand transition-colors"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button className="relative p-2 text-text-muted hover:text-brand transition-colors">
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1">
                <LiveAlertDot />
              </span>
            )}
          </button>
        </div>

        <div className="group relative">
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="flex flex-col items-end mr-1">
              <p className="text-xs font-bold text-text-primary leading-none">{user?.name || 'Prof. Anirudh Iyer'}</p>
              <p className="text-[10px] font-black text-brand uppercase tracking-widest mt-1">Faculty-Admin</p>
            </div>
            <StudentAvatar name={user?.name || 'F'} riskLevel="none" size="md" />
          </div>
          
          <div className="absolute top-full right-0 mt-2 w-64 bg-surface border-0.5 border-border rounded-md py-4 opacity-0 scale-95 invisible group-hover:opacity-100 group-hover:scale-100 group-hover:visible transition-all shadow-xl z-50">
            <div className="px-6 pb-4 border-b-0.5 border-border mb-4">
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Authenticated user</p>
              <p className="text-sm font-bold text-text-primary">{user?.name}</p>
              <p className="text-[10px] text-text-muted truncate mt-0.5 font-mono">{user?.email}</p>
            </div>
            <div className="space-y-1 px-2">
              <button className="w-full px-4 py-2 text-left text-xs font-bold text-text-muted hover:text-text-primary hover:bg-surface-light rounded transition-colors flex items-center gap-3">
                <User size={16} /> Identity profile
              </button>
              <button className="w-full px-4 py-2 text-left text-xs font-bold text-text-muted hover:text-text-primary hover:bg-surface-light rounded transition-colors flex items-center gap-3">
                <Settings size={16} /> System config
              </button>
            </div>
            <div className="h-px bg-border my-4 mx-2" />
            <div className="px-2">
              <button 
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-xs font-black text-risk-high hover:bg-risk-high-bg rounded transition-colors flex items-center gap-3 uppercase tracking-widest"
              >
                <LogOut size={16} /> Terminate session
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

