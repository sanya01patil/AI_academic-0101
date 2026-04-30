import React, { useState } from 'react';
import { 
  ShieldAlert, History, ArrowUpRight, Scale
} from 'lucide-react';
import { RiskMeter, RiskPill } from '../../components/RiskMeter';
import { SHAPExplanation } from '../../components/SHAPExplanation';
import { ConfirmModal } from '../../components/ConfirmModal';
import { EthicsReminder } from '../../components/EthicsReminder';
import { useToast } from '../../components/ToastProvider';

interface RiskPanelProps {
  submission: {
    id: string;
    riskScore: number;
    studentId: string;
    studentName: string;
    courseId: string;
  };
}

export const RiskPanel: React.FC<RiskPanelProps> = ({ submission }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const { toast } = useToast();

  const signals = [
    { label: 'AI synthetic probability', value: 89 },
    { label: 'Stylometric deviation', value: 42 },
    { label: 'Cross-reference match', value: 12 },
    { label: 'Temporal anomaly', value: 65 },
  ];

  const pastSubmissions = [
    { date: '2026-03-12', score: 12, title: 'Algorithm Complexity' },
    { date: '2026-02-15', score: 28, title: 'Data Structures' },
    { date: '2026-01-20', score: 91, title: 'Introduction to C++' },
  ];

  const handleEscalate = () => {
    setModalOpen(false);
    toast('Case escalated to institutional committee', 'success');
  };

  return (
    <div className="w-full flex flex-col h-full bg-surface">
      <div className="flex-1 overflow-y-auto p-8 space-y-10">
        {/* 1. Meter & 2. Badge */}
        <div className="flex flex-col items-center gap-6 p-8 bg-surface-light border-0.5 border-border rounded-panel">
          <RiskMeter score={submission.riskScore} size="lg" />
          <RiskPill score={submission.riskScore} />
          <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] text-center">
            Aggregated forensic risk score
          </p>
        </div>

        {/* 3. SHAP Explanations */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert size={16} className="text-brand" />
            <h3 className="text-[10px] font-black text-text-muted uppercase tracking-widest">Signal attribution</h3>
          </div>
          <SHAPExplanation 
            text="The implementation of a priority queue using a binary heap ensures that the time complexity is maintained at O(E log V)."
            signals={signals}
          />
        </div>

        {/* 4. Prior Submissions */}
        <div className="pt-6 border-t-0.5 border-border">
          <div className="flex items-center gap-2 mb-6">
            <History size={16} className="text-text-muted" />
            <h3 className="text-[10px] font-black text-text-muted uppercase tracking-widest">Prior submissions</h3>
          </div>
          <div className="space-y-3">
            {pastSubmissions.map((s, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border-0.5 border-border rounded-md hover:bg-surface-light transition-all cursor-pointer group">
                <div>
                  <p className="text-xs font-bold text-text-primary group-hover:text-brand transition-colors">{s.title}</p>
                  <p className="text-[9px] text-text-muted font-mono mt-1">{s.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold font-mono ${s.score > 70 ? 'text-risk-high' : s.score > 40 ? 'text-risk-medium' : 'text-risk-low'}`}>
                    {s.score}%
                  </span>
                  <ArrowUpRight size={14} className="text-text-muted opacity-0 group-hover:opacity-100 transition-all" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Faculty Actions */}
        <div className="pt-10 border-t-0.5 border-border">
          <div className="flex items-center gap-2 mb-6">
            <ShieldAlert size={16} className="text-text-muted" />
            <h3 className="text-[10px] font-black text-text-muted uppercase tracking-widest">Faculty Management</h3>
          </div>
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => toast('Request for explanation sent to student.', 'info')}
              className="w-full py-3 bg-surface-light border-0.5 border-border text-text-primary rounded-md font-bold flex items-center justify-center gap-2 hover:bg-brand hover:border-brand hover:text-white transition-all text-xs"
            >
              Request Explanation
            </button>
            <button 
              onClick={() => toast('Risk status cleared. Artifact marked as safe.', 'success')}
              className="w-full py-3 bg-surface-light border-0.5 border-border text-text-primary rounded-md font-bold flex items-center justify-center gap-2 hover:bg-risk-low hover:border-risk-low hover:text-white transition-all text-xs"
            >
              Clear (No Issue)
            </button>
            <button 
              onClick={() => setModalOpen(true)}
              className="w-full py-3 bg-surface-light border-0.5 border-border text-risk-high rounded-md font-bold flex items-center justify-center gap-2 hover:bg-risk-high hover:border-risk-high hover:text-white transition-all text-xs"
            >
              <Scale size={16} strokeWidth={2} />
              Commit Red Flag
            </button>
          </div>
        </div>

        <ConfirmModal 
          isOpen={isModalOpen}
          onConfirm={handleEscalate}
          onCancel={() => setModalOpen(false)}
          message="Are you sure you want to escalate this case to the institutional academic integrity committee? This action is permanent and will trigger a formal investigation."
          confirmLabel="Commit Red Flag"
          type="brand"
        />
      </div>

      {/* EthicsReminder — always visible, pinned */}
      <div className="shrink-0 p-6 bg-background border-t-0.5 border-border">
        <EthicsReminder />
      </div>
    </div>
  );
};
