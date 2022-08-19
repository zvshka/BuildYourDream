import { Box, Button, createStyles, Group, Stack, Textarea } from '@mantine/core';
import { getHotkeyHandler, useListState, useShallowEffect } from '@mantine/hooks';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from '@mantine/form';
import axios from 'axios';
import Pusher from 'pusher-js';
import MessagesBlock from '../components/Message/MessagesBlock';

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
  viewport: {
    '& > div': {
      // display: 'block !important',
    },
  },
}));

export default function Chat() {
  const [messages, handlers] = useListState<any>([]);
  const [pusher, setPusher] = useState<Pusher>();
  const form = useForm({
    validateInputOnChange: false,
    initialValues: {
      author: 'Анон',
      body: '',
    },
  });
  const viewport = useRef<any>();
  const lastMessage = useRef<any>();
  const { classes } = useStyles();

  console.log('CHAT RERENDER');

  useShallowEffect(() => {
    axios.get('/api/chat/connect').then((res) => {
      setPusher(
        new Pusher(res.data.key, {
          cluster: 'eu',
        })
      );
    });
    axios
      .get('/api/chat/messages')
      .then((res) => {
        handlers.setState(res.data.messages);
      })
      .then(() => lastMessage.current.scrollIntoView({ behaviour: 'smooth' }));
  }, []);

  useShallowEffect(() => {
    pusher?.subscribe('chat').bind('new-messages', (data: any) => {
      handlers.append(data);
    });
  }, [pusher?.sessionID]);

  useEffect(() => {
    lastMessage.current.scrollIntoView({ behaviour: 'smooth' });
  }, [messages]);

  const handleSubmit = (data: typeof form.values) => {
    if (!data.body.length) return;
    axios.post('/api/chat/messages', data);
    form.setFieldValue('body', '');
  };

  return (
    <>
      <form onSubmit={form.onSubmit(handleSubmit)} className={classes.container}>
        {/*<form className={classes.container}>*/}
        <Stack className={classes.container}>
          <MessagesBlock messages={messages} viewport={viewport} lastMessage={lastMessage} />
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
    </>
  );
}

// Chat.whyDidYouRender = true;
