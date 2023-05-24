import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export function useCommentsList({
  configId,
  componentId,
}: {
  configId?: string;
  componentId?: string;
}) {
  return useQuery<any[]>({
    queryFn: async () => {
      const { data } = await axios.get(
        `/api/comments?${configId ? `configId=${configId}` : `componentId=${componentId}`}`
      );
      return data;
    },
    queryKey: ['comments', configId || componentId],
    refetchInterval: 5000,
  });
}
