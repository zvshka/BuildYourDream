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
import { randomId, useHash, useListState, useShallowEffect } from '@mantine/hooks';
import { useEffect, useRef, useState } from 'react';
import Pusher from 'pusher-js';
import { useForm } from '@mantine/form';
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
  const [hash, setHash] = useHash();
  const [messages, handlers] = useListState<MessageProps>([
    // {
    //   postedAt: new Date().toDateString(),
    //   body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    //   author: {
    //     image: '',
    //     name: 'zvshka',
    //   },
    // },
    // {
    //   postedAt: new Date().toDateString(),
    //   body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    //   author: {
    //     image: '',
    //     name: 'zvshka',
    //   },
    // },
    // {
    //   postedAt: new Date().toDateString(),
    //   body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    //   author: {
    //     image: '',
    //     name: 'zvshka',
    //   },
    // },
  ]);
  const [pusher, setPusher] = useState<Pusher>();
  const form = useForm({
    initialValues: {
      author: {
        image: '',
        name: '',
      },
      body: '',
    },
  });
  const viewport = useRef<any>();
  const { classes } = useStyles();
  useEffect(() => {
    fetch('/api/chat/connect')
      .then((res) => res.json())
      .then((data) => {
        setPusher(
          new Pusher(data.key, {
            cluster: 'eu',
          })
        );
      });
    viewport.current.scrollTo({ top: viewport.current.scrollHeight, behavior: 'smooth' });
  }, []);

  useShallowEffect(() => {
    setHash(randomId());
    form.setFieldValue('author', {
      image: '',
      name: hash,
    });
    pusher?.subscribe('chat').bind('new-message', (data: any) => {
      handlers.append(data);
    });
  }, [pusher]);

  const handleSubmit = (data: typeof form.values) => {
    fetch('/api/chat/message', {
      method: 'POST',
      // @ts-ignore
      body: JSON.stringify(data),
    });
  };

  return (
    <Shell>
      <form onSubmit={form.onSubmit(handleSubmit)} className={classes.container}>
        <Stack className={classes.container}>
          <Paper className={classes.messagesContainer}>
            <Stack justify="flex-end" className={classes.messages}>
              <ScrollArea viewportRef={viewport}>
                {messages.map((message) => (
                  <Message
                    key={message.id}
                    postedAt={new Date().toDateString()}
                    body={message.body}
                    author={message.author}
                  />
                ))}
              </ScrollArea>
            </Stack>
          </Paper>
          <Group>
            <Box className={classes.inputWrapper}>
              <Textarea
                className={classes.textInput}
                autosize
                minRows={1}
                maxRows={4}
                {...form.getInputProps('body')}
              />
            </Box>
            <Button type="submit">Отправить</Button>
          </Group>
        </Stack>
      </form>
    </Shell>
  );
}
