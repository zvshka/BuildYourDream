import { ActionIcon, Group, Textarea } from '@mantine/core';
import { IconSend } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { showNotification } from '@mantine/notifications';
import { useAuth } from '../../../../Providers/AuthContext/AuthWrapper';
import { storage } from '../../../../../lib/utils';
import { queryClient } from '../../../../Providers/QueryProvider/QueryProvider';

export const CommentInput = ({
  replyCommentId,
  configId,
  componentId,
  threadCommentId,
}: {
  replyCommentId?: string;
  threadCommentId?: string;
  configId?: string;
  componentId?: string;
}) => {
  const { user } = useAuth();

  const form = useForm({
    initialValues: {
      body: '',
      replyCommentId: replyCommentId || '',
      threadCommentId: threadCommentId || '',
    },
  });

  const createCommentMutation = useMutation(
    (commentData: typeof form.values) =>
      axios.post(
        `/api/comments?${configId ? `configId=${configId}` : `componentId=${componentId}`}`,
        commentData,
        {
          headers: {
            authorization: `Bearer ${storage.getToken()}`,
          },
        }
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['comments', componentId || configId]);
        form.reset();
      },
      onError: (err: any) => {
        showNotification({
          title: 'Ошибка',
          message: err.response.data.message || 'Что-то пошло не так',
          color: 'red',
        });
      },
    }
  );

  const handleSubmit = (values: typeof form.values) => {
    createCommentMutation.mutate(values);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Group>
        <Textarea
          sx={{ flex: '1' }}
          minRows={1}
          maxRows={3}
          autosize
          {...form.getInputProps('body')}
          autoFocus
          required
          maxLength={150}
        />
        <ActionIcon color="blue" variant="outline" size="lg" type="submit" disabled={!user}>
          <IconSend />
        </ActionIcon>
      </Group>
    </form>
  );
};
