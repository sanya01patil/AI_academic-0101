import { RiskLevel } from './Student';

export interface ShapFactor {
  label: string;
  value: number;
  weight: number;
}

export interface Submission {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail?: string;
  courseId: string;
  courseName: string;
  assignmentName?: string;
  title: string;
  timestamp: string;
  riskScore: number;
  riskLevel: RiskLevel;
  status: 'pending' | 'reviewed' | 'escalated' | 'cleared';
  aiLikelihood: number;
  styleShift: number;
  gradeAnomaly?: 'high' | 'moderate' | 'none';
  submissionSpeed?: number;
  shapExplanation: string;
  signals: ShapFactor[];
  content?: string;
}
