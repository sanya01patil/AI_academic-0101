import React from 'react';
import { 
  LayoutDashboard, Users, ShieldAlert, BarChart3, 
  Settings, LogOut, ChevronLeft, ChevronRight,
  Database, Activity, FileText
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useViewStore } from '../../store/view';
import { useAuthStore } from '../../store/auth';
import { cn } from '../../lib/utils';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { view, setView } = useViewStore();
  const { logout } = useAuthStore();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', id: 'dashboard' },
    { icon: Users, label: 'Students', path: '/students', id: 'students' },
    { icon: ShieldAlert, label: 'Alerts', path: '/alerts', id: 'alerts' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics', id: 'analytics' },
    { icon: Database, label: 'Audit Log', path: '/audit', id: 'audit', adminOnly: true },
    { icon: Activity, label: 'Model Health', path: '/health', id: 'health', adminOnly: true },
  ];

  const filteredItems = navItems.filter(item => !item.adminOnly || view === 'admin');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-full py-6">
      {/* Brand Header */}
      <div className={cn("px-6 flex items-center gap-3 mb-10 transition-all", collapsed && "px-4")}>
        <div className="w-8 h-8 bg-brand rounded-md flex items-center justify-center text-white shrink-0">
          <ShieldAlert size={18} />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-bold text-sm text-text-primary tracking-tight">IntegriGuard</span>
            <span className="text-[8px] font-black text-brand uppercase tracking-[0.2em] -mt-1">Core engine</span>
          </div>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-4 space-y-1.5">
        {filteredItems.map(item => {
          const active = location.pathname === item.path || (item.path === '/dashboard' && location.pathname.startsWith('/dashboard'));
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-bold transition-all group",
                active 
                  ? "bg-brand-light text-brand" 
                  : "text-text-muted hover:text-text-primary hover:bg-surface-light"
              )}
            >
              <item.icon size={18} className={cn("shrink-0", active ? "text-brand" : "text-text-muted group-hover:text-text-primary")} />
              {!collapsed && <span>{item.label}</span>}
              {active && !collapsed && <div className="ml-auto w-1 h-1 rounded-full bg-brand" />}
            </button>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="px-4 pt-6 border-t-0.5 border-border space-y-1.5">
        {!collapsed && (
          <div className="px-3 py-2 mb-2 bg-surface-light rounded-md">
            <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-1">Current view</p>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-brand uppercase">{view}</span>
              <button 
                onClick={() => setView(view === 'teaching' ? 'admin' : 'teaching')}
                className="text-[9px] font-black text-text-muted hover:text-brand transition-colors"
              >
                Switch
              </button>
            </div>
          </div>
        )}
        
        <button
          onClick={() => navigate('/settings')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-bold text-text-muted hover:text-text-primary hover:bg-surface-light transition-all"
        >
          <Settings size={18} className="shrink-0" />
          {!collapsed && <span>Settings</span>}
        </button>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-bold text-text-muted hover:text-risk-high hover:bg-risk-high-bg transition-all"
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>

        {/* Collapse Toggle */}
        <button
          onClick={onToggle}
          className="w-full mt-4 flex items-center justify-center p-2 text-text-muted hover:text-text-primary transition-colors border-t-0.5 border-border pt-6"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </div>
  );
};
