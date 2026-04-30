import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

export const api = {
  submissions: {
    getAll: () => axios.get(`${API_BASE}/submissions`),
    getOne: (id: string) => axios.get(`${API_BASE}/submissions/${id}`),
    getByStudent: (studentId: string) => axios.get(`${API_BASE}/submissions/student/${studentId}`),
    submitText: (data: any) => axios.post(`${API_BASE}/submissions/text`, data),
    uploadFile: (formData: FormData) => axios.post(`${API_BASE}/submissions/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  },
  alerts: {
    getAll: () => axios.get(`${API_BASE}/alerts`),
    markRead: (id: string) => axios.post(`${API_BASE}/alerts/${id}/read`),
  },
  faculty: {
    logAction: (data: any) => axios.post(`${API_BASE}/faculty-actions`, data),
  },
  students: {
    getAll: () => axios.get(`${API_BASE}/students`),
    getOne: (id: string) => axios.get(`${API_BASE}/students/${id}`),
  },
  baseline: {
    submitSample: (data: any) => axios.post(`${API_BASE}/baseline-sample`, data),
  }
};
