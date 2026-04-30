import { apiClient } from './axios';

export const adminApi = {
  getBiasAudit: async () => {
    try {
      const res = await apiClient.get('/api/admin/bias-audit');
      return res.data;
    } catch {
      return null; // Handle in UI with mock data
    }
  },
  recalibrate: async () => {
    try {
      await apiClient.post('/api/admin/recalibrate');
    } catch {
      console.log('Mock: Model recalibration triggered');
    }
  },
  saveCourseConfig: async (config: any) => {
    try {
      await apiClient.post('/api/admin/course-config', config);
    } catch {
      console.log('Mock: Course config saved', config);
    }
  }
};
