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
  IconFlag,
  IconMessage,
  IconMinusVertical,
  IconPencil,
  IconPencilOff,
  IconSend,
  IconTrash,
  IconTrashOff,
} from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { showNotification } from '@mantine/notifications';
import { openConfirmModal, openModal } from '@mantine/modals';
import { useToggle } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { useContextMenu } from 'mantine-contextmenu';
import Link from 'next/link';
import { storage } from '../../../../../lib/utils';
import { queryClient } from '../../../../Providers/QueryProvider/QueryProvider';
import { Block } from '../../../general/Block/Block';
import { User } from '../../../../../types/User';
import { useAuth } from '../../../../Providers/AuthContext/AuthWrapper';
import { ReportForm } from '../../../forms/ReportForm/ReportForm';
import { useEffect, useState } from 'react';

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
    authorId: string;
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
  const showContextMenu = useContextMenu();
  const [contextMenu, setContextMenu] = useState<any[]>([]);

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

  const handleReport = () => {
    openModal({
      title: 'Жалоба на комментарий',
      children: <ReportForm commentId={commentData.id} />,
    });
  };

  const handleReportUser = () => {
    openModal({
      title: 'Жалоба на пользователя',
      children: <ReportForm userId={commentData.author.id} />,
    });
  };

  useEffect(() => {
    if (user) {
      if (user.id !== commentData.authorId && user.role === 'USER') {
        setContextMenu([
          {
            key: 'answer',
            onClick: () => onChooseReply && onChooseReply(),
            title: 'Ответить на комментарий',
            icon: <IconMessage size="1rem" />,
          },
          {
            key: 'report',
            onClick: handleReport,
            title: 'Пожаловаться на комментарий',
            icon: <IconFlag size="1rem" />,
            color: 'red',
          },
        ]);
      } else if (user.id === commentData.authorId || user.role !== 'USER') {
        setContextMenu(
          [
            {
              key: 'answer',
              onClick: () => onChooseReply && onChooseReply(),
              title: 'Ответить на комментарий',
              icon: <IconMessage size="1rem" />,
            },
            user.id === commentData.authorId && {
              key: 'edit',
              onClick: () => toggleEditing(),
              title: 'Изменить комментарий',
              icon: <IconPencil size="1rem" />,
            },
            !commentData.isDeleted && {
              key: 'delete',
              onClick: handleDelete,
              title: 'Удалить комментарий',
              icon: <IconTrash size="1rem" />,
              color: 'red',
            },
            commentData.isDeleted &&
              commentData.deletedBy &&
              (commentData.deletedBy.id === user.id ||
                (commentData.deletedBy.role === 'USER' && commentData.deletedBy.id === user.id) ||
                (commentData.deletedBy.role !== 'USER' && user.role !== 'USER')) && {
                key: 'undelete',
                onClick: handleUndelete,
                title: 'Восстановить комментарий',
                icon: <IconTrashOff size="1rem" />,
                color: 'blue',
              },
          ].filter((v) => v)
        );
      }
    }
  }, [user]);

  console.log(commentData);

  return (
    <Block
      ml={commentData.replyCommentId ? '3rem' : 0}
      sx={(theme) => ({
        outline: replyId === commentData.id ? `2px solid ${theme.colors.blue[6]}` : '',
      })}
      onContextMenu={showContextMenu(contextMenu)}
    >
      <Group position="apart">
        <Link href={`/profile/${commentData.author.username}`}>
          <Group
            sx={{ cursor: 'pointer' }}
            onContextMenu={showContextMenu([
              {
                key: 'report',
                icon: <IconFlag size="1rem" />,
                onClick: handleReportUser,
                title: 'Пожаловаться',
                color: 'red',
              },
            ])}
          >
            <Avatar
              src={commentData.author.avatarUrl}
              alt={commentData.author.username}
              radius="xl"
            />
            <Box>
              <Text size="md">{commentData.author.username}</Text>
              <Text size="xs" color="dimmed">
                {dayjs(commentData.createdAt).toDate().toLocaleDateString()}{' '}
                {commentData.isEdited ? '(Изменено)' : ''}
              </Text>
            </Box>
          </Group>
        </Link>
        {!commentData.isDeleted && (
          <Group spacing="xs">
            {user && commentData.author.id === user.id && (
              <ActionIcon color="blue" size="lg" onClick={() => toggleEditing()}>
                {!isEditing ? <IconPencil /> : <IconPencilOff />}
              </ActionIcon>
            )}
            {user && (commentData.author.id === user.id || user.role !== 'USER') && (
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
          commentData.deletedBy.role !== 'USER' &&
          user.role !== 'USER' && (
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
          {!commentData.isDeleted ||
          (commentData.isDeleted &&
            user &&
            (user.role !== 'USER' || user.id === commentData.authorId)) ? (
            commentData.body
          ) : (
            <Text span>
              {'<'}Сообщение удалено{'>'}
            </Text>
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
      {user && (
        <Group mt="xs" spacing={4} align="center">
          <UnstyledButton
            className={classes.answer}
            onClick={() => onChooseReply && onChooseReply()}
          >
            <Text h={30} size="sm">
              Ответить
            </Text>
          </UnstyledButton>
          {user.id !== commentData.author.id && (
            <>
              <Box h={30}>
                <IconMinusVertical size={14} fill="gray" color="gray" />
              </Box>
              <UnstyledButton className={classes.button} onClick={handleReport}>
                <Text h={30} size="sm">
                  Пожаловаться
                </Text>
              </UnstyledButton>
            </>
          )}
        </Group>
      )}
    </Block>
  );
}
