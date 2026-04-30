import React from 'react';
import { Search, Filter, Download } from 'lucide-react';
import { SubmissionTable } from './SubmissionTable';
import { useFilterStore } from '../../store/filters';
import { cn } from '../../lib/utils';

export const SubmissionsRegistry = () => {
  const { riskFilter, setRiskFilter } = useFilterStore();

  return (
    <div className="p-8 space-y-8 bg-background">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Forensic registry</h1>
          <p className="text-xs text-text-muted mt-1 uppercase font-black tracking-widest">Authorized monitoring node — Session: Active</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-surface-light border-0.5 border-border p-1 rounded-md">
            {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRiskFilter(r)}
                className={cn(
                  'px-6 py-1.5 rounded text-[10px] font-black uppercase tracking-widest transition-all',
                  riskFilter === r 
                    ? 'bg-surface text-brand border-0.5 border-border shadow-sm' 
                    : 'text-text-muted hover:text-text-primary'
                )}
              >
                {r.toLowerCase()}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-surface border-0.5 border-border text-text-secondary rounded-md text-xs font-bold hover:bg-surface-light transition-all">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      <div className="bg-surface border-0.5 border-border rounded-panel overflow-hidden">
        <div className="px-6 py-4 border-b-0.5 border-border bg-surface-light/30 flex items-center justify-between">
          <div className="relative w-96">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
            <input 
              type="text" 
              placeholder="Search by student identity or artifact ID..." 
              className="w-full bg-surface border-0.5 border-border rounded-md pl-12 pr-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand/20 transition-all"
            />
          </div>
          <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-risk-high" />
              <span>Critical thresholds</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-risk-medium" />
              <span>Elevated risks</span>
            </div>
          </div>
        </div>
        <SubmissionTable />
      </div>
    </div>
  );
};
