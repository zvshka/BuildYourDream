import {
  Box,
  Button,
  createStyles,
  Group,
  Paper,
  ScrollArea,
  Stack,
  Textarea,
} from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import Shell from '../components/Shell/Shell';
import { Message } from '../components/Message';

const useStyles = createStyles((theme) => ({
  inputWrapper: {
    display: 'flex',
    flex: 1,
  },
  textInput: {
    width: '100%',
  },
  container: {
    position: 'relative',
    height: '100%',
    overflow: 'hidden',
  },
  messagesContainer: {
    padding: theme.spacing.sm,
    height: '100%',
    position: 'relative',
  },
  messages: {
    height: '100%',
    position: 'absolute',
    bottom: theme.spacing.sm,
    right: theme.spacing.sm,
    left: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
  },
}));

interface MessageProps {
  id?: string;
  postedAt: string;
  body: string;
  author: {
    name: string;
    image: string;
  };
}
export default function Chat() {
  const [messages, setMessages] = useState<MessageProps[]>([
    {
      postedAt: new Date().toDateString(),
      body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      author: {
        image: '',
        name: 'zvshka',
      },
    },
    {
      postedAt: new Date().toDateString(),
      body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      author: {
        image: '',
        name: 'zvshka',
      },
    },
    {
      postedAt: new Date().toDateString(),
      body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      author: {
        image: '',
        name: 'zvshka',
      },
    },
  ]);
  const viewport = useRef<any>();
  const { classes } = useStyles();
  useEffect(() => {
    viewport.current.scrollTo({ top: viewport.current.scrollHeight, behavior: 'smooth' });
  }, []);
  return (
    <Shell>
      <Stack className={classes.container}>
        <Paper className={classes.messagesContainer}>
          <Stack justify="flex-end" className={classes.messages}>
            <ScrollArea viewportRef={viewport}>
              {messages.map((message) => (
                <Message
                  key={message.id}
                  postedAt={new Date().toDateString()}
                  body={message.body}
                  author={{
                    image: '',
                    name: 'zvshka',
                  }}
                />
              ))}
            </ScrollArea>
          </Stack>
        </Paper>
        <Group>
          <Box className={classes.inputWrapper}>
            <Textarea className={classes.textInput} autosize minRows={1} maxRows={4} />
          </Box>
          <Button>Отправить</Button>
        </Group>
      </Stack>
    </Shell>
  );
}
