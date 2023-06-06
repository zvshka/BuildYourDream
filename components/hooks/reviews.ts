import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export function useComponentReviews(componentId: string, filter: any) {
  return useQuery({
    queryKey: ['reviews', componentId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/components/${componentId}/reviews`, {
        params: {
          orderBy: filter.orderBy,
          page: filter.page,
          orderDir: filter.orderDir,
        },
      });
      return data;
    },
    enabled: !!componentId,
  });
}

export function useUserReviews(username: string, filter: any) {
  return useQuery({
    queryKey: ['reviews', username],
    queryFn: async () => {
      const { data } = await axios.get(`/api/users/${username}/reviews`, {
        params: {
          orderBy: filter.orderBy,
          page: filter.page,
          orderDir: filter.orderDir,
        },
      });
      return data;
    },
    enabled: !!username,
  });
}
