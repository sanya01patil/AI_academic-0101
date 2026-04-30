import { create } from 'zustand';
import { UserRole } from './auth';

interface UserState {
  role: UserRole;
  activeCourseFilter: string;
  setRole: (role: UserRole) => void;
  setCourseFilter: (courseId: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  role: 'faculty',
  activeCourseFilter: 'all',
  setRole: (role) => set({ role }),
  setCourseFilter: (activeCourseFilter) => set({ activeCourseFilter }),
}));
