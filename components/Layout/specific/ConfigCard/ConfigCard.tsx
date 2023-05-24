import { IconFlag, IconHeart } from '@tabler/icons-react';
import { ActionIcon, Avatar, Card, Center, createStyles, Group, rem, Text } from '@mantine/core';
import { NextLink } from '../../general/NextLink/NextLink';

const useStyles = createStyles((theme) => ({
  card: {
    position: 'relative',
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
  },

  rating: {
    position: 'absolute',
    top: theme.spacing.xs,
    right: rem(12),
    pointerEvents: 'none',
  },

  title: {
    display: 'block',
    // marginTop: theme.spacing.md,
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
      <Text className={classes.title} fw={500}>
        {configData.title}
      </Text>

      <Text fz="sm" color="dimmed" lineClamp={4}>
        {configData.description}
      </Text>

      <Group position="apart" className={classes.footer}>
        <Center>
          <Avatar src={configData.author.avatarUrl} size={24} radius="xl" mr="xs" />
          <Text fz="sm" inline>
            {configData.author.username}
          </Text>
        </Center>

        <Group spacing={8} mr={0}>
          <ActionIcon
            className={classes.action}
            onClick={(event) => {
              event.stopPropagation();
              event.preventDefault();
            }}
          >
            <IconHeart size="1rem" color={theme.colors.red[6]} />
          </ActionIcon>
          <ActionIcon
            className={classes.action}
            onClick={(event) => {
              event.stopPropagation();
              event.preventDefault();
            }}
          >
            <IconFlag size="1rem" />
          </ActionIcon>
        </Group>
      </Group>
    </Card>
  );
}
