import { useForm } from '@mantine/form';
import { ActionIcon, Stack, Textarea } from '@mantine/core';
import { Block } from '../../general/Block/Block';
import { Comment } from '../../general/Comment/Comment';
import { IconCubeSend, IconSend } from '@tabler/icons-react';

export const Comments = () => {
  const form = useForm({
    initialValues: {
      text: '',
      replyCommentId: '',
    },
  });

  return (
    <Stack mt="xs">
      <Block>
        <Stack spacing="xs">
          <Textarea
            label="Текст комментария"
            minRows={1}
            {...form.getInputProps('text')}
            // rightSection={<Button>Отправить</Button>}
            rightSection={
              <ActionIcon>
                <IconCubeSend />
              </ActionIcon>
            }
          />
          {/*<Group>*/}
          {/*  <Button>Отправить</Button>*/}
          {/*</Group>*/}
        </Stack>
      </Block>
      <Comment
        postedAt={new Date().toDateString()}
        body="Крутой компонент"
        author={{
          name: 'admin',
          image: '',
        }}
      />
      <Comment
        postedAt={new Date().toDateString()}
        body="Согласен, крутой компонент"
        author={{
          name: 'admin',
          image: '',
        }}
        replyId="someid"
      />
    </Stack>
  );
};
