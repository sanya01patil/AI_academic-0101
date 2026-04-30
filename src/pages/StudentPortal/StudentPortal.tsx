import { useState, useEffect } from 'react';
import { 
  Shield, AlertCircle, LogOut, ChevronLeft,
  FileText, PenTool, Save
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import { cn } from '../../lib/utils';

import { MyRiskCard } from './MyRiskCard';
import { DraftHistory } from './DraftHistory';
import { BaselineWritingTool } from './BaselineWritingTool';
import { SubmissionUpload } from './SubmissionUpload';

export const StudentPortal = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const [drafts, setDrafts] = useState<any[]>([
    { id: 101, title: 'Algorithm Analysis', version: 'v2', words: 1420, time: new Date(Date.now() - 86400000).toISOString() },
    { id: 102, title: 'Data Structures Lab', version: 'v1', words: 850, time: new Date(Date.now() - 172800000).toISOString() },
  ]);
  const [hasBaseline, setHasBaseline] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`/api/submissions/student/${user?.id || 'STU-001'}`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setDrafts(data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch history", error);
      }
    };
    fetchHistory();
  }, [user?.id]);

  const handleSubmissionSuccess = (newDraft: { title: string; words: number }) => {
    const sameAssignment = drafts.filter(d => d.title === newDraft.title);
    const nextVersion = `v${sameAssignment.length + 1}`;
    
    const freshDraft = {
      id: Date.now(),
      title: newDraft.title,
      version: nextVersion,
      words: newDraft.words,
      time: new Date().toISOString()
    };
    
    setDrafts([freshDraft, ...drafts]);
  };

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-brand/10 selection:text-brand">
      {/* Global Nav */}
      <nav className="h-20 bg-surface border-b-0.5 border-border flex items-center justify-between px-8 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-brand rounded-md flex items-center justify-center text-white shrink-0">
            <Shield size={20} />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm text-text-primary tracking-tight">IntegriGuard</span>
            <span className="text-[9px] font-black text-brand uppercase tracking-[0.2em] -mt-1">Student node</span>
          </div>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-4 px-4 py-2 bg-surface-light border-0.5 border-border rounded-md">
            <div className="text-right">
              <p className="text-xs font-bold text-text-primary leading-none">{user?.name || 'Student'}</p>
              <p className="text-[9px] text-text-muted uppercase tracking-widest mt-1 font-bold">Verified academic</p>
            </div>
            <div className="w-8 h-8 rounded bg-brand text-white flex items-center justify-center text-xs font-bold">
              {user?.name?.charAt(0) || 'S'}
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-text-muted hover:text-risk-high transition-colors text-[10px] font-black uppercase tracking-widest"
          >
            <LogOut size={16} /> Exit portal
          </button>
        </div>
      </nav>

      <main className="max-w-[800px] mx-auto py-16 px-6 space-y-20">
        {/* Welcome Section */}
        <section className="space-y-4 border-l-4 border-brand pl-8">
          <h1 className="text-4xl font-bold text-text-primary tracking-tight">Active integrity workspace</h1>
          <p className="text-text-muted text-sm font-medium max-w-lg leading-relaxed">
            Welcome, {user?.name?.split(' ')[0]}. Maintain your linguistic baseline and commit assignments for forensic verification.
          </p>
        </section>

        {/* Core Modules Stack */}
        <div className="space-y-16">
          {/* 1. Writing Profile */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-text-muted">
              <AlertCircle size={18} />
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">Writing integrity profile</h2>
            </div>
            {hasBaseline ? (
              <MyRiskCard />
            ) : (
              <div className="bg-surface border-0.5 border-border border-dashed rounded-panel p-10 flex flex-col items-center justify-center text-center space-y-4 min-h-[200px]">
                <div className="w-12 h-12 rounded-full bg-surface-light border-0.5 border-border text-text-muted flex items-center justify-center">
                  <Shield size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-primary tracking-tight">Profile Uncalibrated</h3>
                  <p className="text-[11px] font-medium text-text-muted mt-2 max-w-sm mx-auto leading-relaxed">
                    Please complete the Baseline Development Protocol below to establish your secure institutional linguistic signature. Your profile will generate upon completion.
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* 2. Submission Workflow — NEW PROMINENT SECTION */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-text-muted">
              <Save size={18} />
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">Assignment commitment protocol</h2>
            </div>
            <SubmissionUpload onSuccess={handleSubmissionSuccess} />
          </section>

          {/* 3. History & Baseline */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <section className="space-y-6">
              <div className="flex items-center gap-3 text-text-muted">
                <FileText size={18} />
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">Submission history</h2>
              </div>
              <DraftHistory drafts={drafts} />
            </section>
            
            <section className="space-y-6">
              <div className="flex items-center gap-3 text-text-muted">
                <PenTool size={18} />
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">Linguistic baseline tool</h2>
              </div>
              <BaselineWritingTool onComplete={() => setHasBaseline(true)} />
            </section>
          </div>
        </div>

        {/* Footer */}
        <footer className="pt-20 pb-12 border-t-0.5 border-border text-center space-y-6">
          <div className="flex items-center justify-center gap-6 text-[9px] font-black text-text-muted uppercase tracking-[0.2em] opacity-40">
            <span>Integrity first</span>
            <div className="w-1 h-1 rounded-full bg-border" />
            <span>Student success</span>
            <div className="w-1 h-1 rounded-full bg-border" />
            <span>Verified identity</span>
          </div>
          <p className="text-[10px] text-text-muted/60 font-medium">
            IntegriGuard Academic Portal v2.4.0 — Powered by Neural Linguistic Profiling
          </p>
        </footer>
      </main>
    </div>
  );
};

