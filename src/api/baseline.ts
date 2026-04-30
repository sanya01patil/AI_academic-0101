import { apiClient } from './axios';

export const baselineApi = {
  submitSample: async (sample: { studentId: string; text: string; timeTaken: number }) => {
    try {
      await apiClient.post('/api/baseline-sample', sample);
    } catch {
      console.log('Mock: Baseline sample submitted', sample);
    }
  }
};
