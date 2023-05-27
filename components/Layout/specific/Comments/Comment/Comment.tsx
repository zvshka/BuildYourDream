import {
  ActionIcon,
  Avatar,
  Box,
  createStyles,
  Group,
  rem,
  Text,
  Textarea,
  UnstyledButton,
} from '@mantine/core';
import dayjs from 'dayjs';
import {
  IconArrowBack,
  IconMinusVertical,
  IconPencil,
  IconPencilOff,
  IconSend,
  IconTrash,
} from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { showNotification } from '@mantine/notifications';
import { openConfirmModal } from '@mantine/modals';
import { useToggle } from '@mantine/hooks';
import { storage } from '../../../../../lib/utils';
import { queryClient } from '../../../../Providers/QueryProvider/QueryProvider';
import { Block } from '../../../general/Block/Block';
import { User } from '../../../../../types/User';
import { useAuth } from '../../../../Providers/AuthContext/AuthWrapper';
import { useForm } from '@mantine/form';

const useStyles = createStyles((theme) => ({
  body: {
    paddingLeft: rem(54),
    paddingTop: theme.spacing.sm,
  },
  answer: {
    color: theme.colors.blue[6],
    marginLeft: rem(54),
    '&:hover': {
      color: theme.colors.blue[9],
    },
  },
  button: {
    color: theme.colors.blue[6],
    '&:hover': {
      color: theme.colors.blue[9],
    },
  },
}));

export function Comment({
  commentData,
  replyId,
  onChooseReply,
}: {
  commentData: {
    id: string;
    replyCommentId: string;
    author: User;
    createdAt: Date;
    body: string;
    configId?: string;
    componentId?: string;
    isDeleted: boolean;
    isEdited: boolean;
    deletedBy: User;
  };
  replyId?: string;
  onChooseReply?: any;
}) {
  const { classes } = useStyles();
  const { user } = useAuth();
  const [isEditing, toggleEditing] = useToggle([false, true]);

  const form = useForm({
    initialValues: {
      body: commentData.body,
    },
  });

  const deleteMutation = useMutation(
    () =>
      axios.delete(`/api/comments/${commentData.id}`, {
        headers: {
          authorization: `Bearer ${storage.getToken()}`,
        },
      }),
    {
      onSuccess: () => {
        showNotification({
          title: 'Успех',
          message: 'Вы успешно удалили комментарий',
          color: 'green',
        });
        queryClient.invalidateQueries([
          'comments',
          commentData.componentId || commentData.configId,
        ]);
      },
      onError: () => {
        showNotification({
          title: 'Ошибка',
          message: 'Что-то пошло не так',
          color: 'red',
        });
      },
    }
  );

  const undeleteMutation = useMutation(
    () =>
      axios.get(`/api/comments/${commentData.id}/undelete`, {
        headers: {
          authorization: `Bearer ${storage.getToken()}`,
        },
      }),
    {
      onSuccess: () => {
        showNotification({
          title: 'Успех',
          message: 'Вы успешно восстановили сообщение',
          color: 'green',
        });
        queryClient.invalidateQueries([
          'comments',
          commentData.componentId || commentData.configId,
        ]);
      },
      onError: () => {
        showNotification({
          title: 'Ошибка',
          message: 'Что-то пошло не так',
          color: 'red',
        });
      },
    }
  );

  const updateMutation = useMutation(
    (values: typeof form.values) =>
      axios.patch(`/api/comments/${commentData.id}`, values, {
        headers: {
          authorization: `Bearer ${storage.getToken()}`,
        },
      }),
    {
      onSuccess: () => {
        showNotification({
          title: 'Успех',
          message: 'Вы успешно изменили комментарий',
          color: 'green',
        });
        toggleEditing();
        queryClient.invalidateQueries([
          'comments',
          commentData.componentId || commentData.configId,
        ]);
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

  const handleDelete = () => {
    openConfirmModal({
      title: 'Удаление комментария',
      children: <Text>Вы собираетесь удалить комментарий, продолжать?</Text>,
      labels: {
        confirm: 'Да',
        cancel: 'Нет',
      },
      onConfirm() {
        deleteMutation.mutate();
      },
    });
  };

  const handleUndelete = () => {
    undeleteMutation.mutate();
  };

  const handleSubmit = (values: typeof form.values) => {
    updateMutation.mutate(values);
  };

  return (
    <Block
      ml={commentData.replyCommentId ? '3rem' : 0}
      sx={(theme) => ({
        outline: replyId === commentData.id ? `2px solid ${theme.colors.blue[6]}` : '',
      })}
    >
      <Group position="apart">
        <Group>
          <Avatar
            src={commentData.author.avatarUrl}
            alt={commentData.author.username}
            radius="xl"
          />
          <Box>
            <Text size="sm">{commentData.author.username}</Text>
            <Text size="xs" color="dimmed">
              {dayjs(commentData.createdAt).toDate().toLocaleDateString()}{' '}
              {commentData.isEdited ? '(Изменено)' : ''}
            </Text>
          </Box>
        </Group>
        {!commentData.isDeleted && (
          <Group spacing="xs">
            {user && commentData.author.id === user.id && (
              <ActionIcon color="blue" size="lg" onClick={() => toggleEditing()}>
                {!isEditing ? <IconPencil /> : <IconPencilOff />}
              </ActionIcon>
            )}
            {user &&
              (commentData.author.id === user.id || ['ADMIN', 'MODERATOR'].includes(user.role)) && (
                <ActionIcon color="red" size="lg" onClick={handleDelete}>
                  <IconTrash />
                </ActionIcon>
              )}
          </Group>
        )}
        {user &&
          commentData.isDeleted &&
          commentData.deletedBy.role === 'USER' &&
          commentData.deletedBy.id === user.id && (
            <ActionIcon onClick={handleUndelete}>
              <IconArrowBack />
            </ActionIcon>
          )}
        {user &&
          commentData.isDeleted &&
          ['ADMIN', 'MODERATOR'].includes(commentData.deletedBy.role) &&
          ['ADMIN', 'MODERATOR'].includes(user.role) && (
            <ActionIcon onClick={handleUndelete}>
              <IconArrowBack />
            </ActionIcon>
          )}
      </Group>
      {!isEditing && (
        <Text
          className={classes.body}
          size="sm"
          color={commentData.isDeleted ? 'gray' : 'black'}
          italic={commentData.isDeleted}
        >
          {commentData.isDeleted ? (
            <>
              <Text>
                {' '}
                {'<'}Сообщение удалено{'>'}{' '}
              </Text>
              <Text>{commentData.body}</Text>
            </>
          ) : (
            commentData.body
          )}
        </Text>
      )}
      {isEditing && (
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Group mt="xs">
            <Textarea
              sx={{ flex: '1' }}
              minRows={1}
              maxRows={3}
              autosize
              ml={rem(54)}
              {...form.getInputProps('body')}
            />
            <ActionIcon color="blue" variant="outline" size="lg" type="submit" disabled={!user}>
              <IconSend />
            </ActionIcon>
          </Group>
        </form>
      )}
      <Group mt="xs" spacing={4} align="center">
        <UnstyledButton className={classes.answer} onClick={() => onChooseReply && onChooseReply()}>
          <Text h={30} size="sm">
            Ответить
          </Text>
        </UnstyledButton>
        <Box h={30}>
          <IconMinusVertical size={14} fill="gray" color="gray" />
        </Box>
        <UnstyledButton className={classes.button}>
          <Text h={30} size="sm">
            Пожаловаться
          </Text>
        </UnstyledButton>
      </Group>
    </Block>
  );
}