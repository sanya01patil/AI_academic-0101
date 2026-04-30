import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  type?: 'danger' | 'brand';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ 
  isOpen, 
  title = 'Institutional confirmation',
  message, 
  onConfirm, 
  onCancel,
  confirmLabel = 'Confirm flag',
  type = 'brand'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
      <div className="bg-surface border-0.5 border-border rounded-modal p-8 max-w-md w-full animate-in fade-in zoom-in duration-200">
        <div className="flex items-start justify-between mb-6">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            type === 'danger' ? 'bg-risk-high-bg text-risk-high' : 'bg-brand-light text-brand'
          }`}>
            <AlertCircle size={24} strokeWidth={1.5} />
          </div>
          <button onClick={onCancel} className="text-text-muted hover:text-text-primary transition-colors">
            <X size={20} />
          </button>
        </div>

        <h3 className="text-xl font-bold text-text-primary mb-3">{title}</h3>
        <p className="text-sm text-text-secondary mb-8 leading-relaxed">
          {message}
        </p>

        <div className="flex gap-4">
          <button 
            onClick={onCancel}
            className="flex-1 py-3 border-0.5 border-border rounded-md text-sm font-bold text-text-secondary hover:bg-surface-light transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className={`flex-1 py-3 rounded-md text-sm font-bold text-white transition-all hover:opacity-90 ${
              type === 'danger' ? 'bg-risk-high' : 'bg-brand'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
