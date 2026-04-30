import { useMemo } from 'react';
import { getRiskLevel, getRiskColor } from '../utils/riskThresholds';

export const useRiskScore = (score: number) => {
  return useMemo(() => ({
    level: getRiskLevel(score),
    color: getRiskColor(score),
    percent: `${score}%`
  }), [score]);
};
