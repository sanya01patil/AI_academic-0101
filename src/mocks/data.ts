import { subDays, subWeeks } from 'date-fns';
import { Student, RiskLevel } from '../types/Student';
import { Submission, ShapFactor } from '../types/Submission';
import { Alert } from '../types/Alert';
import { AuditEntry } from '../types/FacultyAction';

/* ─── Courses ───────────────────────────────────────── */
export const courses = [
  { id: 'CS301', name: 'Advanced Algorithms' },
  { id: 'ENG204', name: 'Academic Writing' },
  { id: 'BUS401', name: 'Business Strategy' },
];

/* ─── Helper: Generate Submissions ─────────────────── */
const generateSHAP = (studentName: string, score: number) => {
  if (score < 70) return "No significant integrity concerns detected. Writing patterns align with established student baseline.";
  const metrics = [
    { text: "Writing vocabulary complexity increased 2.8σ above Week 2 baseline.", weight: 0.4 },
    { text: `Submission completed 47% faster than rolling average.`, weight: 0.3 },
    { text: "Text burstiness score of 0.21 indicates unusually uniform structure.", weight: 0.2 },
    { text: "Stylometric drift detected in function word distribution.", weight: 0.1 }
  ];
  return metrics.map(m => m.text).join(" ");
};

const generateSignals = (score: number): ShapFactor[] => [
  { label: 'AI Probability', value: Math.min(100, score + 10), weight: 0.4 },
  { label: 'Style Shift', value: Math.max(0, score - 20), weight: 0.3 },
  { label: 'Grade Anomaly', value: Math.max(0, score - 40), weight: 0.2 },
  { label: 'Submission Speed', value: Math.max(0, score - 15), weight: 0.1 },
];

/* ─── Student Data (25 Students) ────────────────────── */
const names = [
  { name: 'Arun Karthik', id: 'CS2023001', course: 'CS301' },
  { name: 'Priyanka Rao', id: 'CS2023002', course: 'CS301' },
  { name: 'Sanjay Vishwanathan', id: 'CS2023003', course: 'CS301' },
  { name: 'Meera Iyer', id: 'CS2023004', course: 'CS301' },
  { name: 'Vijay Raghavan', id: 'CS2023005', course: 'CS301' },
  { name: 'Deepa Lakshmi', id: 'CS2023006', course: 'CS301' },
  { name: 'Karthik Subramanian', id: 'CS2023007', course: 'CS301' },
  { name: 'Ananya Deshmukh', id: 'CS2023008', course: 'CS301' },
  { name: 'Rohan Gupta', id: 'CS2023009', course: 'CS301' },
  { name: 'Sneha Reddy', id: 'CS2023010', course: 'CS301' },
  { name: 'Aditi Sharma', id: 'ENG2023001', course: 'ENG204' },
  { name: 'Rahul Verma', id: 'ENG2023002', course: 'ENG204' },
  { name: 'Ishani Kapoor', id: 'ENG2023003', course: 'ENG204' },
  { name: 'Vikram Singh', id: 'ENG2023004', course: 'ENG204' },
  { name: 'Kavita Nair', id: 'ENG2023005', course: 'ENG204' },
  { name: 'Abhishek Patel', id: 'ENG2023006', course: 'ENG204' },
  { name: 'Tanvi Joshi', id: 'ENG2023007', course: 'ENG204' },
  { name: 'Manish Pandey', id: 'ENG2023008', course: 'ENG204' },
  { name: 'Suraj Kumar', id: 'BUS2023001', course: 'BUS401' },
  { name: 'Neha Bansal', id: 'BUS2023002', course: 'BUS401' },
  { name: 'Amit Saxena', id: 'BUS2023003', course: 'BUS401' },
  { name: 'Ritu Malhotra', id: 'BUS2023004', course: 'BUS401' },
  { name: 'Gautam Chopra', id: 'BUS2023005', course: 'BUS401' },
  { name: 'Pooja Hegde', id: 'BUS2023006', course: 'BUS401' },
  { name: 'Varun Dhawan', id: 'BUS2023007', course: 'BUS401' },
];

export const mockStudents: Student[] = names.map((n, i) => {
  let avgScore = 25;
  if (i < 6) avgScore = 82;
  else if (i < 15) avgScore = 55;

  return {
    id: n.id,
    name: n.name,
    studentId: n.id,
    studentCode: n.id,
    email: `${n.name.toLowerCase().replace(' ', '.')}@university.edu`,
    courseIds: [n.course],
    overallRiskLevel: (avgScore >= 70 ? 'high' : avgScore >= 40 ? 'medium' : 'low') as RiskLevel,
    overallRiskScore: avgScore,
    submissionCount: 8,
    flaggedCount: i < 6 ? 3 : 0,
    lastActivity: subDays(new Date(), Math.floor(Math.random() * 5)).toISOString(),
    year: '3rd Year',
    department: n.course.startsWith('CS') ? 'Computer Science' : n.course.startsWith('ENG') ? 'English' : 'Business',
    enrolmentStatus: 'Full-time',
    baselineStatus: 'Verified',
    baseline: { avgSentenceLen: 18, vocabComplexity: 40, funcWordFreq: 30, burstiness: 0.6 },
    latest: { 
      avgSentenceLen: avgScore > 70 ? 25 : 19, 
      vocabComplexity: avgScore > 70 ? 65 : 42, 
      funcWordFreq: avgScore > 70 ? 22 : 31, 
      burstiness: avgScore > 70 ? 0.2 : 0.65 
    },
  };
});

/* ─── Submissions Data (~120 Submissions) ──────────── */
export const mockSubmissions: Submission[] = [];

mockStudents.forEach(student => {
  const numSubs = 4 + Math.floor(Math.random() * 3);
  for (let j = 0; j < numSubs; j++) {
    let score = student.overallRiskScore + (Math.random() * 20 - 10);
    if (student.id === 'CS2023003') score = Math.max(10, 80 - j * 15); 
    if (student.id === 'CS2023001') score = 85 + Math.random() * 10; 

    score = Math.min(98, Math.max(5, Math.round(score)));
    const riskLevel: RiskLevel = score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low';

    mockSubmissions.push({
      id: `SUB-${student.id}-${j}`,
      studentId: student.id,
      studentName: student.name,
      studentEmail: student.email,
      courseId: student.courseIds[0],
      courseName: courses.find(c => c.id === student.courseIds[0])?.name || '',
      assignmentName: `Project Milestone ${j + 1}`,
      title: `${student.courseIds[0] === 'CS301' ? 'Algorithm Performance Analysis' : student.courseIds[0] === 'ENG204' ? 'Critical Literary Theory' : 'Market Competitive Strategy'}`,
      timestamp: subWeeks(new Date(), 12 - j).toISOString(),
      riskScore: score,
      riskLevel,
      aiLikelihood: Math.min(100, score + 5),
      styleShift: Math.max(0, score - 15),
      gradeAnomaly: score > 80 ? 'high' : 'none',
      submissionSpeed: Math.max(0, score - 10),
      status: riskLevel === 'high' ? 'escalated' : riskLevel === 'medium' ? 'reviewed' : 'cleared',
      shapExplanation: generateSHAP(student.name, score),
      signals: generateSignals(score),
      content: "This project explores the multifaceted applications of optimization algorithms in dynamic environments..."
    });
  }
});

/* ─── Admin Mock Data ───────────────────────────────── */
export const mockBiasAudit = [
  { group: 'English as Second Language', flagged: 42, total: 280, fpRate: 15.0, trend: 'stable' },
  { group: 'STEM Background', flagged: 18, total: 310, fpRate: 5.8, trend: 'down' },
  { group: 'Humanities Background', flagged: 35, total: 240, fpRate: 14.5, trend: 'up' },
  { group: 'International Students', flagged: 55, total: 320, fpRate: 17.2, trend: 'stable' },
];

export const mockAuditLog: AuditEntry[] = [
  { id: 'a1', timestamp: '2026-04-29T10:42:00Z', facultyName: 'Prof. Anirudh Iyer', action: 'flag_committee', studentId: 'CS2023001', studentName: 'Arun Karthik', course: 'CS301: Advanced Algorithms', courseId: 'CS301' },
  { id: 'a2', timestamp: '2026-04-29T09:30:00Z', facultyName: 'Dr. Meenakshi Sundaram', action: 'view_history', studentId: 'CS2023002', studentName: 'Priyanka Rao', course: 'CS301: Advanced Algorithms', courseId: 'CS301' },
  { id: 'a3', timestamp: '2026-04-29T08:55:00Z', facultyName: 'Prof. Anirudh Iyer', action: 'request_explanation', studentId: 'CS2023003', studentName: 'Sanjay Vishwanathan', course: 'CS301: Advanced Algorithms', courseId: 'CS301' },
  { id: 'a4', timestamp: '2026-04-28T16:10:00Z', facultyName: 'System Admin', action: 'recalibrate_triggered', details: 'Global model recalibration triggered by performance drift.' },
];

export const mockAlerts: Alert[] = [
  { id: 'al1', type: 'CRITICAL', message: 'Arun Karthik: Significant stylometric drift detected in CS301.', timestamp: subDays(new Date(), 1).toISOString(), isRead: false, submissionId: 'SUB-CS2023001-0' },
  { id: 'al2', type: 'HIGH', message: 'Sanjay Vishwanathan: AI writing pattern detected in ENG204.', timestamp: subDays(new Date(), 2).toISOString(), isRead: false, submissionId: 'SUB-CS2023003-1' },
  { id: 'al3', type: 'MEDIUM', message: 'Meera Iyer: Grade anomaly identified in CS301.', timestamp: subDays(new Date(), 3).toISOString(), isRead: true, submissionId: 'SUB-CS2023004-0' },
];

export const mockModelHealth = {
  overallStatus: 'Healthy',
  lastTraining: subDays(new Date(), 12).toISOString(),
  accuracy: 0.94,
  fpRate: 0.04,
  activeNodes: 8,
  queueLoad: 12
};

export const mockAccuracyHistory = [
  { cycle: 'T-11', accuracy: 91.2 },
  { cycle: 'T-10', accuracy: 92.5 },
  { cycle: 'T-9', accuracy: 92.8 },
  { cycle: 'T-8', accuracy: 93.1 },
  { cycle: 'T-7', accuracy: 93.0 },
  { cycle: 'T-6', accuracy: 94.4 },
  { cycle: 'T-5', accuracy: 94.2 },
  { cycle: 'T-4', accuracy: 95.7 },
  { cycle: 'T-3', accuracy: 96.0 },
  { cycle: 'T-2', accuracy: 95.8 },
  { cycle: 'T-1', accuracy: 96.5 },
  { cycle: 'Now', accuracy: 96.8 },
];

export const mockCourseConfigs = {
  'CS301': { threshold: 70, requireExplanation: true, autoFlag: true },
  'ENG204': { threshold: 65, requireExplanation: true, autoFlag: false },
  'BUS401': { threshold: 75, requireExplanation: false, autoFlag: true },
};
