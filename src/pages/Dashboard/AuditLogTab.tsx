import React, { useState, useMemo } from 'react';
import { Download, Filter, Calendar, Search } from 'lucide-react';
import { mockAuditLog } from '../../mocks/data';
import { AuditAction } from '../../types/FacultyAction';
import { cn, formatDate } from '../../lib/utils';
import { exportToCsv } from '../../utils/exportCsv';

const actionLabels: Record<AuditAction, string> = {
  flag_committee: 'Flag Committee',
  clear_concern: 'Clear Concern',
  request_explanation: 'Request Explanation',
  view_history: 'View History',
  recalibrate_triggered: 'Recalibrate Triggered',
  course_config_saved: 'Course Config Saved',
  baseline_submitted: 'Baseline Submitted',
};

const actionColors: Record<AuditAction, string> = {
  flag_committee: 'bg-danger/10 text-danger border-danger/20',
  clear_concern: 'bg-success/10 text-success border-success/20',
  request_explanation: 'bg-warning/10 text-warning border-warning/20',
  view_history: 'bg-primary/10 text-primary border-primary/20',
  recalibrate_triggered: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  course_config_saved: 'bg-brand/10 text-brand border-brand/20',
  baseline_submitted: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
};

export const AuditLogTab = () => {
  const [actionFilter, setActionFilter] = useState<AuditAction | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = useMemo(() => {
    return mockAuditLog.filter(log => {
      const matchesAction = actionFilter === 'all' || log.action === actionFilter;
      const matchesSearch = log.facultyName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (log.studentName && log.studentName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                            (log.studentId && log.studentId.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesAction && matchesSearch;
    });
  }, [actionFilter, searchTerm]);

  const handleExport = () => {
    exportToCsv('integriguard_audit_log', filteredLogs, ['timestamp', 'facultyName', 'action', 'studentId', 'studentName', 'course']);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">System Audit Log</h3>
          <p className="text-xs text-text-muted mt-1">Traceability for all faculty and administrative actions</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 border border-surface-border rounded-lg text-sm font-semibold text-text-secondary hover:bg-surface-light transition-all"
          >
            <Download size={15} /> Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-surface-light/30 p-4 rounded-xl border border-surface-border">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search faculty or student..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface border border-surface-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div className="relative">
          <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <select 
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value as any)}
            className="w-full bg-surface border border-surface-border rounded-lg pl-10 pr-4 py-2 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="all">All Action Types</option>
            {Object.entries(actionLabels).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
        <div className="relative">
          <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input 
            type="date" 
            className="w-full bg-surface border border-surface-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface border border-surface-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-surface-border bg-surface-light/50">
                <th className="px-4 py-3 text-[11px] uppercase tracking-wider font-semibold text-text-muted">Timestamp</th>
                <th className="px-4 py-3 text-[11px] uppercase tracking-wider font-semibold text-text-muted">Faculty Member</th>
                <th className="px-4 py-3 text-[11px] uppercase tracking-wider font-semibold text-text-muted">Action Type</th>
                <th className="px-4 py-3 text-[11px] uppercase tracking-wider font-semibold text-text-muted">Student ID</th>
                <th className="px-4 py-3 text-[11px] uppercase tracking-wider font-semibold text-text-muted">Course</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/40">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-text-muted text-sm italic">
                    No audit records match your current filters.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-surface-light/40 transition-colors">
                    <td className="px-4 py-3 text-xs text-text-secondary whitespace-nowrap">
                      {formatDate(log.timestamp)}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-text-primary">
                      {log.facultyName}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded border uppercase', actionColors[log.action as AuditAction])}>
                        {actionLabels[log.action as AuditAction]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-text-muted">
                      {log.studentId}
                    </td>
                    <td className="px-4 py-3 text-xs text-text-secondary">
                      {log.course}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

