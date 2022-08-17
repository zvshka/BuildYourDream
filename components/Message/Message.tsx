import { Avatar, Box, createStyles, Group, Spoiler, Text } from '@mantine/core';
import dayjs from 'dayjs';

const useStyles = createStyles((theme) => ({
  body: {
    paddingLeft: 54,
    paddingRight: 24,
    whiteSpace: 'pre-wrap',
  },
}));

export function Message({ postedAt, body, author }: any) {
  const { classes, theme } = useStyles();
  return (
    <Box sx={{ marginTop: theme.spacing.md }}>
      <Group>
        <Avatar src={author?.image} alt={author} radius="xl" />
        <Group>
          <Text size="sm">{author}</Text>
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
