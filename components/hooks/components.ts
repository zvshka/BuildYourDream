import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export function useComponentsList(templateId: string, filter?: any) {
  return useQuery({
    queryKey: ['components', 'list', templateId],
    queryFn: async (ctx) => {
      const { data } = await axios.get(`/api/templates/${templateId}/list`, {
        params: filter,
      });
      return data;
    },
    enabled: !!templateId,
  });
}

export function useComponentData(componentId?: string) {
  return useQuery({
    queryKey: ['components', componentId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/components/${componentId}`);
      return data;
    },
    enabled: !!componentId,
  });
}
