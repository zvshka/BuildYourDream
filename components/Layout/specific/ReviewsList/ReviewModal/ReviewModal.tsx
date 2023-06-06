import { Button, Center, Rating, Stack, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';

export const ReviewModal = ({ componentId }: { componentId: string }) => {
  const form = useForm({
    initialValues: {},
  });

  return (
    <form>
      <Stack>
        <Textarea minRows={7} maxLength={1200} />
        <Center>
          <Rating size="xl" />
        </Center>
        <Button>Отправить</Button>
      </Stack>
    </form>
  );
};
