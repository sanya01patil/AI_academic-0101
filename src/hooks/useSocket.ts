import { useEffect } from 'react';
import { socket } from '../api/socket';
import { useAlertStore } from '../store/alerts';
import { Alert } from '../types/Alert';
import { useQueryClient } from '@tanstack/react-query';

export const useSocket = () => {
  const { addAlert } = useAlertStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    socket.on('new_alert', (alert: Alert) => {
      addAlert(alert);
    });

    socket.on('score_updated', ({ submissionId }: { submissionId: string }) => {
      // Invalidate React Query cache for this submission
      queryClient.invalidateQueries({ queryKey: ['submission', submissionId] });
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
    });

    return () => {
      socket.off('new_alert');
      socket.off('score_updated');
    };
  }, [addAlert, queryClient]);

  return socket;
};
