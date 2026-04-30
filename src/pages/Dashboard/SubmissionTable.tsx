import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowUpDown } from 'lucide-react';
import { mockSubmissions } from '../../mocks/data';
import { useFilterStore } from '../../store/filters';
import { cn } from '../../lib/utils';
import { RiskPill } from '../../components/RiskPill';
import { StudentAvatar } from '../../components/StudentAvatar';

import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';

export const SubmissionTable = () => {
  const navigate = useNavigate();
  const { riskFilter, sortField, sortDirection, toggleSort } = useFilterStore();

  const { data: submissions = [], isLoading, error } = useQuery({
    queryKey: ['submissions'],
    queryFn: async () => {
      try {
        const resp = await api.submissions.getAll();
        if (resp.data && resp.data.length > 0) return resp.data;
      } catch (e) {
        console.warn("Backend unavailable, falling back to demo data");
      }
      
      // Fallback to mock data for flawless demo flow if DB is empty or unavailable
      return mockSubmissions.map(m => ({
        id: m.id,
        studentName: m.studentName,
        student_id: m.studentId,
        course_id: m.courseId,
        assignment_name: m.assignmentName,
        word_count: 500,
        status: m.status,
        submitted_at: m.timestamp,
        risk_score: m.riskScore,
        ai_prob: (m.aiLikelihood || 0) / 100,
        style_shift: (m.styleShift || 0) / 100,
        grade_anomaly: m.gradeAnomaly === 'high' ? 15 : 2,
        shap_explanation: m.shapExplanation
      }));
    },
    refetchInterval: 10000, // Refresh every 10s for live alerts
  });

  const filteredData = useMemo(() => {
    let data = [...submissions];
    
    if (riskFilter !== 'ALL') {
      data = data.filter((s: any) => {
        const risk = (s.risk_score || 0) >= 70 ? 'HIGH' : (s.risk_score || 0) >= 40 ? 'MEDIUM' : 'LOW';
        return risk === riskFilter;
      });
    }

    return data.sort((a: any, b: any) => {
      const mod = sortDirection === 'asc' ? 1 : -1;
      const valA = a[sortField] ?? 0;
      const valB = b[sortField] ?? 0;
      if (typeof valA === 'string') {
        return valA.localeCompare(valB) * mod;
      }
      return (valA - valB) * mod;
    });
  }, [submissions, riskFilter, sortField, sortDirection]);

  const SortHeader = ({ label, k, className }: { label: string, k: any, className?: string }) => (
    <th 
      className={cn(
        "px-6 py-4 text-[10px] uppercase font-black text-text-muted tracking-[0.2em] cursor-pointer group hover:text-brand transition-colors",
        className
      )}
      onClick={() => toggleSort(k)}
    >
      <div className="flex items-center gap-1.5">
        {label}
        <ArrowUpDown size={12} className={cn('transition-opacity', sortField === k ? 'opacity-100' : 'opacity-0 group-hover:opacity-40')} />
      </div>
    </th>
  );

  return (
    <div className="flex flex-col h-full bg-surface">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-surface z-10 border-b-0.5 border-border">
            <tr>
              <SortHeader label="Student" k="studentName" />
              <th className="px-6 py-4 text-[10px] uppercase font-black text-text-muted tracking-[0.2em]">AI Likelihood</th>
              <th className="px-6 py-4 text-[10px] uppercase font-black text-text-muted tracking-[0.2em]">Style Shift</th>
              <th className="px-6 py-4 text-[10px] uppercase font-black text-text-muted tracking-[0.2em]">Grade Anomaly</th>
              <SortHeader label="Risk status" k="riskScore" />
              <th className="px-6 py-4 text-[10px] uppercase font-black text-text-muted tracking-[0.2em] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y-0.5 divide-border/50">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Hydrating forensic registry...</p>
                  </div>
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center">
                  <p className="text-xs font-bold text-text-muted uppercase tracking-widest">No submissions detected in this frequency.</p>
                </td>
              </tr>
            ) : filteredData.map((sub: any) => {
              const riskLevel = (sub.risk_score || 0) >= 70 ? 'HIGH' : (sub.risk_score || 0) >= 40 ? 'MEDIUM' : 'LOW';
              return (
                <tr 
                  key={sub.id} 
                  className="hover:bg-surface-light transition-all cursor-pointer group"
                  onClick={() => navigate(`/submission/${sub.id}`)}
                >
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-4">
                      <StudentAvatar name={sub.studentName || 'Unknown Student'} riskLevel={riskLevel} />
                      <div>
                        <p className="text-sm font-bold text-text-primary group-hover:text-brand transition-colors">{sub.studentName || 'Unknown Student'}</p>
                        <p className="text-[10px] text-text-muted font-medium mt-1">ID: {sub.id.split('-')[0].toUpperCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="w-32 space-y-2">
                      <div className="flex justify-between text-[10px] font-mono font-bold">
                        <span className="text-text-muted">Probability</span>
                        <span className="text-brand">{Math.round((sub.ai_prob || 0) * 100)}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-surface-light border-0.5 border-border rounded-full overflow-hidden">
                        <div className="h-full bg-brand" style={{ width: `${(sub.ai_prob || 0) * 100}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="font-mono font-bold text-brand text-sm">{Math.round((sub.style_shift || 0) * 100)}%</span>
                  </td>
                  <td className="px-6 py-6">
                    <span className="font-mono font-bold text-text-primary text-sm">+{sub.grade_anomaly || 0} pts</span>
                  </td>
                  <td className="px-6 py-6 max-w-md">
                    <div className="space-y-3">
                      <RiskPill score={sub.risk_score || 0} />
                      {sub.shap_explanation && (
                        <p className="text-[11px] text-text-secondary leading-relaxed bg-brand-light/50 border-l-2 border-brand/20 pl-3 py-1.5 rounded-r-md italic">
                          "{typeof sub.shap_explanation === 'string' ? sub.shap_explanation : JSON.stringify(sub.shap_explanation).slice(0, 100) + '...'}"
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <button className="p-2.5 rounded-md border-0.5 border-border bg-surface hover:border-brand/40 hover:bg-brand-light text-text-muted hover:text-brand transition-all">
                      <ChevronRight size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

