import {
  IconDotsVertical,
  IconFlag,
  IconHeart,
  IconHeartFilled,
  IconMessage,
  IconTrash,
} from '@tabler/icons-react';
import {
  ActionIcon,
  Avatar,
  Card,
  Center,
  createStyles,
  Group,
  Menu,
  rem,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { showNotification } from '@mantine/notifications';
import { openConfirmModal, openModal } from '@mantine/modals';
import { useContextMenu } from 'mantine-contextmenu';
import { useEffect, useState } from 'react';
import { NextLink } from '../../general/NextLink/NextLink';
import { useAuth } from '../../../Providers/AuthContext/AuthWrapper';
import { storage } from '../../../../lib/utils';
import { queryClient } from '../../../Providers/QueryProvider/QueryProvider';
import { ReportForm } from '../../forms/ReportForm/ReportForm';

const useStyles = createStyles((theme) => ({
  card: {
    position: 'relative',
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    height: '12rem',
  },

  rating: {
    position: 'absolute',
    top: theme.spacing.xs,
    right: rem(12),
    pointerEvents: 'none',
  },

  title: {
    display: 'block',
    marginBottom: rem(5),
  },

  footer: {
    marginTop: theme.spacing.md,
  },
}));

export function ConfigCard({ link, configData }) {
  const { classes, theme } = useStyles();
  const linkProps = { href: link };
  const { user } = useAuth();
  const showContextMenu = useContextMenu();
  const [contextMenu, setContextMenu] = useState<any[]>([]);

  const deleteConfigMutation = useMutation(
    () =>
      axios.delete(`/api/configs/${configData.id}`, {
        headers: {
          authorization: `Bearer ${storage.getToken()}`,
        },
      }),
    {
      onSuccess: () => {
        showNotification({
          title: 'Успех',
          message: 'Вы успешно удалили сборку',
          color: 'green',
        });
        queryClient.invalidateQueries(['configs', 'lsit']);
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

  const likeMutation = useMutation(
    ({ configId, status }: { configId: string; status: 'like' | 'unlike' }) =>
      axios.get(`/api/configs/${configId}/${status}`, {
        headers: {
          authorization: `Bearer ${storage.getToken()}`,
        },
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['configs', 'list']);
      },
      onError: (err: any) => {
        showNotification({
          title: 'Ошибка',
          color: 'red',
          message: err.response.data.message || 'Что-то пошло не так',
        });
      },
    }
  );

  const handleDelete = () => {
    openConfirmModal({
      title: 'Удаление сборки',
      children: (
        <Text>Вы собираетесь удалить сборку с названием {configData.title}, продолжить?</Text>
      ),
      labels: {
        confirm: 'Да',
        cancel: 'Нет',
      },
      onConfirm() {
        deleteConfigMutation.mutate();
      },
    });
  };
  const handleReportConfig = () => {
    openModal({
      title: 'Жалоба на сборку',
      children: <ReportForm configId={configData?.id} />,
    });
  };

  const handleReportUser = () => {
    openModal({
      title: 'Жалоба на пользователя',
      children: <ReportForm userId={configData.authorId} />,
    });
  };

  const handleLike = () => {
    likeMutation.mutate({ configId: configData.id, status: configData.liked ? 'unlike' : 'like' });
  };

  useEffect(() => {
    if (user) {
      if (user.id !== configData.authorId && user.role === 'USER') {
        setContextMenu([
          {
            key: 'report',
            onClick: handleReportConfig,
            title: 'Пожаловаться на сборку',
            icon: <IconFlag size="1rem" />,
            color: 'red',
          },
        ]);
      } else if (user.id === configData.authorId) {
        setContextMenu([
          {
            key: 'delete',
            onClick: handleDelete,
            title: 'Удалить сборку',
            icon: <IconTrash size="1rem" />,
            color: 'red',
          },
        ]);
      } else if (user.id !== configData.authorId && user.role !== 'USER') {
        setContextMenu([
          {
            key: 'report',
            onClick: handleReportConfig,
            title: 'Пожаловаться на сборку',
            icon: <IconFlag size="1rem" />,
            color: 'red',
          },
          {
            key: 'delete',
            onClick: handleDelete,
            title: 'Удалить сборку',
            icon: <IconTrash size="1rem" />,
            color: 'red',
          },
        ]);
      }
    }
  }, [user]);

  return (
    <Card
      withBorder
      radius="md"
      className={classes.card}
      component={NextLink}
      {...linkProps}
      onContextMenu={showContextMenu(contextMenu)}
    >
      <Stack h="100%" spacing={0}>
        <Group position="apart">
          <Title
            order={4}
            className={classes.title}
            fw={500}
            sx={{ maxWidth: 300, wordWrap: 'break-word' }}
          >
            {configData.title}
          </Title>
          {user && (
            <Menu withinPortal>
              <Menu.Target>
                <ActionIcon
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <IconDotsVertical />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                {user.id !== configData.authorId && (
                  <Menu.Item
                    icon={<IconFlag size="1rem" />}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      handleReportConfig();
                    }}
                  >
                    Пожаловаться
                  </Menu.Item>
                )}
                {(user.id === configData.authorId || user.role !== 'USER') && (
                  <Menu.Item
                    icon={<IconTrash size="1rem" color="red" />}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      handleDelete();
                    }}
                  >
                    Удалить
                  </Menu.Item>
                )}
              </Menu.Dropdown>
            </Menu>
          )}
        </Group>

        <Text fz="sm" color="dimmed" lineClamp={4}>
          {configData.description}
        </Text>

        <Group position="apart" className={classes.footer} align="end" mt="auto">
          <Link href={`/profile/${configData.author.username}`}>
            <Center
              onContextMenu={showContextMenu(
                user && user.id !== configData.authorId
                  ? [
                      {
                        key: 'report',
                        icon: <IconFlag size="1rem" />,
                        onClick: handleReportUser,
                        title: 'Пожаловаться на пользователя',
                        color: 'red',
                      },
                    ]
                  : []
              )}
            >
              <Avatar src={configData.author.avatarUrl} size={24} radius="xl" mr="xs" />
              <Text fz="sm" inline>
                {configData.author.username}
              </Text>
            </Center>
          </Link>

          <Group spacing={8} mr={0}>
            <Group
              spacing={8}
              sx={() => ({ outline: '1px solid lightgrey', borderRadius: theme.radius.sm })}
              pr="xs"
            >
              <ActionIcon
                size="md"
                variant={configData.liked ? 'filled' : 'light'}
                color="red"
                onClick={(event) => {
                  event.stopPropagation();
                  event.preventDefault();
                  handleLike();
                }}
              >
                {!configData.liked && <IconHeart size="1rem" color={theme.colors.red[6]} />}
                {configData.liked && <IconHeartFilled size="1rem" />}
              </ActionIcon>
              <Text fz="xs">{configData.totalLikes > 999 ? '999+' : configData.totalLikes}</Text>
            </Group>
            <Group
              spacing={8}
              sx={() => ({ outline: '1px solid lightgrey', borderRadius: theme.radius.sm })}
              pr="xs"
            >
              <ActionIcon
                size="md"
                onClick={(event) => {
                  event.stopPropagation();
                  event.preventDefault();
                }}
              >
                <IconMessage size="1rem" />
              </ActionIcon>
              <Text fz="xs">
                {configData.totalComments > 999 ? '999+' : configData.totalComments}
              </Text>
            </Group>
          </Group>
        </Group>
      </Stack>
    </Card>
  );
}
