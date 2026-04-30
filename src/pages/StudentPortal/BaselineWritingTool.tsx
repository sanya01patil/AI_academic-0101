import React, { useState, useEffect } from 'react';
import { PenTool, Save, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Props {
  onComplete?: () => void;
}

export const BaselineWritingTool = ({ onComplete }: Props) => {
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [text, setText] = useState(() => localStorage.getItem('baseline_draft') || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  useEffect(() => {
    if (timeLeft <= 0 || isDone) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isDone]);

  useEffect(() => {
    const autoSave = setInterval(() => {
      localStorage.setItem('baseline_draft', text);
    }, 30000);
    return () => clearInterval(autoSave);
  }, [text]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsDone(true);
      localStorage.removeItem('baseline_draft');
      if (onComplete) onComplete();
    }, 1500);
  };

  if (isDone) {
    return (
      <div className="bg-risk-low-bg border-0.5 border-risk-low/20 rounded-panel p-16 text-center space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-surface border-0.5 border-border rounded-full flex items-center justify-center text-risk-low mx-auto">
          <CheckCircle2 size={40} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-text-primary tracking-tight">Linguistic profile updated</h2>
          <p className="text-text-secondary text-sm font-medium mt-2 max-w-sm mx-auto">
            Your writing sample has been processed. The institutional baseline has been successfully calibrated to your unique signature.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface border-0.5 border-border rounded-panel p-10 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-brand-light/50 rounded-md flex items-center justify-center text-brand">
            <PenTool size={24} strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-primary tracking-tight">Baseline development protocol</h2>
            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mt-1">Timed forensic signature collection</p>
          </div>
        </div>
        <div className={cn(
          "px-5 py-2.5 rounded-md border-0.5 font-mono font-bold text-xl flex items-center gap-3",
          timeLeft < 60 ? "bg-risk-high-bg border-risk-high/20 text-risk-high animate-pulse" : "bg-surface-light border-border text-text-primary"
        )}>
          <Clock size={18} /> {formatTime(timeLeft)}
        </div>
      </div>

      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Initiate writing protocol... (Minimum 200 words required for early commitment)"
          className="w-full h-96 bg-surface-light border-0.5 border-border rounded-md p-8 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-brand/20 transition-all resize-none leading-relaxed font-serif"
        />
        <div className="absolute bottom-6 right-8 flex items-center gap-6">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
            <Save size={12} /> Live auto-save active
          </div>
          <div className={cn(
            "px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest border-0.5 font-mono",
            wordCount >= 200 ? "bg-risk-low-bg border-risk-low/20 text-risk-low" : "bg-surface border-border text-text-muted"
          )}>
            {wordCount} WORDS COLLECTED
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex-1 p-5 bg-surface-light rounded-md border-0.5 border-border flex items-center gap-4 border-l-4 border-l-brand">
          <AlertCircle size={20} className="text-brand shrink-0" />
          <p className="text-xs text-text-secondary font-medium leading-relaxed">
            Please write naturally about a complex technical or academic subject. No qualitative evaluation is performed; this data is used solely for stylometric baseline calibration.
          </p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || (timeLeft > 0 && wordCount < 200)}
          className={cn(
            "px-10 py-5 rounded-md font-black text-xs uppercase tracking-[0.2em] transition-all",
            isSubmitting || (timeLeft > 0 && wordCount < 200)
              ? "bg-surface-light text-text-muted border-0.5 border-border cursor-not-allowed"
              : "bg-brand text-white hover:opacity-90 shadow-lg shadow-brand/10"
          )}
        >
          {isSubmitting ? 'Calibrating...' : 'Commit Baseline'}
        </button>
      </div>
    </div>
  );
};
