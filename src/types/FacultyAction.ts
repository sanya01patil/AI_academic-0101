export type AuditAction = 
  | 'flag_committee' 
  | 'clear_concern' 
  | 'request_explanation' 
  | 'view_history' 
  | 'recalibrate_triggered'
  | 'course_config_saved'
  | 'baseline_submitted';

export interface AuditEntry {
  id: string;
  timestamp: string;
  facultyName: string;
  action: AuditAction;
  studentId?: string;
  studentName?: string;
  course?: string;
  courseId?: string;
  details?: string;
}
