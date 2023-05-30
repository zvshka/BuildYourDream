import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { storage } from '../../lib/utils';

export function useUserData(username: string) {
  return useQuery({
    queryKey: ['users', 'list', username],
    queryFn: async () => {
      const { data } = await axios.get(`/api/users/${username}`, {
        headers: {
          authorization: `Bearer ${storage.getToken()}`,
        },
      });

      return data;
    },
    enabled: !!username,
  });
}

export function useUsersList(filter: {
  page: number;
  search: string;
  sortColumn: string;
  sortDirection: 'desc' | 'asc';
}) {
  return useQuery({
    queryKey: ['users', 'list'],
    queryFn: async () => {
      const { data } = await axios.get('/api/users', {
        headers: {
          authorization: `Bearer ${storage.getToken()}`,
        },
        params: new URLSearchParams({
          page: filter.page.toString(),
          search: filter.search,
          sortColumn: filter.sortColumn,
          sortDirection: filter.sortDirection,
        }),
      });
      return data;
    },
  });
}
