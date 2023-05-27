import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { storage } from '../../lib/utils';

export function useUserData(username: string) {
  return useQuery({
    queryKey: ['users', username],
    queryFn: async () => {
      const { data } = await axios.get(`/api/users/${username}`, {
        headers: {
          authorization: `Bearer ${storage.getToken()}`,
        },
      });

      return data;
    },
    enabled: !!username,
  });
}
