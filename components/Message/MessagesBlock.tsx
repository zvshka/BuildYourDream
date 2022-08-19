import React from 'react';
import { createStyles, Paper, ScrollArea, Stack } from '@mantine/core';
import Message from './Message';

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

const MessagesBlock = ({
  messages,
  viewport,
  lastMessage,
}: {
  messages: any[];
  viewport: any;
  lastMessage: any;
}) => {
  const { classes } = useStyles();
  return (
    <Paper className={classes.messagesContainer}>
      <Stack justify="flex-end" className={classes.messages}>
        <ScrollArea
          viewportRef={viewport}
          offsetScrollbars
          classNames={{
            viewport: classes.viewport,
          }}
        >
          {messages.map((message) => (
            <Message
              key={message.id}
              postedAt={message.createdAt}
              body={message.body}
              author={message.username}
            />
          ))}
          <span ref={lastMessage} />
        </ScrollArea>
      </Stack>
    </Paper>
  );
};

export default React.memo(MessagesBlock);
