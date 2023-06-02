import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { IConstraintFieldValue } from '../../types/Constraints';

export function useConstraintsList() {
  return useQuery<{ id: string; data: IConstraintFieldValue }[]>({
    queryKey: ['constraints', 'list'],
    queryFn: async () => {
      const { data } = await axios.get('/api/constraints');
      return data;
    },
  });
}
