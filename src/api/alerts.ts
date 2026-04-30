import { apiClient } from './axios';
import { Alert } from '../types/Alert';
import { mockAlerts } from '../mocks/data';

export const alertsApi = {
  getRecent: async (): Promise<Alert[]> => {
    try {
      const res = await apiClient.get('/api/alerts');
      return res.data;
    } catch {
      return mockAlerts as any[];
    }
  },
  markAsRead: async (id: string) => {
    try {
      await apiClient.post(`/api/alerts/${id}/read`);
    } catch {
      console.log('Mock: Alert marked as read', id);
    }
  }
};
