import { create } from 'zustand';

export type RiskFilter = 'ALL' | 'HIGH' | 'MEDIUM' | 'LOW';

interface FilterState {
  riskFilter: RiskFilter;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  setRiskFilter: (filter: RiskFilter) => void;
  setSort: (field: string, direction: 'asc' | 'desc') => void;
  toggleSort: (field: string) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  riskFilter: 'ALL',
  sortField: 'timestamp',
  sortDirection: 'desc',
  setRiskFilter: (riskFilter) => set({ riskFilter }),
  setSort: (sortField, sortDirection) => set({ sortField, sortDirection }),
  toggleSort: (field) => set((state) => ({
    sortField: field,
    sortDirection: state.sortField === field && state.sortDirection === 'desc' ? 'asc' : 'desc'
  })),
}));
