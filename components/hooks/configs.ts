import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { storage } from '../../lib/utils';
import { IConfig, IConfigsList } from '../../types/Config';

export function useConfigsList(filter?: any) {
  return useQuery<IConfigsList>({
    queryKey: ['configs', 'list'],
    queryFn: async (ctx) => {
      const { data } = await axios.get('/api/configs', {
        params: filter,
        headers: {
          authorization: `Bearer ${storage.getToken()}`,
        },
      });
      return data;
    },
  });
}

export function useConfigData(configId: string) {
  return useQuery<IConfig>({
    queryKey: ['configs', 'list', configId],
    queryFn: async (ctx) => {
      const { data } = await axios.get(`/api/configs/${configId}`);
      return data;
    },
  });
}

export function useUserConfigsList(
  filter: {
    page: number;
    orderBy: 'createdAt' | 'liked' | 'comments';
    orderDir: 'desc' | 'asc';
    search: string;
  },
  username: string
) {
  return useQuery({
    queryFn: async () => {
      const { data } = await axios.get('/api/configs/my', {
        headers: {
          authorization: `Bearer ${storage.getToken()}`,
        },
        params: new URLSearchParams({
          page: filter.page.toString(),
          username,
        }),
      });
      return data;
    },
    queryKey: ['configs', 'list', username],
    enabled: !!username,
  });
}

export function useLikedConfigsList(filter: {
  page: number;
  orderBy: 'createdAt' | 'liked' | 'comments';
  orderDir: 'desc' | 'asc';
  search: string;
}) {
  return useQuery({
    queryFn: async () => {
      const { data } = await axios.get('/api/auth/me/liked', {
        headers: {
          authorization: `Bearer ${storage.getToken()}`,
        },
        params: filter,
      });
      return data;
    },
    queryKey: ['configs', 'list', 'liked'],
  });
}
