import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { User } from '../../types/User';

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
