import { useState } from 'react';
import { StatBar } from './StatBar';
import { SubmissionTable } from './SubmissionTable';
import { AlertsFeed } from './AlertsFeed';
import { FacultyWorkflow } from './FacultyWorkflow';
import { cn } from '../../lib/utils';
import { EthicsReminder } from '../../components/EthicsReminder';
import { Search, Activity } from 'lucide-react';

export const TeachingView = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'browser'>('dashboard');

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* Sub-navigation Tabs */}
      <div className="flex border-b-0.5 border-border px-8 shrink-0 bg-surface">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={cn(
            'px-6 py-4 text-xs font-black uppercase tracking-[0.2em] border-b-2 transition-all',
            activeTab === 'dashboard' ? 'text-brand border-brand' : 'text-text-muted border-transparent hover:text-text-primary'
          )}
        >
          Control center
        </button>
        <button
          onClick={() => setActiveTab('browser')}
          className={cn(
            'px-6 py-4 text-xs font-black uppercase tracking-[0.2em] border-b-2 transition-all',
            activeTab === 'browser' ? 'text-brand border-brand' : 'text-text-muted border-transparent hover:text-text-primary'
          )}
        >
          Class browser
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === 'dashboard' ? (
          <div className="flex-1 flex min-h-0 overflow-hidden">
            {/* Main Stats + Table */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                <StatBar />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-text-primary uppercase tracking-widest flex items-center gap-2">
                      <Search size={16} className="text-brand" /> Active submission monitor
                    </h2>
                    <div className="flex items-center gap-2 text-[10px] text-text-muted font-bold uppercase tracking-widest">
                      <div className="w-1.5 h-1.5 rounded-full bg-risk-low animate-pulse" />
                      Live telemetry active
                    </div>
                  </div>
                  <div className="bg-surface border-0.5 border-border rounded-panel overflow-hidden">
                    <SubmissionTable />
                  </div>
                </div>
              </div>
              
              {/* Pinned Ethics Reminder */}
              <div className="shrink-0 p-4 bg-surface border-t-0.5 border-border">
                <EthicsReminder />
              </div>
            </div>

            {/* Side Panel: Alerts (Lg+ screens) */}
            <aside className="w-80 border-l-0.5 border-border bg-surface shrink-0 hidden xl:flex flex-col">
              <div className="h-16 flex items-center justify-between px-6 border-b-0.5 border-border shrink-0">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-text-primary">Alert feed</h3>
                <Activity size={16} className="text-risk-high" />
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <AlertsFeed />
              </div>
            </aside>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <FacultyWorkflow />
          </div>
        )}
      </div>
    </div>
  );
};

// export default TeachingView; (Removed in favor of named export)
