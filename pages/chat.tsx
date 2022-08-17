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
import {
  getHotkeyHandler,
  randomId,
  useHash,
  useListState,
  useShallowEffect,
} from '@mantine/hooks';
import { useEffect, useRef, useState } from 'react';
import Pusher from 'pusher-js';
import { useForm } from '@mantine/form';
import axios from 'axios';
import Shell from '../components/Shell/Shell';
import { Message } from '../components/Message/Message';

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

export default function Chat() {
  const [hash, setHash] = useHash();
  const [messages, handlers] = useListState<any>([]);
  const [pusher, setPusher] = useState<Pusher>();
  const form = useForm({
    initialValues: {
      author: '',
      body: '',
    },
  });
  const viewport = useRef<any>();
  const { classes } = useStyles();

  useEffect(() => {
    axios.get('/api/chat/connect').then((res) => {
      setPusher(
        new Pusher(res.data.key, {
          cluster: 'eu',
        })
      );
    });
    axios.get('/api/chat/messages').then((res) => {
      handlers.setState(res.data.messages);
      viewport.current.scrollTo({ top: viewport.current.scrollHeight, behavior: 'smooth' });
    });
  }, []);

  useShallowEffect(() => {
    setHash(randomId());
    form.setFieldValue('author', hash);
    pusher?.subscribe('chat').bind('new-messages', (data: any) => {
      handlers.append(data);
      setTimeout(() =>
        viewport.current.scrollTo({ top: viewport.current.scrollHeight, behavior: 'smooth' })
      );
    });
  }, [pusher]);

  const handleSubmit = (data: typeof form.values) => {
    if (!data.body.length) return;
    axios.post('/api/chat/messages', data);
    form.setFieldValue('body', '');
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
                    postedAt={message.createdAt}
                    body={message.body}
                    author={message.username}
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
                onKeyDown={getHotkeyHandler([['Enter', () => handleSubmit(form.values)]])}
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
