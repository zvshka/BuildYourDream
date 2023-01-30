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

export function useTemplateData(templateId?: string) {
  return useQuery({
    queryKey: ['templates', templateId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/templates/${templateId}`);
      return data;
    },
    enabled: !!templateId,
  });
}
