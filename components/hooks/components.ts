import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { IComponent } from '../../types/Template';

interface IComponentsList {
  totalCount: number;
  currentPage: number;
  result: { id: string; templateId: string; data: IComponent }[];
}

export function useComponentsList(templateId: string, filter?: any) {
  return useQuery<IComponentsList>({
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
