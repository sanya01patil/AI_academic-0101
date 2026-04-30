import React from 'react';
import { cn } from '../lib/utils';

interface RiskMeterProps {
  score: number;
  size?: 'lg' | 'sm';
}

export const RiskMeter: React.FC<RiskMeterProps> = ({ score, size = 'sm' }) => {
  const color = score >= 70 ? 'hsl(var(--risk-high))' : score >= 40 ? 'hsl(var(--risk-medium))' : 'hsl(var(--risk-low))';
  const radius = size === 'lg' ? 45 : 20;
  const stroke = size === 'lg' ? 8 : 4;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const containerSize = size === 'lg' ? 'w-32 h-32' : 'w-12 h-12';

  return (
    <div className={cn("relative flex items-center justify-center", containerSize)}>
      <svg className="transform -rotate-90 w-full h-full">
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="currentColor"
          strokeWidth={stroke}
          fill="transparent"
          className="text-surface-light border-0.5 border-border"
        />
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-1000"
        />
      </svg>
      <span className={cn(
        "absolute font-mono font-bold text-text-primary",
        size === 'lg' ? "text-3xl" : "text-[10px]"
      )}>
        {score}
      </span>
    </div>
  );
};

interface RiskPillProps {
  score: number;
}

export const RiskPill: React.FC<RiskPillProps> = ({ score }) => {
  const label = score >= 70 ? 'High risk' : score >= 40 ? 'Medium risk' : 'Low risk';
  const colorClass = score >= 70 
    ? 'bg-risk-high-bg text-risk-high border-risk-high/10' 
    : score >= 40 
      ? 'bg-risk-medium-bg text-risk-medium border-risk-medium/10' 
      : 'bg-risk-low-bg text-risk-low border-risk-low/10';

  return (
    <div className={cn(
      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-0.5 whitespace-nowrap",
      colorClass
    )}>
      {label}
    </div>
  );
};
