import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { storage } from '../../lib/utils';

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
        `/api/comments?${configId ? `configId=${configId}` : `componentId=${componentId}`}`,
        {
          headers: {
            authorization: `Bearer ${storage.getToken()}`,
          },
        }
      );
      return data;
    },
    queryKey: ['comments', configId || componentId],
    refetchInterval: 5000,
  });
}
