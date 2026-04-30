import { DashboardTopBar } from './DashboardTopBar';
import { TeachingView } from './TeachingView';
import { AdminView } from './AdminView';
import { useViewStore } from '../../store/view';
import { CourseSidebar } from './CourseSidebar';
import { cn } from '../../lib/utils';

export const Dashboard = () => {
  const { dashboardView } = useViewStore();

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden selection:bg-brand/10 selection:text-brand">
      <DashboardTopBar />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar: Only in Teaching View */}
        {dashboardView === 'teaching' && (
          <aside className="w-64 h-full bg-surface border-r-0.5 border-border shrink-0 hidden md:block">
            <CourseSidebar />
          </aside>
        )}

        <main className="flex-1 overflow-y-auto relative">
          {dashboardView === 'teaching' ? <TeachingView /> : <AdminView />}
        </main>
      </div>
    </div>
  );
};
