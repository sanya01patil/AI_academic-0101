import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'MMM dd, yyyy HH:mm');
}

export function formatRelative(date: string | Date): string {
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'recently';
    return formatDistanceToNow(d, { addSuffix: true });
  } catch (e) {
    return 'recently';
  }
}

export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'CLEAN';

export function getRiskLevel(score: number): RiskLevel {
  if (score >= 85) return 'CRITICAL';
  if (score >= 70) return 'HIGH';
  if (score >= 40) return 'MEDIUM';
  if (score >= 15) return 'LOW';
  return 'CLEAN';
}

export function getRiskColorClass(level: RiskLevel) {
  switch (level) {
    case 'CRITICAL': return 'bg-danger text-white';
    case 'HIGH': return 'bg-orange-600 text-white';
    case 'MEDIUM': return 'bg-warning text-white';
    case 'LOW': return 'bg-success text-white';
    case 'CLEAN': return 'bg-primary text-white';
    default: return 'bg-surface-light text-text-muted';
  }
}

export function getRiskGradient(level: RiskLevel) {
  switch (level) {
    case 'CRITICAL': return 'risk-gradient-critical';
    case 'HIGH': return 'risk-gradient-high';
    case 'MEDIUM': return 'risk-gradient-medium';
    case 'LOW': return 'risk-gradient-low';
    case 'CLEAN': return 'risk-gradient-clean';
    default: return 'bg-surface-light';
  }
}
