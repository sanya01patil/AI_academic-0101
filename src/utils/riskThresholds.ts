import { DEFAULT_THRESHOLDS } from '../types/RiskScore';

export const getRiskLevel = (score: number) => {
  if (score >= DEFAULT_THRESHOLDS.high) return 'high';
  if (score >= DEFAULT_THRESHOLDS.medium) return 'medium';
  return 'low';
};

export const getRiskColor = (score: number) => {
  if (score >= DEFAULT_THRESHOLDS.high) return '#ef4444'; // danger
  if (score >= DEFAULT_THRESHOLDS.medium) return '#f59e0b'; // warning
  return '#10b981'; // success
};
