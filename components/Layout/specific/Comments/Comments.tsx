import { Center, Group, Stack, Text, UnstyledButton } from '@mantine/core';
import { useState } from 'react';
import { IconX } from '@tabler/icons-react';
import { Block } from '../../general/Block/Block';
import { CommentInput } from './CommentInput/CommentInput';
import { useCommentsList } from '../../../hooks/comments';
import { Comment } from './Comment/Comment';

export const Comments = ({
  configId,
  componentId,
}: {
  configId?: string;
  componentId?: string;
}) => {
  const [replyCommentId, setReplyCommentId] = useState('');
  const [threadCommentId, setThreadCommentId] = useState('');

  const { data: comments, isSuccess: commentsFetched } = useCommentsList({
    configId,
    componentId,
  });

  return (
    <Stack mt="xs">
      <Block>
        <CommentInput
          threadCommentId={threadCommentId}
          replyCommentId={replyCommentId}
          componentId={componentId}
          configId={configId}
        />
      </Block>
      {commentsFetched &&
        comments.map((comment) => (
          <Stack key={comment.id}>
            <Stack>
              <Comment
                commentData={comment}
                onChooseReply={() => {
                  setReplyCommentId(comment.id);
                  setThreadCommentId(comment.id);
                }}
                replyId={replyCommentId}
              />
              {comment.thread.map((answer) => (
                <Comment
                  key={answer.id}
                  commentData={answer}
                  onChooseReply={() => {
                    setReplyCommentId(answer.id);
                    setThreadCommentId(comment.id);
                  }}
                  replyId={replyCommentId}
                />
              ))}
            </Stack>
            {threadCommentId === comment.id && (
              <Block ml="3rem">
                <Stack spacing={0}>
                  <Group spacing={4} mb="sm">
                    <Text fz="sm" color="dimmed">
                      Ответ
                    </Text>
                    <UnstyledButton
                      sx={(theme) => ({
                        color: theme.colors.blue[6],
                        '&:hover': {
                          color: theme.colors.blue[9],
                        },
                      })}
                    >
                      <Text fz="sm">{comment.author.username}</Text>
                    </UnstyledButton>
                    <UnstyledButton
                      onClick={() => {
                        setThreadCommentId('');
                        setReplyCommentId('');
                      }}
                      h="100%"
                    >
                      <IconX style={{ verticalAlign: 'bottom' }} size="1rem" color="gray" />
                    </UnstyledButton>
                  </Group>
                  <CommentInput
                    replyCommentId={replyCommentId}
                    componentId={componentId}
                    configId={configId}
                    threadCommentId={threadCommentId}
                  />
                </Stack>
              </Block>
            )}
          </Stack>
        ))}
    </Stack>
  );
};
