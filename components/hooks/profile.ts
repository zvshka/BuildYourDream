import { useQuery } from '@tanstack/react-query';

export function useUserComponentsList(username?: string) {
  return useQuery({
    queryFn: async () => {},
    queryKey: ['user-components', username],
    enabled: !!username,
  });
}

export function useMyReportsList() {
  return useQuery({
    queryFn: async () => {},
    queryKey: ['my-reports'],
  });
}

export function useMyLikedConfigsList() {
  return useQuery({
    queryFn: async () => {},
    queryKey: ['my-liked-configs'],
  });
}
