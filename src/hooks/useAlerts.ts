import { useQuery } from '@tanstack/react-query';
import { alertsApi } from '../api/alerts';
import { useAlertStore } from '../store/alerts';
import { useEffect } from 'react';

export const useAlerts = () => {
  const { addAlert } = useAlertStore();
  
  const query = useQuery({
    queryKey: ['alerts'],
    queryFn: alertsApi.getRecent,
  });

  useEffect(() => {
    if (query.data) {
      query.data.forEach(alert => addAlert(alert as any));
    }
  }, [query.data, addAlert]);

  return query;
};
