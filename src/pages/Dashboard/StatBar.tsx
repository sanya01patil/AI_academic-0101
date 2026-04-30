import { useSubmissions } from '../../hooks/useSubmissions';
import { ShieldAlert, AlertTriangle, FileCheck, Activity } from 'lucide-react';
import { cn } from '../../lib/utils';

export const StatBar: React.FC = () => {
  // Mock data for now, would use useSubmissions in real impl
  const stats = [
    { label: 'High risk', value: 6, color: 'text-risk-high', bg: 'bg-risk-high-bg', icon: ShieldAlert },
    { label: 'Medium risk', value: 9, color: 'text-risk-medium', bg: 'bg-risk-medium-bg', icon: AlertTriangle },
    { label: 'Submissions this week', value: 42, color: 'text-text-primary', bg: 'bg-surface-light', icon: FileCheck },
    { label: 'Avg risk score', value: 24, color: 'text-risk-low', bg: 'bg-risk-low-bg', icon: Activity },
  ];

  return (
    <div className="flex flex-col gap-6 px-8 py-6 border-b-0.5 border-border bg-surface shrink-0">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card flex items-center justify-between group">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">{stat.label}</p>
              <p className={cn("text-2xl font-bold font-mono tracking-tight transition-all", stat.color)}>
                {stat.value}{stat.label.includes('Avg') && '%'}
              </p>
            </div>
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-all group-hover:scale-110", stat.bg, stat.color)}>
              <stat.icon size={24} strokeWidth={1.5} />
            </div>
          </div>
        ))}
      </div>

      {/* Risk Distribution Graph */}
      <div className="flex flex-col gap-3 pt-4 border-t-0.5 border-border/50">
        <div className="flex justify-between items-center text-[10px] font-black text-text-muted uppercase tracking-widest">
          <span>Global Risk Distribution</span>
          <span>42 Total Submissions</span>
        </div>
        <div className="w-full h-3 rounded-full flex overflow-hidden border-0.5 border-border/50 bg-surface-light">
          <div 
            className="bg-risk-high hover:opacity-80 transition-opacity cursor-pointer relative group" 
            style={{ width: '14%' }}
            title="High Risk: 14%"
          />
          <div 
            className="bg-risk-medium hover:opacity-80 transition-opacity cursor-pointer border-l-0.5 border-surface" 
            style={{ width: '21%' }}
            title="Medium Risk: 21%"
          />
          <div 
            className="bg-risk-low hover:opacity-80 transition-opacity cursor-pointer border-l-0.5 border-surface" 
            style={{ width: '65%' }}
            title="Safe: 65%"
          />
        </div>
        <div className="flex items-center gap-6 text-[10px] font-bold mt-1">
          <div className="flex items-center gap-2 text-risk-high">
            <div className="w-2 h-2 rounded-full bg-risk-high" /> High (14%)
          </div>
          <div className="flex items-center gap-2 text-risk-medium">
            <div className="w-2 h-2 rounded-full bg-risk-medium" /> Medium (21%)
          </div>
          <div className="flex items-center gap-2 text-risk-low">
            <div className="w-2 h-2 rounded-full bg-risk-low" /> Safe (65%)
          </div>
        </div>
      </div>
    </div>
  );
};
