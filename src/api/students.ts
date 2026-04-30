import { apiClient } from './axios';
import { Student } from '../types/Student';
import { mockStudents } from '../mocks/data';

export const studentsApi = {
  getById: async (id: string): Promise<Student> => {
    try {
      const res = await apiClient.get(`/api/students/${id}`);
      return res.data;
    } catch {
      return mockStudents.find(s => s.id === id) || mockStudents[0];
    }
  },
  getAll: async (): Promise<Student[]> => {
    try {
      const res = await apiClient.get('/api/students');
      return res.data;
    } catch {
      return mockStudents;
    }
  }
};
