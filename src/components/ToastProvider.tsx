import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '../lib/utils';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 5000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
        {toasts.map(t => (
          <div key={t.id} className={cn(
            "flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-right duration-300 min-w-[300px] border border-surface-border",
            t.type === 'success' ? "bg-[#0f172a] text-emerald-400" :
            t.type === 'error' ? "bg-[#0f172a] text-rose-400" :
            "bg-[#0f172a] text-indigo-400"
          )}>
            {t.type === 'success' && <CheckCircle size={18} />}
            {t.type === 'error' && <AlertCircle size={18} />}
            {t.type === 'info' && <Info size={18} />}
            <p className="text-sm font-bold flex-1">{t.message}</p>
            <button onClick={() => removeToast(t.id)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
