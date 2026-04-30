import React from 'react';
import { cn } from '../lib/utils';

interface SignalBarProps {
  label: string;
  value: number;
  weight: number;
}

export const SignalBar = ({ label, value, weight }: SignalBarProps) => {
  const getBarColor = (v: number) => {
    if (v >= 70) return 'bg-risk-high';
    if (v >= 40) return 'bg-risk-medium';
    return 'bg-brand';
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-xs">
        <span className="font-bold text-text-primary">{label}</span>
        <div className="flex items-center gap-3">
          <span className="font-mono font-bold text-brand">{value}%</span>
          <span className="text-[10px] text-text-muted uppercase tracking-widest opacity-60">
            Weight: {(weight * 100).toFixed(0)}%
          </span>
        </div>
      </div>
      <div className="h-2 w-full bg-surface-light border-0.5 border-border rounded-full overflow-hidden">
        <div 
          className={cn('h-full transition-all duration-1000 ease-out', getBarColor(value))} 
          style={{ width: `${value}%` }} 
        />
      </div>
    </div>
  );
};
