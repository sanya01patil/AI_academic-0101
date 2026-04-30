import React, { useState } from 'react';
import { MessageSquare, History, Flag, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useToast } from '../../components/ToastProvider';
import { ConfirmModal } from '../../components/ConfirmModal';

interface FacultyActionsProps {
  submissionId: string;
  studentId: string;
  className?: string;
}

export const FacultyActions: React.FC<FacultyActionsProps> = ({ submissionId, studentId, className }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [isCleared, setIsCleared] = useState(false);

  const handleAction = (action: string, label: string) => {
    console.log('Action performed:', action, { submissionId, timestamp: new Date().toISOString() });
    toast(`${label} successfully logged`, 'success');
  };

  return (
    <div className={cn('grid grid-cols-1 gap-3', className)}>
      <button 
        onClick={() => handleAction('request_explanation', 'Request explanation')}
        className="w-full py-4 bg-surface border-0.5 border-border text-text-primary rounded-panel font-bold text-sm flex items-center justify-center gap-3 hover:bg-surface-light hover:border-brand/40 transition-all"
      >
        <MessageSquare size={18} className="text-brand" /> Request explanation from student
      </button>

      <button 
        onClick={() => navigate(`/student/${studentId}`)}
        className="w-full py-4 bg-surface border-0.5 border-border text-text-primary rounded-panel font-bold text-sm flex items-center justify-center gap-3 hover:bg-surface-light hover:border-brand/40 transition-all"
      >
        <History size={18} className="text-brand" /> View submission history
      </button>

      <button 
        onClick={() => setShowFlagModal(true)}
        className="w-full py-4 bg-risk-high-bg border-0.5 border-risk-high/20 text-risk-high rounded-panel font-bold text-sm flex items-center justify-center gap-3 hover:bg-risk-high/10 transition-all"
      >
        <Flag size={18} /> Flag for academic committee
      </button>

      <button 
        onClick={() => { setIsCleared(true); handleAction('clear_concern', 'No concern status'); }}
        className={cn(
          "w-full py-4 rounded-panel font-bold text-sm flex items-center justify-center gap-3 transition-all",
          isCleared 
            ? "bg-risk-low text-white" 
            : "bg-risk-low-bg border-0.5 border-risk-low/20 text-risk-low hover:bg-risk-low/10"
        )}
      >
        <CheckCircle size={18} /> {isCleared ? 'Cleared' : 'Clear — no concern'}
      </button>

      <ConfirmModal 
        isOpen={showFlagModal}
        title="Escalate to committee?"
        message="This will be visible to the student's academic committee. Are you sure you want to proceed?"
        confirmLabel="Proceed with flag"
        type="danger"
        onConfirm={() => {
          setShowFlagModal(false);
          handleAction('flag_committee', 'Escalation to committee');
        }}
        onCancel={() => setShowFlagModal(false)}
      />
    </div>
  );
};

