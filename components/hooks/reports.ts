import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { storage } from '../../lib/utils';

export function useReportsList(filter: {
  page: number;
  search: string;
  createdAt: [Date | null, Date | null];
  reviewAt: [Date | null, Date | null];
  status: 'all' | 'approved' | 'rejected' | 'waiting';
}) {
  return useQuery({
    queryFn: async () => {
      const { data } = await axios.get('/api/reports', {
        params: new URLSearchParams({
          page: filter.page.toString(),
          search: filter.search,
          status: filter.status,
          ...(filter.createdAt[0] && filter.createdAt[1]
            ? {
                createdAt: new URLSearchParams({
                  gt: filter.createdAt[0] ? filter.createdAt[0]?.toISOString() : '',
                  lt: filter.createdAt[1] ? filter.createdAt[1]?.toISOString() : '',
                }).toString(),
              }
            : {}),
          ...(filter.reviewAt[0] && filter.reviewAt[1]
            ? {
                reviewAt: new URLSearchParams({
                  gt: filter.reviewAt[0] ? filter.reviewAt[0]?.toISOString() : '',
                  lt: filter.reviewAt[1] ? filter.reviewAt[1]?.toISOString() : '',
                }).toString(),
              }
            : {}),
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

export function useMyReportsList(filter: {
  page: number;
  search: string;
  createdAt: [Date | null, Date | null];
  reviewAt: [Date | null, Date | null];
  status: 'all' | 'approved' | 'rejected' | 'waiting';
}) {
  return useQuery({
    queryFn: async () => {
      const { data } = await axios.get('/api/reports/my', {
        params: new URLSearchParams({
          page: filter.page.toString(),
          search: filter.search,
          status: filter.status,
          ...(filter.createdAt[0] && filter.createdAt[1]
            ? {
                createdAt: new URLSearchParams({
                  gt: filter.createdAt[0] ? filter.createdAt[0]?.toISOString() : '',
                  lt: filter.createdAt[1] ? filter.createdAt[1]?.toISOString() : '',
                }).toString(),
              }
            : {}),
          ...(filter.reviewAt[0] && filter.reviewAt[1]
            ? {
                reviewAt: new URLSearchParams({
                  gt: filter.reviewAt[0] ? filter.reviewAt[0]?.toISOString() : '',
                  lt: filter.reviewAt[1] ? filter.reviewAt[1]?.toISOString() : '',
                }).toString(),
              }
            : {}),
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
