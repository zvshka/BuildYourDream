import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { User } from '../../types/User';
import { IComponent } from '../../types/Template';
import { storage } from '../../lib/utils';

interface IConfigsList {
  totalCount: number;
  currentPage: number;
  result: {
    id: string;
    title: string;
    description: string;
    author: User;
  }[];
}

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
  return useQuery<{
    id: string;
    title: string;
    description: string;
    author: User;
    authorId: string;
    price: [number, number];
    configTier: string;
    components: {
      id: string;
      templateId: string;
      componentId: string;
      component: IComponent;
    }[];
  }>({
    queryKey: ['configs', 'list', configId],
    queryFn: async (ctx) => {
      const { data } = await axios.get(`/api/configs/${configId}`);
      return data;
    },
  });
}
