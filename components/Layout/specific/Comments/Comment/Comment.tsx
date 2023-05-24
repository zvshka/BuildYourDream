import { Avatar, Box, createStyles, Group, rem, Text, UnstyledButton } from '@mantine/core';
import { Block } from '../../../general/Block/Block';
import dayjs from 'dayjs';
import { IconMinusVertical } from '@tabler/icons-react';

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
    author: {
      username: string;
      avatarUrl?: string;
    };
    createdAt: Date;
    body: string;
  };
  replyId?: string;
  onChooseReply?: any;
}) {
  const { classes } = useStyles();

  return (
    <Block
      ml={commentData.replyCommentId ? '3rem' : 0}
      sx={(theme) => ({
        outline: replyId === commentData.id ? `2px solid ${theme.colors.blue[6]}` : '',
      })}
    >
      <Group>
        <Avatar src={commentData.author.avatarUrl} alt={commentData.author.username} radius="xl" />
        <Box>
          <Text size="sm">{commentData.author.username}</Text>
          <Text size="xs" color="dimmed">
            {dayjs(commentData.createdAt).toDate().toLocaleDateString()}
          </Text>
        </Box>
      </Group>
      <Text className={classes.body} size="sm">
        {commentData.body}
      </Text>
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
