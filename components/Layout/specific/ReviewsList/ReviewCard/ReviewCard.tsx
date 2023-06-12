import {
  ActionIcon,
  Avatar,
  Box,
  createStyles,
  Group,
  Rating,
  rem,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { IconFlag, IconMinusVertical, IconPencil, IconTrash } from '@tabler/icons-react';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useContextMenu } from 'mantine-contextmenu';
import { useEffect, useState } from 'react';
import { openConfirmModal, openModal } from '@mantine/modals';
import axios from 'axios';
import { showNotification } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import { Block } from '../../../general';
import { useAuth } from '../../../../Providers/AuthContext/AuthWrapper';
import { ReviewModal } from '../ReviewModal/ReviewModal';
import { storage } from '../../../../../lib/utils';
import { queryClient } from '../../../../Providers/QueryProvider/QueryProvider';
import { ReportForm } from '../../../forms';

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

export const ReviewCard = ({ author, createdAt, updatedAt, text, rating, id, component }) => {
  const { classes } = useStyles();
  const [contextMenu, setContextMenu] = useState<any[]>([]);
  const showContextMenu = useContextMenu();
  const { user } = useAuth();

  const deleteReviewMutation = useMutation(
    () =>
      axios.delete(`/api/reviews/${id}`, {
        headers: {
          authorization: `Bearer ${storage.getToken()}`,
        },
      }),
    {
      onSuccess: () => {
        showNotification({
          title: 'Успех',
          message: 'Вы успешно удалили отзыв',
          color: 'green',
        });
        queryClient.invalidateQueries(['reviews']);
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

  const handleEdit = () => {
    openModal({
      title: 'Изменение отзыва',
      children: <ReviewModal reviewData={{ author, id, rating, text }} />,
    });
  };

  const handleDelete = () => {
    openConfirmModal({
      title: 'Удаление отзыва',
      children: <Text>Вы собираетесь удалить отзыв, продолжить?</Text>,
      labels: {
        confirm: 'Да',
        cancel: 'Нет',
      },
      onConfirm() {
        deleteReviewMutation.mutate();
      },
    });
  };

  const handleReport = () => {};

  const handleReportUser = () => {
    openModal({
      title: 'Жалоба на пользователя',
      children: <ReportForm userId={author.id} />,
    });
  };

  useEffect(() => {
    if (user) {
      if (user.id !== author.id && user.role === 'USER') {
        setContextMenu([
          {
            key: 'report',
            onClick: handleReport,
            title: 'Пожаловаться на комментарий',
            icon: <IconFlag size="1rem" />,
            color: 'red',
          },
        ]);
      } else if (user.id === author.id || user.role !== 'USER') {
        setContextMenu(
          [
            user.id === author.id && {
              key: 'edit',
              onClick: handleEdit,
              title: 'Изменить отзыв',
              icon: <IconPencil size="1rem" />,
            },
            {
              key: 'delete',
              onClick: handleDelete,
              title: 'Удалить отзыв',
              icon: <IconTrash size="1rem" />,
              color: 'red',
            },
            user.id !== author.id && {
              key: 'report',
              onClick: handleReport,
              title: 'Пожаловаться на отзыв',
              icon: <IconFlag size="1rem" />,
              color: 'red',
            },
          ].filter((v) => v)
        );
      }
    }
  }, [user]);

  return (
    <Block onContextMenu={showContextMenu(contextMenu)}>
      <Group position="apart">
        <Group align="normal">
          <Link
            href={`/profile/${author.username}`}
            style={{ textDecoration: 'none', color: 'black' }}
          >
            <Group
              sx={{ cursor: 'pointer' }}
              onContextMenu={showContextMenu(
                user && user.id !== author.id
                  ? [
                      {
                        key: 'report',
                        icon: <IconFlag size="1rem" />,
                        onClick: handleReportUser,
                        title: 'Пожаловаться',
                        color: 'red',
                      },
                    ]
                  : []
              )}
            >
              <Avatar src={author.avatarUrl} alt={author.username} radius="xl" />
              <Box>
                <Text size="md">{author.username}</Text>
                <Text size="xs" color="dimmed">
                  {dayjs(createdAt).toDate().toLocaleDateString()}{' '}
                  {createdAt !== updatedAt
                    ? `(Изменено ${dayjs(updatedAt).toDate().toLocaleDateString()})`
                    : ''}
                </Text>
              </Box>
            </Group>
          </Link>
          <IconMinusVertical color="lightgrey" />
          <Text size="sm">
            {component.template.name} {component.data['Название']}
          </Text>
        </Group>
        <Group spacing="xs">
          {user && author.id === user.id && (
            <ActionIcon color="blue" size="lg" onClick={handleEdit}>
              <IconPencil />
            </ActionIcon>
          )}
          {user && (author.id === user.id || user.role !== 'USER') && (
            <ActionIcon color="red" size="lg" onClick={handleDelete}>
              <IconTrash />
            </ActionIcon>
          )}
        </Group>
      </Group>
      <Text className={classes.body} size="sm">
        {text}
      </Text>
      <Rating readOnly size="md" value={rating} ml={rem(54)} mt="md" />
      {user && user.id !== author.id && (
        <UnstyledButton className={classes.button} onClick={handleReport}>
          <Text h={30} size="sm">
            Пожаловаться
          </Text>
        </UnstyledButton>
      )}
    </Block>
  );
};
