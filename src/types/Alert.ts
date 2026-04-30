import { RiskLevel } from './Student';

export interface Alert {
  id: string;
  type: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  message: string;
  timestamp: string;
  isRead: boolean;
  submissionId?: string;
  studentName?: string;
  courseName?: string;
}
