import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { storage } from '../../lib/utils';

export function useReportsList(filter: { page: number }) {
  return useQuery({
    queryFn: async () => {
      const { data } = await axios.get('/api/reports', {
        params: new URLSearchParams({
          page: filter.page.toString(),
        }),
        headers: {
          authorization: `Bearer ${storage.getToken()}`,
        },
      });

      return data;
    },
    queryKey: ['reports', 'list'],
  });
}

export function useMyReportsList(filter: { page: number }) {
  return useQuery({
    queryFn: async () => {
      const { data } = await axios.get('/api/reports/my', {
        params: new URLSearchParams({
          page: filter.page.toString(),
        }),
        headers: {
          authorization: `Bearer ${storage.getToken()}`,
        },
      });

      return data;
    },
    queryKey: ['reports', 'list', 'my'],
  });
}
