import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { User } from '../../types/User';
import { IComponentBody } from '../../types/Template';

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
    components: {
      id: string;
      templateId: string;
      data: IComponentBody;
    }[];
  }>({
    queryKey: ['configs', 'list', configId],
    queryFn: async (ctx) => {
      const { data } = await axios.get(`/api/configs/${configId}`);
      return data;
    },
  });
}
