export type RiskLevel = 'high' | 'medium' | 'low' | 'clean';

export interface Student {
  id: string;
  name: string;
  email: string;
  studentId: string;
  courseIds: string[];
  overallRiskLevel: RiskLevel;
  overallRiskScore: number;
  submissionCount: number;
  flaggedCount: number;
  lastActivity: string;
  year?: string;
  department?: string;
  isEsl?: boolean;
  isMature?: boolean;
  enrolmentStatus?: 'Full-time' | 'Part-time';
  avgRiskScore?: number;
  studentCode?: string;
  baselineStatus?: 'Verified' | 'Pending' | 'Flagged';
  baseline: {
    avgSentenceLen: number;
    vocabComplexity: number;
    funcWordFreq: number;
    burstiness: number;
  };
  latest: {
    avgSentenceLen: number;
    vocabComplexity: number;
    funcWordFreq: number;
    burstiness: number;
  };
}
