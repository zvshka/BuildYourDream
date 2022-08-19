import { Avatar, Box, createStyles, Group, Spoiler, Text } from '@mantine/core';
import dayjs from 'dayjs';
import React from 'react';

const useStyles = createStyles((theme) => ({
  body: {
    paddingLeft: 54,
    whiteSpace: 'pre-wrap',
  },
  text: {
    maxWidth: '100%',
    wordBreak: 'break-word',
  },
}));

function Message({ postedAt, body, author }: any) {
  const { classes, theme } = useStyles();
  return (
    <Box sx={{ marginTop: theme.spacing.md }}>
      <Group>
        <Avatar src={author?.image} alt={author} radius="xl" />
        <Box sx={{ display: 'inline-block' }}>
          <Text
            style={{
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              width: '150px',
            }}
            size="sm"
          >
            {author}
          </Text>
          <Text size="xs" color="dimmed">
            {dayjs().to(postedAt)}
          </Text>
        </Box>
      </Group>
      <Spoiler maxHeight={150} hideLabel="Свернуть" showLabel="Показать" className={classes.body}>
        <Text className={classes.text} size="sm">
          {body}
        </Text>
      </Spoiler>
    </Box>
  );
}

export default React.memo(Message);
