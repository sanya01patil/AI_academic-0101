import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn, formatRelative } from '../../lib/utils';

interface SubmissionSnippet {
  id: string;
  date: string;
  score: number;
  title: string;
}

interface PriorSubmissionsProps {
  submissions: SubmissionSnippet[];
  className?: string;
}

export const PriorSubmissions: React.FC<PriorSubmissionsProps> = ({ submissions, className }) => {
  const navigate = useNavigate();

  const getDotColor = (score: number) => {
    if (score >= 70) return 'bg-risk-high border-risk-high/30';
    if (score >= 40) return 'bg-risk-medium border-risk-medium/30';
    return 'bg-risk-low border-risk-low/30';
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="relative pl-4 space-y-6 before:content-[''] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-px before:bg-border">
        {submissions.map((sub, idx) => (
          <div 
            key={sub.id || idx} 
            className="relative cursor-pointer group"
            onClick={() => sub.id && navigate(`/submission/${sub.id}`)}
          >
            <div className={cn(
              'absolute -left-[20.5px] top-1.5 w-3 h-3 rounded-full border-2 border-surface z-10 transition-transform group-hover:scale-125',
              getDotColor(sub.score)
            )} />
            <div className="space-y-1">
              <p className="text-[10px] text-text-muted font-bold">
                {formatRelative(sub.date)}
              </p>
              <p className="text-sm font-bold text-text-primary group-hover:text-brand transition-colors leading-tight">
                {sub.title}
              </p>
              <p className="text-[11px] text-text-secondary flex items-center gap-1.5">
                Risk score: <span className={cn('font-mono font-bold', sub.score >= 70 ? 'text-risk-high' : sub.score >= 40 ? 'text-risk-medium' : 'text-risk-low')}>{sub.score}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

