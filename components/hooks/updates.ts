import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export function useUpdatesList(filter) {
  return useQuery<{ totalCount: number; currentPage: number; result: any[] }>({
    queryKey: ['updates', 'list'],
    queryFn: async () => {
      const { data } = await axios.get('/api/updates', {
        params: filter,
      });
      return data;
    },
  });
}
