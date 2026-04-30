import React from 'react';
import { cn } from '../lib/utils';

export const RiskPill = ({ score }: { score: number }) => {
  const isHigh = score >= 70;
  const isMedium = score >= 40 && score < 70;
  const isLow = score < 40;

  return (
    <span className={cn(
      'px-3 py-1 rounded-full text-xs font-bold border-0.5 font-mono',
      isHigh && 'bg-risk-high-bg text-risk-high border-risk-high/20',
      isMedium && 'bg-risk-medium-bg text-risk-medium border-risk-medium/20',
      isLow && 'bg-risk-low-bg text-risk-low border-risk-low/20'
    )}>
      {isHigh ? 'High' : isMedium ? 'Medium' : 'Low'} risk ({score})
    </span>
  );
};
