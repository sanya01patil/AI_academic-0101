import React from 'react';
import { Highlighter } from 'lucide-react';
import { cn } from '../../lib/utils';

interface DocumentViewerProps {
  zoom: number;
  highlightMode: boolean;
  setHighlightMode: (mode: boolean) => void;
  sentences: any[];
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ zoom, highlightMode, setHighlightMode, sentences }) => {
  return (
    <div className="w-full flex flex-col bg-background relative h-full">
      <div className="flex items-center justify-between px-10 py-5 border-b-0.5 border-border bg-surface">
        <button 
          onClick={() => setHighlightMode(!highlightMode)}
          className={cn(
            "flex items-center gap-2 text-xs font-bold transition-all px-5 py-2.5 rounded-md border-0.5",
            highlightMode 
              ? "bg-risk-medium-bg border-risk-medium/30 text-risk-medium" 
              : "bg-surface-light border-border text-text-muted hover:border-text-secondary"
          )}
        >
          <Highlighter size={16} /> {highlightMode ? 'Markers visible' : 'Identify risk signals'}
        </button>
        <div className="text-[10px] text-text-muted font-bold uppercase tracking-[0.2em] flex items-center gap-8">
          <div className="flex flex-col items-end">
            <span className="text-[8px] opacity-60">Session depth</span>
            <span className="font-mono text-text-primary">12 weeks</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[8px] opacity-60">Lexical count</span>
            <span className="font-mono text-text-primary">1,245 words</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-12 bg-background">
        <div 
          className="max-w-3xl mx-auto bg-surface p-16 rounded-md border-0.5 border-border font-serif text-text-primary leading-loose relative"
          style={{ fontSize: `${(zoom / 100) * 1.125}rem` }}
        >
          <div className="absolute top-6 left-6 text-[8px] font-black text-slate-200 uppercase tracking-[0.6em] select-none">IntegriGuard Forensic Artifact</div>
          <div className="space-y-4">
            {sentences.map((s, i) => (
              <span 
                key={i} 
                className={cn(
                  "transition-all duration-500 rounded-sm px-0.5",
                  highlightMode && s.isFlagged ? "bg-risk-medium-bg border-b-2 border-risk-medium/40 cursor-help" : ""
                )}
                title={highlightMode && s.isFlagged ? `Linguistic variance probability: ${s.prob}%` : undefined}
              >
                {s.text}{" "}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
