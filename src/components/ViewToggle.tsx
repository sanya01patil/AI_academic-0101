import React from 'react';
import { cn } from '../lib/utils';
import { DashboardView } from '../store/view';

interface ViewToggleProps {
  view: DashboardView;
  onChange: (view: DashboardView) => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ view, onChange }) => {
  return (
    <div className="flex bg-surface-light border-0.5 border-border rounded-lg p-1">
      <button
        onClick={() => onChange('teaching')}
        className={cn(
          'px-6 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all',
          view === 'teaching'
            ? 'bg-surface text-brand border-0.5 border-border shadow-sm'
            : 'text-text-muted hover:text-text-primary'
        )}
      >
        Teaching view
      </button>
      <button
        onClick={() => onChange('admin')}
        className={cn(
          'px-6 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all',
          view === 'admin'
            ? 'bg-surface text-brand border-0.5 border-border shadow-sm'
            : 'text-text-muted hover:text-text-primary'
        )}
      >
        Admin view
      </button>
    </div>
  );
};
