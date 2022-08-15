import { createStyles, Text, Avatar, Group, Box } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  body: {
    paddingLeft: 54,
    paddingTop: theme.spacing.sm,
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
        <div>
          <Text size="sm">{author.name}</Text>
          <Text size="xs" color="dimmed">
            {postedAt}
          </Text>
        </div>
      </Group>
      <Text className={classes.body} size="sm">
        {body}
      </Text>
    </Box>
  );
}
