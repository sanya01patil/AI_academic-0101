import React from 'react';
import { History, FileText, ChevronRight } from 'lucide-react';
import { formatDate } from '../../lib/utils';

export interface Draft {
  id: string | number;
  title: string;
  version: string;
  words: number;
  time: string;
  note?: string;
}

interface DraftHistoryProps {
  drafts: Draft[];
}

export const DraftHistory = ({ drafts }: DraftHistoryProps) => {
  return (
    <div className="bg-surface border-0.5 border-border rounded-panel overflow-hidden">
      <div className="px-8 py-6 border-b-0.5 border-border bg-surface-light flex items-center justify-between">
        <div className="flex items-center gap-3">
          <History size={18} className="text-brand" />
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-text-primary">Draft History</h2>
        </div>
        <span className="text-[10px] font-bold text-text-muted px-2 py-1 bg-surface border-0.5 border-border rounded font-mono">
          {drafts.length} Artifacts
        </span>
      </div>

      <div className="divide-y-0.5 divide-border/50">
        {drafts.length === 0 ? (
          <div className="text-center py-12 text-text-muted italic text-xs">
            No analytical artifacts committed to baseline.
          </div>
        ) : (
          drafts.map((draft) => (
            <div key={draft.id} className="flex items-center justify-between px-8 py-5 hover:bg-surface-light transition-all group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-surface border-0.5 border-border rounded-md flex items-center justify-center text-text-muted group-hover:text-brand transition-colors">
                  <FileText size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary group-hover:text-brand transition-colors">{draft.title}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[10px] text-brand font-black uppercase tracking-widest bg-brand-light/50 px-2 py-0.5 rounded">
                      {draft.version}
                    </span>
                    <span className="text-[10px] text-text-muted font-bold font-mono">
                      {draft.words} WORDS
                    </span>
                    {draft.note && (
                      <span className="text-[10px] text-text-muted/60 italic font-medium truncate max-w-[150px]">
                        — {draft.note}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <p className="text-[11px] font-mono font-bold text-text-muted uppercase">{formatDate(draft.time)}</p>
                <ChevronRight size={16} className="text-text-muted group-hover:text-brand transition-all" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
