import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export function useTemplatesList() {
  return useQuery({
    queryKey: ['templates', 'list'],
    queryFn: async () => {
      const { data } = await axios.get('/api/templates');
      return data;
    },
  });
}
