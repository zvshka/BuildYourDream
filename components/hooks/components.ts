import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { IComponentBody } from '../../types/Template';

interface IComponentsList {
  totalCount: number;
  currentPage: number;
  result: { id: string; templateId: string; data: IComponentBody; totalComments: number }[];
}

export function useComponentsList(
  templateId: string,
  filter: {
    page: number;
    search: string;
    tiers: string[];
  }
) {
  return useQuery<IComponentsList>({
    queryKey: ['components', 'list', templateId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/templates/${templateId}/list`, {
        params: filter,
      });
      return data;
    },
    enabled: !!templateId,
  });
}

export function useUserComponentsList(
  username: string,
  filter: {
    page: number;
    search: string;
    tiers: string[];
  }
) {
  return useQuery<IComponentsList>({
    queryKey: ['components', 'list', 'my'],
    queryFn: async () => {
      const { data } = await axios.get('/api/components/my', {
        params: {
          ...filter,
          username,
        },
      });
      return data;
    },
    enabled: !!username,
  });
}

export function useUnapprovedList(filter?: any) {
  return useQuery<IComponentsList>({
    queryKey: ['components', 'list', 'unapproved'],
    queryFn: async () => {
      const { data } = await axios.get('/api/components/unapproved', {
        params: filter,
      });
      return data;
    },
  });
}

export function useComponentData(componentId?: string) {
  return useQuery<{ id: string; templateId: string; data: IComponentBody }>({
    queryKey: ['components', componentId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/components/${componentId}`);
      return data;
    },
    enabled: !!componentId,
  });
}
