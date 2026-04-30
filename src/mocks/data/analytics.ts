export const mockAnalytics = {
  riskDistribution: [
    { name: 'Critical', value: 5, color: '#ef4444' },
    { name: 'High', value: 12, color: '#f97316' },
    { name: 'Medium', value: 25, color: '#f59e0b' },
    { name: 'Low', value: 40, color: '#10b981' },
    { name: 'Clean', value: 150, color: '#6366f1' },
  ],
  violationTypes: [
    { type: 'AI Generated', count: 45 },
    { type: 'Plagiarism', count: 32 },
    { type: 'Collusion', count: 18 },
    { type: 'Identity Fraud', count: 5 },
  ],
  trendData: [
    { date: '2026-04-23', score: 25 },
    { date: '2026-04-24', score: 30 },
    { date: '2026-04-25', score: 28 },
    { date: '2026-04-26', score: 45 },
    { date: '2026-04-27', score: 38 },
    { date: '2026-04-28', score: 52 },
    { date: '2026-04-29', score: 65 },
  ],
};
