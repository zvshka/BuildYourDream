import {
  Avatar,
  Box,
  Button,
  createStyles,
  Group,
  rem,
  Stack,
  Text,
  Textarea,
  UnstyledButton,
} from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import { IconX } from '@tabler/icons-react';
import { Block } from '../Block/Block';

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
}));

interface CommentProps {
  postedAt: string;
  body: string;
  author: {
    name: string;
    image: string;
  };
  replyId?: string;
}

export function Comment({ postedAt, body, author, replyId }: CommentProps) {
  const { classes } = useStyles();

  const [showAnswer, toggle] = useToggle([false, true]);

  return (
    <Stack>
      <Block ml={replyId ? '3rem' : 0}>
        <Group>
          <Avatar src={author.image} alt={author.name} radius="xl" />
          <Box>
            <Text size="sm">{author.name}</Text>
            <Text size="xs" color="dimmed">
              {postedAt}
            </Text>
          </Box>
        </Group>
        <Text className={classes.body} size="sm">
          {body}
        </Text>
        <UnstyledButton mt="xs" className={classes.answer} onClick={() => toggle()}>
          <Text size="sm">Ответить</Text>
        </UnstyledButton>
      </Block>
      {showAnswer && replyId && (
        <Block ml="3rem">
          <Stack spacing="xs">
            <Textarea label="Текст комментария" />
            <Group>
              <Button>Отправить</Button>
              <Group spacing="xs">
                <UnstyledButton sx={{ display: 'flex', justifyContent: 'center' }}>
                  <IconX size={18} />
                </UnstyledButton>
                <Group>
                  <Text size="sm">Ответ </Text>
                  <UnstyledButton sx={(theme) => ({ color: theme.colors.blue[6] })}>
                    admin
                  </UnstyledButton>
                </Group>
              </Group>
            </Group>
          </Stack>
        </Block>
      )}
    </Stack>
  );
}
