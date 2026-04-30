import { RiskLevel } from './Student';

export interface RiskThresholds {
  high: number;
  medium: number;
  low: number;
}

export const DEFAULT_THRESHOLDS: RiskThresholds = {
  high: 70,
  medium: 40,
  low: 15
};

export interface RiskSummary {
  score: number;
  level: RiskLevel;
  trend: 'improving' | 'stable' | 'deteriorating';
}
