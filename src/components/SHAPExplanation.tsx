import React from 'react';
import { cn } from '../lib/utils';

export interface SignalItem {
  label: string;
  value: number; // 0-100
}

interface SignalBarProps {
  label: string;
  value: number;
}

export const SignalBar: React.FC<SignalBarProps> = ({ label, value }) => {
  // Determine color based on value
  const colorClass = value >= 70 ? 'bg-risk-high' : value >= 40 ? 'bg-risk-medium' : 'bg-risk-low';
  
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-text-muted">
        <span>{label}</span>
        <span className="font-mono">{value}%</span>
      </div>
      <div className="h-1.5 w-full bg-surface-light border-0.5 border-border rounded-full overflow-hidden">
        <div 
          className={cn("h-full transition-all duration-500", colorClass)}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};

interface SHAPExplanationProps {
  text: string;
  signals: SignalItem[];
}

export const SHAPExplanation: React.FC<SHAPExplanationProps> = ({ text, signals }) => {
  return (
    <div className="space-y-6">
      <div className="border-l-2 border-brand bg-brand-light/30 p-5 rounded-r-md">
        <p className="text-sm font-medium text-text-primary leading-relaxed italic">
          "{text}"
        </p>
      </div>
      
      <div className="space-y-4 px-1">
        {signals.map((signal, idx) => (
          <SignalBar 
            key={idx} 
            label={signal.label} 
            value={signal.value} 
          />
        ))}
      </div>
    </div>
  );
};
