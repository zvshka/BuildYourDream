import { IconDotsVertical, IconFlag, IconHeart, IconMessage, IconTrash } from '@tabler/icons-react';
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
import { NextLink } from '../../general/NextLink/NextLink';

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

  action: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    ...theme.fn.hover({
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
    }),
  },

  footer: {
    marginTop: theme.spacing.md,
  },
}));

export function ConfigCard({ link, configData }) {
  const { classes, theme } = useStyles();
  const linkProps = { href: link };

  return (
    <Card withBorder radius="md" className={classes.card} component={NextLink} {...linkProps}>
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
              <Menu.Item icon={<IconFlag size="1rem" />}>Пожаловаться</Menu.Item>
              <Menu.Item icon={<IconTrash size="1rem" color="red" />}>Удалить</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>

        <Text fz="sm" color="dimmed" lineClamp={4}>
          {configData.description}
        </Text>

        <Group position="apart" className={classes.footer} align="end" mt="auto">
          <Link href={`/profile/${configData.author.username}`}>
            <Center>
              <Avatar src={configData.author.avatarUrl} size={24} radius="xl" mr="xs" />
              <Text fz="sm" inline>
                {configData.author.username}
              </Text>
            </Center>
          </Link>

          <Group spacing={8} mr={0}>
            <Group spacing={8}>
              <ActionIcon
                className={classes.action}
                size="md"
                onClick={(event) => {
                  event.stopPropagation();
                  event.preventDefault();
                }}
              >
                <IconHeart size="1rem" color={theme.colors.red[6]} />
              </ActionIcon>
              <Text>{configData.totalLikes > 999 ? '999+' : configData.totalLikes}</Text>
            </Group>
            <Group spacing={8}>
              <ActionIcon
                size="md"
                className={classes.action}
                onClick={(event) => {
                  event.stopPropagation();
                  event.preventDefault();
                }}
              >
                <IconMessage size="1rem" />
              </ActionIcon>
              <Text>{configData.totalComments > 999 ? '999+' : configData.totalComments}</Text>
            </Group>
          </Group>
        </Group>
      </Stack>
    </Card>
  );
}
