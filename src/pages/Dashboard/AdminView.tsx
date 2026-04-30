import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, LineChart, Line } from 'recharts';
import { mockBiasAudit, mockModelHealth, mockCourseConfigs, courses as mockCourses } from '../../mocks/data';
import { useViewStore } from '../../store/view';
import { adminApi } from '../../api/admin';
import { cn, formatDate } from '../../lib/utils';
import { TrendingUp, TrendingDown, Minus, Download, RefreshCw, Save, Shield } from 'lucide-react';
import { AuditLogTab } from './AuditLogTab';

/* ─── Shared ─────────────────────────────────────────── */
const TabBtn = ({ label, id }: { label: string; id: string }) => {
  const { activeAdminTab, setAdminTab } = useViewStore();
  const active = activeAdminTab === id;
  return (
    <button
      onClick={() => setAdminTab(id as any)}
      className={cn(
        'px-6 py-3.5 text-xs font-black uppercase tracking-[0.2em] border-b-2 transition-all whitespace-nowrap',
        active
          ? 'text-brand border-brand'
          : 'text-text-muted border-transparent hover:text-text-primary hover:border-border'
      )}
    >
      {label}
    </button>
  );
};

/* ─── Bias Audit ─────────────────────────────────────── */
const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'stable' }) =>
  trend === 'up' ? <TrendingUp size={14} className="text-risk-high" /> :
  trend === 'down' ? <TrendingDown size={14} className="text-risk-low" /> :
  <Minus size={14} className="text-text-muted" />;

const BiasTab = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-text-primary">Bias audit</h3>
          <p className="text-xs text-text-muted mt-1">Last automated audit: {formatDate('2026-04-25T10:00:00Z')}</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-brand text-white rounded-md text-sm font-bold hover:opacity-90 transition-all"
        >
          <RefreshCw size={16} /> Trigger recalibration
        </button>
      </div>

      {/* Table */}
      <div className="bg-surface border-0.5 border-border rounded-panel overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-0.5 border-border bg-surface-light">
              <th className="px-6 py-4 text-[10px] uppercase font-black tracking-[0.2em] text-text-muted">Demographic group</th>
              <th className="px-6 py-4 text-[10px] uppercase font-black tracking-[0.2em] text-text-muted text-right">Total flags</th>
              <th className="px-6 py-4 text-[10px] uppercase font-black tracking-[0.2em] text-text-muted text-right">FP rate</th>
              <th className="px-6 py-4 text-[10px] uppercase font-black tracking-[0.2em] text-text-muted text-center">Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y-0.5 divide-border/50">
            {mockBiasAudit.map(row => (
              <tr key={row.group} className="hover:bg-surface-light transition-colors">
                <td className="px-6 py-4 text-sm font-bold text-text-primary">{row.group}</td>
                <td className="px-6 py-4 text-sm text-text-secondary text-right font-mono">{row.flagged} / {row.total}</td>
                <td className="px-6 py-4 text-right">
                  <span className={cn('text-sm font-bold font-mono', row.fpRate > 15 ? 'text-risk-high' : 'text-risk-low')}>
                    {row.fpRate}%
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center"><TrendIcon trend={row.trend as any} /></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bar chart */}
      <div className="bg-surface border-0.5 border-border rounded-panel p-6">
        <p className="text-sm font-bold text-text-primary mb-6">False positive rate by group — threshold at 15%</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockBiasAudit} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.1} vertical={false} />
              <XAxis dataKey="group" stroke="currentColor" strokeOpacity={0.5} fontSize={11} fontWeight="bold" tickLine={false} axisLine={false} tickFormatter={v => v.split(' ')[0]} />
              <YAxis stroke="currentColor" strokeOpacity={0.5} fontSize={11} fontWeight="bold" tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} />
              <Tooltip cursor={{ fill: 'currentColor', opacity: 0.05 }} contentStyle={tooltipStyle} itemStyle={{ color: 'hsl(var(--risk-high))' }} />
              <ReferenceLine y={15} stroke="hsl(var(--risk-high))" strokeDasharray="4 4" label={{ value: '15% limit', fill: 'hsl(var(--risk-high))', fontSize: 10, position: 'insideTopRight', fontWeight: 'bold' }} />
              <Bar dataKey="fpRate" fill="hsl(var(--risk-high))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Confirmation modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-surface border-0.5 border-border rounded-panel p-8 max-w-md w-full shadow-none">
            <div className="w-12 h-12 bg-brand-light rounded-md flex items-center justify-center text-brand mb-6">
              <RefreshCw size={24} />
            </div>
            <h4 className="text-xl font-bold text-text-primary mb-3">Trigger recalibration?</h4>
            <p className="text-sm text-text-secondary mb-8 leading-relaxed">
              This will initiate a full model recalibration cycle across all production clusters. The process typically takes 2–4 hours and may temporarily increase latency.
            </p>
            <div className="flex gap-4">
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 border-0.5 border-border rounded-md text-sm font-bold text-text-secondary hover:bg-surface-light transition-all">
                Cancel
              </button>
              <button
                onClick={async () => { 
                  setShowModal(false); 
                  await adminApi.recalibrate();
                  console.log('Recalibration triggered via API');
                }}
                className="flex-1 py-3 bg-brand text-white rounded-md text-sm font-bold hover:opacity-90 transition-all"
              >
                Confirm trigger
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Model Health ───────────────────────────────────── */
const HealthTab = () => {
  const h = mockModelHealth;
  const driftMap = { 
    Healthy: 'text-risk-low bg-risk-low-bg border-risk-low/20', 
    Watch: 'text-risk-medium bg-risk-medium-bg border-risk-medium/20', 
    Critical: 'text-risk-high bg-risk-high-bg border-risk-high/20' 
  };
  const tooltipStyle = { backgroundColor: '#ffffff', border: '0.5px solid #e2e8f0', borderRadius: 8, fontSize: 12, boxShadow: 'none' };

  const metrics = [
    { label: 'System Accuracy', value: h.accuracy, color: 'text-brand' },
    { label: 'False Positive Rate', value: h.fpRate, color: 'text-risk-low' },
    { label: 'Active Nodes', value: h.activeNodes, color: 'text-text-primary' },
    { label: 'Queue Load', value: h.queueLoad, color: 'text-risk-medium' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-text-primary">Model health</h3>
        <button className="flex items-center gap-2 px-4 py-2 border-0.5 border-border rounded-md text-xs font-bold text-text-secondary hover:bg-surface-light transition-all">
          <Download size={14} /> Download diagnostic report
        </button>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map(m => (
          <div key={m.label} className="bg-surface border-0.5 border-border rounded-panel p-6">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">{m.label}</p>
            <p className={cn('text-3xl font-bold mt-2 font-mono', m.color)}>
              {typeof m.value === 'number' && m.value < 1 ? (m.value * 100).toFixed(1) + '%' : m.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-surface border-0.5 border-border rounded-panel p-6 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-text-muted font-bold uppercase tracking-wider">Drift status</p>
            <p className="text-sm font-bold text-text-primary">Linguistic pattern stability</p>
          </div>
          <span className={cn('text-[10px] font-black px-3 py-1.5 rounded-md uppercase tracking-widest border-0.5', driftMap[h.overallStatus as keyof typeof driftMap])}>
            {h.overallStatus}
          </span>
        </div>
        <div className="bg-surface border-0.5 border-border rounded-panel p-6 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-text-muted font-bold uppercase tracking-wider">Last retrained</p>
            <p className="text-sm font-bold text-text-primary">Automated training cycle</p>
          </div>
          <p className="text-sm font-bold text-brand font-mono">{formatDate(h.lastTraining)}</p>
        </div>
      </div>

      {/* Accuracy history chart */}
      <div className="bg-surface border-0.5 border-border rounded-panel p-6">
        <p className="text-sm font-bold text-text-primary mb-8">Accuracy over last 12 training cycles</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockAccuracyHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.1} vertical={false} />
              <XAxis dataKey="cycle" stroke="currentColor" strokeOpacity={0.5} fontSize={11} fontWeight="bold" tickLine={false} axisLine={false} />
              <YAxis stroke="currentColor" strokeOpacity={0.5} fontSize={11} fontWeight="bold" tickLine={false} axisLine={false}
                domain={[90, 100]} tickFormatter={v => `${v}%`} />
              <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: 'hsl(var(--brand))' }} />
              <Line type="monotone" dataKey="accuracy" stroke="hsl(var(--brand))" strokeWidth={3} dot={{ r: 4, fill: 'hsl(var(--brand))', strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

/* ─── Course Config ──────────────────────────────────── */
const ConfigTab = () => {
  const [courseId, setCourseId] = useState('CS301');
  const [configs, setConfigs] = useState({ ...mockCourseConfigs });
  const cfg = (configs as any)[courseId] || { threshold: 70, requireExplanation: true, autoFlag: false };

  const update = (field: string, value: any) =>
    setConfigs(prev => ({ ...prev, [courseId]: { ...prev[courseId as keyof typeof prev], [field]: value } }));

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-text-primary">Course configuration</h3>
      </div>

      {/* Course selector */}
      <div className="flex gap-2 p-1 bg-surface-light border-0.5 border-border rounded-lg w-max">
        {mockCourses.map(c => (
          <button
            key={c.id}
            onClick={() => setCourseId(c.id)}
            className={cn(
              'px-4 py-2 rounded-md text-xs font-bold transition-all',
              courseId === c.id
                ? 'bg-white border-0.5 border-border text-brand shadow-sm'
                : 'text-text-muted hover:text-text-primary'
            )}
          >
            {c.id}
          </button>
        ))}
      </div>

      {cfg && (
        <div className="bg-surface border-0.5 border-border rounded-panel p-8 space-y-10">
          {/* High threshold */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-text-primary">Risk threshold</p>
                <p className="text-xs text-text-muted mt-1">Sensitivity at which AI content is flagged for review</p>
              </div>
              <span className="text-2xl font-bold text-brand font-mono">{cfg.threshold}%</span>
            </div>
            <input type="range" min={40} max={95} value={cfg.threshold}
              onChange={e => update('threshold', Number(e.target.value))}
              className="w-full accent-brand h-1.5 rounded-full cursor-pointer bg-surface-light border-0.5 border-border" />
          </div>

          <div className="h-px bg-border w-full" />

          {/* Toggle Switches */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-text-primary">Mandatory student explanation</p>
                <p className="text-xs text-text-muted mt-1">Require students to justify high-risk flags upon submission</p>
              </div>
              <button
                onClick={() => update('requireExplanation', !cfg.requireExplanation)}
                className={cn(
                  'w-12 h-6 rounded-full transition-all relative shrink-0',
                  cfg.requireExplanation ? 'bg-brand' : 'bg-border'
                )}
              >
                <span className={cn(
                  'absolute top-1 w-4 h-4 bg-white rounded-full transition-all',
                  cfg.requireExplanation ? 'left-7' : 'left-1'
                )} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-text-primary">Automated committee escalation</p>
                <p className="text-xs text-text-muted mt-1">Auto-flag critical risks directly to the academic integrity board</p>
              </div>
              <button
                onClick={() => update('autoFlag', !cfg.autoFlag)}
                className={cn(
                  'w-12 h-6 rounded-full transition-all relative shrink-0',
                  cfg.autoFlag ? 'bg-brand' : 'bg-border'
                )}
              >
                <span className={cn(
                  'absolute top-1 w-4 h-4 bg-white rounded-full transition-all',
                  cfg.autoFlag ? 'left-7' : 'left-1'
                )} />
              </button>
            </div>
          </div>

          <div className="h-px bg-border w-full" />

          {/* Save button */}
          <button
            onClick={async () => {
              await adminApi.saveCourseConfig({ courseId, config: cfg });
            }}
            className="w-full py-4 bg-brand text-white rounded-md font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all"
          >
            <Save size={18} /> Update course configuration
          </button>
        </div>
      )}
    </div>
  );
};

/* ─── Admin View (tabs wrapper) ─────────────────────── */
export const AdminView = () => {
  const { activeAdminTab } = useViewStore();

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      {/* Tab strip */}
      <div className="flex border-b-0.5 border-border shrink-0 px-8 bg-surface">
        <TabBtn label="Bias Audit"     id="bias"   />
        <TabBtn label="Model Health"   id="health" />
        <TabBtn label="Course Config"  id="config" />
        <TabBtn label="Audit Log"      id="audit"  />
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto">
          {activeAdminTab === 'bias'   && <BiasTab />}
          {activeAdminTab === 'health' && <HealthTab />}
          {activeAdminTab === 'config' && <ConfigTab />}
          {activeAdminTab === 'audit'  && <AuditLogTab />}
        </div>
      </div>
    </div>
  );
};
