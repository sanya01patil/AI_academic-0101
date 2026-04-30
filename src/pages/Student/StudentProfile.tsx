import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, User, GraduationCap, 
  AlertCircle, FileText, TrendingUp,
  ArrowUpRight, ArrowDownRight, Minus, Mail, Shield
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { mockStudents, mockSubmissions } from '../../mocks/data';
import { cn, formatDate } from '../../lib/utils';
import { RiskPill } from '../../components/RiskPill';
import { StudentAvatar } from '../../components/StudentAvatar';

export const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const student = useMemo(() => 
    mockStudents.find(s => s.id === id) || mockStudents[0], 
  [id]);

  const studentSubmissions = useMemo(() => 
    mockSubmissions.filter(s => s.studentId === student.id).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
  [student.id]);

  const riskHistory = useMemo(() => 
    studentSubmissions.map(s => ({
      date: formatDate(s.timestamp).split(',')[0],
      score: s.riskScore
    })),
  [studentSubmissions]);

  const MetricCard = ({ label, baseline, latest, suffix = '' }: any) => {
    const diff = latest - baseline;
    const isUp = diff > 0;
    const isNeutral = Math.abs(diff) < 0.1;
    
    return (
      <div className="bg-surface border-0.5 border-border rounded-card p-5 space-y-4 hover:border-brand/30 transition-all group">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted group-hover:text-brand transition-colors">{label}</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[9px] text-text-muted font-bold uppercase mb-1">Baseline</p>
            <p className="text-sm font-bold text-text-primary font-mono">{baseline}{suffix}</p>
          </div>
          <div>
            <p className="text-[9px] text-text-muted font-bold uppercase mb-1">Latest</p>
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-text-primary font-mono">{latest}{suffix}</p>
              {!isNeutral && (
                <span className={cn(
                  "flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-md",
                  isUp ? "bg-risk-high-bg text-risk-high" : "bg-risk-low-bg text-risk-low"
                )}>
                  {isUp ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                  {Math.abs(diff).toFixed(1)}
                </span>
              )}
              {isNeutral && <Minus size={10} className="text-text-muted" />}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b-0.5 border-border px-8 py-6 shrink-0 z-20">
        <div className="flex items-center gap-10">
          <button 
            onClick={() => navigate(-1)}
            className="p-3 rounded-md border-0.5 border-border hover:bg-surface-light text-text-muted transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-8">
            <StudentAvatar name={student.name} riskLevel={student.overallRiskLevel} />
            <div>
              <div className="flex items-center gap-4">
                <h1 className="text-3xl font-bold text-text-primary tracking-tight">{student.name}</h1>
                <div className={cn(
                  "px-3 py-1 rounded-md text-[10px] font-bold border-0.5",
                  student.enrolmentStatus === 'Full-time' ? "bg-brand-light text-brand border-brand/20" : "bg-risk-medium-bg text-risk-medium border-risk-medium/20"
                )}>
                  {student.enrolmentStatus}
                </div>
              </div>
              <div className="flex items-center gap-8 mt-3">
                <p className="text-xs text-text-muted font-medium flex items-center gap-2">
                  <User size={14} className="text-brand opacity-60" /> {student.studentCode}
                </p>
                <p className="text-xs text-text-muted font-medium flex items-center gap-2">
                  <GraduationCap size={14} className="text-brand opacity-60" /> {student.department}
                </p>
                <p className="text-xs text-text-muted font-medium flex items-center gap-2">
                  <Mail size={14} className="text-brand opacity-60" /> {student.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Risk Timeline */}
            <div className="lg:col-span-2 bg-surface border-0.5 border-border rounded-panel p-8">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                    <TrendingUp size={18} className="text-brand" /> Risk trajectory
                  </h3>
                  <p className="text-xs text-text-muted mt-1">Cross-submission linguistic analysis</p>
                </div>
                <div className="flex gap-6">
                  <div className="flex items-center gap-2 text-[10px] text-text-muted font-bold uppercase tracking-wider">
                    <div className="w-2 h-2 rounded-full bg-risk-high" /> Critical
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-text-muted font-bold uppercase tracking-wider">
                    <div className="w-2 h-2 rounded-full bg-risk-medium" /> Warning
                  </div>
                </div>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={riskHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.1} vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      stroke="currentColor" strokeOpacity={0.5}
                      fontSize={10} 
                      fontWeight="bold"
                      tickLine={false} 
                      axisLine={false} 
                      dy={10}
                    />
                    <YAxis 
                      stroke="currentColor" strokeOpacity={0.5}
                      fontSize={10} 
                      fontWeight="bold"
                      tickLine={false} 
                      axisLine={false} 
                      domain={[0, 100]}
                      dx={-10}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--surface))', border: '0.5px solid hsl(var(--border))', borderRadius: '8px', fontSize: '10px', fontWeight: 'bold', color: 'hsl(var(--text-primary))' }}
                      itemStyle={{ color: 'hsl(var(--brand))' }}
                    />
                    <ReferenceLine y={70} stroke="hsl(var(--risk-high))" strokeDasharray="4 4" opacity={0.5} />
                    <ReferenceLine y={40} stroke="hsl(var(--risk-medium))" strokeDasharray="4 4" opacity={0.5} />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="hsl(var(--brand))" 
                      strokeWidth={3} 
                      dot={{ r: 4, fill: 'hsl(var(--surface))', stroke: 'hsl(var(--brand))', strokeWidth: 2 }}
                      activeDot={{ r: 6, fill: 'hsl(var(--brand))', strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Baseline Card */}
            <div className="bg-surface border-0.5 border-border rounded-panel p-8 flex flex-col">
              <h3 className="text-sm font-bold text-text-primary mb-8 flex items-center gap-2">
                <Shield size={18} className="text-brand" /> Writing baseline
              </h3>
              <div className="space-y-6 flex-1">
                <div className="flex justify-between items-center pb-4 border-b-0.5 border-border/50">
                  <span className="text-xs text-text-muted font-medium">Status</span>
                  <span className="text-xs font-bold text-brand uppercase tracking-widest bg-brand-light px-2.5 py-1 rounded-md">{student.baselineStatus}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b-0.5 border-border/50">
                  <span className="text-xs text-text-muted font-medium">Calibration period</span>
                  <span className="text-xs font-bold text-text-primary">First 4 weeks</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b-0.5 border-border/50">
                  <span className="text-xs text-text-muted font-medium">Linguistic depth</span>
                  <span className="text-xs font-bold text-text-primary">82.4% Coverage</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b-0.5 border-border/50">
                  <span className="text-xs text-text-muted font-medium">Reliability score</span>
                  <span className="text-xs font-bold text-brand">High confidence</span>
                </div>
              </div>
              <div className="mt-8 p-4 bg-surface-light rounded-md border-0.5 border-border">
                <p className="text-[10px] text-text-muted font-black uppercase tracking-[0.2em] mb-1">Last verification</p>
                <p className="text-xs text-text-primary font-bold">2 weeks ago (Recalibration complete)</p>
              </div>
            </div>
          </div>

          {/* Baseline Comparison */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 text-text-muted">
              <AlertCircle size={18} />
              <h3 className="text-sm font-bold text-text-primary">Linguistic drift analysis (Baseline vs Latest)</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard 
                label="Avg sentence length" 
                baseline={student.baseline.avgSentenceLen} 
                latest={student.latest.avgSentenceLen} 
                suffix=" words"
              />
              <MetricCard 
                label="Vocab complexity" 
                baseline={student.baseline.vocabComplexity} 
                latest={student.latest.vocabComplexity} 
                suffix="%"
              />
              <MetricCard 
                label="Function word freq" 
                baseline={student.baseline.funcWordFreq} 
                latest={student.latest.funcWordFreq} 
                suffix="%"
              />
              <MetricCard 
                label="Text burstiness" 
                baseline={student.baseline.burstiness} 
                latest={student.latest.burstiness} 
              />
            </div>
          </section>

          {/* Submissions Table */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <FileText size={18} className="text-brand opacity-60" /> Recent submissions
              </h3>
              <p className="text-xs text-text-muted font-bold uppercase tracking-widest">{studentSubmissions.length} Total files</p>
            </div>
            <div className="bg-surface border-0.5 border-border rounded-panel overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-0.5 border-border bg-surface-light">
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Assignment title</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Course</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Submitted date</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Risk profile</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y-0.5 divide-border/50">
                  {studentSubmissions.map(sub => (
                    <tr key={sub.id} className="hover:bg-surface-light transition-all group">
                      <td className="px-8 py-6">
                        <p className="text-sm font-bold text-text-primary group-hover:text-brand transition-colors">{sub.title}</p>
                        <p className="text-[10px] text-text-muted font-medium mt-1">ID: {sub.id}</p>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-[10px] font-bold text-text-secondary bg-surface-light border-0.5 border-border px-2 py-1 rounded-md">{sub.courseId}</span>
                      </td>
                      <td className="px-8 py-6 text-xs font-medium text-text-secondary font-mono">{formatDate(sub.timestamp)}</td>
                      <td className="px-8 py-6">
                        <RiskPill score={sub.riskScore} />
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button 
                          onClick={() => navigate(`/submission/${sub.id}`)}
                          className="px-4 py-2 bg-surface border-0.5 border-border rounded-md text-[10px] font-black uppercase tracking-[0.2em] text-brand hover:bg-brand-light transition-all"
                        >
                          Forensics
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

