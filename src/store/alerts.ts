import { create } from 'zustand';
import { Alert } from '../types/Alert';

interface AlertState {
  alerts: Alert[];
  unreadCount: number;
  addAlert: (alert: Alert) => void;
  markAsRead: (id: string) => void;
  markAllRead: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  alerts: [],
  unreadCount: 0,
  addAlert: (alert) =>
    set((state) => {
      const newAlerts = [alert, ...state.alerts];
      return {
        alerts: newAlerts,
        unreadCount: newAlerts.filter((a) => !a.isRead).length,
      };
    }),
  markAsRead: (id) =>
    set((state) => {
      const newAlerts = state.alerts.map((a) =>
        a.id === id ? { ...a, isRead: true } : a
      );
      return {
        alerts: newAlerts,
        unreadCount: newAlerts.filter((a) => !a.isRead).length,
      };
    }),
  markAllRead: () =>
    set((state) => {
      const newAlerts = state.alerts.map((a) => ({ ...a, isRead: true }));
      return {
        alerts: newAlerts,
        unreadCount: 0,
      };
    }),
}));
