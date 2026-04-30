import React, { useState } from 'react';
import { 
  GraduationCap, BookOpen, Calendar, ChevronRight, 
  ChevronLeft, Users, FileCheck, Search, LayoutGrid, X,
  ShieldCheck, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { FACULTY_WORKFLOW_DATA } from '../../mocks/workflowData';

type Step = 'faculty' | 'school' | 'course' | 'year' | 'class_view';

export const FacultyWorkflow = () => {
  const [step, setStep] = useState<Step>('faculty');
  const [selections, setSelections] = useState({
    faculty: '',
    school: '',
    course: '',
    year: '',
    selectedClass: null as any
  });

  const steps: Step[] = ['faculty', 'school', 'course', 'year', 'class_view'];
  const currentStepIndex = steps.indexOf(step);

  const handleNext = (nextStep: Step, value?: any) => {
    if (value) {
      setSelections(prev => ({ ...prev, [step === 'class_view' ? 'selectedClass' : step]: value }));
    }
    setStep(nextStep);
  };

  const handleBack = () => {
    const prevStep = steps[currentStepIndex - 1];
    if (prevStep) setStep(prevStep);
  };

  const SelectionCard = ({ icon: Icon, title, subtitle, onClick, active = false }: any) => (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={cn(
        "flex items-center gap-5 p-6 bg-surface border-0.5 rounded-md transition-all text-left group",
        active ? "border-brand bg-brand-light/20" : "border-border hover:border-brand/40"
      )}
    >
      <div className={cn(
        "w-12 h-12 rounded-md flex items-center justify-center transition-all",
        active ? "bg-brand text-white" : "bg-surface-light text-text-muted group-hover:text-brand"
      )}>
        <Icon size={24} />
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-text-primary text-sm tracking-tight">{title}</h3>
        <p className="text-[10px] text-text-muted font-bold uppercase tracking-[0.15em] mt-1">{subtitle}</p>
      </div>
      <ArrowRight size={18} className="text-text-muted group-hover:text-brand group-hover:translate-x-1 transition-all opacity-0 group-hover:opacity-100" />
    </motion.button>
  );

  const renderStep = () => {
    switch (step) {
      case 'faculty':
        return (
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-text-primary tracking-tight">Institution faculty selection</h2>
              <p className="text-text-muted text-xs font-medium">Select the primary academic division to initiate monitoring protocols</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FACULTY_WORKFLOW_DATA.faculties.map((f) => (
                <SelectionCard
                  key={f.id}
                  icon={GraduationCap}
                  title={f.name}
                  subtitle="Academic lead"
                  onClick={() => handleNext('school', f.id)}
                />
              ))}
            </div>
          </div>
        );

      case 'school':
        const schools = (FACULTY_WORKFLOW_DATA.schools as any)[selections.faculty] || [];
        return (
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-text-primary tracking-tight">School selection</h2>
              <p className="text-text-muted text-xs font-medium">Drill down into specialized schools within the selected faculty</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {schools.map((s: any) => (
                <SelectionCard
                  key={s.id}
                  icon={BookOpen}
                  title={s.name}
                  subtitle="Sub-division"
                  onClick={() => handleNext('course', s.id)}
                />
              ))}
            </div>
          </div>
        );

      case 'course':
        const courses = (FACULTY_WORKFLOW_DATA.courses as any)[selections.school] || [];
        return (
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-text-primary tracking-tight">Course registry</h2>
              <p className="text-text-muted text-xs font-medium">Select the degree program or specialized course for audit</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {courses.map((c: any) => (
                <SelectionCard
                  key={c.id}
                  icon={LayoutGrid}
                  title={c.name}
                  subtitle="Program profile"
                  onClick={() => handleNext('year', c.id)}
                />
              ))}
            </div>
          </div>
        );

      case 'year':
        return (
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-text-primary tracking-tight">Academic year</h2>
              <p className="text-text-muted text-xs font-medium">Target a specific batch or enrollment year</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {FACULTY_WORKFLOW_DATA.years.map((y) => (
                <motion.button
                  key={y.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleNext('class_view', y.id)}
                  className="p-8 bg-surface border-0.5 border-border rounded-md flex flex-col items-center justify-center gap-4 hover:border-brand transition-all group"
                >
                  <Calendar size={32} className="text-text-muted group-hover:text-brand transition-all" />
                  <span className="text-sm font-bold text-text-primary">{y.name}</span>
                </motion.button>
              ))}
            </div>
          </div>
        );

      case 'class_view':
        const classKey = `${selections.course}_${selections.year}`;
        const classes = (FACULTY_WORKFLOW_DATA.classes as any)[classKey] || [];
        
        if (selections.selectedClass) {
          return (
            <div className="space-y-8">
               <button 
                onClick={() => setSelections(prev => ({ ...prev, selectedClass: null }))}
                className="flex items-center gap-2 text-text-muted hover:text-brand font-bold text-[10px] uppercase tracking-widest transition-all"
              >
                <ChevronLeft size={14} /> Return to class browser
              </button>

              <div className="bg-brand rounded-md p-10 text-white flex flex-col md:flex-row md:items-center justify-between gap-10">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-brand-light opacity-80">
                    <ShieldCheck size={16} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{selections.selectedClass.semester}</span>
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight">{selections.selectedClass.subject}</h2>
                  <p className="text-brand-light/80 text-xs font-medium uppercase tracking-widest">{selections.course.toUpperCase()} — {FACULTY_WORKFLOW_DATA.years.find(y => y.id === selections.year)?.name}</p>
                </div>
                <div className="flex gap-6">
                  <div className="px-6 py-4 bg-white/10 rounded border-0.5 border-white/20 text-center min-w-[120px]">
                    <p className="text-[10px] font-bold uppercase opacity-60 tracking-widest mb-2">Submissions</p>
                    <p className="text-2xl font-bold font-mono">{selections.selectedClass.submissions}</p>
                  </div>
                  <div className="px-6 py-4 bg-white/10 rounded border-0.5 border-white/20 text-center min-w-[120px]">
                    <p className="text-[10px] font-bold uppercase opacity-60 tracking-widest mb-2">Cohort size</p>
                    <p className="text-2xl font-bold font-mono">{selections.selectedClass.students.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-surface border-0.5 border-border rounded-md overflow-hidden">
                <div className="p-6 border-b-0.5 border-border flex items-center justify-between bg-surface-light">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-text-primary">Enrolled students</h3>
                  <div className="flex items-center gap-2 px-4 py-2 bg-surface border-0.5 border-border rounded text-text-muted">
                    <Search size={14} />
                    <input type="text" placeholder="Search roster..." className="bg-transparent border-none outline-none text-[11px] font-bold" />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b-0.5 border-border">
                        <th className="px-8 py-5 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Roll identity</th>
                        <th className="px-8 py-5 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Full name</th>
                        <th className="px-8 py-5 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Integrity status</th>
                        <th className="px-8 py-5 text-[10px] font-black text-text-muted uppercase tracking-[0.2em] text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-0.5 divide-border/50">
                      {selections.selectedClass.students.map((student: any) => (
                        <tr key={student.roll} className="hover:bg-surface-light transition-colors group">
                          <td className="px-8 py-5 text-sm font-bold text-text-muted font-mono group-hover:text-brand transition-colors">{student.roll}</td>
                          <td className="px-8 py-5 text-sm font-bold text-text-primary">{student.name}</td>
                          <td className="px-8 py-5">
                            {student.submitted ? (
                              <span className="inline-flex items-center gap-2 px-3 py-1 bg-risk-low-bg text-risk-low rounded text-[10px] font-bold uppercase tracking-wider border-0.5 border-risk-low/20">
                                <FileCheck size={12} /> Verified submission
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-2 px-3 py-1 bg-risk-high-bg text-risk-high rounded text-[10px] font-bold uppercase tracking-wider border-0.5 border-risk-high/20">
                                <X size={12} /> Pending baseline
                              </span>
                            )}
                          </td>
                          <td className="px-8 py-5 text-right">
                            <button className="text-[10px] font-black text-brand uppercase hover:underline tracking-widest transition-all">View forensic report</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        }

        return (
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-text-primary tracking-tight">Class browser</h2>
              <p className="text-text-muted text-xs font-medium">Review cohorts separated by academic year and terminal semester</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {classes.map((c: any) => (
                <motion.button
                  key={c.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelections(prev => ({ ...prev, selectedClass: c }))}
                  className="flex items-center gap-5 p-6 bg-surface border-0.5 border-border rounded-md hover:border-brand transition-all text-left group"
                >
                  <div className="w-14 h-14 bg-surface-light rounded-md flex flex-col items-center justify-center text-text-muted group-hover:bg-brand group-hover:text-white transition-all">
                    <span className="text-[10px] font-black uppercase tracking-tight">{c.semester.split(' ')[0]}</span>
                    <span className="text-lg font-bold font-mono">{c.semester.split(' ')[1]}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-text-primary group-hover:text-brand transition-colors text-sm">{c.subject}</h3>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1.5 text-[9px] font-bold text-text-muted uppercase tracking-widest">
                        <Users size={12} /> <span className="font-mono">{c.students.length}</span> Cohort
                      </div>
                      <div className="flex items-center gap-1.5 text-[9px] font-bold text-risk-low uppercase tracking-widest">
                        <FileCheck size={12} /> <span className="font-mono">{c.submissions}</span> Verified
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-text-muted group-hover:text-brand transition-all" />
                </motion.button>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      {/* Visual Stepper */}
      {step !== 'class_view' && (
        <div className="flex items-center justify-center mb-16 gap-3">
          {steps.filter(s => s !== 'class_view').map((s, idx) => (
            <React.Fragment key={s}>
              <div className={cn(
                "w-10 h-10 rounded-md flex items-center justify-center text-[10px] font-black transition-all border-0.5",
                idx <= currentStepIndex ? "bg-brand text-white border-brand" : "bg-surface border-border text-text-muted"
              )}>
                {idx + 1}
              </div>
              {idx < steps.length - 2 && (
                <div className={cn(
                  "w-16 h-px",
                  idx < currentStepIndex ? "bg-brand" : "bg-border"
                )} />
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Breadcrumb Navigation */}
      {step !== 'faculty' && !selections.selectedClass && (
        <button 
          onClick={handleBack}
          className="mb-10 flex items-center gap-2 text-text-muted hover:text-brand font-bold text-[10px] uppercase tracking-[0.2em] transition-all px-2"
        >
          <ChevronLeft size={16} /> Back to {steps[currentStepIndex - 1]}
        </button>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={step + (selections.selectedClass ? '_detail' : '')}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
