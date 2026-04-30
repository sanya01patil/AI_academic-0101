import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const EthicsReminder: React.FC = () => {
  return (
    <div className="bg-brand-light border-0.5 border-brand/20 p-5 rounded-panel mt-auto">
      <div className="flex items-start gap-4">
        <div className="text-brand shrink-0">
          <ShieldCheck size={20} strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-[10px] font-black text-brand uppercase tracking-widest mb-2">Ethics protocol</p>
          <p className="text-xs text-brand/80 leading-relaxed font-medium">
            These are risk indicators for your review, not determinations of misconduct. All judgements are yours.
          </p>
        </div>
      </div>
    </div>
  );
};
