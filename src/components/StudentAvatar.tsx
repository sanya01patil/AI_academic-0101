import React from 'react';
import { cn } from '../lib/utils';

interface StudentAvatarProps {
  name: string;
  riskLevel: 'high' | 'medium' | 'low' | 'none';
  size?: 'sm' | 'md' | 'lg';
}

export const StudentAvatar: React.FC<StudentAvatarProps> = ({ 
  name, 
  riskLevel,
  size = 'md'
}) => {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  
  const sizeClasses = {
    sm: 'w-6 h-6 text-[8px]',
    md: 'w-10 h-10 text-xs',
    lg: 'w-16 h-16 text-xl'
  };

  const riskClasses = {
    high: 'ring-2 ring-risk-high ring-offset-2',
    medium: 'ring-2 ring-risk-medium ring-offset-2',
    low: 'ring-2 ring-risk-low ring-offset-2',
    none: ''
  };

  return (
    <div className={cn(
      "relative rounded-full bg-brand-light text-brand font-black flex items-center justify-center shrink-0 border-0.5 border-brand/20",
      sizeClasses[size],
      riskClasses[riskLevel]
    )}>
      {initials}
      {riskLevel !== 'none' && (
        <span className={cn(
          "absolute bottom-0 right-0 rounded-full border-2 border-white",
          size === 'sm' ? 'w-2 h-2' : 'w-3 h-3',
          riskLevel === 'high' ? 'bg-risk-high' : riskLevel === 'medium' ? 'bg-risk-medium' : 'bg-risk-low'
        )} />
      )}
    </div>
  );
};
