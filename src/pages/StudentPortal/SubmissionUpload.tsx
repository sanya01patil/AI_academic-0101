import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, FileText, CheckCircle2, Loader2, 
  AlertCircle, Trash2, Save, CheckCircle, ChevronDown, User, BookOpen, GraduationCap, Building2, Landmark
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { useAuthStore } from '../../store/auth';

interface SubmissionUploadProps {
  onSuccess: (draft: { title: string; words: number }) => void;
}

// Mock Data Hierarchy
const ACADEMIC_HIERARCHY: Record<string, any> = {
  "Faculty of Science": {
    "School of Computer Science": {
      "BCA": {
        "First Year": [{ name: "Dr. Alan Turing", subject: "Programming Fundamentals" }],
        "Second Year": [{ name: "Prof. Grace Hopper", subject: "Data Structures" }],
        "Third Year": [{ name: "Dr. Dennis Ritchie", subject: "Operating Systems" }],
        "Fourth Year": [{ name: "Prof. Tim Berners-Lee", subject: "Web Technologies" }]
      },
      "BSc AI and ML": {
        "First Year": [{ name: "Dr. Geoffrey Hinton", subject: "Intro to AI" }],
        "Second Year": [{ name: "Prof. Yann LeCun", subject: "Neural Networks" }],
        "Third Year": [{ name: "Dr. Andrew Ng", subject: "Machine Learning" }],
        "Fourth Year": [{ name: "Prof. Fei-Fei Li", subject: "Computer Vision" }]
      }
    },
    "School of Physics": {
      "BSc Physics": {
        "First Year": [{ name: "Dr. Richard Feynman", subject: "Quantum Mechanics" }],
        "Second Year": [{ name: "Prof. Marie Curie", subject: "Thermodynamics" }],
      }
    }
  },
  "Faculty of Management": {
    "School of Business": {
      "BBA": {
        "First Year": [{ name: "Prof. Peter Drucker", subject: "Management Basics" }],
        "Second Year": [{ name: "Dr. Michael Porter", subject: "Competitive Strategy" }],
      },
      "MBA": {
        "First Year": [{ name: "Prof. Philip Kotler", subject: "Marketing Management" }],
      }
    },
    "School of Economics": {
      "BA Economics": {
        "First Year": [{ name: "Dr. Adam Smith", subject: "Microeconomics" }],
      }
    }
  }
};

export const SubmissionUpload = ({ onSuccess }: SubmissionUploadProps) => {
  const { user } = useAuthStore();
  
  // Wizard State
  const [step, setStep] = useState<number>(1);
  const [faculty, setFaculty] = useState<string>('');
  const [school, setSchool] = useState<string>('');
  const [course, setCourse] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [staff, setStaff] = useState<{name: string, subject: string} | null>(null);

  // Upload State
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [assignmentName, setAssignmentName] = useState('');
  const [versionNote, setVersionNote] = useState('');
  
  // App State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastAutoSave, setLastAutoSave] = useState<string | null>(null);
  const [showRestoreBanner, setShowRestoreBanner] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-save Logic
  useEffect(() => {
    const saved = localStorage.getItem('ig_draft_text');
    const savedTime = localStorage.getItem('ig_draft_time');
    if (saved && saved.length > 0) {
      setShowRestoreBanner(true);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'paste' && text.length > 0) {
      const timer = setTimeout(() => {
        localStorage.setItem('ig_draft_text', text);
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        localStorage.setItem('ig_draft_time', time);
        setLastAutoSave(time);
      }, 60000);
      return () => clearTimeout(timer);
    }
  }, [text, activeTab]);

  const restoreDraft = () => {
    const saved = localStorage.getItem('ig_draft_text');
    const time = localStorage.getItem('ig_draft_time');
    if (saved) {
      setText(saved);
      setLastAutoSave(time);
      setStep(6); // Jump to upload step if restoring
    }
    setShowRestoreBanner(false);
  };

  const discardDraft = () => {
    localStorage.removeItem('ig_draft_text');
    localStorage.removeItem('ig_draft_time');
    setShowRestoreBanner(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.size > 10 * 1024 * 1024) return alert("File too large. Max 10MB.");
      setFile(selected);
    }
  };

  const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Create a composite course ID for the backend tracking
      const courseId = `${course.replace(/\s+/g, '')}-${year.split(' ')[0]}`;
      let response;

      if (activeTab === 'upload' && file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('course_id', courseId);
        formData.append('assignment_name', assignmentName || staff?.subject || 'Assignment');
        formData.append('student_id', user?.id || 'STU-001');
        if (versionNote) formData.append('version_note', versionNote);

        response = await fetch('/api/submissions/upload', {
          method: 'POST',
          body: formData,
        });
      } else {
        response = await fetch('/api/submissions/text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text,
            course_id: courseId,
            assignment_name: assignmentName || staff?.subject || 'Assignment',
            student_id: user?.id || 'STU-001',
            version_note: versionNote,
          }),
        });
      }

      if (!response.ok) throw new Error('Submission failed');
      
      localStorage.removeItem('ig_draft_text');
      localStorage.removeItem('ig_draft_time');

      onSuccess({
        title: assignmentName || staff?.subject || 'Assignment',
        words: activeTab === 'upload' ? 0 : wordCount
      });
      
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
      alert('Submission failed. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setFaculty('');
    setSchool('');
    setCourse('');
    setYear('');
    setStaff(null);
    setFile(null);
    setText('');
    setAssignmentName('');
    setVersionNote('');
    setIsSuccess(false);
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-risk-low-bg border-0.5 border-risk-low/20 rounded-md p-8 flex flex-col items-center text-center space-y-6"
      >
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-risk-low shadow-sm">
          <CheckCircle size={32} />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-text-primary tracking-tight">Assignment submitted</h3>
          <p className="text-text-muted text-sm max-w-sm leading-relaxed">
            Your submission is being analysed. Your writing profile will update shortly.
          </p>
        </div>
        <button 
          onClick={resetForm}
          className="px-8 py-3 bg-risk-low text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-md hover:bg-risk-low/90 transition-all"
        >
          Submit another assignment
        </button>
      </motion.div>
    );
  }

  // Helper to render a step in the wizard
  const renderStep = (
    stepNum: number, 
    title: string, 
    icon: React.ReactNode, 
    selectedValue: string | null, 
    content: React.ReactNode
  ) => {
    const isActive = step === stepNum;
    const isCompleted = step > stepNum;
    const isLocked = step < stepNum;

    return (
      <div className={cn(
        "border-0.5 rounded-xl overflow-hidden transition-all duration-300",
        isActive ? "border-brand bg-brand-light/10 shadow-sm" : 
        isCompleted ? "border-border bg-surface hover:border-brand/30" : 
        "border-border/50 bg-surface-light opacity-50"
      )}>
        <button 
          onClick={() => isCompleted && setStep(stepNum)}
          disabled={isLocked}
          className="w-full px-6 py-4 flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
              isActive ? "bg-brand text-white" :
              isCompleted ? "bg-brand/10 text-brand" :
              "bg-surface border-0.5 border-border text-text-muted"
            )}>
              {isCompleted ? <CheckCircle2 size={16} /> : stepNum}
            </div>
            <div>
              <p className={cn("text-sm font-bold", isActive ? "text-brand" : "text-text-primary")}>{title}</p>
              {isCompleted && selectedValue && (
                <p className="text-[11px] font-medium text-text-muted mt-0.5 flex items-center gap-1.5">
                  {icon} {selectedValue}
                </p>
              )}
            </div>
          </div>
          {isCompleted && <ChevronDown size={16} className="text-text-muted" />}
        </button>

        <AnimatePresence initial={false}>
          {isActive && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 pt-2">
                {content}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {showRestoreBanner && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-brand/5 border-0.5 border-brand/20 rounded-md p-4 flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <AlertCircle size={18} className="text-brand" />
                <p className="text-xs font-medium text-text-primary">
                  You have an unsaved draft.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={discardDraft} className="px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-text-muted hover:text-risk-high">Discard</button>
                <button onClick={restoreDraft} className="px-4 py-1.5 bg-brand text-white text-[9px] font-black uppercase tracking-widest rounded shadow-sm">Restore & Skip to Upload</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {/* Step 1: Faculty */}
        {renderStep(1, "Select Faculty", <Landmark size={12}/>, faculty, (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.keys(ACADEMIC_HIERARCHY).map(f => (
              <button
                key={f}
                onClick={() => { setFaculty(f); setStep(2); setSchool(''); setCourse(''); setYear(''); setStaff(null); }}
                className="p-4 text-left border-0.5 border-border rounded-lg hover:border-brand hover:bg-surface transition-all flex items-center gap-3"
              >
                <Landmark size={18} className="text-brand/60" />
                <span className="text-sm font-bold text-text-primary">{f}</span>
              </button>
            ))}
          </div>
        ))}

        {/* Step 2: School */}
        {renderStep(2, "Select School", <Building2 size={12}/>, school, (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {faculty && Object.keys(ACADEMIC_HIERARCHY[faculty]).map(s => (
              <button
                key={s}
                onClick={() => { setSchool(s); setStep(3); setCourse(''); setYear(''); setStaff(null); }}
                className="p-4 text-left border-0.5 border-border rounded-lg hover:border-brand hover:bg-surface transition-all flex items-center gap-3"
              >
                <Building2 size={18} className="text-brand/60" />
                <span className="text-sm font-bold text-text-primary">{s}</span>
              </button>
            ))}
          </div>
        ))}

        {/* Step 3: Course/Class */}
        {renderStep(3, "Select Course", <BookOpen size={12}/>, course, (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {school && Object.keys(ACADEMIC_HIERARCHY[faculty][school]).map(c => (
              <button
                key={c}
                onClick={() => { setCourse(c); setStep(4); setYear(''); setStaff(null); }}
                className="p-4 text-left border-0.5 border-border rounded-lg hover:border-brand hover:bg-surface transition-all flex items-center gap-3"
              >
                <BookOpen size={18} className="text-brand/60" />
                <span className="text-sm font-bold text-text-primary">{c}</span>
              </button>
            ))}
          </div>
        ))}

        {/* Step 4: Year */}
        {renderStep(4, "Select Academic Year", <GraduationCap size={12}/>, year, (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {course && Object.keys(ACADEMIC_HIERARCHY[faculty][school][course]).map(y => (
              <button
                key={y}
                onClick={() => { setYear(y); setStep(5); setStaff(null); }}
                className="p-4 text-center border-0.5 border-border rounded-lg hover:border-brand hover:bg-surface transition-all"
              >
                <span className="text-sm font-bold text-text-primary block">{y}</span>
              </button>
            ))}
          </div>
        ))}

        {/* Step 5: Staff Member */}
        {renderStep(5, "Select Staff Member", <User size={12}/>, staff?.name ? `${staff.name} (${staff.subject})` : null, (
          <div className="grid grid-cols-1 gap-3">
            {year && ACADEMIC_HIERARCHY[faculty][school][course][year].map((s: any, idx: number) => (
              <button
                key={idx}
                onClick={() => { setStaff(s); setAssignmentName(s.subject); setStep(6); }}
                className="p-4 text-left border-0.5 border-border rounded-lg hover:border-brand hover:bg-surface transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-brand">
                    <User size={18} />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-text-primary block group-hover:text-brand transition-colors">{s.name}</span>
                    <span className="text-[11px] font-medium text-text-muted mt-1 uppercase tracking-widest">{s.subject}</span>
                  </div>
                </div>
                <ChevronRight size={18} className="text-text-muted group-hover:text-brand opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0" />
              </button>
            ))}
          </div>
        ))}

        {/* Step 6: Upload */}
        {renderStep(6, "Artifact Upload", <Upload size={12}/>, null, (
          <div className="space-y-6">
            <div className="flex bg-surface border-0.5 border-border p-1.5 gap-1.5 rounded-lg">
              <button 
                onClick={() => setActiveTab('upload')} 
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 rounded-md text-[10px] font-black uppercase tracking-widest transition-all", 
                  activeTab === 'upload' ? "bg-surface-light text-brand shadow-sm border-0.5 border-border" : "text-text-muted hover:text-text-primary"
                )}
              >
                <Upload size={16} /> Upload File
              </button>
              <button 
                onClick={() => setActiveTab('paste')} 
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 rounded-md text-[10px] font-black uppercase tracking-widest transition-all", 
                  activeTab === 'paste' ? "bg-surface-light text-brand shadow-sm border-0.5 border-border" : "text-text-muted hover:text-text-primary"
                )}
              >
                <FileText size={16} /> Paste Text
              </button>
            </div>

            {activeTab === 'upload' ? (
              <div 
                onClick={() => !file && fileInputRef.current?.click()} 
                onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-brand', 'bg-brand/5'); }}
                onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove('border-brand', 'bg-brand/5'); }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('border-brand', 'bg-brand/5');
                  const dropped = e.dataTransfer.files?.[0];
                  if (dropped) {
                    if (dropped.size > 10 * 1024 * 1024) return alert("File too large.");
                    setFile(dropped);
                  }
                }}
                className={cn(
                  "border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center gap-5 cursor-pointer transition-all", 
                  file ? "border-risk-low bg-risk-low-bg/30" : "border-border hover:border-brand/40 hover:bg-surface-light"
                )}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".pdf,.docx,.txt" 
                  onChange={handleFileChange} 
                />
                
                {file ? (
                  <div className="flex flex-col items-center gap-4 w-full">
                    <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center text-risk-low shadow-sm border-0.5 border-risk-low/20">
                      <CheckCircle2 size={32} />
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-text-primary text-sm">{file.name}</p>
                      <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-1">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setFile(null); }}
                      className="flex items-center gap-2 text-text-muted hover:text-risk-high text-[10px] font-black uppercase tracking-widest pt-2"
                    >
                      <Trash2 size={14} /> Remove file
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-surface-light rounded-xl flex items-center justify-center text-text-muted opacity-40">
                      <Upload size={32} />
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-sm font-bold text-text-primary">Drop your assignment here</p>
                      <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">PDF, DOCX, or TXT — max 10MB</p>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative">
                  <textarea 
                    value={text} 
                    onChange={(e) => setText(e.target.value)} 
                    placeholder="Paste your assignment text here..." 
                    className="w-full min-h-[240px] bg-surface-light border-0.5 border-border rounded-xl p-6 text-sm font-medium focus:outline-none focus:border-brand/40 transition-all resize-none leading-relaxed" 
                  />
                  <div className="absolute bottom-4 right-4 bg-surface/80 backdrop-blur-sm px-3 py-1.5 rounded-md border-0.5 border-border text-[10px] font-bold font-mono text-text-muted uppercase tracking-widest">
                    {wordCount} words
                  </div>
                  {lastAutoSave && (
                    <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-[9px] font-bold text-text-muted/60 uppercase tracking-widest">
                      <Save size={12} /> Draft saved at {lastAutoSave}
                    </div>
                  )}
                </div>
                {wordCount < 100 && wordCount > 0 && (
                  <p className="text-[10px] font-bold text-risk-medium flex items-center gap-1.5 px-1">
                    <AlertCircle size={12} /> Minimum 100 words required for analysis
                  </p>
                )}
              </div>
            )}

            <div className="space-y-4 pt-4 border-t-0.5 border-border">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Assignment name</label>
                <input 
                  type="text" 
                  value={assignmentName} 
                  onChange={(e) => setAssignmentName(e.target.value)} 
                  placeholder="e.g. Week 6 Analysis" 
                  className="w-full bg-surface-light border-0.5 border-border rounded-lg px-4 py-3 text-sm font-bold focus:outline-none focus:border-brand/40 transition-all" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Version note (optional)</label>
                <input 
                  type="text" 
                  value={versionNote} 
                  onChange={(e) => setVersionNote(e.target.value)} 
                  placeholder="What changed in this draft? (optional)" 
                  className="w-full bg-surface-light border-0.5 border-border rounded-lg px-4 py-3 text-sm font-bold focus:outline-none focus:border-brand/40 transition-all" 
                />
              </div>

              <button 
                onClick={handleSubmit} 
                disabled={isSubmitting || (activeTab === 'upload' ? !file : wordCount < 100)}
                className={cn(
                  "w-full py-5 rounded-xl font-black text-[11px] uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-md mt-4", 
                  (isSubmitting || (activeTab === 'upload' ? !file : wordCount < 100))
                    ? "bg-surface-light text-text-muted border-0.5 border-border cursor-not-allowed" 
                    : "bg-brand text-white hover:bg-brand/90 hover:shadow-lg active:scale-[0.98]"
                )}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Analysing your submission...
                  </>
                ) : "Submit assignment"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
