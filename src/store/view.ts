import { create } from 'zustand';

export type DashboardView = 'teaching' | 'admin';
export type AdminTab = 'bias' | 'health' | 'config' | 'audit';

interface ViewState {
  dashboardView: DashboardView;
  setDashboardView: (view: DashboardView) => void;
  activeAdminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;
}

export const useViewStore = create<ViewState>((set) => ({
  dashboardView: 'teaching',
  activeAdminTab: 'bias',
  setDashboardView: (dashboardView) => set({ dashboardView }),
  setAdminTab: (activeAdminTab) => set({ activeAdminTab }),
}));
