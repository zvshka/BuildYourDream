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

  const { data: comments, isSuccess: commentsFetched } = useCommentsList({
    configId,
    componentId,
  });

  return (
    <Stack mt="xs">
      <Block>
        <CommentInput
          replyCommentId={replyCommentId}
          componentId={componentId}
          configId={configId}
        />
      </Block>
      {commentsFetched &&
        comments.map((comment) => (
          <Comment
            commentData={comment}
            onChooseReply={() => setReplyCommentId(comment.id)}
            replyId={replyCommentId}
          />
        ))}
      {replyCommentId.length > 0 && (
        <Block ml="3rem">
          <Stack spacing={0}>
            <Group spacing={4}>
              <Center>
                <Text h={30} color="dimmed">
                  Ответ
                </Text>
              </Center>
              <UnstyledButton
                sx={(theme) => ({
                  color: theme.colors.blue[6],
                  '&:hover': {
                    color: theme.colors.blue[9],
                  },
                })}
              >
                <Center>
                  <Text h={30}>admin</Text>
                </Center>
              </UnstyledButton>
              <UnstyledButton h={30} onClick={() => setReplyCommentId('')}>
                <IconX size={18} color="gray" />
              </UnstyledButton>
            </Group>
            <CommentInput
              replyCommentId={replyCommentId}
              componentId={componentId}
              configId={configId}
            />
          </Stack>
        </Block>
      )}
    </Stack>
  );
};
