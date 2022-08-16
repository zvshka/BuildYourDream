import { Avatar, Box, createStyles, Group, Spoiler, Text } from '@mantine/core';
import dayjs from 'dayjs';

const useStyles = createStyles((theme) => ({
  body: {
    paddingLeft: 54,
    paddingRight: 24,
    whiteSpace: 'pre-wrap',
  },
}));

interface MessageProps {
  postedAt: string;
  body: string;
  author: {
    name: string;
    image: string;
  };
}

export function Message({ postedAt, body, author }: MessageProps) {
  const { classes, theme } = useStyles();
  return (
    <Box sx={{ marginTop: theme.spacing.md }}>
      <Group>
        <Avatar src={author.image} alt={author.name} radius="xl" />
        <Group>
          <Text size="sm">{author.name}</Text>
          <Text size="xs" color="dimmed">
            {dayjs(postedAt).format('DD-MM-YYYY hh:mm').toString()}
          </Text>
        </Group>
      </Group>
      <Spoiler maxHeight={150} hideLabel="Свернуть" showLabel="Показать" className={classes.body}>
        <Text size="sm">{body}</Text>
      </Spoiler>
    </Box>
  );
}
