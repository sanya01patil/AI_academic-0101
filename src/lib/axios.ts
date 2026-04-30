// Re-export canonical apiClient. All logic (auth token, 401 handler) lives in src/api/axios.ts.
export { apiClient as default } from '../api/axios';
