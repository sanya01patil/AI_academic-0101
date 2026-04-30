import React from 'react';
import { Shield, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export const MyRiskCard = () => {
  const indicators = [
    { label: "AI writing pattern probability", value: "0.04%", status: "low", color: "bg-risk-low" },
    { label: "Linguistic style consistency", value: "98.2%", status: "high", color: "bg-risk-low" },
    { label: "Institutional baseline alignment", value: "Verified", status: "verified", color: "bg-risk-low" },
    { label: "Temporal submission pattern", value: "Typical", status: "typical", color: "bg-risk-low" },
  ];

  return (
    <div className="bg-surface border-0.5 border-border rounded-panel p-10 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-brand-light/50 rounded-md flex items-center justify-center text-brand">
            <Shield size={24} strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-primary tracking-tight">Writing Integrity Profile</h2>
            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mt-1">Verified forensic baseline</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-risk-low-bg text-risk-low rounded-md border-0.5 border-risk-low/20 text-[10px] font-black uppercase tracking-widest">
          <CheckCircle2 size={14} /> Account verified
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {indicators.map((ind, idx) => (
          <div key={idx} className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold text-text-secondary uppercase tracking-widest">{ind.label}</span>
              <span className="text-sm font-mono font-bold text-risk-low">
                {ind.value}
              </span>
            </div>
            <div className="h-1.5 w-full bg-surface-light border-0.5 border-border rounded-full overflow-hidden">
              <div className={cn("h-full w-full rounded-full transition-all duration-1000", ind.color)} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-surface-light p-6 rounded-md border-0.5 border-border border-l-4 border-l-brand">
        <p className="text-sm text-text-secondary leading-relaxed italic font-medium">
          "Your current writing profile shows high stability relative to your established institutional baseline. 
          Linguistic markers remain consistent across multi-session analytical passes. 
          No anomalous style shifts detected."
        </p>
      </div>
    </div>
  );
};
