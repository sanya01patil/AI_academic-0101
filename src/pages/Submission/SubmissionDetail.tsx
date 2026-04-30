import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, ZoomIn, ZoomOut, Copy, Download, ShieldCheck
} from 'lucide-react';
import { mockSubmissions } from '../../mocks/data';
import { DocumentViewer } from './DocumentViewer';
import { RiskPanel } from './RiskPanel';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { useToast } from '../../components/ToastProvider';
import { EthicsReminder } from '../../components/EthicsReminder';

export const SubmissionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [highlightMode, setHighlightMode] = useState(false);
  const [zoom, setZoom] = useState(100);

  const { data: submission, isLoading, error } = useQuery({
    queryKey: ['submission', id],
    queryFn: async () => {
      try {
        const resp = await api.submissions.getOne(id!);
        if (resp.data) return resp.data;
      } catch (e) {
        console.warn("Backend unavailable or artifact not found, falling back to demo data");
      }
      
      // Fallback to mock data for demo flow
      const mockSub = mockSubmissions.find(s => s.id === id);
      if (!mockSub) return null;
      
      return {
        id: mockSub.id,
        studentName: mockSub.studentName,
        student_id: mockSub.studentId,
        course_id: mockSub.courseId,
        assignment_name: mockSub.assignmentName,
        title: mockSub.title,
        status: mockSub.status,
        submitted_at: mockSub.timestamp,
        risk_score: mockSub.riskScore,
        ai_prob: (mockSub.aiLikelihood || 0) / 100,
        style_shift: (mockSub.styleShift || 0) / 100,
        grade_anomaly: mockSub.gradeAnomaly === 'high' ? 15 : 2,
        shap_explanation: mockSub.shapExplanation,
        content: mockSub.content || "This project explores the multifaceted applications..."
      };
    },
    enabled: !!id,
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    toast('Forensic report link copied', 'success');
  };

  const sentences = [
    { text: "In the rapidly evolving landscape of modern computer science, graph optimization remains a cornerstone of algorithmic efficiency.", isFlagged: false },
    { text: "This project explores the multifaceted applications of Dijkstra's algorithm and its variants in dynamic network routing environments.", isFlagged: true, prob: 84 },
    { text: "Furthermore, the integration of heuristic functions through A* search allows for significant reductions in the search space, provided that the heuristic remains admissible and consistent.", isFlagged: true, prob: 72 },
    { text: "The implementation of a priority queue using a binary heap ensures that the time complexity is maintained at O(E log V).", isFlagged: false },
    { text: "This theoretical bound is critical for large-scale deployments where vertex density exceeds 10^5.", isFlagged: true, prob: 91 },
    { text: "Dynamic programming approaches provide an alternative for systems with high temporal locality.", isFlagged: false },
    { text: "By caching sub-problem results, we reduce the redundant computations significantly.", isFlagged: false },
    { text: "The Bellman-Ford algorithm, while slower, handles negative edge weights which is a requirement for certain financial models.", isFlagged: true, prob: 68 },
  ];

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold text-text-muted uppercase tracking-[0.2em]">Retracing digital fingerprints...</p>
        </div>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-bold text-text-primary">Artifact not found</h2>
          <button onClick={() => navigate(-1)} className="text-brand hover:underline">Return to registry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {/* Header */}
      <header className="h-16 bg-surface border-b-0.5 border-border flex items-center justify-between px-8 shrink-0 z-20">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2.5 rounded-md border-0.5 border-border hover:bg-surface-light text-text-muted transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-white">
              <ShieldCheck size={18} strokeWidth={2} />
            </div>
            <h1 className="text-lg font-bold text-text-primary tracking-tight">Forensic Analysis: {submission.assignment_name || submission.assignmentName}</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-surface-light rounded-md border-0.5 border-border p-1">
            <button onClick={() => setZoom(Math.max(50, zoom - 10))} className="p-1.5 hover:bg-white hover:border-0.5 hover:border-border rounded text-text-muted transition-all">
              <ZoomOut size={16} />
            </button>
            <span className="text-[11px] font-bold w-12 text-center text-text-primary font-mono">{zoom}%</span>
            <button onClick={() => setZoom(Math.min(200, zoom + 10))} className="p-1.5 hover:bg-white hover:border-0.5 hover:border-border rounded text-text-muted transition-all">
              <ZoomIn size={16} />
            </button>
          </div>
          
          <div className="h-6 w-px bg-border mx-2" />
          
          <button onClick={handleCopy} className="p-2.5 rounded-md border-0.5 border-border text-text-muted hover:text-brand transition-all">
            <Copy size={18} />
          </button>
          <button className="p-2.5 rounded-md border-0.5 border-border text-text-muted hover:text-brand transition-all">
            <Download size={18} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Document Viewer (60%) */}
        <div className="w-[60%] flex flex-col h-full overflow-hidden border-r-0.5 border-border">
          <div className="flex-1 overflow-hidden relative">
            <DocumentViewer 
              zoom={zoom} 
              highlightMode={highlightMode} 
              setHighlightMode={setHighlightMode}
              sentences={sentences}
            />
          </div>
          <footer className="h-12 bg-surface-light border-t-0.5 border-border px-6 flex items-center justify-between text-[10px] font-bold text-text-muted uppercase tracking-widest">
            <div className="flex items-center gap-6">
              <span>Student: {submission.student_id || submission.studentId}</span>
              <span>Word count: {submission.word_count || submission.wordCount || 1245}</span>
            </div>
            <span>Submitted: {new Date(submission.submitted_at || submission.timestamp || Date.now()).toLocaleString()}</span>
          </footer>
        </div>

        {/* Risk Panel (40%) */}
        <div className="w-[40%] overflow-y-auto p-8 space-y-10 bg-surface">
          <RiskPanel submission={{
            ...submission,
            riskScore: submission.risk_score || submission.riskScore || 0,
            aiLikelihood: submission.ai_prob || submission.aiLikelihood || 0,
            styleShift: submission.style_shift || submission.styleShift || 0,
            shapExplanation: submission.shap_explanation || submission.shapExplanation || ""
          }} />
          <EthicsReminder />
        </div>
      </main>
    </div>
  );
};

