import { apiClient } from './axios';
import { Submission } from '../types/Submission';
import { mockSubmissions } from '../mocks/data';

export const submissionsApi = {
  getAll: async (): Promise<Submission[]> => {
    try {
      const res = await apiClient.get('/api/submissions');
      return res.data;
    } catch {
      return mockSubmissions;
    }
  },
  getById: async (id: string): Promise<Submission> => {
    try {
      const res = await apiClient.get(`/api/submissions/${id}`);
      return res.data;
    } catch {
      return mockSubmissions.find(s => s.id === id) || mockSubmissions[0];
    }
  },
  logAction: async (action: any) => {
    try {
      await apiClient.post('/api/faculty-actions', action);
    } catch {
      console.log('Mock: Action logged locally', action);
    }
  }
};
