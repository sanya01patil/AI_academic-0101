import { useQuery } from '@tanstack/react-query';
import { submissionsApi } from '../api/submissions';

export const useSubmissions = () => {
  return useQuery({
    queryKey: ['submissions'],
    queryFn: submissionsApi.getAll,
  });
};

export const useSubmissionDetail = (id: string) => {
  return useQuery({
    queryKey: ['submission', id],
    queryFn: () => submissionsApi.getById(id),
    enabled: !!id,
  });
};
